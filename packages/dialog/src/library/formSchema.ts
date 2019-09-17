#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formSchema'
import * as Validator from 'ajv'
import * as os from 'os'
import * as ppath from 'path'
let allof: any = require('json-schema-merge-allof')
let parser: any = require('json-schema-ref-parser')

export enum EntityType {
    simple,
    list,
    prebuilt
}

export interface ListEntry {
    value: string,
    synonyms: string
}

export class Entity {
    name: string
    values?: ListEntry[]

    constructor(name: string) {
        this.name = name
    }
}

type EntitySet = Record<string, Entity>

export class FormSchema {
    /**
     * Read and validate schema from a path.
     * @param schemaPath URL for schema.
     */
    static async readSchema(schemaPath: string): Promise<FormSchema> {
        let noref = await parser.dereference(schemaPath)
        let schema = allof(noref)
        let validator = new Validator()
        if (!validator.validateSchema(schema)) {
            let message = ''
            for (let error in validator.errors) {
                message = message + error + os.EOL
            }
            throw message
        }
        if (schema.type !== 'object') {
            throw new Error('Form schema must be of type object.')
        }
        return new FormSchema('', schema, ppath.basename(schemaPath, '.schema.dialog'))
    }

    /** 
     * Name of schema 
     */
    name: string

    /** 
     * Path to this schema definition. 
     */
    path: string

    /** 
     * Schema definition.  This is the content of a properties JSON Schema object. 
     */
    schema: any

    constructor(path: string, schema: any, name?: string) {
        this.name = name || ''
        this.path = path
        this.schema = schema
    }

    * schemaProperties(): Iterable<FormSchema> {
        for (let prop in this.schema.properties) {
            let newPath = this.path + (this.path === '' ? '' : '.') + prop
            yield new FormSchema(newPath, this.schema.properties[prop])
        }
    }

    typeName(): string {
        let isArray = false
        let schema = this.schema
        let type = schema.type
        if (type === 'array') {
            schema = this.schema.items
            type = schema.type
            isArray = true
        }
        if (schema.enum) {
            type = 'enum'
        }
        if (isArray) {
            type = type + '[]'
        }
        return type
    }

    mappings(): string[] {
        let mappings: string[] = this.schema.$mappings
        if (mappings === null && this.path) {
            if (this.schema.type === 'number') {
                mappings = ['number']
            } else {
                mappings = [this.path]
            }
        }
        if (!mappings) {
            mappings = []
        }
        return mappings
    }

    /**
     * Return all entities found in schema.
     */
    entities(): EntitySet {
        let entities: EntitySet = {}
        this.addEntities(entities)
        return entities
    }

    private addEntities(entities: EntitySet) {
        for (let mapping of this.mappings()) {
            if (!entities.hasOwnProperty(mapping)) {
                let entity = new Entity(mapping)
                if (mapping === this.path) {
                    if (this.typeName() === 'enum') {
                        // TODO: Do we want to enhance the schema with enum synonyms or leave that to the .lu files?
                        entity.values = this.schema.enum
                    }
                }
                entities[mapping] = entity
            }
        }
        for (let prop of this.schemaProperties()) {
            prop.addEntities(entities)
        }
    }
}
