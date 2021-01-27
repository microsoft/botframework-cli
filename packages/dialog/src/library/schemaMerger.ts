/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra'
import * as hash from './hash'
import * as nuget from '@snyk/nuget-semver'
import * as os from 'os'
import * as ppath from 'path'
import * as xp from 'xml2js'
import Ajv = require('ajv');
import parser from '@apidevtools/json-schema-ref-parser'
import {JsonPointer as ptr} from 'json-ptr'

const allof = require('json-schema-merge-allof')
const clone = require('clone')
const getUri = require('get-uri')
const glob = require('globby')
const semverRsort = require('semver/functions/rsort')
const util = require('util')

const exec = util.promisify(require('child_process').exec)

// Walk over JSON object, stopping if true from walker.
// Walker gets the current value, the parent object and full path to that object
// and returns false to continue, true to stop going deeper.
function walkJSON(elt: any, fun: (val: any, obj?: any, path?: string) => boolean, obj?: any, path?: any) {
    const done = fun(elt, obj, path)
    if (!done) {
        if (typeof elt === 'object' || Array.isArray(elt)) {
            for (const key in elt) {
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
    const stream = await getUri(uri)
    let data = ''
    for await (const chunk of stream) {
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
    const target = {}
    const merger = (obj: any) => {
        for (const prop in obj) {
            const val = obj[prop]
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                target[prop] = mergeObjects(target[prop], val)
            } else {
                target[prop] = obj[prop]
            }
        }
    }
    merger(obj1)
    merger(obj2)
    const finalTarget = {}
    for (const key of Object.keys(target).sort()) {
        finalTarget[key] = target[key]
    }
    return finalTarget
}

// Build a tree of component (project or package) references in order to compute a topological sort.
class ComponentNode {
    // Component metadata information
    public metadata: Component

    // Explicit patterns
    public explictPatterns: string[] = []

    // Child components
    private readonly children: ComponentNode[] = []

    // Parent components
    private readonly parents: ComponentNode[] = []

    // Track if processed
    private processed = false

    constructor(component?: Component) {
        this.metadata = component ?? {path: '', name: '', version: ''} as Component
    }

    // Add a child component
    public addChild(component: ComponentNode): ComponentNode {
        component.parents.push(this)
        this.children.push(component)
        return component
    }

    // Return the topological sort of DAG rooted in component.
    // Sort has all parents in bread-first order before any child.
    public sort(): ComponentNode[] {
        const sort: ComponentNode[] = []
        let remaining: ComponentNode[] = [this]
        while (remaining.length > 0) {
            const newRemaining: ComponentNode[] = []
            for (const component of remaining) {
                if (component.allParentsProcessed()) {
                    if (!component.processed) {
                        sort.push(component)
                        component.processed = true
                        for (const child of component.children) {
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

    public patterns(extensions: string[], negativePatterns: string[], imports: string): string[] {
        let patterns = this.explictPatterns
        if (patterns.length === 0 && this.metadata.path) {
            patterns = []
            const root = ppath.dirname(this.metadata.path)
            for (const extension of extensions) {
                patterns.push(ppath.join(root, '**', `*${extension}`))
            }
            if (this.metadata.path.endsWith('package.json')) {
                patterns.push(`!${ppath.join(root, 'node_modules', '**')}`)
            } else if (this.metadata.path.endsWith('.csproj')) {
                patterns.push(`!${ppath.join(root, 'bin', '**')}`)
                patterns.push(`!${ppath.join(root, 'obj', '**')}`)
            }
            patterns.push(`!${ppath.join(ppath.resolve(imports), '**')}`)
            patterns.push(`!${ppath.join(root, 'test', '**')}`)
            patterns.push(`!${ppath.join(root, 'tests', '**')}`)
            patterns = [...patterns, ...negativePatterns]
        }
        return patterns
    }

    // Test to see if root component
    public isRoot(): boolean {
        return this.parents.length === 0 || (this.parents.length === 1 && this.parents[0].parents.length === 0)
    }

    // Check to see if this component is a parent of another component
    public isParent(node: ComponentNode): boolean {
        let found = false
        for (const child of this.children) {
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
        return this.metadata.path.endsWith('.csproj')
    }

    // Test to see if first-level component
    public isTopComponent(): boolean {
        return this.parents.find(p => p.parents.length > 0 && p.isRoot()) !== undefined
    }

    // Test to see if all parents are processed which means you can be added to sort.
    private allParentsProcessed(): boolean {
        for (const parent of this.parents) {
            if (!parent.processed) {
                return false
            }
        }
        return true
    }
}

interface PathComponent {
    path: string
    node: ComponentNode
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
 * Normalized information extracted from language native package components.
 * This involves some mapping and normalization as described for each property.
 * For NPM some nuget keywords can be used as a package.json extension and are marked below.
 * 
 * Nuget ignored attributes:
 *   title (not used by nuget UI)
 *   owners (doesn't seem relevant)
 *   licenseUrl (deprecated)
 *   iconUrl (deprecated)
 *   summary (deprecated)
 *   requireLicenseAcceptance (we always require)
 * 
 * NPM ignored attributes:
 *   contributors (not relevant)
 *   bugs (should be off project page)
 */
export interface Component {
    /** 
     * Package name.
     * Nuget: id
     * NPM: name
     */
    name: string

    /** 
     * Version.
     * Nuget: version
     * NPM: version
     */
    version: string

    /** 
     * Path to component definition. 
     */
    path: string

    /** 
     * Description of component.
     * Nuget: description
     * NPM: description
     */
    description: string

    /** 
     * Release notes for component.
     * Nuget: releaseNotes
     * NPM: releaseNotes extension
     */
    releaseNotes: string

    /** 
     * Authors of component.
     * Nuget: break authors on comma
     * NPM: author string and if structured {name} {email} {url}
     */
    authors: string[]

    /** 
     * Keywords describing component.
     * Nuget: tags broken on space
     * NPM: keywords
     */
    keywords: string[]

    /** 
     * Icon for component. 
     * Nuget: relative path to icon in package
     * NPM: icon extension
     */
    icon: string

    /** 
     * Repository containing component source.
     * Nuget: repository.url (dropping type, branch, commit)
     * NPM: repository string or respository.url (dropping type)
     */
    repository: string

    /** 
     * License information for component.
     * Nuget: license
     * NPM: license
     */
    license: string

    /** 
     * Locale id for component.
     * Nuget: language
     * NPM: language extension
     */
    language: string

    /** 
     * Copyright information.
     * Nuget: copyright
     * NPM: copyright extension
     */
    copyright: string

    /** 
     * True if includes .schema/.uischema file. 
     */
    includesSchema: boolean

    /** 
     * True if includes exports. 
     */
    includesExports: boolean
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
     * Files that were unchanged.
     */
    unchanged: string[],

    /**
     * Files where a component has a new definition and the old imported definition has been changed.
     */
    conflicts: Import[]

    /** 
     * Normalized description of top-level components installed in project. 
     */
    components: Component[]
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

    // Negative patterns found in input globs
    private readonly negativePatterns: string[]

    // Track packages that have been processed
    private readonly packages = new Set()

    // Component tree
    private readonly root = new ComponentNode()
    private readonly parents: ComponentNode[] = []
    private components: ComponentNode[] = []

    // Files
    private readonly files: Map<string, Map<string, PathComponent[]>> = new Map<string, Map<string, PathComponent[]>>()

    // Validator for checking schema
    private readonly validator = new Ajv()

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
        this.patterns = patterns.map(forwardSlashes)
        this.negativePatterns = this.patterns.filter(p => p.startsWith('!'))
        this.output = output ? ppath.join(ppath.dirname(output), ppath.basename(output, ppath.extname(output))) : ''
        this.imports = imports ?? ppath.join(ppath.dirname(this.output), 'imported')
        this.checkOnly = checkOnly
        this.verbose = verbose
        this.log = log
        this.warn = warn
        this.error = error
        this.extensions = extensions ?? ['.schema', '.lu', '.lg', '.qna', '.dialog', '.uischema']
        this.schemaPath = schema
        this.debug = debug
        this.nugetRoot = nugetRoot ?? ''
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
            await this.expandPackages(await glob(this.patterns))
            await this.analyze()
            const schema = await this.mergeSchemas()
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
    private pushParent(component: Component): ComponentNode {
        const node = new ComponentNode(component)
        const child = this.currentParent().addChild(node)
        this.parents.push(child)
        this.currentFile = component.path
        return node
    }

    // Pop the current parent
    private popParent() {
        this.parents.pop()
        this.currentFile = this.currentParent().metadata.path
    }

    // Return the current parent
    private currentParent(): ComponentNode {
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
            const schema = await fs.readJSON(this.schemaPath)
            this.currentFile = schema.$schema
            this.metaSchema = await getJSON(schema.$schema)
            this.validator.addSchema(this.metaSchema, 'componentSchema')
            this.currentFile = this.schemaPath
            this.validateSchema(schema)
            return parser.dereference(schema)
        }

        // Delete existing output
        const outputPath = ppath.resolve(this.output + '.schema')
        if (!this.checkOnly) {
            await fs.remove(this.output + '.schema')
            await fs.remove(this.output + '.schema.final')
            await fs.remove(this.output + '.schema.expanded')
        }

        const componentPaths: PathComponent[] = []
        const schemas = this.files.get('.schema')
        if (schemas) {
            for (const pathComponents of schemas.values()) {
                // Just take first definition if multiple ones
                const pathComponent = pathComponents[0]
                if (pathComponent.path !== outputPath) {
                    componentPaths.push(pathComponent)
                }
            }
        }

        if (componentPaths.length === 0) {
            return
        }
        this.log('Parsing component .schema files')
        for (const componentPath of componentPaths) {
            try {
                const path = componentPath.path
                this.currentFile = path
                this.vlog(`Parsing ${path}`)
                let component = await fs.readJSON(path)
                if (component.definitions && component.definitions.component) {
                    this.parsingWarning('Skipping merged schema')
                } else {
                    this.relativeToAbsoluteRefs(component, path)
                    if (component.$ref) {
                        // Expand top-level $ref to support testing
                        const ref = await getJSON(component.$ref)
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
                    if (componentPath.node.metadata.name && componentPath.node.metadata.version) {
                        // Only include versioned components
                        component.$package = {
                            name: componentPath.node.metadata.name,
                            version: componentPath.node.metadata.version
                        }
                    }
                    const filename = ppath.basename(path)
                    const kind = filename.substring(0, filename.lastIndexOf('.'))
                    const fullPath = ppath.resolve(path)
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
        const oneOf = Object.keys(this.definitions)
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
            const finalDefinitions: any = {}
            for (const key of Object.keys(this.definitions).sort()) {
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
                const start = process.hrtime.bigint()
                fullSchema = await parser.dereference(clone(finalSchema))
                const end = process.hrtime.bigint()
                const elapsed = Number(end - start) / 1000000000
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
        if (!this.checkOnly) {
            await fs.remove(this.output + '.uischema')
        }

        const uiSchemas = this.files.get('.uischema')
        const result = {}
        if (uiSchemas) {
            if (!schema || this.failed) {
                this.error('Error must have a merged .schema to merge .uischema files')
                return
            }

            this.log('Merging component .uischema files')
            if (this.schemaPath) {
                this.log(`Using merged schema ${this.schemaPath}`)
            }
            const outputName = ppath.basename(this.output)
            for (const [fileName, componentPaths] of uiSchemas.entries()) {
                // Skip files that match output .uischema
                if (!fileName.startsWith(outputName + '.')) {
                    const [kindName, localeName] = this.kindAndLocale(fileName, schema)
                    let locale = result[localeName]
                    if (!locale) {
                        locale = result[localeName] = {}
                    }

                    // Merge together definitions for the same kind
                    if (componentPaths.length > 1) {
                        this.vlog(`Merging into ${kindName}.${localeName}`)
                    }
                    for (const componentPath of componentPaths.reverse()) {
                        try {
                            const path = componentPath.path
                            this.currentFile = path
                            if (componentPaths.length > 1) {
                                this.vlog(`  Merging ${this.currentFile}`)
                            } else {
                                this.vlog(`Parsing ${this.currentFile}`)
                            }
                            const component = await fs.readJSON(path)
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

                    const kindDef = schema?.definitions[kindName]
                    if (!kindDef) {
                        this.uiError(kindName)
                    } else {
                        this.validateProperties(kindName, kindDef, locale[kindName].form?.properties)
                        this.validateProperties(`${kindName}.order`, kindDef, locale[kindName].form?.order)
                    }
                }
            }
            if (!this.failed) {
                for (const locale of Object.keys(result)) {
                    const uischema = {$schema: this.metaUISchemaId}
                    for (const key of Object.keys(result[locale]).sort()) {
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
            const split = kindName.lastIndexOf('.')
            if (split >= 0) {
                locale = kindName.substring(split + 1)
                kindName = kindName.substring(0, split)
            }
        }
        return [kindName, locale]
    }

    // Copy all exported assets into imported assets
    private async copyAssets(): Promise<Imports | undefined> {
        const imports: Imports | undefined = this.failed ? undefined : {
            added: [], deleted: [], unchanged: [], conflicts: [],
            components: []
        }
        if (imports && !this.schemaPath) {
            this.log(`Copying exported assets to ${this.imports}`)
            const processed = new Set<string>()
            for (const component of this.components) {
                if (!component.isRoot()) {
                    const exported = ppath.join(ppath.dirname(component.metadata.path), 'exported')
                    if (component.isTopComponent()) {
                        imports.components.push(component.metadata)
                    }
                    processed.add(component.metadata.name)

                    if (await fs.pathExists(exported)) {
                        const used = new Set<string>()
                        const imported = ppath.join(this.imports, component.metadata.name)
                        this.vlog(`Copying ${exported} to ${imported}`)
                        component.metadata.includesExports = true

                        // Copy all exported files
                        for (const path of await glob(forwardSlashes(ppath.join(exported, '**')))) {
                            const destination = ppath.join(imported, ppath.relative(exported, path))
                            used.add(forwardSlashes(destination))
                            let msg = `Copy ${path} to ${destination}`
                            try {
                                let copy = true
                                const info: Import = {definition: await hash.addHash(path), path: destination}
                                const {unchanged, embeddedHash} = await hash.isUnchanged(destination)
                                if (hash.embeddedHash(path, info.definition) === embeddedHash) {
                                    // Import is based on last export
                                    this.vlog(`Unchanged ${destination}`)
                                    imports.unchanged.push(destination)
                                    copy = false
                                } else if (unchanged) {
                                    // Destination has not changed, but export has
                                    this.vlog(msg)
                                    imports.added.push(info)
                                } else {
                                    // Destination and export have changed
                                    this.warn(`Warning copied conflicting ${path} to ${destination}`)
                                    imports.conflicts.push(info)
                                }
                                msg = ''
                                if (copy && !this.checkOnly) {
                                    await fs.ensureDir(ppath.dirname(destination))
                                    await fs.writeFile(destination, info.definition)
                                }
                            } catch (e) {
                                if (msg) {
                                    this.log(msg)
                                }
                                this.mergingError(e)
                            }
                        }

                        // Delete removed files
                        for (const path of await glob(forwardSlashes(ppath.join(imported, '**')))) {
                            if (!used.has(path)) {
                                const {unchanged} = await hash.isUnchanged(path)
                                if (unchanged) {
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

            // Identify previously imported components that are not there any more
            if (await fs.pathExists(this.imports)) {
                for (const importedDir of await fs.readdir(this.imports)) {
                    const importPath = ppath.join(this.imports, importedDir)
                    // On a mac .DS_STORE throws an error if you try to glob it so ensure directory
                    if (!processed.has(importedDir) && (await fs.lstat(importPath)).isDirectory()) {
                        for (const path of await glob(forwardSlashes(ppath.join(this.imports, importedDir, '**')))) {
                            const {unchanged} = await hash.isUnchanged(path)
                            if (unchanged) {
                                imports.deleted.push(path)
                                this.vlog(`Delete ${path}`)
                            } else {
                                imports.conflicts.push({definition: '', path})
                                this.warn(`Warning deleted modified ${path}`)
                            }
                        }
                        if (!this.checkOnly) {
                            await fs.remove(ppath.join(this.imports, importedDir))
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
                for (const prop of uiProps) {
                    if (prop !== '*') {
                        const newSchema = this.propertyDefinition(schema, prop)
                        if (!newSchema) {
                            this.uiError(`${path}.${prop}`)
                        }
                    }
                }
            } else {
                for (const [prop, uiProp] of Object.entries(uiProps)) {
                    const newPath = `${path}.${prop}`
                    const newSchema = this.propertyDefinition(schema, prop)
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
                for (const choice of schema.anyOf) {
                    const def = this.propertyDefinition(choice, property)
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
            for (const error of this.validator.errors as Ajv.ErrorObject[]) {
                this.schemaError(error)
            }
            this.validator.errors = undefined
        }
    }

    // Validate against UI schema
    private validateUISchema(schema: any): void {
        if (!this.validator.validate('UISchema', schema)) {
            for (const error of this.validator.errors as Ajv.ErrorObject[]) {
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

    private nuspecComponent(path: string, nuspec: any): Component {
        const component: Component = {
            name: nuspec.id?.[0] ?? '',
            version: nuspec.version?.[0] ?? '',
            path,
            description: nuspec.description?.[0] ?? '',
            releaseNotes: nuspec.releaseNotes?.[0] ?? '',
            authors: nuspec.authors?.[0].split(',').map(s => s.trim()) ?? [],
            keywords: nuspec.tags?.[0].split(' ').map(s => s.trim()) ?? [],
            icon: nuspec.icon?.[0] ?? '',
            repository: nuspec.repository?.[0].$?.url ?? '',
            license: nuspec.license?.[0] ?? '',
            language: nuspec.language?.[0] ?? '',
            copyright: nuspec.copyright?.[0] ?? '',
            includesSchema: false,
            includesExports: false
        }
        return component
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
                    const nuspec = await this.xmlToJSON(path)
                    const md = nuspec?.package?.metadata[0]
                    this.pushParent(this.nuspecComponent(path, md))
                    const dependencies: any[] = []
                    walkJSON(nuspec, val => {
                        if (val.dependencies) {
                            // NOTE: We assume first framework with dependencies has schema files.
                            for (const groups of val.dependencies) {
                                if (groups.dependency) {
                                    // Direct dependencies
                                    for (const dependency of groups.dependency) {
                                        dependencies.push(dependency.$)
                                    }
                                    break
                                } else if (groups.group) {
                                    // Grouped dependencies
                                    for (const group of groups.group) {
                                        if (group.dependency) {
                                            for (const dependency of group.dependency) {
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
                    for (const dependent of dependencies) {
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

    // Convert a nuget pattern to a regexp
    // 4.*.2.*-* would go to ^4\.[^.]*\.2\.[^-]*-.*$
    private nugetPattern(version: string): RegExp {
        let pattern = '^'
        for (let i = 0; i < version.length; ++i) {
            let ch = version[i]
            switch (ch) {
                case '*':
                    if (i + 1 < version.length) {
                        pattern += `[^${version[i + 1]}]*`
                    } else {
                        pattern += '.*'
                    }
                    break
                case '.':
                    pattern += '\\.'
                    break
                default:
                    pattern += ch
            }
        }
        pattern += '$'
        return new RegExp(pattern)
    }

    // Expand nuget package and all of its dependencies
    private async expandNuget(packageName: string, minVersion: string): Promise<void> {
        // Linux/Mac are case sensitive and nuget/dotnet lowercase package names
        packageName = packageName.toLowerCase()
        let pkgPath = ppath.join(this.nugetRoot, packageName)
        if (!this.packages.has(pkgPath) && !packageName.startsWith('system')) {
            try {
                this.currentFile = pkgPath
                this.packages.add(pkgPath)
                const versions: string[] = []
                if (await fs.pathExists(pkgPath)) {
                    for (const pkgVersion of await fs.readdir(pkgPath)) {
                        versions.push(pkgVersion.toLowerCase())
                    }
                    let versionToUse = ''
                    minVersion = minVersion || '0.0.0'
                    if (minVersion.startsWith('$')) {
                        // Deal with build variables by installing most recent version
                        versionToUse = nuget.maxSatisfying(versions, '0-1000')
                        if (this.debug) {
                            this.parsingWarning(`Using most recent version ${minVersion}`)
                        }
                    } else if (minVersion.includes('*')) {
                        // Match pattern against available versions
                        const pattern = this.nugetPattern(minVersion)
                        for (const version of semverRsort(versions)) {
                            if (pattern.exec(version)) {
                                versionToUse = version
                                break
                            }
                        }
                    } else {
                        versionToUse = nuget.minSatisfying(versions, minVersion)
                    }
                    pkgPath = ppath.join(pkgPath, versionToUse ?? '')
                    const nuspecPath = ppath.join(pkgPath, `${packageName}.nuspec`)
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
                this.currentFile = this.currentParent().metadata.path
            }
        }
    }

    private packageComponent(path: string): Component {
        return {
            name: '',
            version: '',
            path,
            description: '',
            releaseNotes: '',
            authors: [],
            keywords: [],
            icon: '',
            repository: '',
            license: '',
            language: '',
            copyright: '',
            includesSchema: false,
            includesExports: false
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
                this.pushParent(this.packageComponent(path))
                const json = await this.xmlToJSON(path)

                // Walk projects
                const projects: string[] = []
                walkJSON(json, elt => {
                    if (elt.ProjectReference) {
                        for (const ref of elt.ProjectReference) {
                            const projectPath = ppath.join(ppath.dirname(path), ref.$.Include)
                            projects.push(projectPath)
                        }
                        return true
                    }
                    return false
                })
                for (const project of projects) {
                    await this.expandCSProj(project)
                }

                // Walk nugets
                await this.findGlobalNuget()
                if (this.nugetRoot !== '') {
                    const nugetPackages: any[] = []
                    walkJSON(json, elt => {
                        if (elt.PackageReference) {
                            for (const pkgRef of elt.PackageReference) {
                                nugetPackages.push(pkgRef.$)
                            }
                            return true
                        }
                        return false
                    })
                    if (nugetPackages.length === 0) {
                        // Try packages.config
                        const configPath = ppath.join(ppath.dirname(path), 'packages.config')
                        if (await fs.pathExists(configPath)) {
                            this.currentFile = this.prettyPath(configPath)
                            this.vlog(`${this.indent()}Following ${this.currentFile}`)
                            const config = await this.xmlToJSON(configPath)
                            walkJSON(config, elt => {
                                if (elt.packages?.package) {
                                    for (const info of elt.packages.package) {
                                        nugetPackages.push({Include: info.$.id, Version: info.$.version})
                                    }
                                    return true
                                }
                                return false
                            })
                        }
                    }
                    for (const pkg of nugetPackages) {
                        await this.expandNuget(pkg.Include, pkg.Version)
                    }
                }
            } finally {
                this.popParent()
            }
        }
    }

    private packageJsonComponent(path: string, pkg: any): Component {
        const component: Component = {
            name: pkg.name,
            version: pkg.version,
            path,
            description: pkg.description ?? '',
            releaseNotes: pkg.releaseNotes ?? '',
            authors: [],
            keywords: pkg.keywords ?? [],
            icon: pkg.icon ?? '',
            repository: '',
            license: pkg.license ?? '',
            language: pkg.language ?? '',
            copyright: pkg.copyright ?? '',
            includesSchema: false,
            includesExports: false
        }

        if (pkg.author) {
            let author = pkg.author
            if (typeof author === 'object') {
                author = `${author.name}${author.email ? `, ${author.email}` : ''}${author.url ? `, ${author.url}` : ''}`
            }
            component.authors.push(author)
        }

        if (pkg.repository) {
            let repo = pkg.repository
            if (typeof repo === 'object') {
                repo = repo.url
            }
            component.repository = repo
        }

        return component
    }

    private async expandPackageJson(path: string): Promise<void> {
        path = normalize(path)
        if (!this.packages.has(path)) {
            try {
                this.packages.add(path)
                this.vlog(`${this.indent()}Following ${this.prettyPath(path)}`)
                const pkg = await fs.readJSON(path)
                const dependencies = {...pkg.dependencies, ...pkg.optionalDependencies}
                this.pushParent(this.packageJsonComponent(path, pkg))
                if (dependencies) {
                    for (const dependent of Object.keys(dependencies)) {
                        let lastDir = ''
                        let rootDir = ppath.dirname(path)
                        // Walk up parent directories to find package
                        while (rootDir !== lastDir) {
                            const dependentPath = ppath.join(rootDir, 'node_modules', dependent, 'package.json')
                            if (await fs.pathExists(dependentPath)) {
                                await this.expandPackageJson(dependentPath)
                                break
                            } else {
                                lastDir = rootDir
                                rootDir = ppath.dirname(rootDir)
                            }
                        }
                        if (rootDir === lastDir && pkg.optionalDependencies && !(dependent in pkg.optionalDependencies)) {
                            this.missingPackage(dependent)
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
        for (const path of paths) {
            // We expect a package
            const name = ppath.basename(path)
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
            for (const component of this.components) {
                if (component.metadata.path.endsWith('.csproj')) {
                    this.output = ppath.basename(component.metadata.path, '.csproj')
                } else if (component.metadata.path.endsWith('.nuspec')) {
                    this.output = ppath.basename(component.metadata.path, '.nuspec')
                } else if (component.metadata.path.endsWith('package.json')) {
                    this.output = ppath.basename(ppath.dirname(component.metadata.path))
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
        for (const component of this.components) {
            const patterns = component.patterns(this.extensions, this.negativePatterns, this.imports).map(forwardSlashes)
            for (const path of await glob(patterns)) {
                const ext = ppath.extname(path)
                let map = this.files.get(ext)
                if (!map) {
                    map = new Map<string, PathComponent[]>()
                    this.files.set(ext, map)
                }
                const name = ppath.basename(path)
                let record = map.get(name)
                if (!record) {
                    record = []
                    map.set(name, record)
                }
                record.push({path: ppath.resolve(path), node: component})
            }
        }
    }

    // Analyze component files to identify:
    // 1) Multiple definitions of the same file in a component. (Error)
    // 2) Multiple definitions of .schema across projects/components (Error)
    private async analyze() {
        for (const [ext, files] of this.files.entries()) {
            for (const [file, records] of files.entries()) {
                const winner = records[0]
                const same: PathComponent[] = []
                const conflicts: PathComponent[] = []
                for (const alt of records) {
                    if (alt.path.endsWith('.schema') || alt.path.endsWith('.uischema')) {
                        alt.node.metadata.includesSchema = true
                    }
                    if (alt !== winner) {
                        if (winner.node === alt.node) {
                            same.push(alt)
                        } else if (ext === '.schema') {
                            // Check for same content which can happen when project and nuget from project are 
                            // both being used.
                            const winnerSrc = await fs.readFile(winner.path, 'utf8')
                            const altSrc = await fs.readFile(alt.path, 'utf8')
                            if (winnerSrc !== altSrc) {
                                conflicts.push(alt)
                            }
                        } else if (ext !== '.uischema') {
                            conflicts.push(alt)
                        }
                    }
                }

                if (same.length > 0) {
                    this.failed = true
                    this.error(`Error multiple definitions of ${file} in ${winner.node.metadata.name}`)
                    this.error(`  ${winner.path}`)
                    for (const alt of same) {
                        this.error(`  ${alt.path}`)
                    }
                }

                if (conflicts.length > 0) {
                    this.failed = true
                    this.error(`Error conflicting definitions of ${file}`)
                    this.error(`  ${winner.node.metadata.name}: ${winner.path}`)
                    for (const alt of conflicts) {
                        this.error(`  ${alt.node.metadata.name}: ${alt.path}`)
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
                const start = stdout.indexOf(name)
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
        const extension = this.definitions[extensionName] || this.metaSchema.definitions[extensionName]
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
                    for (const property in extension.properties) {
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
                for (const required of extension.required) {
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
        const found: string[] = []
        const addArg = (val: string) => {
            const start = val.indexOf('(')
            const end = val.indexOf(')')
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
            for (const elt of definition.$role) {
                if (elt.startsWith(type)) {
                    addArg(elt)
                }
            }
        } else {
            const elt = definition.$role
            if (definition.$role && definition.$role.startsWith(type)) {
                addArg(elt)
            }
        }
        return found
    }

    // Process extensions by making sure they have been done and then merging into definition.
    private processExtension(definition: any): void {
        const extensions = this.roles(definition, 'extends')
        for (const extensionName of extensions) {
            // Ensure base has been extended
            const extension = this.definitions[extensionName]
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
            const schema = this.definitions[this.currentKind]
            if (this.roles(schema, 'interface').length > 0) {
                this.interfaces.push(this.currentKind)
            }
        }
        for (this.currentKind in this.definitions) {
            if (!this.isInterface(this.currentKind)) {
                // Expand all references and allof to make processing simpler
                const definition = this.definitions[this.currentKind]
                for (const interfaceName of this.roles(definition, 'implements')) {
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
                        const expression = this.roles(val, 'expression')
                        const implementation = this.roles(val, 'implementation')
                        const iface = this.roles(val, 'interface')
                        const extension = this.roles(val, 'extends')
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
                const ref: string = val.$ref
                if (ref.startsWith('#/')) {
                    val.$ref = `#/definitions/${kind}${ref.substring(ref.indexOf('/'))}`
                } else if (ref.startsWith('file:')) {
                    const filename = ppath.basename(ref)
                    const kind = filename.substring(0, filename.lastIndexOf('.'))
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
                        this.missingKind(val.$kind)
                    }
                }
                return false
            })
        }
    }

    // Expand interface definitions to include all implementations
    private expandInterfaces(): void {
        for (const interfaceName of this.interfaces) {
            this.currentKind = interfaceName
            const interfaceDefinition = this.definitions[interfaceName]
            const implementations = this.implementations[interfaceName]
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
                for (const implementation of this.implementations[interfaceName]) {
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
                const definition = this.definitions[this.currentKind]
                this.mergeInto('component', definition, true)
                definition.properties.$kind.const = this.currentKind
            }
        }
    }

    private sortImplementations(): void {
        for (this.currentKind in this.definitions) {
            const definition = this.definitions[this.currentKind]
            if (this.isInterface(this.currentKind) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => (a.$ref || a.type).localeCompare(b.$ref || b.type))
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
        const sources: string[] = []
        await this.bundleFun(schema, schema, sources, '')
        for (const source of sources) {
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
            for (const key in elt) {
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
                            const ref = `#/definitions/${name}${pointer}`
                            const definition: any = ptr.get(schema, ref)
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
                for (const [key, val] of Object.entries(elt)) {
                    if (typeof val === 'object' || Array.isArray(val)) {
                        const childBundled = this.prune(val)
                        if (!childBundled) {
                            // Prune any keys of unused structured object
                            delete elt[key]
                        }
                        keep = keep || childBundled
                    }
                }
            }
        } else if (Array.isArray(elt)) {
            for (const child of elt) {
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
                for (const child of val.allOf) {
                    if (child.$ref) {
                        const ref: any = ptr.get(bundle, child.$ref)
                        for (const prop in ref) {
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
        for (const entry of schema.oneOf) {
            this.currentKind = entry.$ref.substring(entry.$ref.lastIndexOf('/') + 1)
            const definition = schema.definitions[this.currentKind]
            const verifyProperty = (val, path) => {
                if (val.$ref) {
                    val = clone(val)
                    const ref: any = ptr.get(schema, val.$ref)
                    for (const prop in ref) {
                        if (!val[prop]) {
                            val[prop] = ref[prop]
                        }
                    }
                    delete val.$ref
                }
                if (!val.$schema) {
                    // Assume $schema is an external reference and ignore error checking
                    if (val.$kind) {
                        const kind = schema.definitions[val.$kind]
                        if (this.roles(kind, 'interface').length > 0) {
                            const implementations = kind.oneOf
                            let hasImplementation = false
                            if (kind.oneOf) {
                                for (const implementation of implementations) {
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
                    for (const propName in val.properties) {
                        verifyProperty(val.properties[propName], pathName(path, propName))
                    }
                }
                if (val.items) {
                    if (Array.isArray(val.items)) {
                        for (const idx in val.items) {
                            verifyProperty(val.items[idx], pathName(path, `items/${idx}`))
                        }
                    } else {
                        verifyProperty(val.items, pathName(path, 'item'))
                    }
                }
                if (val.oneOf) {
                    for (const idx in val.oneOf) {
                        verifyProperty(val.oneOf[idx], pathName(path, `oneOf/${idx}`))
                    }
                }
                if (val.anyOf) {
                    for (const idx in val.anyOf) {
                        verifyProperty(val.anyOf[idx], pathName(path, `anyOf/${idx}`))
                    }
                }
                if (typeof val.additionalProperties === 'object') {
                    verifyProperty(val.additionalProperties, pathName(path, 'additionalProperties'))
                }
                if (val.patternProperties) {
                    for (const pattern in val.patternProperties) {
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

    // Report missing $kind.
    private missingKind(kind: string): void {
        if (!this.missingKinds.has(kind)) {
            this.error(`${this.currentKind}: Error missing ${kind} schema file from merge`)
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
    private schemaError(err: Ajv.ErrorObject): void {
        this.error(`${this.currentFile}: ${err.dataPath} error: ${err.message}`)
        this.failed = true
    }

    private parsingWarning(msg: string): void {
        this.warn(`Warning ${this.currentFile}: ${msg}`)
    }

    // Error while parsing component schemas
    private parsingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        const posMatch = /position\s+([0-9]+)/.exec(msg)
        if (posMatch) {
            const file = fs.readFileSync(this.currentFile, 'utf8')
            const pos = Number(posMatch[1])
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
        const msg = typeof err === 'string' ? err : err.message
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

    // Report missing $kind.
    private missingPackage(component: string): void {
        this.error(`${this.currentFile}: Error could not find dependency ${component}`)
        this.failed = true
    }

    // Missing $ref
    private refError(original: string, modified: string): void {
        this.error(`Error could not bundle ${original} into ${modified}`)
        this.failed = true
    }
}
