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
type TemplateTypes = { property: string[], mappings: string[] }

/**
 * Extra properties:
 * $mappings: [entity] defaults based on type, string -> [property], numbers -> [property, number]
 * $templates: Template basenames to specialize for this property.
 * 
 * TODO: Add more like $units.
 */
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
            throw new Error(message)
        }
        if (schema.type !== 'object') {
            throw new Error('Form schema must be of type object.')
        }
        return new FormSchema('', schema, ppath.basename(schemaPath, '.form.dialog'))
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
        this.name = name || ppath.basename(path, '.dialog')
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

    templates(): TemplateTypes {
        let templates = this.schema.$templates
        if (!templates) {
            templates = {
                property: [this.typeName() + 'Property.lg', this.typeName() + 'Entity.lu', this.typeName() + 'Entity.lg', this.typeName() + 'Ask.dialog'],
                mappings: this.mappings()
            }
        } 
        if (!templates.property) {
            templates.property = []
        }
        if (!templates.mappings) {
            templates.mappings = []
        }
        return templates
    }

    mappings(): string[] {
        let mappings: string[] = this.schema.$mappings
        if (!mappings && this.path) {
            if (this.schema.type === 'number') {
                mappings = ['number']
            } else {
                mappings = [this.path + 'Entity']
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
            // Do not include entities generated from property
            if (!entities.hasOwnProperty(mapping) && !mapping.startsWith(this.path) && !mapping.endsWith('Entity') && mapping !== 'utterance') {
                let entity = new Entity(mapping)
                entities[mapping] = entity
            }
        }
        for (let prop of this.schemaProperties()) {
            prop.addEntities(entities)
        }
    }
}
