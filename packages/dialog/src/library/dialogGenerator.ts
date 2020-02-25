#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
export * from './dialogGenerator'
import * as s from './schema'
import * as expressions from 'adaptive-expressions'
import * as fs from 'fs-extra'
import * as lg from 'botbuilder-lg'
import * as ppath from 'path'
import * as ph from './generatePhrases'
import { processSchemas } from './processSchemas'

export enum FeedbackType {
    message,
    info,
    warning,
    error
}

export type Feedback = (type: FeedbackType, message: string) => void

function localePath(name: string, dir: string, locale?: string): string {
    return locale ? ppath.join(dir, locale, name) : ppath.join(dir, name)
}

export async function writeFile(path: string, val: any, force: boolean, feedback: Feedback) {
    try {
        if (force || !await fs.pathExists(path)) {
            feedback(FeedbackType.info, `Generating ${path}`)
            let dir = ppath.dirname(path)
            await fs.ensureDir(dir)
            await fs.writeFile(path, val)
        } else {
            feedback(FeedbackType.warning, `Skipping already existing ${path}`)
        }
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}

const expressionEngine = new expressions.ExpressionEngine((func: any) => {
    switch (func) {
        case 'phrase': return ph.PhraseEvaluator
        case 'phrases': return ph.PhrasesEvaluator
        default: return expressions.ExpressionFunctions.lookup(func)
    }
})

// Given a template name we look for it or an .lg version of it in template dirs (or their locale sub dirs)
type Template = lg.Evaluator | string | undefined

async function findTemplate(name: string, templateDirs: string[], locale?: string): Promise<Template> {
    let template
    for (let dir of templateDirs) {
        let loc = localePath(name, dir, locale)
        if (await fs.pathExists(loc)) {
            // Simple template
            template = await fs.readFile(loc, 'utf8')
        } else {
            // LG Engine with name/names added functions
            loc = localePath(name + '.lg', dir, locale)
            if (await fs.pathExists(loc)) {
                template = lg.LGParser.parseFile(loc, undefined, expressionEngine)
            }
        }
    }
    return template
}

function addLocale(name: string, locale: string, schemaName: string): string {
    let result = `${schemaName}-${name}`
    if (locale) {
        let base = `${schemaName}-${ppath.basename(name, '.lg')}`
        let extStart = base.indexOf('.')
        let filename
        if (extStart < 0) {
            filename = `${base}.${locale}.lg`
        } else {
            filename = `${base.substring(0, extStart)}.${locale}${base.substring(extStart)}`
        }
        result = ppath.join(ppath.dirname(name), filename)
    }
    return result
}

async function replaceAsync(str: string, re: RegExp, callback: (match: string) => Promise<string>): Promise<string> {
    let parts: any[] = []
    let i = 0
    if (re.global) {
        re.lastIndex = i
    }
    let match
    while (match = re.exec(str)) {
        // This probably needs to be awaited
        parts.push(str.slice(i, match.index), callback(match[0]))
        i = re.lastIndex
        if (!re.global) {
            break // for non-global regexes only take the first match
        }
        if (match[0].length === 0) {
            re.lastIndex++
        }
    }
    parts.push(str.slice(i))
    const strings = await Promise.all(parts)
    return strings.join('')
}

const RefPattern = /^\s*\[[^\]\n\r]*\]\s*$/gm
const LocalePattern = /\.[^.]+\.lg$/
async function processLibraryTemplates(template: string, outPath: string, templateDirs: string[], outDir: string, scope: any, force: boolean, feedback: Feedback): Promise<string> {
    if (!template.startsWith('>>> Library')) {
        return replaceAsync(template, RefPattern, async (match: string): Promise<string> => {
            let replacement = await processTemplate(match.substring(match.indexOf('[') + 1, match.indexOf(']')), templateDirs, outDir, scope, force, feedback, false)
            replacement = replacement.replace(LocalePattern, '.lg')
            let local = ppath.relative(ppath.dirname(outPath), replacement)
            return Promise.resolve(`\n[${ppath.basename(replacement)}](${local})`)
        });
    } else {
        return Promise.resolve(template)
    }
}

// Add entry to the .lg generation context and return it.  
// This also ensures the file does not exist already.
type FileRef = { name: string, fallbackName: string, fullName: string, relative: string }
function addEntry(fullPath: string, outDir: string, tracker: any): FileRef | undefined {
    let ref: FileRef | undefined
    let basename = ppath.basename(fullPath, '.dialog')
    let ext = ppath.extname(fullPath).substring(1)
    let arr: FileRef[] = tracker[ext]
    if (!arr.find(ref => ref.name === basename)) {
        ref = {
            name: basename,
            fallbackName: basename.replace(/\.[^.]+\.lg/, '.lg'),
            fullName: ppath.basename(fullPath),
            relative: ppath.relative(outDir, fullPath)
        }
    }
    return ref
}

function existingRef(name: string, tracker: any): FileRef | undefined {
    let ext = ppath.extname(name).substring(1)
    let arr: FileRef[] = tracker[ext]
    return arr.find(ref => ref.fullName === name)
}

async function processTemplate(
    templateName: string,
    templateDirs: string[],
    outDir: string,
    scope: any,
    force: boolean,
    feedback: Feedback,
    ignorable: boolean): Promise<string> {
    let outPath = ''
    try {
        let ref = existingRef(templateName, scope.templates)
        if (ref) {
            outPath = ppath.join(outDir, ref.relative)
        } else {
            let template = await findTemplate(templateName, templateDirs, scope.locale)
            if (template !== undefined) {
                // NOTE: Ignore templates that are defined, but are empty
                if (template) {
                    let filename = addLocale(templateName, scope.locale, scope.schemaName)
                    if (typeof template === 'object' && template.templates.some(f => f.name === 'filename')) {
                        filename = template.evaluateTemplate('filename', scope)
                    }
                    outPath = ppath.join(outDir, scope.locale, filename)
                    let ref = addEntry(outPath, outDir, scope.templates)
                    if (ref) {
                        if (force || !await fs.pathExists(outPath)) {
                            feedback(FeedbackType.info, `Generating ${outPath}`)
                            let result = template
                            if (typeof template === 'object') {
                                result = template.evaluateTemplate('template', scope)
                                if (Array.isArray(result)) {
                                    result = result.join('\n')
                                }
                                if (template.templates.some(f => f.name === 'filename')) {
                                    filename = template.evaluateTemplate('filename', scope)
                                }
                            }

                            // See if generated file has been overridden in templates
                            let existing = await findTemplate(filename, templateDirs, scope.locale)
                            if (existing) {
                                result = existing
                            }

                            result = await processLibraryTemplates(result as string, outPath, templateDirs, outDir, scope, force, feedback)
                            let dir = ppath.dirname(outPath)
                            await fs.ensureDir(dir)
                            await fs.writeFile(outPath, result)
                            scope.templates[ppath.extname(outPath).substring(1)].push(ref)
                        } else {
                            feedback(FeedbackType.warning, `Skipping already existing ${outPath}`)
                        }
                    }
                }
            } else if (!ignorable) {
                feedback(FeedbackType.error, `Missing template ${templateName}` + (scope.locale ? ` in locale ${scope.locale}` : ''))
            }
        }
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
    return outPath
}

async function processTemplates(
    schema: s.Schema,
    extensions: string[],
    templateDirs: string[],
    outDir: string,
    scope: any,
    force: boolean,
    feedback: Feedback) {

    scope.templates = {
        lg: [],
        lu: [],
        qna: [],
        json: [],
        dialog: []
    }

    // Entities first--ok to ignore templates because they might be property specific
    for (let entity of schema.allEntities()) {
        let [entityName, role] = entity.name.split(':')
        scope.entity = entityName
        scope.role = role
        scope.property = entity.property
        for (let ext of ['.lu', '.lg', '.qna', '.dialog']) {
            if (extensions.includes(ext)) {
                await processTemplate(entityName + ext, templateDirs, outDir, scope, force, feedback, true)
            }
        }
    }
    scope.entity = undefined
    scope.role = undefined
    scope.property = undefined

    // Process per property templates
    for (let prop of schema.schemaProperties()) {
        scope.property = prop.path

        // Property templates
        for (let templateName of prop.templates()) {
            if (extensions.includes(ppath.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, scope, force, feedback, false)
            }
        }
    }
    scope.property = undefined

    // Process templates found at the top
    if (schema.schema.$templates) {
        for (let templateName of schema.schema.$templates) {
            if (extensions.includes(ppath.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, scope, force, feedback, false)
            }
        }
    }
}

// Expand strings with ${} expression in them by evaluating and then interpreting as JSON.
function expandSchema(schema: any, scope: any, path: string, inProperties: boolean, missingIsError: boolean, feedback: Feedback): any {
    let newSchema = schema
    if (Array.isArray(schema)) {
        newSchema = []
        for (let val of schema) {
            let newVal = expandSchema(val, scope, path, false, missingIsError, feedback)
            newSchema.push(newVal)
        }
    } else if (typeof schema === 'object') {
        newSchema = {}
        for (let [key, val] of Object.entries(schema)) {
            let newPath = path
            if (inProperties) {
                newPath += newPath === '' ? key : '.' + key;
            }
            let newVal = expandSchema(val, { ...scope, property: newPath }, newPath, key === 'properties', missingIsError, feedback)
            newSchema[key] = newVal
        }
    } else if (typeof schema === 'string' && schema.startsWith('${')) {
        let expr = schema.substring(2, schema.length - 1)
        try {
            let { value, error } = expressionEngine.parse(expr).tryEvaluate(scope)
            if (!error && value) {
                newSchema = value
            } else {
                if (missingIsError) {
                    feedback(FeedbackType.error, `${expr}: ${error}`)
                }
            }
        } catch (e) {
            feedback(FeedbackType.error, `${expr}: ${e.message}`)
        }
    }
    return newSchema
}

function expandStandard(dirs: string[]): string[] {
    let expanded: string[] = []
    for (let dir of dirs) {
        if (dir === 'standard') {
            dir = ppath.join(__dirname, '../../templates')
        }
        expanded.push(dir)
    }
    return expanded;
}

/**
 * Iterate through the locale templates and generate per property/locale files.
 * Each template file will map to <filename>_<property>.<ext>.
 * @param schemaPath Path to JSON Schema to use for generation.
 * @param outDir Where to put generated files.
 * @param metaSchema Schema to use when generating .dialog files
 * @param allLocales Locales to generate.
 * @param templateDirs Where templates are found.
 * @param force True to force overwriting existing files.
 * @param feedback Callback function for progress and errors.
 */
export async function generate(
    schemaPath: string,
    outDir: string,
    metaSchema?: string,
    allLocales?: string[],
    templateDirs?: string[],
    force?: boolean,
    feedback?: Feedback)
    : Promise<void> {

    if (!feedback) {
        feedback = (_info, _message) => true
    }

    if (!metaSchema) {
        metaSchema = 'https://raw.githubusercontent.com/microsoft/botbuilder-dotnet/master/schemas/sdk.schema'
    } else if (!metaSchema.startsWith('http')) {
        // Adjust relative to outDir
        metaSchema = ppath.relative(outDir, metaSchema)
    }

    if (!allLocales) {
        allLocales = ['en-us']
    }

    if (!templateDirs) {
        templateDirs = ['standard']
    }

    let op = 'Regenerating'
    if (!force) {
        force = false
        op = 'Generating'
    }
    feedback(FeedbackType.message, `${op} resources for ${ppath.basename(schemaPath, '.schema')} in ${outDir}`)
    feedback(FeedbackType.message, `Locales: ${JSON.stringify(allLocales)} `)
    feedback(FeedbackType.message, `Templates: ${JSON.stringify(templateDirs)} `)
    feedback(FeedbackType.message, `App.schema: ${metaSchema} `)
    try {
        templateDirs = expandStandard(templateDirs)
        await fs.ensureDir(outDir)
        let schema = await processSchemas(schemaPath, templateDirs, feedback)
        schema.schema = expandSchema(schema.schema, {}, '', false, false, feedback)
        let scope: any = {
            locales: allLocales,
            schemaName: schema.name(),
            schema: schema.schema,
            properties: schema.schema.$public,
            entities: schema.entityTypes(),
            triggerIntent: schema.triggerIntent(),
            appSchema: metaSchema
        }
        for (let currentLoc of allLocales) {
            await fs.ensureDir(ppath.join(outDir, currentLoc))
            scope.locale = currentLoc
            await processTemplates(schema, ['.lg', '.lu', '.qna'], templateDirs, outDir, scope, force, feedback)
        }
        scope.locale = ''
        await processTemplates(schema, ['.dialog', '.json'], templateDirs, outDir, scope, force, feedback)

        // Expand schema expressions
        let name = s.Schema.basename(schemaPath)
        let expanded = expandSchema(schema.schema, scope, '', false, true, feedback)
        let body = JSON.stringify(expanded, (key, val) => (key === '$templates' || key === '$requires') ? undefined : val, 4)
        await writeFile(ppath.join(outDir, `${name}.schema.dialog`), body, force, feedback)
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}
