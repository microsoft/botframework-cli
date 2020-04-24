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
// TODO: Are we using this?
let fileUtils: any = require('@apidevtools/json-schema-ref-parser/lib/util/url')
let getUri: any = require('get-uri')
let util: any = require('util')
let exec: any = util.promisify(require('child_process').exec)

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
    private metaSchemaId = ''
    private metaSchema: any
    private definitions: any = {}
    private expanded: any = {} // Expanded versions for analysis
    private interfaces: string[] = []
    private implementations: any = {}
    private rootURI = ''
    private failed = false
    private missingKinds = new Set()
    private currentFile = ''
    private readonly jsonOptions = { spaces: 4, EOL: os.EOL }

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
            let schemaPaths: any[] = []

            // delete output so we don't attempt to process it
            if (fs.existsSync(this.output)) {
                fs.unlinkSync(this.output)
            }

            this.log(`Finding component .schema files in ${this.patterns.join(', ')}`)
            for await (const path of this.expandPackages(await glob(this.patterns))) {
                schemaPaths.push(path)
            }

            if (schemaPaths.length === 0) {
                return false
            } else {
                let validator = new Validator()

                this.log('Parsing component .schema files')
                for (let schemaPath of schemaPaths) {
                    try {
                        this.currentFile = schemaPath
                        if (this.verbose) {
                            this.log(`Parsing ${schemaPath}`)
                        }
                        let schema = await fs.readJSON(schemaPath)
                        if (schema.$id) {
                            this.error(`${this.currentFile}: warning: Skipping because of top-level $id: ${schema.$id}.`)
                        } else {
                            // Convert relative file references to absolute so that when derefenced for the whole schema they are found
                            this.relativeToAbsoluteRefs(schema, schemaPath)

                            // Pick up meta-schema from first .dialog file
                            if (!this.metaSchema) {
                                this.metaSchemaId = schema.$schema
                                this.metaSchema = await this.getJSON(schema.$schema)
                                validator.addSchema(this.metaSchema, 'componentSchema')
                                this.rootURI = ppath.dirname(schema.$schema)
                                if (this.verbose) {
                                    this.log(`  Using component.schema ${this.metaSchemaId}`)
                                }
                            } else if (schema.$schema !== this.metaSchemaId) {
                                this.error(`${this.currentFile}: error:${this.currentFile}: ${schema.$schema} does not match component.schema ${this.metaSchemaId}`)
                            }
                            if (!validator.validate('componentSchema', schema)) {
                                for (let error of validator.errors as Validator.ErrorObject[]) {
                                    this.schemaError(error)
                                }
                            }
                            let filename = schemaPath.split(/[\\\/]/).pop() as string
                            let kind = filename.substr(0, filename.lastIndexOf('.'))
                            this.expandDefinition(schema)
                            this.definitions[kind] = schema
                            let noref = await parser.dereference(clone(schema), this.definitionResolver())
                            this.expanded[kind] = allof(noref)
                        }
                    } catch (e) {
                        this.parsingError(e)
                    }
                }

                this.log('Merging schemas')
                this.removeSchemas()
                this.processRoles()
                this.fixWithinComponentReferences()
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

                let finalDefinitions: any = {}
                for (let key of Object.keys(this.definitions).sort()) {
                    finalDefinitions[key] = this.definitions[key]
                }
                let finalSchema = {
                    type: 'object',
                    title: 'Component kinds',
                    description: 'These are all of the kinds that can be created by the loader.',
                    oneOf,
                    definitions: finalDefinitions
                }
                if (this.debug) {
                    await fs.writeJSON(this.output + '.final', finalSchema, this.jsonOptions)
                }

                // Convert all references to local ones
                let bundle = await parser.bundle(finalSchema as any, this.definitionResolver())
                bundle = this.addTopLevelProperties(bundle)

                if (!this.failed) {
                    this.log(`Writing ${this.output}`)
                    await fs.writeJSON(this.output, bundle, this.jsonOptions)
                    if (this.debug) {
                        await fs.writeJSON(this.output + '.expanded', allof(bundle), this.jsonOptions);
                    }
                } else {
                    this.error(`${this.currentFile}: Could not merge schemas`)
                }
            }
        } catch (e) {
            this.mergingError(e)
        }
        return true
    }

    toAbsoluteRef(ref: string, base: string): string {
        if (ref.startsWith('.')) {
            ref = `file:///${ppath.resolve(ppath.dirname(base), ref).replace(/\\/g, '/')}`
        }
        return ref
    }

    relativeToAbsoluteRefs(schema: object, path: string) {
        this.walkJSON(schema, (val, obj, key) => {
            if (val.$ref) {
                val.$ref = this.toAbsoluteRef(val.$ref, path)
            } else if (val.$schema) {
                val.$schema = this.toAbsoluteRef(val.$schema, path)
            }
            return false
        })
    }

    definitionResolver(): any {
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
                        this.walkJSON(json, elt => {
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
                        this.walkJSON(json, elt => {
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

    prettyPath(path: string): string {
        let newPath = ppath.relative(process.cwd(), path)
        if (newPath.startsWith('..')) {
            newPath = path
        }
        return newPath
    }

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

    removeSchemas() {
        this.walkJSON(this.definitions, (val) => {
            if (val.$schema) delete val.$schema
            return false
        })
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
                this.walkJSON(schema, (val: any, _obj, key) => {
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
    fixWithinComponentReferences(): void {
        for (let kind in this.definitions) {
            this.walkJSON(this.definitions[kind], (val: any) => {
                if (val.$ref && typeof val.$ref === 'string') {
                    let ref: string = val.$ref
                    if (ref.startsWith('#/definitions/')) {
                        val.$ref = '#/definitions/' + kind + '/definitions' + ref.substr(ref.indexOf('/'))
                    }
                }
                return false
            })
        }
    }

    // Expand $kind into $ref: #/defintions/kind
    expandKinds(): void {
        this.walkJSON(this.definitions, val => {
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

    // Expand interface definitions to include all implementations
    expandInterfaces(): void {
        for (let interfaceName of this.interfaces) {
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
                let definition = this.definitions[implementation]
                interfaceDefinition.oneOf.push({
                    $ref: `#/definitions/${implementation}`
                })
            }
        }
    }

    // Include standard component properties
    addComponentProperties(): void {
        for (let kind of Object.keys(this.definitions)) {
            if (!this.isInterface(kind)) {
                let definition = this.definitions[kind]

                // Add $kind and $copy to required
                let required = definition.required
                if (required) {
                    required.push('$kind')
                } else {
                    required = ['$kind']
                }
                delete definition.required
                definition.anyOf = [
                    {
                        title: 'Reference',
                        required: ['$copy']
                    },
                    {
                        title: 'Type',
                        required
                    }
                ]

                // Define $kind restriction
                // NOTE: This must be pushed into the full definition because otherwise 
                // the const doesn't end up forcing the rest of the schema.
                let kindDef = { ...this.metaSchema.definitions.kind, const: `${kind}` }
                let found = false
                this.walkJSON(definition, (val) => {
                    if (val.properties) {
                        val.properties.$kind = kindDef
                        found = true
                        return true
                    }
                    return false
                })
                if (!found) {
                    definition.properties = { $kind: kindDef }
                }

                // Ensure we always allow some extra properties
                if (!definition.patternProperties) {
                    definition.patternProperties = {}
                }
                definition.patternProperties = { ...definition.patternProperties, ...this.metaSchema.definitions.patternProperties }

                // Enforce allOF on component schema
                if (!definition.allOf) {
                    definition.allOf = []
                }
                definition.allOf.push({ $ref: `#/definitions/component` })
            }
        }
    }

    sortImplementations(): void {
        for (let key in this.definitions) {
            let definition = this.definitions[key]
            if (this.isInterface(definition) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => a.title.localeCompare(b.title))
            }
        }
    }

    // Turn definition: into full URI
    expandDefinition(definition: any): void {
        const scheme = 'definition:'
        this.walkJSON(definition, (val: any) => {
            if (val.$ref && val.$ref.startsWith(scheme)) {
                val.$ref = `${this.metaSchemaId}#/definitions/${val.$ref.substring(scheme.length)}`
            }
            return false
        })
    }

    // Turn full definition URI into local reference
    addSchemaDefinitions(): void {
        this.definitions = { ...this.metaSchema.definitions, ...this.definitions }
        this.walkJSON(this.definitions, (val: any) => {
            if (val.$ref && val.$ref.startsWith(this.metaSchemaId)) {
                val.$ref = val.$ref.substring(this.metaSchemaId.length)
            }
            return false
        })
    }

    addTopLevelProperties(bundle: any): any {
        // Remove top-level properties
        this.walkJSON(bundle, (val: any, obj?: any, key?: string) => {
            if (val.$schema) delete val.$schema
            if (val.$id) delete val.$id
            return false
        })

        return {
            $schema: this.metaSchemaId,
            $id: ppath.resolve(this.output),
            ...bundle
        }
    }

    walkJSON(elt: any, fun: (val: any, obj?: any, key?: string) => boolean, obj?: any, key?: any): boolean {
        let done = fun(elt, obj, key)
        if (!done) {
            if (typeof elt === 'object' || Array.isArray(elt)) {
                for (let key in elt) {
                    done = this.walkJSON(elt[key], fun, elt, key)
                    if (done) break
                }
            }
        }
        return done
    }

    async getJSON(uri: string): Promise<any> {
        let stream = await getUri(uri)
        let data = ''
        for await (let chunk of stream) {
            data += chunk.toString()
        }
        return JSON.parse(data)
    }

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

    schemaError(err: Validator.ErrorObject): void {
        this.error(`${this.currentFile}: ${err.dataPath} error: ${err.message}`)
        this.failed = true
    }

    parsingError(err: Error): void {
        let posMatch = /position\s+([0-9]+)/.exec(err.message)
        if (posMatch) {
            let file = fs.readFileSync(this.currentFile, 'utf8')
            let pos = Number(posMatch[1])
            err.message += os.EOL + file.substring(pos - 40, pos) + '^^^' + file.substring(pos, pos + 40)
        }
        this.error(`${this.currentFile}: ${err.message}`)
        this.failed = true
    }

    mergingError(err: Error): void {
        this.error(err.message)
        this.failed = true
    }
}