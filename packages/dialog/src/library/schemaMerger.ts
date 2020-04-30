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
let clone: any = require('clone')
let getUri: any = require('get-uri')
let ptr = require('json-ptr')
let util: any = require('util')
let exec: any = util.promisify(require('child_process').exec)

// Walk over JSON object, stopping if true from walker.
// Walker gets the current value, the parent object and full path to that object.
function walkJSON(elt: any, fun: (val: any, obj?: any, path?: string) => boolean, obj?: any, path?: any): boolean {
    let done = fun(elt, obj, path)
    if (!done) {
        if (typeof elt === 'object' || Array.isArray(elt)) {
            for (let key in elt) {
                done = walkJSON(elt[key], fun, elt, pathName(path, key))
                if (done) break
            }
        }
    }
    return done
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

    /** Merge component schemas together into a single self-contained files.
     * $role of implements(interface) hooks up defintion to interface.
     * $role of extends(kind) will extend the kind by picking up property related restrictions.
     * $kind for a property connects to another component.
     * schema:#/definitions/foo will refer to $schema#/definition/foo
     * Does extensive error checking and validation to ensure information is present and consistent.
     */
    async mergeSchemas(): Promise<boolean> {
        try {
            let componentPaths: any[] = []

            // delete output so we don't attempt to process it
            if (fs.existsSync(this.output)) {
                fs.unlinkSync(this.output)
            }

            this.log(`Finding component .schema files in${os.EOL}  ${this.patterns.join(os.EOL + '  ')}`)
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
                                    this.log(`  Using ${this.metaSchemaId} to define components.`)
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
                            this.fixComponentReferences(kind, component)
                            if (component.allOf) {
                                this.parsingError(`Does not support allOf in component .schema definitions`)
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
                        return { $ref: `#/definitions/${kind}` }
                    })
                this.addSchemaDefinitions()

                if (!this.failed) {
                    this.currentFile = this.output
                    this.currentKind = ''
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

                    // Final verification
                    this.verifySchema(finalSchema)
                    if (!this.failed) {
                        this.log(`Writing ${this.output}`)
                        await fs.writeJSON(this.output, finalSchema, this.jsonOptions)
                        if (this.debug) {
                            let start = process.hrtime()
                            await parser.dereference(clone(finalSchema))
                            let [_, end] = process.hrtime(start)
                            end = end / 1000000000
                            this.log(`Expanding took ${end} seconds`)
                        }
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
        walkJSON(schema, (val) => {
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
                        walkJSON(json, (elt) => {
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
                            }  else if (elt.ProjectReference) {
                                int todo = 1
                            }
                            return done
                        })
                    }
                } else if (name === 'packages.config') {
                    let json = await this.xmlToJSON(path)
                    let packages = await this.findParentDirectory(ppath.dirname(path), 'packages')
                    if (packages) {
                        walkJSON(json, (elt) => {
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

    // Find the first parent directory that has dir
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

    /**
     * Merge extension into definition.
     * @param extensionName Name of definition to merge in.
     * @param definition Definition that will be changed
     * @param canOverride True if definition can override extension.
     */
    mergeInto(extensionName: string, definition: any, canOverride?: boolean) {
        let extension = this.definitions[extensionName] || this.metaSchema.definitions[extensionName]

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
                        this.mergingError(`Redefines property ${property} from ${extensionName}.`)
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
            definition.required = [...definition.required, ...extension.required]
        }

        // Merge property restrictions
        if (extension.hasOwnProperty('additionalProperties')) {
            if (definition.hasOwnProperty('additionalProperties')) {
                if (!canOverride) {
                    this.mergingError(`Redefines additionalProperties from ${extensionName}.`)
                }
            } else {
                definition.additionalProperties = extension.additionalProperties
            }
        }

        if (extension.patternProperties) {
            if (definition.patternProperties) {
                definition.patternPropties = { ...definition.patternProperties, ...extension.patternProperties }
            } else {
                definition.patternProperties = clone(extension.patternProperties)
            }
        }
    }

    // Return a list of references for a particular type of role
    roles(definition: any, type: string): string[] {
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
    processExtension(definition: any): void {
        let extensions = this.roles(definition, 'extends')
        for (let extensionName of extensions) {
            // Ensure base has been extended
            let extension = this.definitions[extensionName]
            if (!extension.$processed) {
                this.processExtension(extension)
            }

            this.mergeInto(extensionName, definition)
        }
        definition.$processed = true
    }

    // Add in any extension definitions
    processExtensions(): void {
        for (this.currentKind in this.definitions) {
            this.processExtension(this.definitions[this.currentKind])
        }
        // Remove processing informationx
        walkJSON(this.definitions, (val) => {
            if (val.$processed) {
                delete val.$processed
            }
            return false
        })
    }

    // Check $role validity and identify implementations and interfaces
    processImplementations(): void {
        for (this.currentKind in this.definitions) {
            let schema = this.definitions[this.currentKind]
            if (this.roles(this.definitions[this.currentKind], 'interface').length > 0) {
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
                        this.mergingError(`Interface ${interfaceName} is not defined.`)
                    } else if (!this.isInterface(interfaceName)) {
                        this.mergingError(`${interfaceName} is missing an interface $role.`)
                    } else {
                        if (!this.implementations[interfaceName]) {
                            this.implementations[interfaceName] = []
                        }
                        this.implementations[interfaceName].push(this.currentKind)
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
    }

    // Turn #/definitions/foo into #/definitions/${kind}/definitions/foo
    fixComponentReferences(kind: string, definition: any): void {
        walkJSON(definition, (val: any) => {
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

    // Expand $kind into $ref: #/defintions/kind
    expandKinds(): void {
        for (this.currentKind in this.definitions) {
            walkJSON(this.definitions[this.currentKind], (val) => {
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
                interfaceDefinition.oneOf.push({
                    $ref: `#/definitions/${implementation}`
                })
            }
        }
        this.currentKind = ''
    }

    // Include standard component properties from schema
    addComponentProperties(): void {
        for (this.currentKind in this.definitions) {
            if (!this.isInterface(this.currentKind)) {
                let definition = this.definitions[this.currentKind]
                this.mergeInto('component', definition, true)
                definition.properties.$kind.const = this.currentKind
            }
        }
    }

    sortImplementations(): void {
        for (this.currentKind in this.definitions) {
            let definition = this.definitions[this.currentKind]
            if (this.isInterface(definition) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => a.title.localeCompare(b.title))
            }
        }
    }

    // Add schema definitions and turn schema: or full definition URI into local reference
    addSchemaDefinitions(): void {
        const scheme = 'schema:'
        this.definitions = { ...this.metaSchema.definitions, ...this.definitions }
        for (this.currentKind in this.definitions) {
            walkJSON(this.definitions[this.currentKind], (val) => {
                if (typeof val === 'object' && val.$ref && (val.$ref.startsWith(scheme) || val.$ref.startsWith(this.metaSchemaId))) {
                    val.$ref = val.$ref.substring(val.$ref.indexOf('#'))
                }
                return false
            })
        }
    }

    // Remove $schema and $id and make sure they are unique
    removeSchemaAndId(bundle: any): void {
        walkJSON(bundle, (val, _obj, path) => {
            if (path) {
                if (val.$schema && typeof val.$schema === 'string') delete val.$schema
                if (val.$id) delete val.$id
            }
            return false
        })
    }

    // Verify schema has title/description everywhere and interfaces exist.
    verifySchema(schema: any): void {
        for (let entry of schema.oneOf) {
            this.currentKind = entry.$ref.substring(entry.$ref.lastIndexOf('/') + 1)
            let definition = schema.definitions[this.currentKind]
            let verifyProperty = (val, path) => {
                if (val.$ref) {
                    val = clone(val)
                    let ref = ptr.get(schema, val.$ref)
                    for (let prop in ref) {
                        if (!val[prop]) {
                            val[prop] = ref[prop]
                        }
                    }
                    delete val.$ref
                }
                if (val.$kind) {
                    let kind = schema.definitions[val.$kind]
                    if (this.roles(kind, 'interface').length > 0 && kind.oneOf.length == 0) {
                        this.mergingError(`${path} has no implementations of ${val.$kind}.`)
                    }
                }
                if (!val.title) {
                    this.mergingError(`${path} has no title.`)
                }
                if (!val.description) {
                    this.mergingError(`${path} has no description.`)
                }
            }
            walkJSON(definition, (val, _, path) => {
                if (val.properties && !path?.endsWith('properties')) {
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
    }

    // Check to see if a kind is an interface.
    isInterface(kind: string): boolean {
        return this.interfaces.includes(kind)
    }

    // Report missing component.
    missing(kind: string): void {
        if (!this.missingKinds.has(kind)) {
            this.error(`${this.currentKind}: Missing ${kind} schema file from merge.`)
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