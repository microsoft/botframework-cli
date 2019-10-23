#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formGenerator'
import * as s from './formSchema'
import { ExpressionEngine } from 'botbuilder-expression-parser'
import * as expr from 'botbuilder-expression'
import * as fs from 'fs-extra'
import * as lg from 'botbuilder-lg'
import * as path from 'path'
import * as ph from './generatePhrases'
import { processSchemas } from './processSchemas'
import { SSL_OP_EPHEMERAL_RSA } from 'constants'

// TODO:
// Support numbered tokens in order to support **ASK1**, etc.
// Add --multiple for lists of properties to bind
export enum FeedbackType {
    info,
    warning,
    error
}

export type Feedback = (type: FeedbackType, message: string) => void

function localePath(name: string, dir: string, locale?: string): string {
    return locale ? path.join(dir, locale, name) : path.join(dir, name)
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

/*
async function generateDialog(form: s.FormSchema, schema: string, templateDir: string, outDir: string, force: boolean, feedback: Feedback): Promise<void> {
    let templates = ''
    let addTemplate = function (t?: string) {
        if (t) {
            let name = path.basename(t, '.dialog')
            if (templates !== '') {
                templates += `, "${name}"`
            } else {
                templates += `"${name}"`
            }
        }
    }
    for (let prop of form.schemaProperties()) {
        for (let type of prop.templateNames()) {
            for (let templateName of await glob(path.join(templateDir, type + '*.dialog'))) {
                let template = await readTemplate(templateDir, path.basename(templateName, '.dialog'), '.dialog', feedback)
                if (template) {
                    let loc = path.basename(templateDir)
                    let newTemplate = expand(path.basename(templateName), template, prop, { property: prop.path, name: generateWords(prop.path, loc).join(' '), locale: loc }, feedback)
                    let name = expandedName(path.basename(templateName, '.dialog'), prop.path)
                    let obj = JSON.parse(newTemplate)
                    obj.$schema = schema
                    newTemplate = JSON.stringify(obj, undefined, 4)
                    let outName = await writeTemplate(newTemplate, outDir, form.name, name, '.dialog', false, force, feedback)
                    addTemplate(outName)
                }
            }
        }
    }

    let pattern = path.join(templateDir, '[a-z]+.dialog')
    for (let lib of await copyLibraryPattern(form, pattern, outDir, force, feedback)) {
        addTemplate(lib)
    }

    await writeTemplate(JSON.stringify(form.schema, undefined, 4), outDir, '', form.name, '.form.dialog', false, true, feedback)

    let root = await readTemplate(templateDir, 'Main', '.dialog', feedback)
    if (root) {
        let newRoot = expand('main.dialog', root, form, { references: templates, locale: path.basename(templateDir) }, feedback)
        await writeTemplate(newRoot, outDir, '', form.name + '.main', '.dialog', false, force, feedback)
    } else {
        throw new Error('Missing Main.dialog template')
    }
}

async function generateMultiLanguage(schema: s.FormSchema, locales: string[], templateDir: string, outDir: string, feedback: Feedback): Promise<void> {
    let template = await readTemplate(templateDir, 'luconfig', '.json', feedback)
    if (template) {
        let refs = ''
        for (let locale of locales) {
            if (refs !== '') {
                refs += ',' + os.EOL
            }
            refs += `"${locale}/${schema.name}.${locale}.lu"`
        }
        let newTemplate = expand('luconfig.json', template, schema, { locale: locales[0], references: refs }, feedback)
        await writeTemplate(newTemplate, outDir, '', 'luconfig', '.json', false, true, feedback)
    }
}
*/

const expressionEngine = new ExpressionEngine((func: any) => {
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
    let result = name
    if (locale) {
        let base = `${formName}-${path.basename(name, '.lg')}`
        let extStart = base.indexOf('.')
        let filename
        if (extStart < 0) {
            filename = `${base}-${locale}.lg`
        } else {
            filename = `${base.substring(0, extStart)}-${locale}${base.substring(extStart)}`
        }
        result = path.join(path.dirname(name), filename)
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
    return replaceAsync(template, RefPattern, async (match: string): Promise<string> => {
        let replacement = await processTemplate(match.substring(1, match.length - 1), templateDirs, outDir, form, scope, force, feedback)
        let local = path.relative(path.dirname(outPath), replacement)
        return Promise.resolve(`[${path.basename(replacement)}](${local})`)
    });
}

async function processTemplate(
    templateName: string,
    templateDirs: string[],
    outDir: string,
    form: s.FormSchema,
    scope: any,
    force: boolean,
    feedback: Feedback): Promise<string> {
    let outPath = ''
    try {
        let template = await findTemplate(templateName, templateDirs, scope.locale)
        if (template !== undefined) {
            // NOTE: Ignore templates that are defined, but are empty
            if (template) {
                scope.form = form.name
                scope.schema = form.schema
                let filename = addLocale(templateName, scope.locale, scope.formName)
                if (typeof template === 'object' && template.templates.some(f => f.Name === 'filename')) {
                    filename = template.evaluateTemplate('filename', scope)
                }
                outPath = path.join(outDir, filename)
                let ext = path.extname(templateName).substring(1)
                if (!scope.templates[ext].includes(outPath)) {
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
                        scope.templates[ext].push(outPath)
                    } else {
                        feedback(FeedbackType.info, `Skipping already existing ${outPath}`)
                    }
                }
            }
        } else {
            feedback(FeedbackType.error, `Missing template ${templateName}` + (scope.locale ? ` in locale ${scope.locale}` : ''))
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

    // Process per property and entity templates
    for (let prop of schema.schemaProperties()) {
        scope.property = prop.name

        // Property templates
        for (let templateName of prop.templates()) {
            if (extensions.includes(path.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, schema, scope, force, feedback)
            }
        }

        if (scope.locale) {
            // Entity templates
            for (let entity of Object.keys(schema.entities())) {
                scope.entity = entity
                await processTemplate(entity + '.lu', templateDirs, outDir, schema, scope, force, feedback)
                await processTemplate(entity + '.lg', templateDirs, outDir, schema, scope, force, feedback)
            }
        }
    }
    scope.property = undefined
    scope.entity = undefined

    // Process templates found at the top
    if (schema.schema.$templates) {
        for (let templateName of schema.schema.$templates) {
            if (extensions.includes(path.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, form, scope, force, feedback)
            }
        }
    }
}

/**
 * Iterate through the locale templates and generate per property/locale files.
 * Each template file will map to <filename>_<property>.<ext>.
 * @param outDir Where to put generated files.
 * @param schema Schema to use when generating .dialog files
 * @param allLocales Locales to generate.
 * @param templateDir Where templates are found.
 * @param force True to force overwriting existing files.
 * @param feedback Callback function for progress and errors.
 */
export async function generate(
    formPath: string,
    outDir: string,
    schema?: string,
    allLocales?: string[],
    templateDirs?: string[],
    force?: boolean,
    feedback?: Feedback)
    : Promise<void> {
    if (!feedback) {
        feedback = (_info, _message) => true
    }
    if (!schema) {
        schema = 'https://raw.githubusercontent.com/microsoft/botbuilder-dotnet/chrimc/map/schemas/sdk.schema'
    } else if (!schema.startsWith('http')) {
        // Adjust relative to outDir
        schema = path.relative(outDir, schema)
    }
    if (!allLocales) {
        allLocales = ['en-us']
    }

    if (!templateDirs) {
        templateDirs = [path.join(__dirname, '../../templates')]
    }
    let op = 'Regenerating'
    if (!force) {
        force = false
        op = 'Generating'
    }
    feedback(FeedbackType.info, `${op} resources for ${path.basename(formPath, '.form')} in ${outDir}`)
    feedback(FeedbackType.info, `Locales: ${JSON.stringify(allLocales)} `)
    feedback(FeedbackType.info, `Templates: ${JSON.stringify(templateDirs)} `)
    feedback(FeedbackType.info, `Schema: ${schema} `)
    try {
        await fs.ensureDir(outDir)
        let { form, schema } = await processSchemas(formPath, templateDirs, outDir, force, feedback)
        let scope: any = {
            locales: allLocales,
            form: form.schema,
            formName: form.name,
            schema: schema.schema,
            properties: Object.keys(form.schema.properties),
        }
        for (let currentLoc of allLocales) {
            let localeOut = path.join(outDir, currentLoc)
            await fs.ensureDir(localeOut)
            scope.locale = currentLoc
            await processTemplates(form, schema, ['.lg', '.lu', '.qna'], templateDirs, localeOut, scope, force, feedback)
        }
        scope.locale = ''
        await processTemplates(form, schema, ['.dialog', '.json'], templateDirs, outDir, scope, force, feedback)
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}
