#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formGenerator'
import * as s from './formSchema'
import * as expr from 'botframework-expressions'
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
            await fs.writeFile(path, val)
        } else {
            feedback(FeedbackType.info, `Skipping already existing ${path}`)
        }
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}

const expressionEngine = new expr.ExpressionEngine((func: any) => {
    switch (func) {
        case 'phrase': return ph.PhraseEvaluator
        case 'phrases': return ph.PhrasesEvaluator
        default: return expr.BuiltInFunctions.Lookup(func)
    }
})

// Given a template name we look for it or an .lg version of it in template dirs (or their locale sub dirs)
type Template = lg.TemplateEngine | string | undefined

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
                template = new lg.TemplateEngine(expressionEngine)
                template.addFile(loc)
            }
        }
    }
    return template
}

function addLocale(name: string, locale: string, formName: string): string {
    let result = `${formName}-${name}`
    if (locale) {
        let base = `${formName}-${ppath.basename(name, '.lg')}`
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
    let parts = []
    let i = 0
    if (re.global) {
        re.lastIndex = i
    }
    let match
    while (match = re.exec(str)) {
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

const RefPattern = /^\[[^\]]*\]/gm
async function processLibraryTemplates(template: string, outPath: string, templateDirs: string[], outDir: string, form: any, scope: any, force: boolean, feedback: Feedback): Promise<string> {
    if (!template.startsWith('>>> Library')) {
        return replaceAsync(template, RefPattern, async (match: string): Promise<string> => {
            let replacement = await processTemplate(match.substring(1, match.length - 1), templateDirs, outDir, form, scope, force, feedback, false)
            let local = ppath.relative(ppath.dirname(outPath), replacement)
            return Promise.resolve(`[${ppath.basename(replacement)}](${local})`)
        });
    } else {
        return Promise.resolve(template)
    }
}

type FileRef = { name: string, fullName: string, relative: string }
function addEntry(fullPath: string, outDir: string, tracker: any): FileRef | undefined {
    let ref: FileRef | undefined
    let basename = ppath.basename(fullPath, '.dialog')
    let ext = ppath.extname(fullPath).substring(1)
    let arr: FileRef[] = tracker[ext]
    if (!arr.find(ref => ref.name === basename)) {
        ref = {
            name: basename,
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
    form: s.FormSchema,
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
                    let filename = addLocale(templateName, scope.locale, scope.formName)
                    if (typeof template === 'object' && template.templates.some(f => f.Name === 'filename')) {
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
                                if (template.templates.some(f => f.Name === 'filename')) {
                                    filename = template.evaluateTemplate('filename', scope)
                                }
                            }
                            result = await processLibraryTemplates(result as string, outPath, templateDirs, outDir, form, scope, force, feedback)
                            await fs.writeFile(outPath, result)
                            scope.templates[ppath.extname(outPath).substring(1)].push(ref)
                        } else {
                            feedback(FeedbackType.info, `Skipping already existing ${outPath}`)
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
    form: s.FormSchema,
    schema: s.FormSchema,
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
    for (let entity of Object.keys(schema.entities())) {
        for (let ext of ['.lu', '.lg', '.qna', '.dialog']) {
            if (extensions.includes(ext)) {
                await processTemplate(entity + ext, templateDirs, outDir, schema, scope, force, feedback, true)
            }
        }
    }

    // Process per property templates
    for (let prop of schema.schemaProperties()) {
        scope.property = prop.name

        // Property templates
        for (let templateName of prop.templates()) {
            if (extensions.includes(ppath.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, schema, scope, force, feedback, false)
            }
        }
    }
    scope.property = undefined

    // Process templates found at the top
    if (schema.schema.$templates) {
        for (let templateName of schema.schema.$templates) {
            if (extensions.includes(ppath.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, form, scope, force, feedback, false)
            }
        }
    }
}

/**
 * Iterate through the locale templates and generate per property/locale files.
 * Each template file will map to <filename>_<property>.<ext>.
 * @param outDir Where to put generated files.
 * @param metaSchema Schema to use when generating .dialog files
 * @param allLocales Locales to generate.
 * @param templateDirs Where templates are found.
 * @param force True to force overwriting existing files.
 * @param feedback Callback function for progress and errors.
 */
export async function generate(
    formPath: string,
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
        metaSchema = 'https://raw.githubusercontent.com/microsoft/botbuilder-dotnet/chrimc/map/schemas/sdk.schema'
    } else if (!metaSchema.startsWith('http')) {
        // Adjust relative to outDir
        metaSchema = ppath.relative(outDir, metaSchema)
    } 

    if (!allLocales) {
        allLocales = ['en-us']
    }

    if (!templateDirs) {
        templateDirs = [ppath.join(__dirname, '../../templates')]
    }

    let op = 'Regenerating'
    if (!force) {
        force = false
        op = 'Generating'
    }
    feedback(FeedbackType.message, `${op} resources for ${ppath.basename(formPath, '.form')} in ${outDir}`)
    feedback(FeedbackType.message, `Locales: ${JSON.stringify(allLocales)} `)
    feedback(FeedbackType.message, `Templates: ${JSON.stringify(templateDirs)} `)
    feedback(FeedbackType.message, `App.schema: ${metaSchema} `)
    try {
        await fs.ensureDir(outDir)
        let { form, schema } = await processSchemas(formPath, templateDirs, outDir, force, feedback)
        let scope: any = {
            locales: allLocales,
            form: form.schema,
            formName: form.name,
            schema: schema.schema,
            properties: Object.keys(form.schema.properties),
            appSchema: metaSchema
        }
        for (let currentLoc of allLocales) {
            await fs.ensureDir(ppath.join(outDir, currentLoc))
            scope.locale = currentLoc
            await processTemplates(form, schema, ['.lg', '.lu', '.qna'], templateDirs, outDir, scope, force, feedback)
        }
        scope.locale = ''
        await processTemplates(form, schema, ['.dialog', '.json'], templateDirs, outDir, scope, force, feedback)
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}
