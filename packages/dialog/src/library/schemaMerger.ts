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
import * as nuget from '@snyk/nuget-semver'
import * as xp from 'xml2js'
let allof: any = require('json-schema-merge-allof')
let clone: any = require('clone')
let getUri: any = require('get-uri')
let ptr = require('json-ptr')
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

// Build a tree of component (project or package) references in order to compute a topological sort.
class Component {
    // Name of component
    public name: string

    // Path to component
    public path: string

    // Parent components
    private readonly parents: Component[] = []

    // Child components
    private readonly children: Component[] = []

    // Minimum depth
    private minDepth = 10000

    // Position wrt siblings at minimum depth
    private position: number

    // Track if processed
    private processed = false

    constructor(path: string, position: number) {
        this.name = ppath.basename(path)
        this.path = path
        this.position = position
    }

    // Add a child component
    public addChild(component: Component): Component {
        component.parents.push(this)
        this.children.push(component)
        return component
    }

    public sort(): Component[] {
        this.setChildDepth(0, 0)
        let sort: Component[] = []
        let remaining: Component[] = [this]
        while (remaining.length > 0) {
            let minDepth = 1000
            let minPos = 1000
            let inext = -1
            for (let i = 0; i < remaining.length; ++i) {
                let component = remaining[i]
                if (component.allParentsProcessed()
                    && (component.minDepth < minDepth
                        || (component.minDepth === minDepth && component.position < minPos))) {
                    inext = i
                    minDepth = component.minDepth
                    minPos = component.position
                }
            }
            if (inext < 0) {
                throw new Error('Circular dependencies in packages')
            }
            let next = remaining.splice(inext, inext)[0]
            next.processed = true
            sort.push(next)
            for (let child of this.children) {
                remaining.push(child)
            }
        }
        return sort
    }

    private setChildDepth(depth: number, position: number) {
        if (depth < this.minDepth) {
            this.minDepth = depth
            this.position = position
        }
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].setChildDepth(depth + 1, i)
        }
    }

    // Test to see if all parents are processed
    private allParentsProcessed(): boolean {
        for (let parent of this.parents) {
            if (!parent.processed) {
                return false
            }
        }
        return true
    }
}

/**
 * This class will find and merge component .schema files into a validated custom schema.
 */
export default class SchemaMerger {
    // Input parameters
    private readonly patterns: string[]
    private readonly output: string
    private readonly verbose: boolean
    private readonly log: any
    private readonly warn: any
    private readonly error: any
    private readonly debug: boolean | undefined

    // Track projects and packags that have been processed
    private readonly projects = new Set()
    private readonly packages = new Set()

    // Root where nuget packages are found
    private nugetRoot = ''

    // Map from root project directory to dependent ComposerAsset patterns
    private readonly content = new Map<string, string[]>()
    private currentContent: string[] | undefined

    // Validator for checking schema
    private readonly validator = new Validator()

    // $schema that defines allowed component .schema
    private metaSchemaId = ''
    private metaSchema: any

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
    private readonly jsonOptions = { spaces: '  ', EOL: os.EOL }

    /**
     * Merger to combine copmonent .schema files to make a custom schema.
     * @param patterns Glob patterns for the .schema files to combine.
     * @param output The output file to create.
     * @param verbose True to show files as processed.
     * @param log Logger for informational messages.
     * @param warn Logger for warning messages.
     * @param error Logger for error messages.
     * @param debug Generate debug output.
     * @param nugetRoot Root directory for nuget packages.  (Useful for testing.)
     */
    public constructor(patterns: string[], output: string, verbose: boolean, log: any, warn: any, error: any, debug?: boolean, nugetRoot?: string) {
        this.patterns = patterns
        this.output = output
        this.verbose = verbose
        this.log = log
        this.warn = warn
        this.error = error
        this.debug = debug
        this.nugetRoot = nugetRoot || ''
    }

    /** 
     * Merge component schemas together into a single self-contained files.
     * $role of implements(interface) hooks up defintion to interface.
     * $role of extends(kind) will extend the kind by picking up property related restrictions.
     * $kind for a property connects to another component.
     * schema:#/definitions/foo will refer to $schema#/definition/foo
     * Does extensive error checking and validation to ensure information is present and consistent.
     * Returns true if successfull.
     */
    async mergeSchemas(): Promise<boolean> {
        try {
            let root = new Component('c:/foo/root.woof', 0)
            let a = root.addChild(new Component('c:/foo/a.woof', 0))
            let b = root.addChild(new Component('c:/foo/b.woof', 1))
            a.addChild(new Component('c:/foo/c.woof', 0))
            a.addChild(new Component('c:/foo/d.woof', 1))
            b.addChild(new Component('c:/foo/e.woof', 0))
            let sort = root.sort()
            console.log(sort)

            let componentPaths: any[] = []

            // Delete existing output
            await fs.remove(this.output)
            await fs.remove(this.output + '.final')
            await fs.remove(this.output + '.expanded')

            this.log(`Finding component .schema files in${os.EOL}  ${this.patterns.join(os.EOL + '  ')}`)
            for await (const path of this.expandPackages(await glob(this.patterns))) {
                componentPaths.push(path)
            }

            if (componentPaths.length === 0) {
                return false
            }
            this.log('Parsing component .schema files')
            for (let componentPath of componentPaths) {
                try {
                    this.currentFile = componentPath
                    if (this.verbose) {
                        this.log(`Parsing ${componentPath}`)
                    }
                    let component = await fs.readJSON(componentPath)
                    if (component.definitions && component.definitions.component) {
                        this.parsingWarning('Skipping merged schema')
                    } else {
                        this.relativeToAbsoluteRefs(component, componentPath)

                        // Pick up meta-schema from first .dialog file
                        if (!this.metaSchema) {
                            this.metaSchemaId = component.$schema
                            this.currentFile = this.metaSchemaId
                            this.metaSchema = await getJSON(component.$schema)
                            this.validator.addSchema(this.metaSchema, 'componentSchema')
                            if (this.verbose) {
                                this.log(`  Using ${this.metaSchemaId} to define components`)
                            }
                            this.currentFile = componentPath
                            this.validateSchema(component)
                        } else if (component.$schema !== this.metaSchemaId) {
                            this.parsingWarning(`Component schema ${component.$schema} does not match ${this.metaSchemaId}`)
                        } else {
                            this.validateSchema(component)
                        }
                        delete component.$schema

                        let filename = ppath.basename(componentPath)
                        let kind = filename.substring(0, filename.lastIndexOf('.'))
                        let fullPath = ppath.resolve(componentPath)
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
                let finalSchema: any = {
                    $schema: this.metaSchemaId,
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
                finalSchema = await parser.bundle(finalSchema as parser.JSONSchema, this.schemaProtocolResolver())
                finalSchema = this.expandAllOf(finalSchema)
                this.removeId(finalSchema)
                if (this.debug) {
                    await fs.writeJSON(this.output + '.expanded', finalSchema, this.jsonOptions)
                }

                // Final verification
                this.verifySchema(finalSchema)
                if (!this.failed) {
                    // Verify all refs work
                    let start = process.hrtime()
                    await parser.dereference(clone(finalSchema))
                    let end = process.hrtime(start)[1] / 1000000000
                    if (this.verbose) {
                        this.log(`Expanding all $ref took ${end} seconds`)
                    }

                    this.log(`Writing ${this.output}`)
                    await fs.writeJSON(this.output, finalSchema, this.jsonOptions)
                }
            }
            if (this.failed) {
                this.error('*** Could not merge component schemas ***')
            }
        } catch (e) {
            this.mergingError(e)
        }
        return !this.failed
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
        walkJSON(schema, val => {
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
        let reader = _file => {
            return JSON.stringify(this.metaSchema)
        }
        return {
            resolve: {
                defintion: {
                    order: 1,
                    canRead: /^schema:/i,
                    read(file: parser.FileInfo, _callback: any, _$refs: any) {
                        return reader(file)
                    }
                }
            }
        }
    }

    // Convert to the right kind of slash. 
    // ppath.normalize did not do this properly on the mac.
    normalize(path: string): string {
        if (ppath.sep === '/') {
            path = path.replace(/\\/g, ppath.sep)
        } else {
            path = path.replace(/\//g, ppath.sep)
        }
        return ppath.normalize(path)
    }

    // Expand nuget package and all of its dependencies
    async expandNuget(packageName: string, minVersion: string, root: boolean): Promise<string[]> {
        let packages: string[] = []
        let pkgPath = ppath.join(this.nugetRoot, packageName)
        if (!this.projects.has(pkgPath) && !packageName.startsWith('System')) {
            let oldFile = this.currentFile
            try {
                this.currentFile = pkgPath
                this.projects.add(pkgPath)
                let versions: string[] = []
                if (await fs.pathExists(pkgPath)) {
                    for (let pkgVersion of await fs.readdir(pkgPath)) {
                        versions.push(pkgVersion.toLowerCase())
                    }
                    minVersion = minVersion || '0.0.0'
                    // NOTE: The semver package does not handle more complex nuget range revisions
                    // We get an exception and will ignore those dependencies.
                    let version = nuget.minSatisfying(versions, minVersion)
                    pkgPath = this.normalize(ppath.join(pkgPath, version || ''))
                    this.currentFile = pkgPath
                    packages.push(pkgPath)
                    if (this.verbose) {
                        this.log(`  Following nuget ${this.prettyPath(pkgPath)}`)
                    }
                    let nuspecPath = ppath.join(pkgPath, `${packageName}.nuspec`)
                    if (await fs.pathExists(nuspecPath)) {
                        let nuspec = await this.xmlToJSON(nuspecPath)
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
                                                break
                                            }
                                        }
                                    }
                                }
                                return true
                            }
                            return false
                        })
                        for (let dependent of dependencies) {
                            let dependentPackages = await this.expandNuget(dependent.id, dependent.version, false)
                            packages = [...packages, ...dependentPackages]
                        }
                    }
                } else if (root) {
                    this.parsingError('  Nuget package does not exist')
                }
            } catch (e) {
                this.parsingWarning(e.message)
            } finally {
                this.currentFile = oldFile
            }
        }
        return packages
    }

    // Expand .csproj packages, nugets and projects
    async expandCSProj(path: string): Promise<string[]> {
        let references: string[] = []
        if (!this.projects[path]) {
            this.projects[path] = true
            this.currentFile = this.prettyPath(path)
            if (this.verbose) {
                this.log(`  Following ${this.currentFile}`)
            }
            references.push(this.normalize(ppath.join(ppath.dirname(path), '/**/*.schema')))
            let json = await this.xmlToJSON(path)
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
                for (let pkg of nugetPackages) {
                    let nugetReferences = await this.expandNuget(pkg.Include, pkg.Version, true)
                    for (let nuget of nugetReferences) {
                        references.push(this.normalize(ppath.join(nuget, '**/*.schema')))
                    }
                }
            }
            let projects: string[] = []
            walkJSON(json, elt => {
                if (elt.ProjectReference) {
                    for (let ref of elt.ProjectReference) {
                        let projectPath = this.normalize(ppath.join(ppath.dirname(path), ref.$.Include))
                        projects.push(projectPath)
                    }
                    return true
                }
                return false
            })
            for (let project of projects) {
                references = [...references, ...await this.expandCSProj(project)]
            }
        }
        return references
    }

    async walkPackageJson(packagePath: string, basePath: string, visitor: (path: string) => void): Promise<boolean> {
        let found = this.packages.has(packagePath)
        let fullPath = ppath.join(packagePath, 'package.json')
        if (!found && await fs.pathExists(fullPath)) {
            this.projects.add(packagePath)
            found = true
            let pkg = await fs.readJSON(fullPath)
            visitor(packagePath)
            if (pkg.dependencies) {
                for (let dependent of Object.keys(pkg.dependencies)) {
                    let rootDir = basePath
                    while (rootDir) {
                        let dependentPath = ppath.join(rootDir, 'node_modules', dependent)
                        if (await this.walkPackageJson(dependentPath, basePath, visitor)) {
                            break;
                        } else {
                            rootDir = ppath.dirname(rootDir)
                        }
                    }
                }
            }
        }
        return found
    }

    async expandPackageJson(path: string): Promise<string[]> {
        let references: string[] = []
        let basePath = ppath.resolve(ppath.dirname(path))
        await this.walkPackageJson(basePath, basePath,
            async path => {
                if (this.verbose) {
                    this.log(`  Following ${this.prettyPath(ppath.join(path, 'package.json'))}`)
                }
                references.push(this.normalize(ppath.join(path, '**/*.schema')))
                // Negative pattern to exclude node_modules
                references.push(`!${this.normalize(ppath.join(path, 'node_modules/**/*.schema'))}`)

                // Track content
                this.currentContent?.push(this.normalize(ppath.join(path, '/ComposerAssets/**/*')))
            })
        return references
    }

    // Add the package to content and setup the root
    setContentRoot(path: string): string {
        let root = ppath.resolve(path)
        if (!this.packages.has(root)) {
            this.currentContent = []
            this.content.set(root, this.currentContent)
        }
        return root
    }

    // While we collect schema build the tree of project to dependencies
    // Once we have the tree we generate the topological sort where when popping nodes with no parents we prefer by minimal depth and then by sibling order.
    // We also build a map from asset names to the places where that asset is found.
    // We can scan that map and identify:
    // 1) Assets that override other assets--this is informative.
    // 2) When multiple independent paths override the same child asset.  This implies they should be merged since one of them will be preferred.
    // 3) When multiple independent paths have the same asset.  This implies something should be renamed.

    // Expand package.json, package.config or *.csproj to look for .schema below referenced packages.
    async * expandPackages(paths: string[]): AsyncIterable<string> {
        for (let path of paths) {
            if (path.endsWith('.schema')) {
                yield this.prettyPath(path)
            } else {
                let references: string[] = []
                let name = ppath.basename(path)
                if (name.endsWith('.csproj')) {
                    references.push(...await this.expandCSProj(this.setContentRoot(path)))
                } else {
                    if (name === 'packages.config') {
                        if (this.verbose) {
                            this.log(`  Following ${this.prettyPath(path)}`)
                        }
                        let json = await this.xmlToJSON(path)
                        let packages = await this.findParentDirectory(ppath.dirname(path), 'packages')
                        if (packages) {
                            this.setContentRoot(path)
                            // TODO: I don't think this is right.  We need to call expandNugetPackages.x
                            walkJSON(json, elt => {
                                if (elt.package) {
                                    for (let info of elt.package) {
                                        let id = `${info.$.id}.${info.$.version}`
                                        references.push(ppath.join(packages, `${id}/**/*.schema`))

                                    }
                                    return true
                                }
                                return false
                            })
                        }
                    } else if (name === 'package.json') {
                        let children = await this.expandPackageJson(this.setContentRoot(path))
                        references = [...references, ...children]
                    } else {
                        throw new Error(`Unknown package type ${path}`)
                    }
                }
                this.currentContent = undefined
                references = references.map(ref => ref.replace(/\\/g, '/'))
                for (let expandedRef of await glob(references)) {
                    yield this.prettyPath(expandedRef)
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
    async findGlobalNuget(): Promise<void> {
        if (!this.nugetRoot) {
            this.nugetRoot = ''
            try {
                const { stdout } = await exec('dotnet nuget locals global-packages --list')
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

    // Copy content

    /**
     * Merge extension into definition.
     * @param extensionName Name of definition to merge in.
     * @param definition Definition that will be changed
     * @param canOverride True if definition can override extension.
     */
    mergeInto(extensionName: string, definition: any, canOverride?: boolean) {
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
                    definition.patternPropties = { ...definition.patternProperties, ...extension.patternProperties }
                } else {
                    definition.patternProperties = clone(extension.patternProperties)
                }
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
            if (extension && !extension.$processed) {
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
    processImplementations(): void {
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
    fixComponentReferences(kind: string, definition: any): void {
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

    // Expand $kind into $ref: #/defintions/kind
    expandKinds(): void {
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
    expandInterfaces(): void {
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
            walkJSON(this.definitions[this.currentKind], val => {
                if (typeof val === 'object' && val.$ref && (val.$ref.startsWith(scheme) || val.$ref.startsWith(this.metaSchemaId))) {
                    val.$ref = val.$ref.substring(val.$ref.indexOf('#'))
                }
                return false
            })
        }
    }

    // Expand $ref below allOf and remove allOf
    expandAllOf(bundle: any): any {
        walkJSON(bundle, val => {
            if (val.allOf && Array.isArray(val.allOf)) {
                for (let child of val.allOf) {
                    if (child.$ref) {
                        let ref = ptr.get(bundle, child.$ref)
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
    removeId(bundle: any) {
        walkJSON(bundle, val => {
            if (val.$id) {
                delete val.$id
            }
            return false
        })
    }

    // Verify schema has title/description everywhere and interfaces exist.
    verifySchema(schema: any): void {
        this.log('Verifying schema')
        this.validateSchema(schema)
        for (let entry of schema.oneOf) {
            this.currentKind = entry.$ref.substring(entry.$ref.lastIndexOf('/') + 1)
            let definition = schema.definitions[this.currentKind]
            let verifyProperty = (val, path) => {
                if (!val.$schema) {
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
                    if (!val.title) {
                        this.mergingWarning(`${path} has no title`)
                    }
                    if (!val.description) {
                        this.mergingWarning(`${path} has no description`)
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
    }

    // Check to see if a kind is an interface.
    isInterface(kind: string): boolean {
        return this.interfaces.includes(kind)
    }

    // Report missing component.
    missing(kind: string): void {
        if (!this.missingKinds.has(kind)) {
            this.error(`${this.currentKind}: Missing ${kind} schema file from merge`)
            this.missingKinds.add(kind)
            this.failed = true
        }
    }

    // Error in schema validity
    schemaError(err: Validator.ErrorObject): void {
        this.error(`${this.currentFile}: ${err.dataPath} error: ${err.message}`)
        this.failed = true
    }

    parsingWarning(msg: string): void {
        this.warn(`Warning ${this.currentFile}: ${msg}`)
    }

    // Error while parsing component schemas
    parsingError(err: Error | string): void {
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
    mergingWarning(msg: string): void {
        if (this.currentKind) {
            this.warn(`Warning ${this.currentKind}: ${msg}`)
        } else {
            this.warn(`Warning ${msg}`)
        }
    }

    // Error while merging schemas
    mergingError(err: Error | string): void {
        let msg = typeof err === 'string' ? err : err.message
        if (this.currentKind) {
            this.error(`Error ${this.currentKind}: ${msg}`)
        } else {
            this.error(`Error ${msg}`)
        }
        this.failed = true
    }
}
