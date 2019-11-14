#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
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
        for (let file of await glob(ppath.join(dir, '**/*.schema*'))) {
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

// Process the form schema to generate all schemas
// 1) A property can $ref to a property definition to reuse a type like address. Ref resolver includes.
// 2) $requires:[] can be in a property or at the top.  This is handled by finding all of them and then merging
//    properties, definition and required.  
//    The assumption here is that the required properties are orthogonal to the form so unique names are important.
export type Schemas = { form: s.Schema, schema: s.Schema }
export async function processSchemas(formPath: string, templateDirs: string[], outDir: string, force: boolean, feedback: fg.Feedback)
    : Promise<Schemas> {
    let allRequired = await templateSchemas(templateDirs, feedback)
    let resolver: any = {
        canRead: true,
        read(file: string): any {
            return allRequired[ppath.basename(file)]
        }
    }
    let formSchema = await getSchema(formPath, feedback, resolver)
    let required = {}
    await findRequires(formSchema, allRequired, required, feedback)
    let allSchema = clone(formSchema)
    if (!allSchema.required) allSchema.required = []
    if (!allSchema.$expectedOnly) allSchema.$expectedOnly = []
    if (!allSchema.$templates) allSchema.$templates = []
    for (let schema of Object.values(allRequired)) {
        allSchema.properties = { ...allSchema.properties, ...schema.properties }
        allSchema.definition = { ...allSchema.definition, ...schema.definition }
        if (schema.required) allSchema.required = allSchema.required.concat(schema.required)
        if (schema.$expectedOnly) allSchema.$expectedOnly = allSchema.$expectedOnly.concat(schema.$expectedOnly)
        if (schema.$templates) allSchema.$templates = allSchema.$templates.concat(schema.$templates)
    }
    let name = s.Schema.basename(formPath)
    await fg.writeFile(ppath.join(outDir, `${name}.form.dialog`), JSON.stringify(formSchema, undefined, 4), force, feedback)
    await fg.writeFile(ppath.join(outDir, `${name}.schema.dialog`), JSON.stringify(allSchema, undefined, 4), force, feedback)
    return { form: new s.Schema(formPath, formSchema), schema: new s.Schema(formPath, allSchema) }
}
