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
    } catch {
        if (feedback) {
            feedback(FeedbackType.warning, `There is no ${templateExt} template file for ${templateName}`)
        }
    }
    return template
}

async function writeTemplate(template: string, outDir: string, templateName: string, templateExt: string, includeLocale: boolean, force: boolean, feedback: Feedback): Promise<string | undefined> {
    let outName = templateName + (includeLocale ? '.' + path.basename(outDir) : '') + templateExt
    try {
        let outPath = path.join(outDir, outName)
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

const TOKENS = ['**PROPERTY**', '**PROPERTIES', 'PROPERTIES**', '**ENTITY**', '**ENTITIES', 'ENTITIES**', '**ENUM**', '**ENUMS', 'ENUMS**', '**SCHEMA**', '**REFERENCES**', '**LOCALE**']
const PROPERTY = 0
const STARTPROP = 1
const ENDPROP = 2
const ENTITY = 3
const STARTENTITY = 4
const ENDENTITY = 5
const ENUM = 6
const STARTENUM = 7
const ENDENUM = 8
const SCHEMA = 9
const REFERENCES = 10
const LOCALE = 11

function scanForToken(template: string, pos: number, endToken: string): { newpos: number, block: string } | undefined {
    let current = ''
    let start = pos
    while (pos < template.length) {
        current += template[pos]
        if (!endToken.startsWith(current)) {
            current = ''
        } else if (current === endToken) {
            return { newpos: pos, block: template.substring(start, pos - endToken.length) }
        }
        ++pos
    }
    return
}

/**
 * Expand a template by substituting for expressions in it.
 * \*\*PROPERTIES ... PROPERTIES\*\*: will duplicate the full block inside for each property and bound \*\*PROPERTY\*\* to the current property.
 * \*\*ENTITIES ... ENTITIES\*\*: will duplicate the full block inside for each entity name and bound \*\*ENTITY\*\* to the current entity.
 * \*\*ENUMS ... ENUMS\*\*: will duplicate the full block inside for each enum value and bound \*\*ENUM\*\* to the current enum.
 * \*\*PROPERTY\*\* gets the current property name.
 * \*\*ENTITY\*\* gets the current entity name.
 * \*\*SCHEMA\*\* gets the current schema name.
 * \*\*REFERENCES\*\*: list of references for generated files of that type.
 * \*\*LOCALE\*\* gets the locale name.
 * @param template The template to substitute in.
 * @param schema The schema of the current property or the whole schema.
 * @param bindings Current bindings for tokens.
 * @param feedback Feedback function.
 */
function expand(template: string, schema: s.FormSchema, bindings: { property?: string, entity?: string, value?: string, references?: string, locale?: string }, feedback?: Feedback): string {
    if (!feedback) {
        feedback = (_info: FeedbackType, _msg: string) => true
    }
    let newTemplate = ''
    let current = ''
    let startPos = 0
    let pos = 0
    while (pos < template.length) {
        if (current === '') {
            startPos = pos
        }
        current += template[pos]
        if (!TOKENS.some(t => t.startsWith(current))) {
            newTemplate += current
            current = ''
        } else {
            let match = TOKENS.indexOf(current)
            switch (match) {
                case PROPERTY:
                    if (bindings.property) {
                        newTemplate += bindings.property
                    } else {
                        feedback(FeedbackType.error, `No definition for property at ${startPos}.`)
                    }
                    current = ''
                    break
                case ENTITY:
                    if (bindings.entity) {
                        newTemplate += bindings.entity
                    } else {
                        feedback(FeedbackType.error, `No definition for entity at ${startPos}.`)
                    }
                    current = ''
                    break
                case ENUM:
                    if (bindings.value) {
                        newTemplate += bindings.value
                    } else {
                        feedback(FeedbackType.error, `No definition for value at ${startPos}.`)
                    }
                    current = ''
                    break
                case SCHEMA:
                    if (schema.name) {
                        newTemplate += schema.name
                    } else {
                        feedback(FeedbackType.error, `No definition for schema at ${startPos}.`)
                    }
                    current = ''
                    break
                case REFERENCES:
                    if (bindings.references) {
                        newTemplate += bindings.references
                    } else {
                        feedback(FeedbackType.error, `No definition for references at ${startPos}.`)
                    }
                    current = ''
                    break
                case LOCALE:
                    if (bindings.locale) {
                        newTemplate += bindings.locale
                    } else {
                        feedback(FeedbackType.error, `No definition for locale at ${startPos}.`)
                    }
                    current = ''
                    break;
                case STARTPROP: {
                    let scan = scanForToken(template, pos + 1, TOKENS[ENDPROP])
                    if (scan) {
                        let { newpos, block } = scan
                        for (let prop of schema.schemaProperties()) {
                            newTemplate += expand(block, prop, { property: prop.path, ...bindings }, feedback)
                        }
                        pos = newpos
                    } else {
                        throw new Error(`${TOKENS[STARTPROP]} at ${startPos} missing end.`)
                    }
                    current = ''
                    break
                }
                case STARTENTITY: {
                    let scan = scanForToken(template, pos + 1, TOKENS[ENDENTITY])
                    if (scan) {
                        let { newpos, block } = scan
                        for (let entityName of schema.mappings()) {
                            newTemplate += expand(block, schema, { entity: entityName, ...bindings }, feedback)
                        }
                        pos = newpos
                    } else {
                        throw new Error(`${TOKENS[STARTENTITY]} at ${startPos} missing end.`)
                    }
                    current = ''
                    break
                }
                case STARTENUM: {
                    let scan = scanForToken(template, pos + 1, TOKENS[ENDENUM])
                    if (scan) {
                        let { newpos, block } = scan
                        if (schema.schema.enum) {
                            for (let val of schema.schema.enum) {
                                newTemplate += expand(block, schema, { value: val, ...bindings }, feedback)
                            }
                        }
                        pos = newpos
                    } else {
                        throw new Error(`${TOKENS[STARTENTITY]} at ${pos} missing end.`)
                    }
                    current = ''
                    break
                }
                default:
                    if (match >= 0) {
                        feedback(FeedbackType.error, `${TOKENS[match]} at ${pos} missing start.`)
                    }
            }
        }
        ++pos
    }
    return newTemplate
}

async function copyLibraries(schema: s.FormSchema, templateDir: string, ext: string, outdir: string, force: boolean, feedback: Feedback): Promise<string[]> {
    let locale = path.basename(templateDir)
    let templates: string[] = []
    for (let templatePath of await glob(path.join(templateDir, '*.' + locale + ext))) {
        let template = await fs.readFile(templatePath, 'utf8')
        let newTemplate = expand(template, schema, {}, feedback)
        let ext = path.extname(templatePath)
        let outName = await writeTemplate(newTemplate, outdir, path.basename(templatePath, ext), ext, false, force, feedback)
        if (outName) {
            templates.push(outName)
        }
    }
    return templates
}

async function generateLG(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    let refs = ''
    for (let prop of schema.schemaProperties()) {
        let type = prop.templateName()
        let template = await readTemplate(templateDir, type, '.lg', feedback)
        if (template) {
            let newTemplate = expand(template, prop, { property: prop.path, locale: path.basename(templateDir) }, feedback)
            let outName = await writeTemplate(newTemplate, outDir, prop.path, '.lg', true, force, feedback)
            if (outName) {
                refs += `(${outName})[${outName}]${os.EOL}`
            }
        }
    }

    for (let ref of await copyLibraries(schema, templateDir, '.lg', outDir, force, feedback)) {
        refs += `(${ref})[${ref}]${os.EOL}`
    }
    await writeTemplate(refs, outDir, schema.name, '.lu', true, force, feedback)
}

async function generateLU(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    let templates = ''
    for (let entity of Object.values(schema.entities())) {
        if (entity.name !== 'utterance') {
            let template = await readTemplate(templateDir, entity.name, '.lu')
            let outName: string | undefined
            if (!template) {
                if (entity.values) {
                    template = await readTemplate(templateDir, 'enum', '.lu', feedback)
                } else {
                    template = await readTemplate(templateDir, 'string', '.lu', feedback)
                }
            }
            if (template) {
                let valueSchema = new s.FormSchema('', { enum: entity.values })
                template = expand(template, valueSchema, { entity: entity.name, locale: path.basename(templateDir) }, feedback)
                outName = await writeTemplate(template, outDir, entity.name, '.lu', true, force, feedback)
            }
            if (outName) {
                templates += `[${outName}](./${outName})` + os.EOL
            }
        }
    }

    for (let lib of await copyLibraries(schema, templateDir, '.lu', outDir, force, feedback)) {
        templates += `[${lib}](./${lib})` + os.EOL
    }
    await writeTemplate(templates, outDir, schema.name, '.lu', true, force, feedback)
}

function expandedName(templateName: string, propertyName: string): string {
    let suffix = ''
    for (let i = 0; i < templateName.length; ++i) {
        let ch = templateName[i]
        if (ch !== ch.toLowerCase()) {
            suffix = templateName.substring(i)
            break
        }
    }
    return propertyName + suffix
}

async function generateDialog(schema: s.FormSchema, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    let templates = ''
    let addTemplate = function (t?: string) {
        if (t) {
            if (templates !== '') {
                templates += `, "${t}"`
            } else {
                templates += `"${t}"`
            }
        }
    }
    for (let prop of schema.schemaProperties()) {
        let type = prop.templateName()
        for (let templateName of await glob(path.join(templateDir, type + '*.dialog'))) {
            let template = await readTemplate(templateDir, path.basename(templateName, '.dialog'), '.dialog', feedback) || ''
            let newTemplate = expand(template, prop, { property: prop.path, locale: path.basename(templateDir) }, feedback)
            let name = expandedName(path.basename(templateName, '.dialog'), prop.path)
            let outName = await writeTemplate(newTemplate, outDir, name, '.dialog', false, force, feedback)
            addTemplate(outName)
        }
    }

    for (let lib of await copyLibraries(schema, templateDir, '.dialog', outDir, force, feedback)) {
        addTemplate(lib)
    }
    let root = await readTemplate(templateDir, 'root', '.dialog', feedback)
    if (root) {
        let newRoot = expand(root, schema, { references: templates, locale: path.basename(templateDir) }, feedback)
        await writeTemplate(newRoot, outDir, schema.name, '.dialog', false, force, feedback)
    } else {
        throw new Error('Missing root.dialog template')
    }
}

async function generateMultiLanguage(schema: s.FormSchema, locales: string[], templateDir: string, outDir: string, feedback: Feedback): Promise<void> {
    let template = await readTemplate(templateDir, 'luconfig', '.json', feedback)
    if (template) {
        // TODO: We need to expand this to .lg, but declarative is missing for .lg
        let refs = ''
        for (let locale of locales) {
            if (refs !== '') {
                refs += ',' + os.EOL
            }
            refs += `"${locale}/${schema.name}.${locale}.lu"`
        }
        let newTemplate = expand(template, schema, { locale: locales[0], references: refs }, feedback)
        await writeTemplate(newTemplate, outDir, 'luconfig', '.json', false, true, feedback)
    }
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
export async function generate(schema: s.FormSchema, outDir: string, locales?: string[], templateDir?: string, force?: boolean, feedback?: Feedback): Promise<void> {
    if (!locales) {
        locales = ['en-us']
    }
    if (!feedback) {
        feedback = (_info, _message) => true
    }
    if (!templateDir) {
        templateDir = path.join(__dirname, '../../resources')
    }
    if (!force) {
        force = false
    }
    try {
        await fs.ensureDir(outDir)
        for (let locale of locales) {
            try {
                let localeIn = path.join(templateDir, locale)
                let localeOut = path.join(outDir, locale)
                await fs.ensureDir(localeOut)
                await generateLG(schema, localeIn, localeOut, force, feedback)
                await generateLU(schema, localeIn, localeOut, force, feedback)
            } catch (e) {
                feedback(FeedbackType.error, e.message)
            }
        }
        await generateMultiLanguage(schema, locales, templateDir, outDir, feedback)
        await generateDialog(schema, templateDir, outDir, force, feedback)
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}
