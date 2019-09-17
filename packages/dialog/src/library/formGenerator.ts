#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formGenerator'
import * as s from './formSchema'
import * as fs from 'fs-extra'
import * as glob from 'globby'
import * as os from 'os'
import * as path from 'path'
import { readFile, writeFile } from 'fs'

export enum FeedbackType {
    info,
    warning,
    error
}

type Feedback = (type: FeedbackType, message: string) => void

async function readTemplate(templateDir: string, templateName: string, templateExt: string, feedback?: Feedback): Promise<string | null> {
    let template = null
    try {
        template = await fs.readFile(path.join(templateDir, templateName + templateExt), 'utf8')
    }
    catch (e) {
        if (feedback) {
            feedback(FeedbackType.warning, `There is no ${templateExt} template file for ${templateName}`)
        }
    }
    return template
}

async function writeTemplate(template: string, outDir: string, templateName: string, templateExt: string, includeLocale: boolean, force: boolean, feedback: Feedback): Promise<string | undefined> {
    let outName = templateName + (includeLocale ? '_' + path.basename(outDir) : '') + templateExt
    try {
        let outPath = path.join(outDir, outName);
        if (!force && await fs.pathExists(outPath)) {
            feedback(FeedbackType.info, `Skipping already existing ${outPath}`)
        } else {
            feedback(FeedbackType.info, `Generating ${outPath}`)
            await fs.writeFile(outPath, template)
        }
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
    return outName
}

const TOKENS = ['**PROPERTY**', '**PROPERTIES', 'PROPERTIES**', '**ENTITY**', '**ENTITIES', 'ENTITIES**', '**ENUM**', '**ENUMS', 'ENUMS**']
const PROPERTY = 0
const STARTPROP = 1
const ENDPROP = 2
const ENTITY = 3
const STARTENTITY = 4
const ENDENTITY = 5
const ENUM = 6
const STARTENUM = 7
const ENDENUM = 8

function scanForToken(template: string, pos: number, endToken: string): { newpos: number, block: string } | undefined {
    let current = ""
    let start = pos
    while (pos < template.length) {
        current += template[pos]
        if (!endToken.startsWith(current)) {
            current = ""
        } else if (current == endToken) {
            return { newpos: pos, block: template.substring(start, pos - endToken.length) }
        }
        ++pos
    }
    return undefined
}

/**
 * Expand a template by substituting for expressions in it.
 * \*\*PROPERTIES ... PROPERTIES\*\*: will duplicate the full block inside for each property and bound \*\*PROPERTY\*\* to the current property.
 * \*\*ENTITIES ... ENTITIES\*\*: will duplicate the full block inside for each entity name and bound \*\*ENTITY\*\* to the current entity.
 * \*\*ENUMS ... ENUMS\*\*: will duplicate the full block inside for each enum value and bound \*\*ENUM\*\* to the current enum.
 * \*\*PROPERTY\*\* gets the current property name.
 * \*\*ENTITY\*\* gets the current entity name.
 * @param template The template to substitute in.
 * @param schema The schema of the current property or the whole schema.
 * @param property The current property name.
 * @param entity The current entity name.
 * @param value The current enum value.
 */
function expand(template: string, schema: s.FormSchema, property?: string, entity?: string, value?: string, feedback?: Feedback): string {
    if (!feedback) {
        feedback = (type: FeedbackType, msg: string) => true
    }
    let newTemplate = ''
    let current = ''
    let startPos = 0
    let pos = 0
    while (pos < template.length) {
        if (current == "") {
            startPos = pos
        }
        current += template[pos]
        if (!TOKENS.some((t) => t.startsWith(current))) {
            newTemplate += current
            current = ""
        } else {
            let match = TOKENS.indexOf(current)
            switch (match) {
                case PROPERTY:
                    if (property) {
                        newTemplate += property
                    } else {
                        feedback(FeedbackType.error, `No definition for property at ${startPos}.`)
                    }
                    current = ""
                    break;
                case ENTITY:
                    if (entity) {
                        newTemplate += entity
                    } else {
                        feedback(FeedbackType.error, `No definition for entity at ${startPos}.`)
                    }
                    current = ""
                    break;
                case ENUM:
                    if (value) {
                        newTemplate += value
                    } else {
                        feedback(FeedbackType.error, `No definition for value at ${startPos}.`)
                    }
                    current = ""
                    break;
                case STARTPROP:
                    {
                        let scan = scanForToken(template, pos + 1, TOKENS[ENDPROP])
                        if (scan) {
                            let { newpos, block } = scan
                            for (let prop of schema.schemaProperties()) {
                                newTemplate += expand(block, prop, prop.path, entity, value, feedback)
                            }
                            pos = newpos
                        } else {
                            throw `${TOKENS[STARTPROP]} at ${startPos} missing end.`
                        }
                        current = ""
                        break;
                    }
                case ENDPROP:
                    feedback(FeedbackType.error, `${TOKENS[ENDPROP]} at ${startPos} missing start.`)
                    break;
                case STARTENTITY:
                    {
                        let scan = scanForToken(template, pos + 1, TOKENS[ENDENTITY])
                        if (scan) {
                            let { newpos, block } = scan
                            for (let entity of schema.mappings()) {
                                newTemplate += expand(block, schema, property, entity, value, feedback)
                            }
                            pos = newpos
                        } else {
                            throw `${TOKENS[STARTENTITY]} at ${startPos} missing end.`
                        }
                        current = ""
                        break;
                    }
                case ENDENTITY:
                    feedback(FeedbackType.error, `${TOKENS[ENDENTITY]} at ${startPos} missing start.`)
                    break;
                case STARTENUM:
                    {
                        let scan = scanForToken(template, pos + 1, TOKENS[ENDENUM])
                        if (scan) {
                            let { newpos, block } = scan
                            if (schema.schema.enum) {
                                for (let value of schema.schema.enum) {
                                    newTemplate += expand(block, schema, property, entity, value, feedback)
                                }
                            }
                            pos = newpos
                        } else {
                            throw `${TOKENS[STARTENTITY]} at ${pos} missing end.`
                        }
                        current = ""
                        break;
                    }
                case ENDENUM:
                    feedback(FeedbackType.error, `${TOKENS[ENDENUM]} at ${pos} missing start.`)
                    break;
            }
        }
        ++pos;
    }
    return newTemplate
}

async function copyLibraries(schema: s.FormSchema, templateDir: string, ext: string, outdir: string, force: boolean, feedback: Feedback): Promise<string[]> {
    let locale = path.basename(templateDir)
    let templates: string[] = []
    for (let templatePath of await glob(path.join(templateDir, '*_' + locale + ext))) {
        let template = await fs.readFile(templatePath, 'utf8')
        let newTemplate = expand(template, schema, undefined, undefined, undefined, feedback)
        let ext = path.extname(templatePath)
        let outName = await writeTemplate(newTemplate, outdir, path.basename(templatePath, ext), ext, false, force, feedback)
        if (outName) {
            templates.push(outName)
        }
    }
    return templates
}

async function generateLG(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    for (let prop of schema.schemaProperties()) {
        let type = prop.typeName()
        let template = await readTemplate(templateDir, type, '.lg', feedback)
        if (template) {
            let newTemplate = expand(template, prop, prop.path, undefined, undefined, feedback)
            await writeTemplate(newTemplate, outDir, prop.path, '.lg', true, force, feedback)
        }
    }
    copyLibraries(schema, templateDir, '.lg', outDir, force, feedback)
}

async function generateLU(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    let templates = ''
    for (let entity of Object.values(schema.entities())) {
        if (entity.name != 'string') {
            let template = await readTemplate(templateDir, entity.name, '.lu')
            let outName: string | undefined = undefined
            if (entity.values) {
                // Define base values for enum based list
                if (!template) {
                    template = await readTemplate(templateDir, 'enum', '.lu', feedback);
                }
                if (template) {
                    let valueSchema = new s.FormSchema("", { enum: entity.values })
                    template = expand(template, valueSchema, undefined, entity.name, undefined, feedback)
                    outName = await writeTemplate(template, outDir, entity.name, '.lu', true, force, feedback)
                }
            } else {
                if (template) {
                    template = expand(template, schema, undefined, entity.name, undefined, feedback)
                    outName = await writeTemplate(template, outDir, entity.name, '.lu', true, force, feedback)
                }
            }
            if (outName) {
                templates += `[${outName}](./${outName})` + os.EOL
            }
        }
    }

    for (let lib of await copyLibraries(schema, templateDir, '.lu', outDir, force, feedback)) {
        templates += `[${lib}](./${lib})` + os.EOL
    }

    await writeTemplate(templates, outDir, schema.name, '.lu.dialog', true, force, feedback)
}

async function generateDialog(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
}


// TODO: 
// One .lu per entity
// One .lg per property
// Do pieces for pulling out all entities, etc.

/**
 * Iterate through the locale templates and generate per property/locale files.
 * Each template file will map to <filename>_<property>.<ext>.
 * @param outDir Where to put generated files.
 * @param locales Locales to generate.
 * @param templateDir Where templates are found.
 * @param force True to force overwriting existing files.
 * @param feedback Callback function for progress and errors.
 */
export async function generate(schema: s.FormSchema, outDir: string, locales?: string[], templateDir?: string, force?: boolean, feedback?: Feedback): Promise<void> {
    if (!locales) {
        locales = ["en-us"]
    }
    if (!templateDir) {
        templateDir = 'resources'
    }
    if (!feedback) {
        feedback = (info, message) => true
    }
    if (!force) {
        force = false;
    }
    await fs.ensureDir(outDir)
    for (let locale of locales) {
        try {
            let localeIn = path.join(templateDir, locale)
            let localeOut = path.join(outDir, locale)
            await fs.ensureDir(localeOut)
            await generateLG(schema, localeIn, localeOut, force, feedback)
            await generateLU(schema, localeIn, localeOut, force, feedback)
            await generateDialog(schema, localeIn, localeOut, force, feedback)
        } catch (e) {
            feedback(FeedbackType.error, e.message)
        }
    }
}

