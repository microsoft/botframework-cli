/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import Ajv = require('ajv')
import parser from '@apidevtools/json-schema-ref-parser'
import http from './getJSON'

// Get JSON from a URI.
async function getJSON(uri: string): Promise<any> {
    if (uri.indexOf(':') < 2) {
        uri = `file:///${uri}`
    }
    return http(uri)
}

export class SchemaTracker {
    // Map from type name to information about that kind.
    kindToKind: Map<string, Kind>

    // Map from dialog path to kind.
    pathToKind: Map<string, string>

    private readonly validator = new Ajv({logger: false});

    constructor() {
        this.kindToKind = new Map<string, Kind>()
        this.pathToKind = new Map<string, string>()
        // NOTE: This is so that ajv doesn't complain about extra keywords around $ref
    }

    async getValidator(schemaPath: string): Promise<[Ajv.ValidateFunction, boolean]> {
        let validator = this.validator.getSchema(schemaPath)
        let added = false
        if (!validator) {
            try {
                let schemaObject = await getJSON(schemaPath)
                let fullSchema = await parser.dereference(schemaObject) as any
                added = true
                if (fullSchema.oneOf) {
                    const implementsRole = 'implements('
                    let processRole = (role: string, type: Kind) => {
                        if (role.startsWith(implementsRole)) {
                            role = role.substring(implementsRole.length, role.length - 1)
                            let interfaceDefinition = this.kindToKind.get(role)
                            if (!interfaceDefinition) {
                                interfaceDefinition = new Kind(role)
                                this.kindToKind.set(role, interfaceDefinition)
                            }
                            interfaceDefinition.addImplementation(type)
                        }
                    }
                    for (let def of fullSchema.oneOf) {
                        let kind = def.properties.$kind.const
                        let type = new Kind(kind, def)
                        this.kindToKind.set(kind, type)
                        if (def.$role) {
                            if (typeof def.$role === 'string') {
                                processRole(def.$role, type)
                            } else {
                                for (let role of def.$role) {
                                    processRole(role, type)
                                }
                            }
                        }
                        this.walkProps(def, kind)
                    }
                }

                // Pick up component.schema
                let metaSchemaName = fullSchema.$schema as string
                if (!this.validator.getSchema(metaSchemaName)) {
                    let metaSchema = await getJSON(metaSchemaName)
                    this.validator.addSchema(metaSchema, metaSchemaName)
                }
                this.validator.addSchema(fullSchema, schemaPath)
                validator = this.validator.getSchema(schemaPath)
                if (!validator) {
                    throw new Error(`Could not get validator for schema ${schemaPath}`)
                }
            } catch (err) {
                throw new Error(`Could not use schema ${schemaPath}\n${err.message}`)
            }
        }

        return [validator, added]
    }

    expectsKind(dialog: string, path: string): Kind | undefined {
        const normalized = `${dialog}${path.replace(/\[\d+\]/, '')}`
        const kind = this.pathToKind.get(normalized)
        return kind ? this.kindToKind.get(kind) : undefined
    }

    private walkProps(val: any, path: string) {
        if (val.properties) {
            for (let propName in val.properties) {
                let prop = val.properties[propName]
                if (prop.type === 'array') {
                    prop = prop.items
                }
                let newPath = `${path}/${propName}`
                if (prop.$kind) {
                    // Path points to a $kind
                    this.pathToKind.set(newPath, prop.$kind)
                }
                if (prop.properties) {
                    this.walkProps(prop, newPath)
                }
            }
        }
    }
}

// Information about a type.
export class Kind {
    // Name of the type.
    name: string

    // Definition
    definition?: object

    // Possible types for an interface type.
    implementations: Kind[]

    // Interface types this type implements.
    interfaces: Kind[]

    constructor(name: string, definition?: object) {
        this.name = name
        this.definition = definition
        this.implementations = []
        this.interfaces = []
    }

    addImplementation(type: Kind) {
        this.implementations.push(type)
        type.interfaces.push(this)
    }

    toString(): string {
        return this.name
    }
}
