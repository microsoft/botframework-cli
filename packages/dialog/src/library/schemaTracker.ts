#!/usr/bin/env node

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as ajv from 'ajv';
let getUri: any = require('get-uri')

// Get JSON from a URI.
async function getJSON(uri: string): Promise<any> {
    if (uri.indexOf(':') < 2) {
        uri = `file:///${uri}`
    }
    let stream = await getUri(uri)
    let data = ''
    for await (let chunk of stream) {
        data += chunk.toString()
    }
    return JSON.parse(data)
}

export class SchemaTracker {
    // Map from type name to information about that type.
    typeToType: Map<string, Type>

    private readonly validator: ajv.Ajv

    constructor() {
        this.typeToType = new Map<string, Type>()
        // NOTE: This is so that ajv doesn't complain about extra keywords around $ref
        this.validator = new ajv({ logger: false })
    }

    async getValidator(schemaPath: string): Promise<[ajv.ValidateFunction, boolean]> {
        let validator = this.validator.getSchema(schemaPath)
        let added = false
        if (!validator) {
            try {
                let schemaObject = await getJSON(schemaPath)
                added = true
                if (schemaObject.oneOf) {
                    const defRef = '#/definitions/'
                    const implementsRole = 'implements('
                    let processRole = (role: string, type: Type) => {
                        if (role.startsWith(implementsRole)) {
                            role = role.substring(implementsRole.length, role.length - 1)
                            let interfaceDefinition = this.typeToType.get(role)
                            if (!interfaceDefinition) {
                                interfaceDefinition = new Type(role)
                                this.typeToType.set(role, interfaceDefinition)
                            }
                            interfaceDefinition.addImplementation(type)
                        }
                    }
                    for (let one of schemaObject.oneOf) {
                        // Pick up roles of top-level objects
                        let ref = one.$ref
                        if (ref.startsWith(defRef)) {
                            ref = ref.substring(defRef.length)
                            if (!this.typeToType.get(ref)) {
                                let def = schemaObject.definitions[ref]
                                if (def) {
                                    let type = new Type(ref, def)
                                    this.typeToType.set(ref, type)
                                    if (def.$role) {
                                        if (typeof def.$role === 'string') {
                                            processRole(def.$role, type)
                                        } else {
                                            for (let role of def.$role) {
                                                processRole(role, type)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Pick up component.schema
                let metaSchemaName = schemaObject.$schema
                if (!this.validator.getSchema(metaSchemaName)) {
                    let metaSchema = await getJSON(metaSchemaName)
                    this.validator.addSchema(metaSchema, metaSchemaName)
                }
                this.validator.addSchema(schemaObject, schemaPath)
                validator = this.validator.getSchema(schemaPath) as ajv.ValidateFunction
            } catch (err) {
                throw new Error(`Could not use schema ${schemaPath}\n${err.message}`)
            }
        }
        return [validator, added]
    }
}

// Information about a type.
export class Type {
    // Name of the type.
    name: string

    // Paths to lg properties for concrete types.
    lgProperties: string[]

    // Possible types for an interface type.
    implementations: Type[]

    // Interface types this type implements.
    interfaces: Type[]

    constructor(name: string, schema?: any) {
        this.name = name
        this.lgProperties = []
        this.implementations = []
        this.interfaces = []
        if (schema) {
            this.walkProps(schema, name)
        }
    }

    addImplementation(type: Type) {
        this.implementations.push(type)
        type.interfaces.push(this)
    }

    toString(): string {
        return this.name
    }

    private walkProps(val: any, path: string) {
        if (val.properties) {
            for (let propName in val.properties) {
                let prop = val.properties[propName]
                let newPath = `${path}/${propName}`
                if (prop.$role === 'lg') {
                    this.lgProperties.push(newPath)
                } else if (prop.properties) {
                    this.walkProps(prop, newPath)
                }
            }
        }
    }
}
