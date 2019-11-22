/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command';
import * as Validator from 'ajv';
import * as fs from 'fs-extra';
import * as glob from 'globby';
import * as os from 'os';
import * as ppath from 'path';
import * as semver from 'semver';
import * as xp from 'xml2js';
let allof: any = require('json-schema-merge-allof')
let clone = require('clone')
let getJson = require('get-json')
let parser: any = require('json-schema-ref-parser')
let util: any = require('util')
let exec: any = util.promisify(require('child_process').exec)

export default class DialogMerge extends Command {

    static args = [
        { name: 'glob1', required: true },
        { name: 'glob2', required: false },
        { name: 'glob3', required: false },
        { name: 'glob4', required: false },
        { name: 'glob5', required: false },
        { name: 'glob6', required: false },
        { name: 'glob7', required: false },
        { name: 'glob8', required: false },
        { name: 'glob9', required: false },
    ]

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h' }),
        output: flags.string({ char: 'o', description: 'Output path and filename for merged schema. [default: app.schema]', default: 'app.schema', required: false }),
        branch: flags.string({ char: 'b', description: 'The branch to use for the meta-schema component.schema.', default: 'master', required: false }),
        update: flags.boolean({ char: 'u', description: 'Update .schema files to point the <branch> component.schema and regenerate component.schema if baseComponent.schema is present.', default: false, required: false }),
        verbose: flags.boolean({ description: 'output verbose logging of files as they are processed', default: false }),
    }

    private verbose? = false
    private failed = false
    private missingTypes = new Set()
    private currentFile = ''
    private readonly jsonOptions = { spaces: 4, EOL: os.EOL }

    async run() {
        const { argv, flags } = this.parse(DialogMerge)

        await this.mergeSchemas(argv, flags.output, flags.branch, flags.update, flags.verbose)
    }

    /**
     * Merge together .schema files to make a custom schema.
     * @param patterns Glob patterns for the .schema files to combine.
     * @param output The output file to create.  app.schema by default.
     * @param branch Branch to use for where to find component.schema.
     * @param update True to update .schema files to point to branch component.schema files.
     */
    async mergeSchemas(patterns: string[], output?: string, branch?: string, update?: boolean, verbose?: boolean): Promise<boolean> {
        this.verbose = verbose
        this.failed = false
        this.missingTypes = new Set()
        try {
            let schemaPaths = []
            if (update) {
                if (!branch) {
                    this.error(`${this.currentFile}: error: Must specify -branch <branch> in order to use -update`)
                    return false
                }
                await this.updateMetaSchema(branch)
                if (verbose) {
                    this.log(`Updating component.schema references to branch ${branch}`)
                }
            }

            if (!output) {
                output = 'app.schema'
            }

            // delete output so we don't attempt to process it
            if (fs.existsSync(output)) {
                fs.unlinkSync(output)
            }

            for await (const path of this.expandPackages(await glob(patterns))) {
                schemaPaths.push(path)
            }

            if (schemaPaths.length === 0) {
                return false
            } else {
                let metaSchema: any
                let definitions: any = {}
                let validator = new Validator()

                if (!metaSchema && branch) {
                    // Find branch specific schema
                    let path = `https://raw.githubusercontent.com/Microsoft/botbuilder-dotnet/${branch}/schemas/component.schema`
                    metaSchema = await getJson(path)
                }

                if (metaSchema) {
                    validator.addSchema(metaSchema, 'componentSchema')
                }

                for (let schemaPath of schemaPaths) {
                    this.currentFile = schemaPath
                    if (verbose) {
                        this.log(`Parsing ${schemaPath}`)
                    }
                    if (update) {
                        let schema = await fs.readJSON(schemaPath)
                        if (!schema.$id) {
                            schema.$schema = schema.$schema.replace(/botbuilder-dotnet\/[^/]*\//, `botbuilder-dotnet/${branch}/`)
                            await fs.writeJSON(schemaPath, schema, this.jsonOptions)
                        }
                    }
                    let noref = await parser.dereference(schemaPath)
                    if (noref.$id) {
                        this.error(`${this.currentFile}: warning: Skipping because of top-level $id:${noref.$id}.`)
                    } else {
                        let schema = allof(noref)
                        // Pick up meta-schema from first .dialog file
                        if (!metaSchema) {
                            metaSchema = JSON.parse(await this.getURL(schema.$schema))
                            validator.addSchema(metaSchema, 'componentSchema')
                            if (verbose) {
                                this.log(`  Using component.schema ${metaSchema.$id}`)
                            }
                        } else if (schema.$schema !== metaSchema.$id) {
                            this.error(`${this.currentFile}: error:${this.currentFile}: error:${schema.$schema} does not match component.schema ${metaSchema.$id}`)
                        }
                        delete schema.$schema
                        if (!validator.validate('componentSchema', schema)) {
                            for (let error of validator.errors as Validator.ErrorObject[]) {
                                this.schemaError(error)
                            }
                        }
                        let filename = schemaPath.split(/[\\\/]/).pop() as string
                        let type = filename.substr(0, filename.lastIndexOf('.'))
                        if (!schema.type && !this.isUnionType(schema)) {
                            schema.type = 'object'
                        }
                        definitions[type] = schema
                    }
                }
                this.fixDefinitionReferences(definitions)
                this.processRoles(definitions, metaSchema)
                this.addTypeTitles(definitions)
                this.expandTypes(definitions)
                this.addStandardProperties(definitions, metaSchema)
                this.sortUnions(definitions)
                let finalDefinitions: any = {}
                for (let key of Object.keys(definitions).sort()) {
                    finalDefinitions[key] = definitions[key]
                }
                let finalSchema = {
                    $schema: metaSchema.$id,
                    $id: ppath.basename(output),
                    type: 'object',
                    title: 'Component types',
                    description: 'These are all of the types that can be created by the loader.',
                    oneOf: Object.keys(definitions)
                        .filter(schemaName => !this.isUnionType(definitions[schemaName]))
                        .sort()
                        .map(schemaName => {
                            return {
                                title: schemaName,
                                description: definitions[schemaName].description || '',
                                $ref: '#/definitions/' + schemaName
                            }
                        }),
                    definitions: finalDefinitions
                }

                if (!this.failed) {
                    this.log(`Writing ${output}`)
                    await fs.writeJSON(output, finalSchema, this.jsonOptions)
                } else {
                    this.error(`${this.currentFile}: error: Could not merge schemas`)
                }
            }
        } catch (e) {
            this.thrownError(e)
        }
        return true
    }

    // Expand package.json, package.config or *.csproj to look for .schema below referenced packages.
    async * expandPackages(paths: string[],): AsyncIterable<string> {
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
            this.error(`${this.currentFile}: warning: Cannot find global nuget packages so skipping .csproj\n${err}`)
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

    // Update component.schema to a specific branch version
    async updateMetaSchema(branch: string): Promise<void> {
        if (fs.existsSync('baseComponent.schema')) {
            if (this.verbose) {
                this.log(`Generating component.schema for branch ${branch}`)
            }
            let schema = await fs.readJSON('baseComponent.schema')
            let metaSchemaName = schema.$schema
            let metaSchemaDef = await this.getURL(metaSchemaName)
            let metaSchema = JSON.parse(metaSchemaDef)
            for (let prop in schema) {
                let propDef = schema[prop]
                if (typeof propDef === 'string') {
                    metaSchema[prop] = propDef
                } else {
                    for (let subProp in propDef) {
                        metaSchema[prop][subProp] = propDef[subProp]
                    }
                }
            }
            metaSchema.$id = metaSchema.$id.replace('{branch}', branch)
            metaSchema.$comment = `File generated by: "dialogSchema -u -b ${branch}.`
            await fs.writeJSON('component.schema', metaSchema, this.jsonOptions)
        }
    }

    processRoles(definitions: any, metaSchema: any): void {
        for (let type in definitions) {
            this.walkJSON(definitions[type], (val: any, _obj, key) => {
                if (val.$role) {
                    if (typeof val.$role === 'string') {
                        this.processRole(val.$role, val, type, definitions, metaSchema, key)
                    } else {
                        for (let role of val.$role) {
                            this.processRole(role, val, type, definitions, metaSchema, key)
                        }
                    }
                }
                return false
            })
        }
    }

    processRole(role: string, elt: any, type: string, definitions: any, metaSchema: any, key?: string): void {
        const prefix = 'unionType('
        if (role === 'expression' || role === 'lg' || role === 'memoryPath') {
            if (elt.type) {
                this.error(`${this.currentFile}:error: $role ${role} must not have a type.`)
            }
            for (let prop in metaSchema.definitions[role]) {
                if (!elt[prop]) {
                    elt[prop] = metaSchema.definitions[role][prop]
                }
            }
        } else if (role === 'unionType') {
            if (key) {
                this.error(`${this.currentFile}:error: unionType $role can only be defined at the top of the schema definition.`)
            }
        } else if (role.startsWith(prefix) && role.endsWith(')')) {
            let unionType = role.substring(prefix.length, role.length - 1)
            if (!definitions[unionType]) {
                this.error(`${this.currentFile}:error: union type ${unionType} is not defined.`)
            } else if (!this.isUnionType(definitions[unionType])) {
                this.error(`${this.currentFile}:error: is missing $role of unionType.`)
            } else {
                let definition = definitions[type]
                let unionDefinition = definitions[unionType]
                if (!unionDefinition.oneOf) {
                    unionDefinition.oneOf = []
                }
                unionDefinition.oneOf.push({
                    title: type,
                    description: definition.description || '',
                    $ref: `#/definitions/${type}`
                })
            }
        } else {
            this.error(`${this.currentFile}:error: Unknown $role`)
        }
    }

    addTypeTitles(definitions: any): void {
        this.walkJSON(definitions, val => {
            if (val.oneOf) {
                this.walkJSON(val.oneOf, def => {
                    if (def.type) {
                        // NOTE: This overrides any existing title but prevents namespace collision
                        def.title = def.type
                    }
                    return false
                })
            }
            return false
        })
    }

    fixDefinitionReferences(definitions: any): void {
        for (let type in definitions) {
            this.walkJSON(definitions[type], (val: any) => {
                if (val.$ref && typeof val.$ref === 'string') {
                    let ref: string = val.$ref
                    if (ref.startsWith('#/definitions/')) {
                        val.$ref = '#/definitions/' + type + '/definitions' + ref.substr(ref.indexOf('/'))
                    }
                }
                return false
            })
        }
    }

    expandTypes(definitions: any): void {
        this.walkJSON(definitions, val => {
            if (val.$type) {
                if (definitions.hasOwnProperty(val.$type)) {
                    val.$ref = '#/definitions/' + val.$type
                } else {
                    this.missing(val.$type)
                }
            }
            return false
        })
    }

    addStandardProperties(definitions: any, dialogSchema: any): void {
        for (let type in definitions) {
            let definition = definitions[type]
            if (!this.isUnionType(definition)) {
                // Reorder properties to put $ first.
                let props: any = {
                    $type: clone(dialogSchema.definitions.type),
                    $copy: dialogSchema.definitions.copy,
                    $id: dialogSchema.definitions.id,
                    $designer: dialogSchema.definitions.designer
                }
                props.$type.const = type
                if (definition.properties) {
                    for (let prop in definition.properties) {
                        props[prop] = definition.properties[prop]
                    }
                }
                definition.properties = props
                definition.additionalProperties = false
                definition.patternProperties = { '^\\$': { type: 'string' } }
                let required = definition.required
                if (required) {
                    required.push('$type')
                } else {
                    required = ['$type']
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
            }
        }
    }

    sortUnions(definitions: any): void {
        for (let key in definitions) {
            let definition = definitions[key]
            if (this.isUnionType(definition) && definition.oneOf) {
                definition.oneOf = definition.oneOf.sort((a: any, b: any) => a.title.localeCompare(b.title))
            }
        }
    }

    walkJSON(elt: any, fun: (val: any, obj?: any, key?: string) => boolean, obj?: any, key?: any): boolean {
        let done = fun(elt, obj, key)
        if (!done) {
            if (Array.isArray(elt)) {
                for (let val of elt) {
                    done = this.walkJSON(val, fun)
                    if (done) break
                }
            } else if (typeof elt === 'object') {
                for (let val in elt) {
                    done = this.walkJSON(elt[val], fun, elt, val)
                    if (done) break
                }
            }
        }
        return done
    }

    async getURL(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const http = require('http')
            const https = require('https')

            let client = http

            if (url.toString().indexOf('https') === 0) {
                client = https
            }

            client.get(url, (resp: any) => {
                let data = ''

                // A chunk of data has been recieved.
                resp.on('data', (chunk: any) => {
                    data += chunk
                })

                // The whole response has been received.
                resp.on('end', () => {
                    resolve(data)
                })

            }).on('error', (err: any) => {
                reject(err)
            })
        })
    }
    isUnionType(schema: any): boolean {
        return schema.$role === 'unionType'
    }

    missing(type: string): void {
        if (!this.missingTypes.has(type)) {
            this.error(`${this.currentFile}: error: Missing ${type} schema file from merge.`)
            this.missingTypes.add(type)
            this.failed = true
        }
    }

    schemaError(err: Validator.ErrorObject): void {
        this.error(`${this.currentFile}: error:${err.dataPath} ${err.message}`)
        this.failed = true
    }

    thrownError(err: Error): void {
        this.error(`${this.currentFile}: error:${err.message}`)
        this.failed = true
    }

    errorMsg(type: string, message: string): void {
        this.error(`${this.currentFile}: error:${type}: ${message}`)
        this.failed = true
    }

}
