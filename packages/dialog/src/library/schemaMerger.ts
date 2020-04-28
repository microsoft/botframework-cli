/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as Validator from 'ajv'
import * as fs from 'fs-extra'
import * as glob from 'globby'
import * as os from 'os'
import * as parser from '@apidevtools/json-schema-ref-parser'
import * as ppath from 'path'
import * as semver from 'semver'
import * as xp from 'xml2js'
let allof: any = require('json-schema-merge-allof')
let clone: any = require('clone')
let getUri: any = require('get-uri')
let ptr = require('json-ptr')
let util: any = require('util')
let exec: any = util.promisify(require('child_process').exec)

// Walk over JSON object, stopping if true from walker.
// Walker gets the current value, the parent object and key in that object.
function walkJSON(elt: any, fun: (val: any, obj?: any, key?: string) => boolean, obj?: any, key?: any): boolean {
    let done = fun(elt, obj, key)
    if (!done) {
        if (typeof elt === 'object' || Array.isArray(elt)) {
            for (let key in elt) {
                done = walkJSON(elt[key], fun, elt, key)
                if (done) break
            }
        }
    }
    return done
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

// We mark the $ref we don't want to expand by changing them to $pref
function protectRefs(schema: any) {
    walkJSON(schema, (val: any, obj?: any, key?: any) => {
        if (!key) {
            // Root oneOf
            for (let child of val.oneOf) {
                if (child.$ref) {
                    child.$pref = child.$ref
                    delete child.$ref
                }
            }
        } else {
            if (val.$kind && val.$ref) {
                // Don't expand $kind refs
                val.$pref = val.$ref
                delete val.$ref
            } else if (val.$role === 'interface') {
                // Don't expand interface refs
                for (let child of val.oneOf) {
                    if (child.$ref) {
                        child.$pref = child.$ref
                        delete child.$ref
                    }
                }
            }
        }
        return false
    })
}

// Restore $pref to $ref
function restoreRefs(schema: any) {
    walkJSON(schema, (val) => {
        if (val.$pref) {
            val.$ref = val.$pref
            delete val.$pref
        }
        return false
    })
}


// Simplify schema by expanding allOf and local references to anything
// except root oneOf, interface oneOf and $kind references.
export async function simplifySchema(schema: any): Promise<any> {
    protectRefs(schema)
    await parser.dereference(schema)
    restoreRefs(schema)
    let result = allof(schema, {
        resolvers: {
            const: function (values, path, mergeSchemas, options) {
                // Last value is the top-most schema element
                return values[values.length - 1]
            }
        }
    })
    return result
}

export class SchemaMerger {
    // Input parameters
    private patterns: string[]
    private output: string
    private verbose: boolean
    private log: any
    private warn: any
    private error: any
    private debug: boolean | undefined

    // State tracking
    private validator = new Validator()
    private metaSchemaId = ''
    private metaSchema: any
    private definitions: any = {}
    private source: any = {}
    private expanded: any = {} // Expanded versions for analysis
    private interfaces: string[] = []
    private implementations: any = {}
    private failed = false
    private missingKinds = new Set()
    private currentFile = ''
    private currentKind = ''
    private readonly jsonOptions = { spaces: '\t', EOL: os.EOL }

    /**
     * Merger to combine copmonent .schema files to make a custom schema.
     * @param patterns Glob patterns for the .schema files to combine.
     * @param output The output file to create.  app.schema by default.
     * @param verbose True to show files as processed.
     * @param log Logger for informational messages.
     * @param warn Logger for warning messages.
     * @param error Logger for error messages.
     * @param debug Generate debug output.
     */
    public constructor(patterns: string[], output: string, verbose: boolean, log: any, warn: any, error: any, debug?: boolean) {
        this.patterns = patterns
        this.output = output
        this.verbose = verbose
        this.log = log
        this.warn = warn
        this.error = error
        this.debug = debug
    }

    async mergeSchemas(): Promise<boolean> {
        try {
            let componentPaths: any[] = []

            // delete output so we don't attempt to process it
            if (fs.existsSync(this.output)) {
                fs.unlinkSync(this.output)
            }

            this.log(`Finding component .schema files in ${this.patterns.join(', ')}`)
            for await (const path of this.expandPackages(await glob(this.patterns))) {
                componentPaths.push(path)
            }

            if (componentPaths.length === 0) {
                return false
            } else {
                this.log('Parsing component .schema files')
                for (let componentPath of componentPaths) {
                    try {
                        this.currentFile = componentPath
                        if (this.verbose) {
                            this.log(`Parsing ${componentPath}`)
                        }
                        let component = await fs.readJSON(componentPath)
                        if (component.$id) {
                            this.error(`${this.currentFile}: warning: Skipping because of top-level $id: ${component.$id}.`)
                        } else {
                            this.relativeToAbsoluteRefs(component, componentPath)

                            // Pick up meta-schema from first .dialog file
                            if (!this.metaSchema) {
                                this.metaSchemaId = component.$schema
                                this.metaSchema = await getJSON(component.$schema)
                                this.validator.addSchema(this.metaSchema, 'componentSchema')
                                if (this.verbose) {
                                    this.log(`  Using component.schema ${this.metaSchemaId}`)
                                }
                                this.validateSchema(component)
                            } else if (component.$schema !== this.metaSchemaId) {
                                this.error(`${this.currentFile}: error:${this.currentFile}: ${component.$schema} does not match component.schema ${this.metaSchemaId}`)
                            } else {
                                this.validateSchema(component)
                            }

                            let filename = ppath.basename(componentPath)
                            let kind = filename.substring(0, filename.lastIndexOf('.'))
                            if (this.source[kind] && this.source[kind] != componentPath) {
                                this.parsingError(`redefines ${kind} from ${this.source[kind]}.`)
                            }
                            this.source[kind] = ppath.resolve(componentPath)
                            this.definitions[kind] = component
                            let noref = await parser.dereference(clone(component), this.schemaProtocolResolver())
                            this.expanded[kind] = allof(noref)
                        }
                    } catch (e) {
                        this.parsingError(e)
                    }
                }
                this.currentFile = ''

                this.log('Merging component schemas')
                this.processRoles()
                this.fixComponentReferences()
                this.expandKinds()
                this.expandInterfaces()
                this.addComponentProperties()
                this.sortImplementations()
                let oneOf = Object.keys(this.definitions)
                    .filter(kind => !this.isInterface(kind))
                    .sort()
                    .map(kind => {
                        return {
                            $ref: '#/definitions/' + kind
                        }
                    })
                this.addSchemaDefinitions()

                if (!this.failed) {
                    this.currentFile = this.output
                    let finalDefinitions: any = {}
                    for (let key of Object.keys(this.definitions).sort()) {
                        finalDefinitions[key] = this.definitions[key]
                    }
                    let finalSchema = {
                        $schema: this.metaSchemaId,
                        $id: ppath.resolve(this.output),
                        type: 'object',
                        title: 'Component kinds',
                        description: 'These are all of the kinds that can be created by the loader.',
                        oneOf,
                        definitions: finalDefinitions
                    }
                    if (this.debug) {
                        await fs.writeJSON(this.output + '.final', finalSchema, this.jsonOptions)
                    }

                    // Convert all remote references to local ones
                    await parser.bundle(finalSchema as any, this.schemaProtocolResolver())
                    this.removeSchemaAndId(finalSchema)

                    // Simplify schema to make checking easier
                    let start = process.hrtime()
                    let simple = await simplifySchema(clone(finalSchema))
                    let [_, end] = process.hrtime(start)
                    end = end / 1000000000
                    if (this.debug) {
                        this.log(`Expanding took ${end} seconds`)
                        await fs.writeJSON(this.output + '.expanded', simple, this.jsonOptions);
                    }

                    // Final verification
                    this.verifySchema(simple)
                    if (!this.failed) {
                        this.log(`Writing ${this.output}`)
                        await fs.writeJSON(this.output, finalSchema, this.jsonOptions)
                    }
                }
                if (this.failed) {
                    this.error('*** Could not merge component schemas ***')
                }
            }
        } catch (e) {
            this.mergingError(e)
        }
        return true
    }

    // Validate against component schema
    validateSchema(schema: any): void {
        if (!this.validator.validate('componentSchema', schema)) {
            for (let error of this.validator.errors as Validator.ErrorObject[]) {
                this.schemaError(error)
            }
            this.validator.errors = undefined
        }
    }

    // Convert file relative ref to absolute ref
    toAbsoluteRef(ref: string, base: string): string {
        if (ref.startsWith('.')) {
            ref = `file:///${ppath.resolve(ppath.dirname(base), ref).replace(/\\/g, '/')}`
        }
        return ref
    }

    // Convrert local references to absolute so we can keep them as references when combined
    relativeToAbsoluteRefs(schema: object, path: string) {
        walkJSON(schema, (val, obj, key) => {
            if (val.$ref) {
                val.$ref = this.toAbsoluteRef(val.$ref, path)
            } else if (val.$schema) {
                val.$schema = this.toAbsoluteRef(val.$schema, path)
            }
            return false
        })
    }

    // Resovler for schema: -> metaSchema
    schemaProtocolResolver(): any {
        let reader = (file: parser.FileInfo): string => {
            return JSON.stringify(this.metaSchema)
        }
        return {
            resolve: {
                defintion: {
                    order: 1,
                    canRead: /^schema:/i,
                    read(file: parser.FileInfo, callback: any, $refs: any): any {
                        return reader(file)
                    }
                }
            }
        }
    }

    // Expand package.json, package.config or *.csproj to look for .schema below referenced packages.
    async * expandPackages(paths: string[]): AsyncIterable<string> {
        for (let path of paths) {
            if (path.endsWith('.schema')) {
                yield this.prettyPath(path)
            } else {
                let references: string[] = []
                let name = ppath.basename(path)
                if (this.verbose) {
                    this.log(`Following ${path}`)
                }
                if (name.endsWith('.csproj')) {
                    references.push(ppath.join(ppath.dirname(path), '/**/*.schema'))
                    let json = await this.xmlToJSON(path)
                    let packages = await this.findGlobalNuget()
                    if (packages) {
                        walkJSON(json, elt => {
                            let done = false
                            if (elt.PackageReference) {
                                for (let pkgRef of elt.PackageReference) {
                                    let pkg = pkgRef.$
                                    let pkgName = pkg.Include.toLowerCase()
                                    let pkgPath = ppath.join(packages, pkgName)
                                    let versions: string[] = []
                                    for (let version of fs.readdirSync(pkgPath)) {
                                        versions.push(version.toLowerCase())
                                    }
                                    let baseVersion = pkg.Version || '0.0.0'
                                    let version = semver.minSatisfying(versions, `>=${baseVersion.toLowerCase()}`)
                                    references.push(ppath.join(packages, pkgName, version || '', '/**/*.schema'))
                                }
                                done = true
                            }
                            return done
                        })
                    }
                } else if (name === 'packages.config') {
                    let json = await this.xmlToJSON(path)
                    let packages = await this.findParentDirectory(ppath.dirname(path), 'packages')
                    if (packages) {
                        walkJSON(json, elt => {
                            let done = false
                            if (elt.package) {
                                for (let info of elt.package) {
                                    let id = `${info.$.id}.${info.$.version}`
                                    references.push(ppath.join(packages, `${id}/**/*.schema`))
                                }
                                done = true
                            }
                            return done
                        })
                    }
                } else if (name === 'package.json') {
                    let json = await fs.readJSON(path)
                    for (let pkg in json.dependencies) {
                        references.push(ppath.join(ppath.dirname(path), `node_modules/${pkg}/**/*.schema`))
                    }
                } else {
                    throw new Error(`Unknown package type ${path}`)
                }
                for (let ref of references) {
                    for (let expandedRef of await glob(ref)) {
                        yield this.prettyPath(expandedRef)
                    }
                }
            }
        }
        return []
    }

    // Generate path relative to CWD
    prettyPath(path: string): string {
        let newPath = ppath.relative(process.cwd(), path)
        if (newPath.startsWith('..')) {
            newPath = path
        }
        return newPath
    }

    // Find the global nuget repository
    async findGlobalNuget(): Promise<string> {
        let result = ''
        try {
            const { stdout } = await exec('dotnet nuget locals global-packages --list')
            const name = 'global-packages:'
            let start = stdout.indexOf(name)
            if (start > -1) {
                result = stdout.substring(start + name.length).trim()
            }
        } catch (err) {
            this.warn(`${this.currentFile}: warning: Cannot find global nuget packages so skipping .csproj\n${err}`)
        }
        return result
    }

    // Convert XML to JSON
    async xmlToJSON(path: string): Promise<string> {
        let xml = (await fs.readFile(path)).toString()
        return new Promise((resolve, reject) =>
            xp.parseString(xml, (err: Error, result: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }))
    }

    async findParentDirectory(path: string, dir: string): Promise<string> {
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

    // Check $role validity and identify implementations and interfaces
    processRoles(): void {
        let expanded = {}
        for (let kind in this.definitions) {
            let schema = this.expanded[kind]
            if (schema.$role === 'interface') {
                this.interfaces.push(kind)
            }
            expanded[kind] = schema
        }
        for (let kind in expanded) {
            // Expand all references and allof to make processing simpler
            let schema = expanded[kind]
            let role = schema.$role
            const prefix = 'implements('
            if (role && role.startsWith(prefix) && role.endsWith(')')) {
                // Connect to interface
                let interfaceName = role.substring(prefix.length, role.length - 1)
                if (!this.definitions[interfaceName]) {
                    this.error(`${kind}: interface ${interfaceName} is not defined.`)
                } else if (!this.isInterface(interfaceName)) {
                    this.error(`${kind}: ${interfaceName} is missing an interface $role.`)
                } else {
                    if (!this.implementations[interfaceName]) {
                        this.implementations[interfaceName] = []
                    }
                    this.implementations[interfaceName].push(kind)
                }

                // Verify all $roles are valid
                walkJSON(schema, (val: any, _obj, key) => {
                    if (val.$role) {
                        if (key ? val.$role !== 'expression' : val.$role !== 'implements' && !val.$role.startsWith(prefix)) {
                            this.error(`${kind}: $role ${role} is not valid in ${val}`)
                        }
                    }
                    return false
                })
            }
        }
    }

    // Turn #/definitions/foo into #/definitions/${kind}/definitions/foo
    fixComponentReferences(): void {
        for (let kind in this.definitions) {
            this.currentKind = kind
            walkJSON(this.definitions[kind], (val: any) => {
                if (val.$ref && typeof val.$ref === 'string') {
                    let ref: string = val.$ref
                    if (ref.startsWith('#/definitions/')) {
                        val.$ref = '#/definitions/' + kind + '/definitions' + ref.substring(ref.indexOf('/'))
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
        this.currentKind = ''
    }

    // Expand $kind into $ref: #/defintions/kind
    expandKinds(): void {
        for (let kind in this.definitions) {
            this.currentKind = kind
            walkJSON(this.definitions[kind], val => {
                if (val.$kind) {
                    if (this.definitions.hasOwnProperty(val.$kind)) {
                        val.$ref = '#/definitions/' + val.$kind
                    } else {
                        this.missing(val.$kind)
                    }
                }
                return false
            })
        }
        this.currentKind = ''
    }

    // Expand interface definitions to include all implementations
    expandInterfaces(): void {
        for (let interfaceName of this.interfaces) {
            this.currentKind = interfaceName
            let interfaceDefinition = this.definitions[interfaceName]
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
                this.currentKind = implementation
                let definition = this.definitions[implementation]
                interfaceDefinition.oneOf.push({
                    $ref: `#/definitions/${implementation}`
                })
            }
        }
        this.currentKind = ''
    }

    // Include standard component properties
    addComponentProperties(): void {
        for (let kind in this.definitions) {
            this.currentKind = kind
            if (!this.isInterface(kind)) {
                let definition = this.definitions[kind]

                // Add $kind to required
                if (definition.required) {
                    definition.required.push('$kind')
                } else {
                    definition.required = ['$kind']
                }

                // Define $kind restriction
                // NOTE: This must be pushed into the full definition because otherwise 
                // the const doesn't end up forcing the rest of the schema.
                let kindDef = { type: 'string', const: `${kind}` }

                if (definition.hasOwnProperty('additionalProperties')) {
                    // If additionalProperties is specified, you must have a top-level properties
                    if (definition.allOf) {
                        this.mergingError('allOf is not allowed with additionalProperties.')
                    } else {
                        // Merge into top-level properties
                        if (!definition.properties) {
                            definition.properties = {}
                        }
                        definition.properties = { ...definition.properties, ...this.metaSchema.definitions.component.properties }
                        definition.properties.$kind = kindDef
                    }
                } else {
                    // Otherwise you can use allOf to combine schemas
                    if (!definition.allOf) {
                        definition.allOf = []
                        if (definition.properties) {
                            definition.allOf.push({ properties: definition.properties })
                        }
                        delete definition.properties
                    }
                    definition.allOf.push({ properties: { $kind: kindDef } })
                    definition.allOf.push({ $ref: `#/definitions/component` })
                }
            }
        }
        this.currentKind = ''
    }

    sortImplementations(): void {
        for (let kind in this.definitions) {
            this.currentKind = kind
            let definition = this.definitions[kind]
            if (this.isInterface(definition) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => a.title.localeCompare(b.title))
            }
        }
        this.currentKind = ''
    }

    // Add schema definitions and turn schema: or full definition URI into local reference
    addSchemaDefinitions(): void {
        const scheme = 'schema:'
        this.definitions = { ...this.metaSchema.definitions, ...this.definitions }
        for (let kind in this.definitions) {
            this.currentKind = kind
            walkJSON(this.definitions[kind], (val: any) => {
                if (typeof val === 'object' && val.$ref && (val.$ref.startsWith(scheme) || val.$ref.startsWith(this.metaSchemaId))) {
                    val.$ref = val.$ref.substring(val.$ref.indexOf('#'))
                }
                return false
            })
        }
        this.currentKind = ''
    }

    // Remove $schema and $id and make sure they are unique
    removeSchemaAndId(bundle: any): void {
        walkJSON(bundle, (val: any, obj?: any, key?: string) => {
            if (key) {
                if (val.$schema && typeof val.$schema === 'string') delete val.$schema
                if (val.$id) delete val.$id
            }
            return false
        })
    }

    verifySchema(schema: any): void {
        // TODO: Remove this
        return
        // Ensure everyone has a $kind and minimum property definitions
        for (let entry of schema.oneOf) {
            this.currentKind = entry.$ref.substring(entry.$ref.lastIndexOf('/') + 1)
            let definition = schema.definitions[this.currentKind]
            let propName: string
            let expand = (val: any) => {
                if (val.$ref) {
                    let ref = ptr.get(schema, val.$ref)
                    for (let prop in ref) {
                        if (!val.hasOwnProperty(prop)) {
                            val[prop] = ref[prop]
                        }
                    }
                    delete val.$ref
                }
            }
            let verifyProperty = (val: any) => {
                if (!val.title) {
                    this.mergingError(`${propName} has no title.`)
                }
                if (!val.description) {
                    this.mergingError(`${propName} has no description.`)
                }
                if (val.$kind) {
                    let ref = ptr.get(schema, val.$ref)
                    if (val.$role === 'interface' && val.oneOf.length == 0) {
                        this.mergingError(`${propName} has no implementations of ${val.$kind}.`)
                    }
                } else {
                    expand(val)
                }
            }
            walkJSON(definition, (val: any) => {
                let basePropName = propName
                if (val.properties) {
                    for (propName in val.properties) {
                        verifyProperty(val.properties[propName])
                    }
                }
                if (val.items) {
                    if (Array.isArray(val.items)) {
                        for (let idx in val.items) {
                            propName = `${basePropName}/items/${idx}`
                            verifyProperty(val.items[idx])
                        }
                    } else {
                        propName = `${basePropName}/items`
                        verifyProperty(val.items)
                    }

                }
                if (val.oneOf) {
                    for (let idx in val.oneOf) {
                        propName = `${basePropName}/oneOf/${idx}`
                        verifyProperty(val.oneOf[idx])
                    }
                }
                if (val.anyOf) {
                    for (let idx in val.anyOf) {
                        propName = `${basePropName}/oneOf/${idx}`
                        verifyProperty(val.oneOf[idx])
                    }
                }
                propName = basePropName
                return false
            })
        }
    }

    // Check to see if a kind is an interface.
    isInterface(kind: string): boolean {
        return this.interfaces.includes(kind)
    }

    missing(kind: string): void {
        if (!this.missingKinds.has(kind)) {
            this.error(`${this.currentFile}: Missing ${kind} schema file from merge.`)
            this.missingKinds.add(kind)
            this.failed = true
        }
    }

    // Error in schema validity
    schemaError(err: Validator.ErrorObject): void {
        this.error(`${this.currentFile}: ${err.dataPath} error: ${err.message}`)
        this.failed = true
    }

    // Error while parsing component schemas
    parsingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        let posMatch = /position\s+([0-9]+)/.exec(msg)
        if (posMatch) {
            let file = fs.readFileSync(this.currentFile, 'utf8')
            let pos = Number(posMatch[1])
            msg += os.EOL + file.substring(pos - 40, pos) + '^^^' + file.substring(pos, pos + 40)
        }
        this.error(`${this.currentFile}: ${msg}`)
        this.failed = true
    }

    // Error while merging schemas
    mergingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        if (this.currentKind) {
            this.error(`${this.currentKind}: ${msg}`)
        } else {
            this.error(msg)
        }
        this.failed = true
    }
}