#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as fg from './formGenerator'
import * as glob from 'globby'
import * as path from 'path'
import * as s from './formSchema'
let allof: any = require('json-schema-merge-allof')
let clone = require('clone')
let parser: any = require('json-schema-ref-parser')

type idToSchema = { [id: string]: any }
function basename(loc: string): string {
    let name = path.basename(loc)
    return name.substring(0, name.indexOf('.'))
}

async function templateSchemas(templateDirs: string[], feedback: fg.Feedback): Promise<idToSchema> {
    let map: idToSchema = {}
    for (let dir of templateDirs) {
        for (let file of await glob(dir + '**/*.schema')) {
            let schema = await getSchema(file, feedback)
            let id: string = schema.$id || path.basename(file, '.schema')
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
async function getSchema(path: string, feedback: fg.Feedback): Promise<any> {
    let schema
    try {
        let noref = await parser.dereference(path)
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
export async function processSchemas(formPath: string, templateDirs: string[], outDir: string, force: boolean, feedback: fg.Feedback)
    : Promise<s.FormSchema> {
    let formSchema = await getSchema(formPath, feedback)
    let allRequired = await templateSchemas(templateDirs, feedback)
    let required = {}
    await findRequires(formSchema, allRequired, required, feedback)
    let allSchema = clone(formSchema)
    for (let schema of Object.values(allRequired)) {
        allSchema.properties = { ...allSchema.properties, ...schema.properties }
        allSchema.definition = { ...allSchema.definition, ...schema.definition }
        allSchema.required = { ...allSchema.required, ...schema.required }
        allSchema.$expectedOnly = { ...allSchema.$expectedOnly, ...schema.$expectedOnly }
    }
    let name = basename(formPath)
    await fg.writeFile(path.join(outDir, name + '.form.dialog'), formSchema, force, feedback)
    await fg.writeFile(path.join(outDir, `.${name}.schema.dialog`), allSchema, force, feedback)
    return new s.FormSchema('', allSchema, name)
}
