#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* tslint:disable:no-unused */
export * from './schema'
import * as Validator from 'ajv'
import * as os from 'os'
import * as ppath from 'path'
import * as ps from './processSchemas'
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

/**
 * Extra properties:
 * $entities: [entity] defaults based on type, string -> [property], numbers -> [property, number]
 * $templates: Template basenames to specialize for this property.
 */
export class Schema {
    /**
     * Read and validate schema from a path.
     * @param schemaPath URL for schema.
     */
    static async readSchema(schemaPath: string): Promise<Schema> {
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
            throw new Error('Root schema must be of type object.')
        }
        return new Schema(schemaPath, schema)
    }

    static basename(loc: string): string {
        let name = ppath.basename(loc)
        return name.substring(0, name.indexOf('.'))
    }

    /** 
     * Path to this schema definition. 
     */
    path: string

    /** 
     * Schema definition.  This is the content of a properties JSON Schema object. 
     */
    schema: any

    /**
     * Source of schema
     */
    source: string

    constructor(source: string, schema: any, path?: string) {
        this.source = source
        this.path = path || ''
        this.schema = schema
    }

    name(): string {
        return Schema.basename(this.source)
    }

    * schemaProperties(): Iterable<Schema> {
        for (let prop in this.schema.properties) {
            let newPath = this.path + (this.path === '' ? '' : '.') + prop
            yield new Schema(this.source, this.schema.properties[prop], newPath)
        }
    }

    typeName(): string {
        return ps.typeName(this.schema)
    }

    templates(): string[] {
        let templates = this.schema.$templates
        if (!templates) {
            let type = this.typeName()
            templates = [type + 'Entity.lu', type + 'Entity.lg', type + 'Property.lg', type + 'Ask.dialog']
            for (let entity of this.schema.$entities) {
                let [entityName, _] = entity.split(':')
                if (entityName === this.path + 'Entity') {
                    templates.push(`${type}Set${type}.dialog`)
                    if (type === 'enum') {
                        templates.push(`${type}ChooseEntity.dialog`)
                    }
                } else {
                    templates.push(`${type}Set${entityName}.dialog`)
                }
            }
        }
        return templates
    }

    triggerIntent(): string {
        return this.schema.$triggerIntent || this.name()
    }

    /**
     * Return all entities found in schema.
     */
    allEntities(): EntitySet {
        let entities: EntitySet = {}
        this.addEntities(entities)
        return entities
    }

    /**
     * Return all of the entity types in schema.
     */
    entityTypes(): string[] {
        let found: string[] = []
        for (let entity of Object.keys(this.allEntities())) {
            let [entityName, _] = entity.split(':')
            if (!found.includes(entityName)) {
                found.push(entityName)
            }
        }
        return found
    }

    /**
     * Return the roles or entity types found in schema.
     */
    * roles(): Iterable<string> {
        for (let entity of Object.keys(this.allEntities())) {
            let [entityName, role] = entity.split(':')
            yield role || entityName
        }
    }

    private addEntities(entities: EntitySet) {
        if (this.schema.$entities) {
            for (let entity of this.schema.$entities) {
                // Do not include entities generated from property
                if (!entities.hasOwnProperty(entity)) {
                    let entityWrapper = new Entity(entity)
                    entities[entity] = entityWrapper
                }
            }
        } else {
            // Don't explore properties below an explicit mapping
            for (let prop of this.schemaProperties()) {
                prop.addEntities(entities)
            }
        }
    }
}
