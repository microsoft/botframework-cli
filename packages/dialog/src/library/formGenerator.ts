#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
export * from './formGenerator'
import * as s from './formSchema'
import { ExpressionEngine } from 'botbuilder-expression-parser';
import * as expr from 'botbuilder-expression';
import * as fs from 'fs-extra'
import * as lg from 'botbuilder-lg'
import * as path from 'path'
import * as ph from './generatePhrases'
import { processSchemas } from './processSchemas'

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
async function findTemplate(name: string, templateDirs: string[], locale?: string): Promise<lg.TemplateEngine | string | undefined> {
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

function addLocale(name: string, locale: string): string {
    let result = name
    if (locale) {
        let base = path.basename(name, '.lg')
        let extStart = base.indexOf('.')
        let filename = `${base.substring(0, extStart)}-${locale}${base.substring(extStart)}`
        result = path.join(path.dirname(name), filename)
    }
    return result
}

type GeneratedTemplates = { lg: string[], lu: string[], dialog: string[], [id: string]: string[] }
async function processTemplate(
    templateName: string,
    templateDirs: string[],
    outDir: string,
    form: s.FormSchema,
    prop: string,
    loc: string,
    force: boolean,
    feedback: Feedback,
    generated: GeneratedTemplates) {
    try {
        let template = await findTemplate(templateName, templateDirs, loc)
        if (template !== undefined) {
            // NOTE: Ignore templates that are defined, but are empty
            if (template) {
                let filename = addLocale(templateName, loc)
                let result = template
                if (typeof template === 'object') {
                    let scope = {
                        locale: loc,
                        form: form.name,
                        schema: form.schema,
                        property: prop,
                    }
                    result = template.evaluateTemplate('template', scope)
                    if (template.templates.some(f => f.Name === 'filename')) {
                        filename = template.evaluateTemplate('filename', scope)
                    }
                }
                let outPath = path.join(outDir, loc, filename)
                let ext = path.extname(templateName).substring(1)
                if (!generated[ext].includes(outPath)) {
                    generated[ext].push(outPath)
                    await writeFile(outPath, result, force, feedback)
                }
            }
        } else {
            feedback(FeedbackType.error, `Missing template ${templateName}` + (loc ? ` in locale ${loc}` : ''))
        }
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}

async function processTemplates(
    form: s.FormSchema,
    extensions: string[],
    templateDirs: string[],
    outDir: string,
    loc: string,
    force: boolean,
    feedback: Feedback)
    : Promise<GeneratedTemplates> {
    let generated: GeneratedTemplates = {
        lg: [],
        lu: [],
        qna: [],
        dialog: []
    }
    // Want an .lu/.lg per mapping
    // bread
    // templates: 
    // property: [enum.lg, enum.lu]
    // propertyEntity: 
    // mappings: [breadEntity]
    for (let prop of form.schemaProperties()) {
        for (let templateName of prop.templates().property) {
            if (extensions.includes(path.extname(templateName))) {
                await processTemplate(templateName, templateDirs, outDir, form, prop.name, loc, force, feedback, generated)
            }
        }
        if (loc) {
            for (let entity of Object.keys(form.entities())) {
                await processTemplate(entity + '.lu', templateDirs, outDir, form, prop.name, loc, force, feedback, generated)
                await processTemplate(entity + '.lg', templateDirs, outDir, form, prop.name, loc, force, feedback, generated)
            }
        }
    }
    return generated
}

/**
 * Iterate through the locale templates and generate per property/locale files.
 * Each template file will map to <filename>_<property>.<ext>.
 * @param outDir Where to put generated files.
 * @param schema Schema to use when generating .dialog files
 * @param locales Locales to generate.
 * @param templateDir Where templates are found.
 * @param force True to force overwriting existing files.
 * @param feedback Callback function for progress and errors.
 */
export async function generate(
    formPath: string,
    outDir: string,
    schema?: string,
    locales?: string[],
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
    if (!locales) {
        locales = ['en-us']
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
    feedback(FeedbackType.info, `Locales: ${JSON.stringify(locales)} `)
    feedback(FeedbackType.info, `Templates: ${JSON.stringify(templateDirs)} `)
    feedback(FeedbackType.info, `Schema: ${schema} `)
    try {
        await fs.ensureDir(outDir)
        let form = await processSchemas(formPath, templateDirs, outDir, force, feedback)
        for (let currentLoc of locales) {
            let localeOut = path.join(outDir, currentLoc)
            await fs.ensureDir(localeOut)
            await processTemplates(form, ['.lg', '.lu', '.qna'], templateDirs, outDir, currentLoc, force, feedback)
        }
        // On a property $templates has
        // property: [<all templates that apply to a property>]
        // propertyEntity: [<all templates that apply to property/entity pair>]
        // We bind:
        // form: Name of form
        // schema: Schema definition
        // property: for both property specific template kinds
        // entity: for propertyEntity needs
        // locale: bound if in a template sub-directory
        // NOTE: We do not bind locale because template itself knows
        // Default $template has:
        // property: [<type>Entity.lu, <type>Entity.lg, <type>.lg]
        // propertyEntity: [Set<type>To<entity>.dialog, Ask<type>.dialog, ...]
        // We also bind to templates of every entity name in mapping and track if we already generated
        // 
        // There is also a global $templates where we bind
        // LG: All LG references
        // LU: All LU references
        // DIALOG: All .dialog references
        // form: form name
        // schema: schema definition
        //
        // Process is to loop over each property:
        //   Loop over property templates and expand
        //   Loop over propertyEntity templates and expand
        //   Loop over entity and expand
        // For each template we search the directories in order.  For .lg/.lu files we search in subdirectories.
        //   
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }
}
