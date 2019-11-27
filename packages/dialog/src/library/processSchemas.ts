#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as fg from './dialogGenerator'
import * as glob from 'globby'
import * as ppath from 'path'
import * as s from './schema'
let allof: any = require('json-schema-merge-allof')
let clone = require('clone')
let parser: any = require('json-schema-ref-parser')

type idToSchema = { [id: string]: any }

async function templateSchemas(templateDirs: string[], feedback: fg.Feedback): Promise<idToSchema> {
    let map: idToSchema = {}
    for (let dir of templateDirs) {
        for (let file of await glob(ppath.join(dir, '**/*.schema'))) {
            let schema = await getSchema(file, feedback)
            let id: string = schema.$id || ppath.basename(file)
            if (!map[id]) {
                map[id] = schema
            }
        }
    }
    return map
}

async function findRequires(schema: any, map: idToSchema, found: idToSchema, feedback: fg.Feedback): Promise<void> {
    let addRequired = async (required: string) => {
        if (!found[required]) {
            let schema = map[required] || await getSchema(required, feedback)
            if (!schema) {
                feedback(fg.FeedbackType.error, `Schema ${required} cannot be found`)
            } else {
                found[required] = schema
            }
        }
    }
    if (typeof schema === 'object') {
        for (let [child, val] of Object.entries(schema)) {
            if (child === '$requires') {
                for (let required of val as string[]) {
                    await addRequired(required)
                }
            } else {
                await findRequires(val, map, found, feedback)
            }
        }
    }
}

// Get a schema after following all references and removing allOf
async function getSchema(path: string, feedback: fg.Feedback, resolver?: any): Promise<any> {
    let schema
    try {
        let noref = await parser.dereference(path, { template: resolver })
        schema = allof(noref)
    } catch (err) {
        feedback(fg.FeedbackType.error, err)
    }
    return schema
}

function mergeSchemas(allSchema: any, schemas: any[]) {
    for (let schema of schemas) {
        allSchema.properties = { ...allSchema.properties, ...schema.properties }
        allSchema.definitions = { ...allSchema.definitions, ...schema.definitions }
        if (schema.required) allSchema.required = allSchema.required.concat(schema.required)
        if (schema.$expectedOnly) allSchema.$expectedOnly = allSchema.$expectedOnly.concat(schema.$expectedOnly)
        if (schema.$templates) allSchema.$templates = allSchema.$templates.concat(schema.$templates)
        if (schema.$public) allSchema.$public = allSchema.$public.concat(schema.$public)
    }
}

// Process the root schema to generate all schemas
// 1) A property can $ref to a property definition to reuse a type like address. Ref resolver includes.
// 2) $requires:[] can be in a property or at the top.  This is handled by finding all of the referenced schemas and then merging.  
export async function processSchemas(schemaPath: string, templateDirs: string[], feedback: fg.Feedback)
    : Promise<any> {
    let allRequired = await templateSchemas(templateDirs, feedback)
    let resolver: any = {
        canRead: true,
        read(file: string): any {
            return allRequired[ppath.basename(file)]
        }
    }
    let formSchema = await getSchema(schemaPath, feedback, resolver)
    let required = {}
    await findRequires(formSchema, allRequired, required, feedback)
    let allSchema = clone(formSchema)
    if (!allSchema.required) allSchema.required = []
    if (!allSchema.$expectedOnly) allSchema.$expectedOnly = []
    if (!allSchema.$templates) allSchema.$templates = []
    if (formSchema.$public) {
        allSchema.$public = formSchema.$public
    } else {
        // Default to properties in root schema
        allSchema.$public = Object.keys(formSchema.properties)
    }
    mergeSchemas(allSchema, Object.values(allRequired));

    return new s.Schema(schemaPath, allSchema)
}
