#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formTracker'
import * as Validator from 'ajv'
import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
let allof: any = require('json-schema-merge-allof')
let clone = require('clone')
let parser: any = require('json-schema-ref-parser')


export enum FeedbackType {
    info,
    warning,
    error
}

export class FormSchema {

    /** Path to this schema definition. */
    path: string

    /** Schema definition.  This is the content of a properties JSON Schema object. */
    schema: any

    constructor(path: string, schema: any) {
        this.path = path
        this.schema = schema
    }

    /**
     * Read and validate schema from a path.
     * @param schemaPath URL for schema.
     */
    static async readSchema(schemaPath: string): Promise<FormSchema> {
        let noref = await parser.dereference(schemaPath)
        let schema = allof(noref)
        let validator = new Validator()
        if (!validator.validateSchema(schema)) {
            let message = ""
            for (let error in validator.errors) {
                message = message + error + os.EOL
            }
            throw message
        }
        if (schema.type != "object") {
            throw "Form schema must be of type object."
        }
        return new FormSchema("", schema)
    }

    * schemaProperties(): Iterable<FormSchema> {
        for (let prop in this.schema.properties) {
            let newPath = this.path + (this.path == "" ? "" : ".") + prop
            yield new FormSchema(newPath, this.schema.properties[prop])
        }
    }

    typeName(): string {
        let isArray = false
        let schema = this.schema
        let type = schema.type
        if (type == "array") {
            schema = this.schema.items
            type = schema.type
            isArray = true
        }
        if (schema.enum) {
            type = "enum"
        }
        if (isArray) {
            type = type + "[]"
        }
        return type
    }

    mappings(): string[] {
        let mappings: string[] = this.schema.mappings
        if (mappings == null) {
            mappings = [this.path]
        }
        return mappings
    }

    /**
     * Iterate through the locale templates and generate per property/locale files.
     * Each template file will map to <filename>_<property>.<ext>.
     * @param outDir Where to put generated files.
     * @param locales Locales to generate.
     * @param templateDir Where templates are found.
     * @param force True to force overwriting existing files.
     * @param feedback Callback function for progress and errors.
     */
    async generate(outDir: string, locales?: string[], templateDir?: string, force?: boolean,
        feedback?: (type: FeedbackType, message: string) => boolean): Promise<void> {
        if (!locales) {
            locales = ["en-us"]
        }
        if (!templateDir) {
            templateDir = 'resources'
        }
        if (!feedback) {
            feedback = (info, message) => true
        }
        await fs.ensureDir(outDir)
        for (let locale of locales) {
            try {
                let localeIn = path.join(templateDir, locale)
                let localeOut = path.join(outDir, locale)
                await fs.ensureDir(localeOut)
                for (let templateFilename of await fs.readdir(localeIn)) {
                    let templateExt = path.extname(templateFilename)
                    let templateBasename = path.basename(templateFilename, templateExt)
                    let templateParts = templateBasename.split("_")
                    let templateType = templateParts[0]
                    let templateLocale = templateParts.length > 1 ? templateParts[1] : null
                    let template = await fs.readFile(path.join(localeIn, templateFilename), 'utf8')
                    if (templateLocale != null) {
                        // Just copy any already localized file
                        await fs.writeFile(path.join(localeOut, templateFilename), template)
                    }
                    else {
                        for (let prop of this.schemaProperties()) {
                            try {
                                let propType = prop.typeName()
                                for (let mapping of prop.mappings()) {
                                    if ((mapping == this.path && propType == templateType)
                                        || mapping == templateType) {
                                        let propPath = path.join(localeOut, prop.path + "-" + templateType + "_" + locale + templateExt)
                                        if (!feedback(FeedbackType.info, `Generating ${propPath}`)) {
                                            return
                                        }
                                        if (force || !await fs.pathExists(propPath)) {
                                            let instance = template.replace(/\*\*PROPERTY\*\*/gi, prop.path)
                                            await fs.writeFile(propPath, instance)
                                        }
                                    }
                                }
                            }
                            catch (e) {
                                if (!feedback(FeedbackType.error, e.message)) {
                                    return
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                if (!feedback(FeedbackType.error, e.message)) {
                    return
                }
            }
        }
    }
}   