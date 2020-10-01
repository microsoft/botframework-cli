/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as Validator from 'ajv'
import * as fs from 'fs-extra'
import * as glob from 'globby'
import * as hash from './hash'
import * as os from 'os'
import * as parser from '@apidevtools/json-schema-ref-parser'
import * as ppath from 'path'
import {JsonPointer as ptr} from 'json-ptr'
import * as nuget from '@snyk/nuget-semver'
import * as xp from 'xml2js'
let allof: any = require('json-schema-merge-allof')
let clone: any = require('clone')
let getUri: any = require('get-uri')
let util: any = require('util')
let exec: any = util.promisify(require('child_process').exec)

// Walk over JSON object, stopping if true from walker.
// Walker gets the current value, the parent object and full path to that object
// and returns false to continue, true to stop going deeper.
function walkJSON(elt: any, fun: (val: any, obj?: any, path?: string) => boolean, obj?: any, path?: any) {
    let done = fun(elt, obj, path)
    if (!done) {
        if (typeof elt === 'object' || Array.isArray(elt)) {
            for (let key in elt) {
                walkJSON(elt[key], fun, elt, pathName(path, key))
            }
        }
    }
}

function pathName(path: string | undefined, extension: string): string {
    return path ? `${path}/${extension}` : extension
}

// Get JSON from a URI.
async function getJSON(uri: string): Promise<any> {
    let stream = await getUri(uri)
    let data = ''
    for await (let chunk of stream) {
        data += chunk.toString()
    }
    return JSON.parse(data)
}

// Convert to the right kind of slash. 
// ppath.normalize did not do this properly on the mac.
function normalize(path: string): string {
    path = ppath.resolve(path)
    if (ppath.sep === '/') {
        path = path.replace(/\\/g, ppath.sep)
    } else {
        path = path.replace(/\//g, ppath.sep)
    }
    return ppath.normalize(path)
}

// Replace backslash with forward slash for glob
function forwardSlashes(input: string): string {
    return input.replace(/\\/g, '/')
}

// Deep merge of JSON objects
function mergeObjects(obj1: any, obj2: any): any {
    let target = {}
    let merger = (obj: any) => {
        for (let prop in obj) {
            let val = obj[prop]
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                target[prop] = mergeObjects(target[prop], val)
            } else {
                target[prop] = obj[prop]
            }
        }
    }
    merger(obj1)
    merger(obj2)
    let finalTarget = {}
    for (let key of Object.keys(target).sort()) {
        finalTarget[key] = target[key]
    }
    return finalTarget
}

// Build a tree of component (project or package) references in order to compute a topological sort.
class Component {
    // Name of component
    public name: string

    // Version of component
    public version: string

    // Path to component
    public path: string

    // Explicit patterns
    public explictPatterns: string[] = []

    // Parent components
    private readonly parents: Component[] = []

    // Child components
    private readonly children: Component[] = []

    // Track if processed
    private processed = false

    constructor(path?: string, name?: string, version?: string) {
        this.path = path || ''
        this.name = name || ''
        this.version = version || ''
    }

    // Add a child component
    public addChild(component: Component): Component {
        component.parents.push(this)
        this.children.push(component)
        return component
    }

    // Return the topological sort of DAG rooted in component.
    // Sort has all parents in bread-first order before any child.
    public sort(): Component[] {
        let sort: Component[] = []
        let remaining: Component[] = [this]
        while (remaining.length > 0) {
            let newRemaining: Component[] = []
            for (let component of remaining) {
                if (component.allParentsProcessed()) {
                    if (!component.processed) {
                        sort.push(component)
                        component.processed = true
                        for (let child of component.children) {
                            newRemaining.push(child)
                        }
                    }
                } else {
                    newRemaining.push(component)
                }
            }
            remaining = newRemaining
        }
        return sort
    }

    public patterns(extensions: string[]): string[] {
        let patterns = this.explictPatterns
        if (patterns.length === 0 && this.path) {
            patterns = []
            let root = ppath.dirname(this.path)
            for (let extension of extensions) {
                patterns.push(ppath.join(root, `**/*${extension}`))

            }
            if (this.path.endsWith('package.json')) {
                patterns.push(`!${ppath.join(root, 'node_modules/**')}`)
            } else if (this.path.endsWith('.csproj')) {
                patterns.push(`!${ppath.join(root, 'bin/**')}`)
            }
        }
        return patterns
    }

    // Test to see if root component
    public isRoot(): boolean {
        return this.parents.length === 0 || (this.parents.length === 1 && this.parents[0].parents.length === 0)
    }

    // Check to see if this component is a parent of another component
    public isParent(node: Component): boolean {
        let found = false
        for (let child of this.children) {
            if (child === node) {
                found = true
                break
            } else {
                if (child.isParent(node)) {
                    found = true
                    break
                }
            }
        }
        return found
    }

    // Test to see if component is a C# project
    public isCSProject(): boolean {
        return this.path.endsWith('.csproj')
    }

    // Test to see if all parents are processed which means you can be added to sort.
    private allParentsProcessed(): boolean {
        for (let parent of this.parents) {
            if (!parent.processed) {
                return false
            }
        }
        return true
    }
}

interface PathComponent {
    path: string
    component: Component
}

/**
 * Interface for imported assets to be copied.
 */
export interface Import {
    /**
     * New definition for file as utf-8.  
     * For .lg/.lu/.qna is a string and for .dialog a serialized JSON object.
     */
    definition: string,

    /**
     * Output path for writing file.
     */
    path: string
}

/**
 * Interface describing changes made to import components.
 */
export interface Imports {
    /**
     * Files to add because they are new or the old file has not changed since last imported.
     */
    added: Import[],

    /**
     * Files to delete because they are no longer in the original components.
     */
    deleted: string[],

    /**
     * Files where a component has a new definition and the old imported definition has been changed.
     */
    conflicts: Import[]
}

/**
 * This class will find and merge component .schema files into a validated custom schema.
 */
export class SchemaMerger {
    // Input parameters
    private readonly patterns: string[]
    private output: string
    private readonly imports: string
    private readonly checkOnly: boolean
    private readonly verbose: boolean
    private readonly log: any
    private readonly warn: any
    private readonly error: any
    private readonly extensions: string[]
    private readonly schemaPath: string | undefined
    private readonly debug: boolean | undefined
    private nugetRoot = ''    // Root where nuget packages are found

    // Track packages that have been processed
    private readonly packages = new Set()

    // Component tree
    private readonly root = new Component()
    private readonly parents: Component[] = []
    private components: Component[] = []

    // Files
    private readonly files: Map<string, Map<string, PathComponent[]>> = new Map<string, Map<string, PathComponent[]>>()

    // Validator for checking schema
    private readonly validator = new Validator()

    // $schema that defines allowed component .schema
    private metaSchemaId = ''
    private metaSchema: any

    // $schema for .uischema
    private metaUISchemaId = ''
    private metaUISchema: any

    // Map from $kind to definition
    private definitions: any = {}

    // Map from $kind to source
    private readonly source: any = {}

    // List of interface $kind
    private readonly interfaces: string[] = []

    // Map from interface to implementations
    private readonly implementations: any = {}

    // Tracking information for errors
    private failed = false
    private readonly missingKinds = new Set()
    private currentFile = ''
    private currentKind = ''

    // Default JSON serialization options
    private readonly jsonOptions = {spaces: '  ', EOL: os.EOL}

    /**
     * Merger to combine component .schema and .uischema files to make a custom schema.
     * @param patterns Glob patterns for the .csproj or packge.json files to combine.
     * @param output The output schema file to create or empty string to use default.
     * @param imports The output directory for imports.
     * @param checkOnly Check only--do not write files.
     * @param verbose True to show files as processed.
     * @param log Logger for informational messages.
     * @param warn Logger for warning messages.
     * @param error Logger for error messages.
     * @param extensions Extensions to analyze for loader.
     * @param schema Path to merged .schema to only merge .uischema.
     * @param debug Generate debug output.
     * @param nugetRoot Root directory for nuget packages.  (Useful for testing.)
     */
    public constructor(patterns: string[], output: string, imports: string | undefined, checkOnly: boolean, verbose: boolean, log: any, warn: any, error: any, extensions?: string[], schema?: string, debug?: boolean, nugetRoot?: string) {
        this.patterns = patterns
        this.output = output ? ppath.join(ppath.dirname(output), ppath.basename(output, ppath.extname(output))) : ''
        this.imports = imports ?? ppath.dirname(this.output)
        this.checkOnly = checkOnly
        this.verbose = verbose
        this.log = log
        this.warn = warn
        this.error = error
        this.extensions = extensions || ['.schema', '.lu', '.lg', '.qna', '.dialog', '.uischema']
        this.schemaPath = schema
        this.debug = debug
        this.nugetRoot = nugetRoot || ''
    }

    /** 
     * Verify and merge component .schema and .uischema together into a single .schema and .uischema.
     * Also ensures that for C# all declarative assets are output to <project>/Generated/<component>.
     * Returns import changes if successful otherwise u.
     */
    public async merge(): Promise<Imports | undefined> {
        let imports: Imports | undefined
        try {
            this.log('Finding component files')
            await this.expandPackages(await glob(this.patterns.map(forwardSlashes)))
            await this.analyze()
            let schema = await this.mergeSchemas()
            this.log('')
            await this.mergeUISchemas(schema)
            this.log('')
            imports = await this.copyAssets()
        } catch (e) {
            this.mergingError(e)
        }
        if (this.failed) {
            this.error('*** Could not merge components ***')
        }
        return imports
    }

    // Push a child on the current parent and make it the new parent
    private pushParent(path: string, name?: string, version?: string): Component {
        let component = new Component(path, name, version)
        let child = this.currentParent().addChild(component)
        this.parents.push(child)
        this.currentFile = path
        return component
    }

    // Pop the current parent
    private popParent() {
        this.parents.pop()
        this.currentFile = this.currentParent().path
    }

    // Return the current parent
    private currentParent(): Component {
        return this.parents[this.parents.length - 1]
    }

    /** 
     * Merge component schemas together into a single self-contained .schema file.
     * $role of implements(interface) hooks up defintion to interface.
     * $role of extends(kind) will extend the kind by picking up property related restrictions.
     * $kind for a property connects to another component.
     * schema:#/definitions/foo will refer to $schema#/definition/foo
     * Does extensive error checking and validation to ensure information is present and consistent.
     */
    private async mergeSchemas(): Promise<any> {
        let fullSchema: any

        if (this.schemaPath) {
            // Passed in merged schema
            this.currentFile = this.schemaPath
            let schema = await fs.readJSON(this.schemaPath)
            this.currentFile = schema.$schema
            this.metaSchema = await getJSON(schema.$schema)
            this.validator.addSchema(this.metaSchema, 'componentSchema')
            this.currentFile = this.schemaPath
            this.validateSchema(schema)
            return parser.dereference(schema)
        }

        // Delete existing output
        let outputPath = ppath.resolve(this.output + '.schema')
        await fs.remove(this.output + '.schema')
        await fs.remove(this.output + '.schema.final')
        await fs.remove(this.output + '.schema.expanded')

        let componentPaths: PathComponent[] = []
        let schemas = this.files.get('.schema')
        if (schemas) {
            for (let pathComponents of schemas.values()) {
                // Just take first definition if multiple ones
                let pathComponent = pathComponents[0]
                if (pathComponent.path !== outputPath) {
                    componentPaths.push(pathComponent)
                }
            }
        }

        if (componentPaths.length === 0) {
            return
        }
        this.log('Parsing component .schema files')
        for (let componentPath of componentPaths) {
            try {
                let path = componentPath.path
                this.currentFile = path
                this.vlog(`Parsing ${path}`)
                let component = await fs.readJSON(path)
                if (component.definitions && component.definitions.component) {
                    this.parsingWarning('Skipping merged schema')
                } else {
                    this.relativeToAbsoluteRefs(component, path)
                    if (component.$ref) {
                        // Expand top-level $ref to support testing
                        let ref = await getJSON(component.$ref)
                        component = {...ref, ...component}
                        delete component.$ref
                    }

                    if (!component.$schema) {
                        this.missingSchemaError()
                    } else if (!this.metaSchema) {
                        // Pick up meta-schema from first .dialog file
                        this.metaSchemaId = component.$schema
                        this.currentFile = this.metaSchemaId
                        this.metaSchema = await getJSON(component.$schema)
                        this.validator.addSchema(this.metaSchema, 'componentSchema')
                        this.vlog(`  Using ${this.metaSchemaId} to define components`)
                        this.currentFile = path
                        this.validateSchema(component)
                    } else if (component.$schema !== this.metaSchemaId) {
                        this.parsingWarning(`Component schema ${component.$schema} does not match ${this.metaSchemaId}`)
                    } else {
                        this.validateSchema(component)
                    }
                    delete component.$schema
                    if (componentPath.component.name && componentPath.component.version) {
                        // Only include versioned components
                        component.$package = {
                            name: componentPath.component.name,
                            version: componentPath.component.version
                        }
                    }
                    let filename = ppath.basename(path)
                    let kind = filename.substring(0, filename.lastIndexOf('.'))
                    let fullPath = ppath.resolve(path)
                    if (this.source[kind] && this.source[kind] !== fullPath) {
                        this.parsingError(`Redefines ${kind} from ${this.source[kind]}`)
                    }
                    this.source[kind] = fullPath
                    this.fixComponentReferences(kind, component)
                    if (component.allOf) {
                        this.parsingError('Does not support allOf in component .schema definitions')
                    }
                    this.definitions[kind] = component
                }
            } catch (e) {
                this.parsingError(e)
            }
        }
        this.currentFile = ''

        this.log('Merging component schemas')
        this.processExtensions()
        this.processImplementations()
        this.expandKinds()
        this.expandInterfaces()
        this.addComponentProperties()
        this.sortImplementations()
        let oneOf = Object.keys(this.definitions)
            .filter(kind => !this.isInterface(kind) && this.definitions[kind].$role)
            .sort()
            .map(kind => {
                return {$ref: `#/definitions/${kind}`}
            })

        // Add component schema definitions
        this.definitions = {...this.metaSchema.definitions, ...this.definitions}

        if (!this.failed) {
            this.currentFile = this.output + '.schema'
            this.currentKind = ''
            let finalDefinitions: any = {}
            for (let key of Object.keys(this.definitions).sort()) {
                finalDefinitions[key] = this.definitions[key]
            }
            let finalSchema: any = {
                $schema: this.metaSchemaId,
                type: 'object',
                title: 'Component kinds',
                description: 'These are all of the kinds that can be created by the loader.',
                oneOf,
                definitions: finalDefinitions
            }
            if (this.debug) {
                await fs.writeJSON(this.currentFile + '.final', finalSchema, this.jsonOptions)
            }

            // Convert all remote references to local ones
            await this.bundle(finalSchema)
            finalSchema = this.expandAllOf(finalSchema)
            this.removeId(finalSchema)
            if (this.debug) {
                await fs.writeJSON(this.currentFile + '.expanded', finalSchema, this.jsonOptions)
            }

            // Final verification
            this.verifySchema(finalSchema)
            if (!this.failed) {
                // Verify all refs work
                let start = process.hrtime.bigint()
                fullSchema = await parser.dereference(clone(finalSchema))
                let end = process.hrtime.bigint()
                let elapsed = Number(end - start) / 1000000000
                this.vlog(`Expanding all $ref took ${elapsed} seconds`)
                if (!this.checkOnly) {
                    this.log(`Writing ${this.currentFile}`)
                    await fs.writeJSON(this.currentFile, finalSchema, this.jsonOptions)
                }
            }
        }
        return fullSchema
    }

    /** 
     * Merge component <kind>[.locale].uischema together into self-contained <project>[.locale].uischema files.
     * Does extensive error checking and validation against the schema.
     */
    private async mergeUISchemas(schema: any): Promise<void> {
        await fs.remove(this.output + '.uischema')

        let uiSchemas = this.files.get('.uischema')
        let result = {}
        if (uiSchemas) {
            if (!schema || this.failed) {
                this.error('Error must have a merged .schema to merge .uischema files')
                return
            }

            this.log('Merging component .uischema files')
            if (this.schemaPath) {
                this.log(`Using merged schema ${this.schemaPath}`)
            }
            let outputName = ppath.basename(this.output)
            for (let [fileName, componentPaths] of uiSchemas.entries()) {
                // Skip files that match output .uischema
                if (!fileName.startsWith(outputName + '.')) {
                    let [kindName, localeName] = this.kindAndLocale(fileName, schema)
                    let locale = result[localeName]
                    if (!locale) {
                        locale = result[localeName] = {}
                    }

                    // Merge together definitions for the same kind
                    if (componentPaths.length > 1) {
                        this.vlog(`Merging into ${kindName}.${localeName}`)
                    }
                    for (let componentPath of componentPaths.reverse()) {
                        try {
                            let path = componentPath.path
                            this.currentFile = path
                            if (componentPaths.length > 1) {
                                this.vlog(`  Merging ${this.currentFile}`)
                            } else {
                                this.vlog(`Parsing ${this.currentFile}`)
                            }
                            let component = await fs.readJSON(path)
                            if (!component.$schema) {
                                this.missingSchemaError()
                            } else if (!this.metaUISchema) {
                                // Pick up meta-schema from first .uischema file
                                this.metaUISchemaId = component.$schema
                                this.currentFile = this.metaUISchemaId
                                this.metaUISchema = await getJSON(component.$schema)
                                this.validator.addSchema(this.metaUISchema, 'UISchema')
                                this.vlog(`  Using ${this.metaUISchemaId} to define .uischema`)
                                this.currentFile = path
                                this.validateUISchema(component)
                            } else if (component.$schema !== this.metaUISchemaId) {
                                this.parsingWarning(`UI schema ${component.$schema} does not match ${this.metaUISchemaId}`)
                            } else {
                                this.validateUISchema(component)
                            }
                            delete component.$schema
                            locale[kindName] = mergeObjects(locale[kindName], component)
                        } catch (e) {
                            this.parsingError(e)
                        }
                    }

                    let kindDef = schema?.definitions[kindName]
                    if (!kindDef) {
                        this.uiError(kindName)
                    } else {
                        this.validateProperties(kindName, kindDef, locale[kindName].form?.properties)
                        this.validateProperties(`${kindName}.order`, kindDef, locale[kindName].form?.order)
                    }
                }
            }
            if (!this.failed) {
                for (let locale of Object.keys(result)) {
                    let uischema = {$schema: this.metaUISchemaId}
                    for (let key of Object.keys(result[locale]).sort()) {
                        uischema[key] = result[locale][key]
                    }
                    this.currentFile = ppath.join(ppath.dirname(this.output), outputName + (locale ? '.' + locale : '') + '.uischema')
                    if (!this.checkOnly) {
                        this.log(`Writing ${this.currentFile}`)
                        await fs.writeJSON(this.currentFile, uischema, this.jsonOptions)
                    }
                }
            }
        }
    }

    private kindAndLocale(filename: string, schema: any): [string, string] {
        let kindName = ppath.basename(filename, '.uischema')
        let locale = ''
        if (!schema.definitions[kindName]) {
            let split = kindName.lastIndexOf('.')
            if (split >= 0) {
                locale = kindName.substring(split + 1)
                kindName = kindName.substring(0, split)
            }
        }
        return [kindName, locale]
    }

    // Copy all exported assets into imported assets
    private async copyAssets(): Promise<Imports | undefined> {
        let imports: Imports | undefined = this.failed ? undefined : {added: [], deleted: [], conflicts: []}
        if (imports && !this.schemaPath && this.components.length > 0) {
            this.log(`Copying exported assets to ${this.imports}`)
            for (let component of this.components) {
                if (!component.isRoot()) {
                    let exported = ppath.join(ppath.dirname(component.path), 'ExportedAssets')
                    if (await fs.pathExists(exported)) {
                        let used = new Set<string>()
                        let imported = ppath.join(this.imports, 'ImportedAssets', component.name)
                        this.vlog(`Copying ${exported} to ${imported}`)

                        // Copy all exported files
                        for (let path of await glob(forwardSlashes(ppath.join(exported, '**')))) {
                            let destination = ppath.join(imported, ppath.relative(exported, path))
                            let info: Import = {definition: '', path: destination}
                            used.add(forwardSlashes(destination))
                            if (!await fs.pathExists(destination) || await hash.isUnchanged(destination)) {
                                imports.added.push(info)
                                this.vlog(`Copy ${path} to ${destination}`)
                            } else {
                                imports.conflicts.push(info)
                                this.warn(`Warning copied conflicting ${path} to ${destination}`)
                            }
                            try {
                                info.definition = await hash.addHash(path)
                                if (!this.checkOnly) {
                                    await fs.ensureDir(ppath.dirname(destination))
                                    await fs.writeFile(destination, info.definition)
                                }
                            } catch (e) {
                                this.mergingError(e)
                            }
                        }

                        // Delete removed files
                        for (let path of await glob(forwardSlashes(ppath.join(imported, '**')))) {
                            if (!used.has(path)) {
                                if (await hash.isUnchanged(path)) {
                                    imports.deleted.push(path)
                                    this.vlog(`Delete ${path}`)
                                } else {
                                    imports.conflicts.push({definition: '', path})
                                    this.warn(`Warning deleted modified ${path}`)
                                }
                                if (!this.checkOnly) {
                                    await fs.remove(path)
                                }
                            }
                        }
                    }
                }
            }
        }
        return imports
    }

    // Given schema properties object and ui schema properties object, check to ensure 
    // each ui schema property exists in schema
    private validateProperties(path: string, schema: any, uiProps: object): void {
        if (uiProps) {
            if (Array.isArray(uiProps)) {
                // Validate order entries against schema
                for (let prop of uiProps) {
                    if (prop !== '*') {
                        let newSchema = this.propertyDefinition(schema, prop)
                        if (!newSchema) {
                            this.uiError(`${path}.${prop}`)
                        }
                    }
                }
            } else {
                for (let [prop, uiProp] of Object.entries(uiProps)) {
                    let newPath = `${path}.${prop}`
                    let newSchema = this.propertyDefinition(schema, prop)
                    if (!newSchema) {
                        this.uiError(newPath)
                    } else {
                        if (uiProp.properties) {
                            this.validateProperties(newPath, newSchema, uiProp.properties)
                        }
                        if (uiProp.order) {
                            this.validateProperties(newPath + '.order', newSchema, uiProp.order)
                        }
                    }
                }
            }
        }
    }

    // Return the schema definition for property or undefined if none
    private propertyDefinition(schema: any, property: string): any {
        if (typeof schema === 'object') {
            if (schema.type === 'object') {
                return schema.properties[property]
            } else if (schema.type === 'array') {
                return typeof schema.items === 'object' ? this.propertyDefinition(schema.items, property) : undefined
            } else if (schema.anyOf) {
                for (let choice of schema.anyOf) {
                    let def = this.propertyDefinition(choice, property)
                    if (def) {
                        return def
                    }
                }
            }
        }
        return
    }

    // Validate against component schema
    private validateSchema(schema: any): void {
        if (!this.validator.validate('componentSchema', schema)) {
            for (let error of this.validator.errors as Validator.ErrorObject[]) {
                this.schemaError(error)
            }
            this.validator.errors = undefined
        }
    }

    // Validate against UI schema
    private validateUISchema(schema: any): void {
        if (!this.validator.validate('UISchema', schema)) {
            for (let error of this.validator.errors as Validator.ErrorObject[]) {
                this.schemaError(error)
            }
            this.validator.errors = undefined
        }
    }

    // Convert file relative ref to absolute ref
    private toAbsoluteRef(ref: string, base: string): string {
        if (ref.startsWith('.')) {
            ref = forwardSlashes(`file:///${ppath.resolve(ppath.dirname(base), ref)}`)
        }
        return ref
    }

    // Convert local references to absolute so we can keep them as references when combined
    private relativeToAbsoluteRefs(schema: object, path: string) {
        walkJSON(schema, val => {
            if (val.$ref) {
                val.$ref = this.toAbsoluteRef(val.$ref, path)
            } else if (val.$schema) {
                val.$schema = this.toAbsoluteRef(val.$schema, path)
            }
            return false
        })
    }

    private indent(): string {
        return '  '.repeat(this.parents.length)
    }

    // Expand a .nuspec by walking its dependencies
    private async expandNuspec(path: string): Promise<void> {
        path = normalize(path)
        if (!this.packages.has(path)) {
            this.currentFile = path
            if (await fs.pathExists(path)) {
                try {
                    this.packages.add(path)
                    this.vlog(`${this.indent()}Following nuget ${this.prettyPath(path)}`)
                    let nuspec = await this.xmlToJSON(path)
                    let md = nuspec?.package?.metadata[0]
                    this.pushParent(path, md.id[0], md.version[0])
                    let dependencies: any[] = []
                    walkJSON(nuspec, val => {
                        if (val.dependencies) {
                            // NOTE: We assume first framework with dependencies has schema files.
                            for (let groups of val.dependencies) {
                                if (groups.dependency) {
                                    // Direct dependencies
                                    for (let dependency of groups.dependency) {
                                        dependencies.push(dependency.$)
                                    }
                                    break
                                } else if (groups.group) {
                                    // Grouped dependencies
                                    for (let group of groups.group) {
                                        if (group.dependency) {
                                            for (let dependency of group.dependency) {
                                                dependencies.push(dependency.$)
                                            }
                                        }
                                    }
                                }
                            }
                            return true
                        }
                        return false
                    })
                    for (let dependent of dependencies) {
                        await this.expandNuget(dependent.id, dependent.version)
                    }
                } finally {
                    this.popParent()
                }
            } else if (this.debug) {
                // Assume missing nuget is because of build complexities
                this.parsingWarning('Could not find nuget')
            }
        }
    }

    // Expand nuget package and all of its dependencies
    private async expandNuget(packageName: string, minVersion: string): Promise<void> {
        let pkgPath = ppath.join(this.nugetRoot, packageName)
        if (!this.packages.has(pkgPath) && !packageName.startsWith('System')) {
            try {
                this.currentFile = pkgPath
                this.packages.add(pkgPath)
                let versions: string[] = []
                if (await fs.pathExists(pkgPath)) {
                    for (let pkgVersion of await fs.readdir(pkgPath)) {
                        versions.push(pkgVersion.toLowerCase())
                    }
                    // NOTE: The semver package does not handle more complex nuget range revisions
                    // We get an exception and will ignore those dependencies.
                    minVersion = minVersion || '0.0.0'
                    if (minVersion.startsWith('$')) {
                        // Deal with build variables by installing most recent version
                        minVersion = nuget.maxSatisfying(versions, '0-1000')
                        if (this.debug) {
                            this.parsingWarning(`Using most recent version ${minVersion}`)
                        }
                    }
                    let version = nuget.minSatisfying(versions, minVersion)
                    pkgPath = ppath.join(pkgPath, version || '')
                    let nuspecPath = ppath.join(pkgPath, `${packageName}.nuspec`)
                    await this.expandNuspec(nuspecPath)
                } else if (this.debug) {
                    // Ignore any missing dependencies assuming they are from a target framework like this:
                    // <group targetFramework=".NETFramework4.0">
                    //   <dependency id="Microsoft.Diagnostics.Tracing.EventSource.Redist" version = "1.1.28" />
                    // </group>
                    this.parsingWarning('Missing package')
                }
            } catch (e) {
                this.parsingWarning(e.message)
            } finally {
                this.currentFile = this.currentParent().path
            }
        }
    }

    // Expand .csproj packages, nugets and projects
    private async expandCSProj(path: string): Promise<void> {
        path = normalize(path)
        if (!this.packages[path]) {
            this.packages[path] = true
            try {
                this.currentFile = this.prettyPath(path)
                this.vlog(`${this.indent()}Following ${this.currentFile}`)
                this.pushParent(path)
                let json = await this.xmlToJSON(path)

                // Walk projects
                let projects: string[] = []
                walkJSON(json, elt => {
                    if (elt.ProjectReference) {
                        for (let ref of elt.ProjectReference) {
                            let projectPath = ppath.join(ppath.dirname(path), ref.$.Include)
                            projects.push(projectPath)
                        }
                        return true
                    }
                    return false
                })
                for (let project of projects) {
                    await this.expandCSProj(project)
                }

                // Walk nugets
                await this.findGlobalNuget()
                if (this.nugetRoot !== '') {
                    let nugetPackages: any[] = []
                    walkJSON(json, elt => {
                        if (elt.PackageReference) {
                            for (let pkgRef of elt.PackageReference) {
                                nugetPackages.push(pkgRef.$)
                            }
                            return true
                        }
                        return false
                    })
                    if (nugetPackages.length === 0) {
                        // Try packages.config
                        let configPath = ppath.join(ppath.dirname(path), 'packages.config')
                        if (await fs.pathExists(configPath)) {
                            this.currentFile = this.prettyPath(configPath)
                            this.vlog(`${this.indent()}Following ${this.currentFile}`)
                            let config = await this.xmlToJSON(configPath)
                            walkJSON(config, elt => {
                                if (elt.packages?.package) {
                                    for (let info of elt.packages.package) {
                                        nugetPackages.push({Include: info.$.id, Version: info.$.version})
                                    }
                                    return true
                                }
                                return false
                            })
                        }
                    }
                    for (let pkg of nugetPackages) {
                        await this.expandNuget(pkg.Include, pkg.Version)
                    }
                }
            } finally {
                this.popParent()
            }
        }
    }

    private async expandPackageJson(path: string): Promise<void> {
        path = normalize(path)
        if (!this.packages.has(path)) {
            try {
                this.packages.add(path)
                this.vlog(`${this.indent()}Following ${this.prettyPath(path)}`)
                let pkg = await fs.readJSON(path)
                let component = this.pushParent(path, pkg.name, pkg.version)
                component.name = pkg.name || component.name
                if (pkg.dependencies) {
                    for (let dependent of Object.keys(pkg.dependencies)) {
                        let rootDir = ppath.dirname(path)
                        // Walk up parent directories to find package
                        while (rootDir) {
                            let dependentPath = ppath.join(rootDir, 'node_modules', dependent, 'package.json')
                            if (await fs.pathExists(dependentPath)) {
                                await this.expandPackageJson(dependentPath)
                                break
                            } else {
                                rootDir = ppath.dirname(rootDir)
                            }
                        }
                    }
                }
            } finally {
                this.popParent()
            }
        }
    }

    // Build the component tree and compute the breadth-first topological sort
    private async buildComponentTree(paths: string[]): Promise<void> {
        this.parents.push(this.root)
        for (let path of paths) {
            // We expect a package
            let name = ppath.basename(path)
            if (name.endsWith('.csproj')) {
                // C# project
                await this.expandCSProj(path)
            } else if (name.endsWith('.nuspec')) {
                // Explicitly added .nuspec to support out of project scenarios
                await this.expandNuspec(path)
            } else if (name === 'package.json') {
                // Node package
                await this.expandPackageJson(path)
            } else if (this.extensions.includes(ppath.extname(name))) {
                this.root.explictPatterns.push(path)
            } else {
                throw new Error(`Unknown package type or extension ${path}`)
            }
        }
        this.components = this.root.sort()

        if (!this.output) {
            // Figure out base app name from first project
            for (let component of this.components) {
                if (component.path.endsWith('.csproj')) {
                    this.output = ppath.basename(component.path, '.csproj')
                } else if (component.path.endsWith('.nuspec')) {
                    this.output = ppath.basename(component.path, '.nuspec')
                } else if (component.path.endsWith('package.json')) {
                    this.output = ppath.basename(ppath.dirname(component.path))
                }
                if (this.output) {
                    break
                }
            }
        }
    }

    // Build the component tree and find all resources
    private async expandPackages(paths: string[]): Promise<void> {
        await this.buildComponentTree(paths)
        for (let component of this.components) {
            let patterns = component.patterns(this.extensions).map(forwardSlashes)
            for (let path of await glob(patterns)) {
                let ext = ppath.extname(path)
                let map = this.files.get(ext)
                if (!map) {
                    map = new Map<string, PathComponent[]>()
                    this.files.set(ext, map)
                }
                let name = ppath.basename(path)
                let record = map.get(name)
                if (!record) {
                    record = []
                    map.set(name, record)
                }
                record.push({path: ppath.resolve(path), component})
            }
        }
    }

    // Analyze component files to identify:
    // 1) Multiple definitions of the same file in a component. (Error)
    // 2) Multiple definitions of .schema across projects/components (Error)
    private async analyze() {
        for (let [ext, files] of this.files.entries()) {
            for (let [file, records] of files.entries()) {
                let winner = records[0]
                let same: PathComponent[] = []
                let conflicts: PathComponent[] = []
                for (let alt of records) {
                    if (alt !== winner) {
                        if (winner.component === alt.component) {
                            same.push(alt)
                        } else if (ext === '.schema') {
                            // Check for same content which can happen when project and nuget from project are 
                            // both being used.
                            let winnerSrc = await fs.readFile(winner.path, 'utf8')
                            let altSrc = await fs.readFile(alt.path, 'utf8')
                            if (winnerSrc !== altSrc) {
                                conflicts.push(alt)
                            }
                        }
                    }
                }

                if (same.length > 0) {
                    this.failed = true
                    this.error(`Error multiple definitions of ${file} in ${winner.component.name}`)
                    this.error(`  ${winner.path}`)
                    for (let alt of same) {
                        this.error(`  ${alt.path}`)
                    }
                }

                if (conflicts.length > 0) {
                    this.failed = true
                    this.error(`Error conflicting definitions of ${file}`)
                    this.error(`  ${winner.component.name}: ${winner.path}`)
                    for (let alt of conflicts) {
                        this.error(`  ${alt.component.name}: ${alt.path}`)
                    }
                }
            }
        }
    }

    // Generate path relative to CWD
    private prettyPath(path: string): string {
        let newPath = ppath.relative(process.cwd(), path)
        if (newPath.startsWith('..')) {
            newPath = path
        }
        return newPath
    }

    // Find the global nuget repository
    private async findGlobalNuget(): Promise<void> {
        if (!this.nugetRoot) {
            this.nugetRoot = ''
            try {
                const {stdout} = await exec('dotnet nuget locals global-packages --list')
                const name = 'global-packages:'
                let start = stdout.indexOf(name)
                if (start > -1) {
                    this.nugetRoot = stdout.substring(start + name.length).trim()
                }
            } catch {
                this.parsingError('Cannot find global nuget packages')
            }
        }
    }

    // Convert XML to JSON
    private async xmlToJSON(path: string): Promise<any> {
        let xml = (await fs.readFile(path)).toString()
        if (xml.startsWith('\uFEFF')) {
            xml = xml.slice(1)
        }
        return new Promise((resolve, reject) =>
            xp.parseString(xml, (err: Error, result: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }))
    }

    // Find the first parent directory that has dir
    private async findParentDirectory(path: string, dir: string): Promise<string> {
        path = ppath.resolve(path)
        let result = ''
        if (path) {
            result = ppath.join(path, dir)
            if (!await fs.pathExists(result)) {
                result = await this.findParentDirectory(ppath.dirname(path), dir)
            }
        }
        return result
    }

    /**
     * Merge extension into definition.
     * @param extensionName Name of definition to merge in.
     * @param definition Definition that will be changed
     * @param canOverride True if definition can override extension.
     */
    private mergeInto(extensionName: string, definition: any, canOverride?: boolean) {
        let extension = this.definitions[extensionName] || this.metaSchema.definitions[extensionName]

        if (!extension) {
            this.mergingError(`Cannot extend ${extensionName} because it is not included`)
        } else {
            // Ensure it is an object at the top
            if (!definition.type) {
                definition.type = 'object'
            }

            // Merge properties
            if (extension.properties) {
                if (!definition.properties) {
                    definition.properties = clone(extension.properties)
                } else {
                    for (let property in extension.properties) {
                        if (definition.properties[property]) {
                            this.mergingError(`Redefines property ${property} from ${extensionName}`)
                        } else {
                            definition.properties[property] = clone(extension.properties[property])
                        }
                    }
                }
            }

            // Merge required
            if (extension.required) {
                if (!definition.required) {
                    definition.required = []
                }
                if (!Array.isArray(definition.required)) {
                    definition.required = [definition.required]
                }
                if (!Array.isArray(extension.required)) {
                    extension.required = [extension.required]
                }
                for (let required of extension.required) {
                    if (!definition.required.includes(required)) {
                        definition.required.push(required)
                    }
                }
            }

            // Merge property restrictions
            if (extension.hasOwnProperty('additionalProperties')) {
                if (definition.hasOwnProperty('additionalProperties')) {
                    if (!canOverride) {
                        this.mergingError(`Redefines additionalProperties from ${extensionName}`)
                    }
                } else {
                    definition.additionalProperties = extension.additionalProperties
                }
            }

            if (extension.patternProperties) {
                if (definition.patternProperties) {
                    definition.patternPropties = {...definition.patternProperties, ...extension.patternProperties}
                } else {
                    definition.patternProperties = clone(extension.patternProperties)
                }
            }
        }
    }

    // Return a list of references for a particular type of role
    private roles(definition: any, type: string): string[] {
        let found: string[] = []
        let addArg = (val: string) => {
            let start = val.indexOf('(')
            let end = val.indexOf(')')
            if (start < 0 && end < 0) {
                found.push('')
            } else {
                if (start < 0 || end < 0) {
                    this.mergingError(`Invalid $role ${val}`)
                } else {
                    found.push(val.substring(start + 1, end).trim())
                }
            }
        }
        if (Array.isArray(definition.$role)) {
            for (let elt of definition.$role) {
                if (elt.startsWith(type)) {
                    addArg(elt)
                }
            }
        } else {
            let elt = definition.$role
            if (definition.$role && definition.$role.startsWith(type)) {
                addArg(elt)
            }
        }
        return found
    }

    // Process extensions by making sure they have been done and then merging into definition.
    private processExtension(definition: any): void {
        let extensions = this.roles(definition, 'extends')
        for (let extensionName of extensions) {
            // Ensure base has been extended
            let extension = this.definitions[extensionName]
            if (extension && !extension.$processed) {
                this.processExtension(extension)
            }

            this.mergeInto(extensionName, definition)
        }
        definition.$processed = true
    }

    // Add in any extension definitions
    private processExtensions(): void {
        for (this.currentKind in this.definitions) {
            this.processExtension(this.definitions[this.currentKind])
        }
        // Remove processing information
        walkJSON(this.definitions, val => {
            if (val.$processed) {
                delete val.$processed
                return true
            }
            return false
        })
    }

    // Check $role validity and identify implementations and interfaces
    private processImplementations(): void {
        // Identify interfaces
        for (this.currentKind in this.definitions) {
            let schema = this.definitions[this.currentKind]
            if (this.roles(schema, 'interface').length > 0) {
                this.interfaces.push(this.currentKind)
            }
        }
        for (this.currentKind in this.definitions) {
            if (!this.isInterface(this.currentKind)) {
                // Expand all references and allof to make processing simpler
                let definition = this.definitions[this.currentKind]
                for (let interfaceName of this.roles(definition, 'implements')) {
                    // Connect to interface
                    if (!this.definitions[interfaceName]) {
                        this.mergingError(`Interface ${interfaceName} is not defined`)
                    } else if (!this.isInterface(interfaceName)) {
                        this.mergingError(`${interfaceName} is missing an interface $role`)
                    } else {
                        if (!this.implementations[interfaceName]) {
                            this.implementations[interfaceName] = []
                        }
                        this.implementations[interfaceName].push(this.currentKind)
                    }
                }

                // Verify all $roles are valid
                walkJSON(definition, (val, _obj, path) => {
                    if (val.$role) {
                        let expression = this.roles(val, 'expression')
                        let implementation = this.roles(val, 'implementation')
                        let iface = this.roles(val, 'interface')
                        let extension = this.roles(val, 'extends')
                        if (!path) {
                            if (expression.length > 0) {
                                this.mergingError(`$role ${val.$role} is not valid for component`)
                            }
                        } else {
                            if (implementation.length > 0 || iface.length > 0 || extension.length > 0) {
                                this.mergingError(`$role ${val.$role} is not valid in ${path}`)
                            }
                        }
                    }
                    return false
                })
            }
        }
    }

    // Turn #/definitions/foo into #/definitions/${kind}/definitions/foo
    // Turn file://.../<kind> into #/definitions/<kind>
    private fixComponentReferences(kind: string, definition: any): void {
        walkJSON(definition, val => {
            if (val.$ref && typeof val.$ref === 'string') {
                let ref: string = val.$ref
                if (ref.startsWith('#/')) {
                    val.$ref = `#/definitions/${kind}${ref.substring(ref.indexOf('/'))}`
                } else if (ref.startsWith('file:')) {
                    let filename = ppath.basename(ref)
                    let kind = filename.substring(0, filename.lastIndexOf('.'))
                    if (this.source[kind]) {
                        val.$ref = `#/definitions/${kind}`
                    }
                }
            }
            return false
        })
    }

    // Expand $kind into $ref: #/definitions/kind
    private expandKinds(): void {
        for (this.currentKind in this.definitions) {
            walkJSON(this.definitions[this.currentKind], val => {
                if (val.$kind && typeof val.$kind === 'string') {
                    if (this.definitions.hasOwnProperty(val.$kind)) {
                        val.$ref = '#/definitions/' + val.$kind
                    } else {
                        this.missing(val.$kind)
                    }
                }
                return false
            })
        }
    }

    // Expand interface definitions to include all implementations
    private expandInterfaces(): void {
        for (let interfaceName of this.interfaces) {
            this.currentKind = interfaceName
            let interfaceDefinition = this.definitions[interfaceName]
            let implementations = this.implementations[interfaceName]
            if (implementations) {
                if (!interfaceDefinition.oneOf) {
                    interfaceDefinition.oneOf = [
                        {
                            type: 'string',
                            title: `Reference to ${interfaceName}`,
                            description: `Reference to ${interfaceName} .dialog file.`
                        }
                    ]
                }
                for (let implementation of this.implementations[interfaceName]) {
                    interfaceDefinition.oneOf.push({
                        $ref: `#/definitions/${implementation}`
                    })
                }
            }
        }
        this.currentKind = ''
    }

    // Include standard component properties from schema
    private addComponentProperties(): void {
        for (this.currentKind in this.definitions) {
            if (!this.isInterface(this.currentKind)) {
                let definition = this.definitions[this.currentKind]
                this.mergeInto('component', definition, true)
                definition.properties.$kind.const = this.currentKind
            }
        }
    }

    private sortImplementations(): void {
        for (this.currentKind in this.definitions) {
            let definition = this.definitions[this.currentKind]
            if (this.isInterface(definition) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => a.title.localeCompare(b.title))
            }
        }
    }

    // Split a $ref into path, pointer and name for definition
    private splitRef(ref: string): {path: string, pointer: string, name: string} {
        const hash = ref.indexOf('#')
        const path = hash < 0 ? '' : ref.substring(0, hash)
        const pointer = hash < 0 ? '' : ref.substring(hash + 1)
        let name = ppath.basename(path)
        if (name.endsWith('#')) {
            name = name.substring(0, name.length - 1)
        }
        return {path, pointer, name}
    }

    // Bundle remote references into schema while pruning to minimally needed definitions.
    // Remote references will be found under definitions/<pathBasename> which must be unique.
    // There is special code to handle requires siblings to $ref where we remove the requires from
    // the bundled definition.  This is similar to what JSON schema 8 does.
    private async bundle(schema: any): Promise<void> {
        const current = this.currentFile
        let sources: string[] = []
        await this.bundleFun(schema, schema, sources, '')
        for (let source of sources) {
            this.prune(schema.definitions[source])
        }
        walkJSON(schema, elt => {
            if (typeof elt === 'object') {
                delete elt.$bundled
            }
            return false
        })
        this.currentFile = current
    }

    private async bundleFun(schema: any, elt: any, sources: string[], source: string): Promise<void> {
        if (typeof elt === 'object' || Array.isArray(elt)) {
            for (let key in elt) {
                const val = elt[key]
                if (key === '$ref' && typeof val === 'string') {
                    if (val.startsWith('schema:') || val.startsWith(this.metaSchemaId)) {
                        // Component schema reference
                        elt.$ref = val.substring(val.indexOf('#'))
                    } else {
                        const {path, pointer, name} = this.splitRef(val)
                        if (path) {
                            if (!schema.definitions[name]) {
                                // New source
                                this.currentFile = path
                                this.vlog(`Bundling ${path}`)
                                schema.definitions[name] = await getJSON(path)
                                sources.push(name)
                            }
                            let ref = `#/definitions/${name}${pointer}`
                            let definition: any = ptr.get(schema, ref)
                            if (!definition) {
                                this.refError(elt.$ref, ref)
                            } else if (!elt.$bundled) {
                                elt.$ref = ref
                                elt.$bundled = true
                                if (elt.required) {
                                    // Strip required from destination
                                    // This is to support a required sibling to $ref
                                    delete definition.required
                                }
                                if (!definition.$bundled) {
                                    // First outside reference mark it to keep and follow internal $ref
                                    definition.$bundled = true
                                    let cd = ''
                                    try {
                                        if (path.startsWith('file:')) {
                                            cd = process.cwd()
                                            process.chdir(ppath.dirname(path))
                                        }
                                        await this.bundleFun(schema, definition, sources, name)
                                    } finally {
                                        if (cd) {
                                            process.chdir(cd)
                                        }
                                    }
                                }
                            }
                        } else if (source) {
                            // Internal reference in external source
                            const ref = `#/definitions/${source}${pointer}`
                            const definition: any = ptr.get(schema, ref)
                            if (!elt.$bundled) {
                                elt.$ref = ref
                                elt.$bundled = true
                                if (!definition.$bundled) {
                                    definition.$bundled = true
                                    await this.bundleFun(schema, definition, sources, source)
                                }
                            }
                        }
                    }
                } else {
                    await this.bundleFun(schema, val, sources, source)
                }
            }
        }
    }

    // Prune out any unused keys inside of external schemas
    private prune(elt: any): boolean {
        let keep = false
        if (typeof elt === 'object') {
            keep = elt.$bundled
            if (!keep) {
                for (let [key, val] of Object.entries(elt)) {
                    if (typeof val === 'object' || Array.isArray(val)) {
                        let childBundled = this.prune(val)
                        if (!childBundled) {
                            // Prune any keys of unused structured object
                            delete elt[key]
                        }
                        keep = keep || childBundled
                    }
                }
            }
        } else if (Array.isArray(elt)) {
            for (let child of elt) {
                const childKeep = this.prune(child)
                keep = keep || childKeep
            }
        }
        return keep
    }

    // Expand $ref below allOf and remove allOf
    private expandAllOf(bundle: any): any {
        walkJSON(bundle, val => {
            if (val.allOf && Array.isArray(val.allOf)) {
                for (let child of val.allOf) {
                    if (child.$ref) {
                        let ref: any = ptr.get(bundle, child.$ref)
                        for (let prop in ref) {
                            if (!child.hasOwnProperty(prop)) {
                                child[prop] = clone(ref[prop])
                            }
                        }
                        delete child.$ref
                    }
                }
            }
            return false
        })
        return allof(bundle)
    }

    // Remove any child $id because their references have been changed to be local
    private removeId(bundle: any) {
        walkJSON(bundle, val => {
            if (val.$id) {
                delete val.$id
            }
            return false
        })
    }

    // Verify schema has title/description everywhere and interfaces exist.
    private verifySchema(schema: any): void {
        this.log('Verifying schema')
        this.validateSchema(schema)
        for (let entry of schema.oneOf) {
            this.currentKind = entry.$ref.substring(entry.$ref.lastIndexOf('/') + 1)
            let definition = schema.definitions[this.currentKind]
            let verifyProperty = (val, path) => {
                if (val.$ref) {
                    val = clone(val)
                    let ref: any = ptr.get(schema, val.$ref)
                    for (let prop in ref) {
                        if (!val[prop]) {
                            val[prop] = ref[prop]
                        }
                    }
                    delete val.$ref
                }
                if (!val.$schema) {
                    // Assume $schema is an external reference and ignore error checking
                    if (val.$kind) {
                        let kind = schema.definitions[val.$kind]
                        if (this.roles(kind, 'interface').length > 0) {
                            let implementations = kind.oneOf
                            let hasImplementation = false
                            if (kind.oneOf) {
                                for (let implementation of implementations) {
                                    if (implementation.$ref) {
                                        hasImplementation = true
                                        break
                                    }
                                }
                            }
                            if (!hasImplementation) {
                                this.mergingError(`${path} has no implementations of ${val.$kind}`)
                            }
                        }
                    }
                    if (typeof val === 'object') {
                        if (!val.title) {
                            this.mergingWarning(`${path} has no title`)
                        }
                        if (!val.description) {
                            this.mergingWarning(`${path} has no description`)
                        }
                    }
                }
            }
            walkJSON(definition, (val, _, path) => {
                if (val.$schema && path) {
                    return true
                }
                if (val.properties && (!path || !path.endsWith('properties'))) {
                    for (let propName in val.properties) {
                        verifyProperty(val.properties[propName], pathName(path, propName))
                    }
                }
                if (val.items) {
                    if (Array.isArray(val.items)) {
                        for (let idx in val.items) {
                            verifyProperty(val.items[idx], pathName(path, `items/${idx}`))
                        }
                    } else {
                        verifyProperty(val.items, pathName(path, 'item'))
                    }
                }
                if (val.oneOf) {
                    for (let idx in val.oneOf) {
                        verifyProperty(val.oneOf[idx], pathName(path, `oneOf/${idx}`))
                    }
                }
                if (val.anyOf) {
                    for (let idx in val.anyOf) {
                        verifyProperty(val.anyOf[idx], pathName(path, `anyOf/${idx}`))
                    }
                }
                if (typeof val.additionalProperties === 'object') {
                    verifyProperty(val.additionalProperties, pathName(path, 'additionalProperties'))
                }
                if (val.patternProperties) {
                    for (let pattern in val.patternProperties) {
                        verifyProperty(val.patternProperties[pattern], pathName(path, `patternProperties/${pattern}`))
                    }
                }
                return false
            })
        }
        this.currentKind = ''
    }

    // Check to see if a kind is an interface.
    private isInterface(kind: string): boolean {
        return this.interfaces.includes(kind)
    }

    private vlog(msg: string): void {
        if (this.verbose) {
            this.log(msg)
        }
    }

    // Report missing component.
    private missing(kind: string): void {
        if (!this.missingKinds.has(kind)) {
            this.error(`${this.currentKind}: Missing ${kind} schema file from merge`)
            this.missingKinds.add(kind)
            this.failed = true
        }
    }

    // Missing $schema
    private missingSchemaError() {
        this.error(`${this.currentFile}: Error missing $schema`)
        this.failed = true
    }

    // Error in schema validity
    private schemaError(err: Validator.ErrorObject): void {
        this.error(`${this.currentFile}: ${err.dataPath} error: ${err.message}`)
        this.failed = true
    }

    private parsingWarning(msg: string): void {
        this.warn(`Warning ${this.currentFile}: ${msg}`)
    }

    // Error while parsing component schemas
    private parsingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        let posMatch = /position\s+([0-9]+)/.exec(msg)
        if (posMatch) {
            let file = fs.readFileSync(this.currentFile, 'utf8')
            let pos = Number(posMatch[1])
            msg += os.EOL + file.substring(pos - 40, pos) + '^^^' + file.substring(pos, pos + 40)
        } else {
            msg = `${this.currentFile}: ${msg}`
        }
        this.error(`Error ${msg}`)
        this.failed = true
    }

    // Warning while merging schemas
    private mergingWarning(msg: string): void {
        if (this.currentKind) {
            this.warn(`Warning ${this.currentKind}: ${msg}`)
        } else {
            this.warn(`Warning ${msg}`)
        }
    }

    // Error while merging schemas
    private mergingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        if (this.currentKind) {
            this.error(`Error ${this.currentKind}: ${msg}`)
        } else {
            this.error(`Error ${msg}`)
        }
        this.failed = true
    }

    // Generic error message
    private uiError(path: string): void {
        this.error(`Error ${path} does not exist in schema`)
        this.failed = true
    }

    // Missing $ref
    private refError(original: string, modified: string): void {
        this.error(`Error could not bundle ${original} into ${modified}`)
        this.failed = true
    }
}
