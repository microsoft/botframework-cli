#!/usr/bin/env node

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export * from './schemaTracker';
import * as fs from 'fs-extra';
import * as glob from 'globby';
import * as parser from '@apidevtools/json-schema-ref-parser'
import * as path from 'path';
import * as st from './schemaTracker';

let clone = require('clone')

// Top-level dialog definition that would be found in a file.
export class Dialog {
    // The path relative to the DialogTracker root where the dialog came from or should be written to.
    file: string

    // Definition of this dialog or undefined if file did not parse.
    body?: any

    // Any errors found in validating definition.
    errors: Error[]

    // TRUE if dialog should be written, i.e. changed since read.
    save: boolean

    constructor(file: string, body?: object) {
        this.file = file
        if (!path.isAbsolute) {
            throw new Error(`${file} must be an absolute path.`)
        }
        this.body = body
        this.errors = []
        this.save = true
    }

    // Return the id of the dialog, i.e. the base filename.
    id(): string {
        return path.basename(this.file, '.dialog')
    }

    // Base schema for dialog.
    schema(): string {
        return this.body.$schema
    }

    toString(): string {
        return path.relative(process.cwd(), this.file)
    }
}

// Definition of a Bot Framework component.
export class Definition {
    // $kind definition of the component or undefined.
    kind?: st.Kind

    // Dialog that contains definition.
    dialog?: Dialog

    // Path within the dialog that leads to the component definition.
    path?: string

    // id of the component if present, otherwise undefined.
    id?: string

    // Where this definition is being used.
    usedBy: Definition[]

    /**
     * Construct a component definition.
     * @param type The $kind of the component.
     * @param id The id of the component if present.
     * @param dialog The dialog that contains the definition. (undefined for forward reference.)
     * @param path The path within the file to the component.
     */
    constructor(type?: st.Kind, id?: string, dialog?: Dialog, path?: string) {
        this.kind = type
        this.id = id
        this.dialog = dialog
        this.path = path
        this.usedBy = []
    }

    // Compare definitions and return -1 for less than, 0 for equals and +1 for greater than.
    compare(definition: Definition): number {
        let result: number
        if (this.dialog !== undefined && this.path !== undefined
            && definition.dialog !== undefined && definition.path !== undefined) { // Actual definitions
            if (this.dialog === definition.dialog) {
                if (this.path === definition.path) {
                    result = 0
                } else {
                    result = this.path.localeCompare(definition.path)
                }
            } else {
                result = this.dialog.file.localeCompare(definition.dialog.file)
            }
        } else if (this.dialog !== undefined && this.path !== undefined) {
            result = +1
        } else if (definition.dialog !== undefined && definition.path !== undefined) {
            result = -1
        } else if (this.id !== undefined && this.kind !== undefined
            && definition.id !== undefined && definition.kind !== undefined) {
            if (this.id === definition.id) {
                if (this.kind === definition.kind) {
                    result = 0
                } else {
                    result = this.kind.name.localeCompare(definition.kind.name)
                }
            } else {
                result = this.id.localeCompare(definition.id)
            }
        } else {
            if (this.id !== undefined && this.kind !== undefined) {
                result = -1
            } else if (definition.id !== undefined && definition.kind !== undefined) {
                result = +1
            } else {
                result = -1
            }
        }
        return result
    }

    * typeMismatches(): Iterable<Definition> {
        if (this.kind) {
            for (let usedBy of this.usedBy) {
                if (usedBy.kind !== this.kind &&
                    !usedBy.kind?.implementations.includes(this.kind)) {
                    yield usedBy
                }
            }
        }
    }

    usedByString(): string {
        let result = ''
        if (this.usedBy.length > 0) {
            result = 'used by'
            for (let user of this.usedBy) {
                result += ' ' + user.locatorString()
            }
        }
        return result
    }

    toString(): string {
        return `${this.kind}${this.locatorString()}`
    }

    locatorString(): string {
        if (this.id) {
            return `[${this.id}]`
        } else {
            return this.pathString()
        }
    }

    pathString(): string {
        let id = this.dialog ? this.dialog.id() : 'undefined'
        return `(${id}#${this.path})`
    }
}

// Tracks cogs and the definitions they contain.
export class DialogTracker {
    // Paths will be relative to root directory.
    root: string

    // Tracker for information about schemas.
    schema: st.SchemaTracker

    // Default $schema
    schemaPath: string

    /**
     * Map from id to the definition.
     * If there are more than one, then it is multiply defined.
     */
    idToDef: Map<string, Definition[]>

    // Map from a type to all instances of that type.
    typeToDef: Map<string, Definition[]>

    // Top-level cogs in tracker.
    dialogs: Dialog[]

    constructor(schema: st.SchemaTracker, root?: string, schemaPath?: string) {
        this.schema = schema
        this.schemaPath = schemaPath || ''
        this.root = root || process.cwd()
        this.idToDef = new Map<string, Definition[]>()
        this.typeToDef = new Map<string, Definition[]>()
        this.dialogs = []
    }

    // Add a new Dialog file to the tracker.
    async addDialog(dialog: Dialog): Promise<void> {
        try {
            const schemaFile = dialog.body.$schema || this.schemaPath
            if (dialog.schema() && this.schemaPath && dialog.schema() !== this.schemaPath) {
                dialog.errors.push(new Error(`${dialog.schema()} does not match default schema ${this.schemaPath}`))
            } else if (schemaFile) {
                if (!this.schemaPath) {
                    // First found schema is default
                    this.schemaPath = schemaFile
                }
                let schemaPath = schemaFile
                if (schemaPath.indexOf(':') < 2) {
                    schemaPath = path.resolve(path.dirname(dialog.file), schemaFile)
                }
                let [validator] = await this.schema.getValidator(schemaPath)
                let validation = validator(dialog.body, dialog.file)
                if (!validation && validator.errors) {
                    for (let err of validator.errors) {
                        let path = err.dataPath
                        if (path.startsWith(dialog.file)) {
                            path = path.substring(dialog.file.length)
                        }
                        dialog.errors.push(new Error(`${path} ${err.message}`))
                    }
                }
            } else {
                dialog.errors.push(new Error('missing $schema.'))
            }

            // Create definitions and references
            this.findDefinitionsAndReferences(dialog.body, '', dialog, undefined)

            // Assume we will save it and reset this when coming from file
            dialog.save = true
        } catch (e) {
            dialog.errors.push(e)
        }
        this.dialogs.push(dialog)
    }

    // Read a dialog file and add it to the tracker.
    async addDialogFile(file: string): Promise<Dialog> {
        let dialog: Dialog
        let rel = path.relative(this.root, file)
        try {
            const definition = await parser.dereference(await fs.readJSON(rel))
            dialog = new Dialog(rel, definition)
            await this.addDialog(dialog)
        } catch (e) {
            // File is not valid JSON
            dialog = new Dialog(rel)
            dialog.errors.push(e)
            this.dialogs.push(dialog)
        }
        dialog.save = false
        return dialog
    }

    // Add dialog files that match patterns to tracker.
    async addDialogFiles(patterns: string[]): Promise<void> {
        let filePaths = await glob(patterns.map(e => e.replace(/\\/g, '/')))
        for (let filePath of filePaths) {
            await this.addDialogFile(filePath)
        }
    }

    // Remove dialog from tracker.
    removeDialog(dialog: Dialog) {
        this.dialogs = this.dialogs.filter(c => c !== dialog)
        for (let definition of this.allDefinitions()) {
            if (definition.dialog === dialog) {
                this.removeDefinition(definition)
            }
        }
    }

    // Find an existing dialog or return undefined.
    findDialog(id: string): undefined | Dialog {
        let result: undefined | Dialog
        for (let dialog of this.dialogs) {
            if (dialog.id() === id) {
                result = dialog
                break
            }
        }
        return result
    }

    // Find the dialog corresponding to a file path.
    findDialogFile(file: string): undefined | Dialog {
        return this.findDialog(path.basename(file, '.dialog'))
    }

    // Clone an existing dialog so you can modify it and then call updateDialog.
    cloneDialog(file: string): undefined | Dialog {
        let dialog = this.findDialog(file)
        return dialog ? clone(dialog, false) : undefined
    }

    // Update or add a dialog.
    async updateDialog(dialog: Dialog): Promise<void> {
        let oldDialog = this.findDialog(dialog.id())
        if (oldDialog) {
            this.removeDialog(oldDialog)
        }
        await this.addDialog(dialog)
    }

    /**  
     * Write out dialog files with save true and reset the flag.
     * @param root If present this is the new root and paths below will be relative to process.cwd.
     */
    async writeDialogs(root?: string): Promise<void> {
        for (let dialog of this.dialogs) {
            if (dialog.save) {
                let filePath = root ? path.join(path.resolve(root), path.relative(process.cwd(), dialog.file)) : dialog.file
                let dir = path.dirname(filePath)
                await fs.mkdirp(dir)
                let oldID = dialog.id()
                delete dialog.body.$id
                await fs.writeJSON(filePath, dialog.body, {spaces: 4})
                dialog.file = path.relative(process.cwd(), filePath)
                dialog.body.$id = oldID
                dialog.save = false
            }
        }
    }

    // All definitions.
    * allDefinitions(): Iterable<Definition> {
        for (let defs of this.typeToDef.values()) {
            for (let def of defs) {
                yield def
            }
        }
    }

    // Definitions that try to define the same id.
    * multipleDefinitions(): Iterable<Definition[]> {
        for (let def of this.idToDef.values()) {
            if (def.length > 1) {
                let type = def[0].kind
                if (!def.find(d => d.kind !== type)) {
                    yield def
                }
            }
        }
    }

    // Definitions that are referred to through $kind, but are not defined.
    * missingDefinitions(): Iterable<Definition> {
        for (let defs of this.idToDef.values()) {
            for (let def of defs) {
                if (!def.dialog) {
                    yield def
                }
            }
        }
    }

    // Definitions with ids that are unused.
    * unusedIDs(): Iterable<Definition> {
        for (let defs of this.idToDef.values()) {
            for (let def of defs) {
                if (def.usedBy.length === 0 && !def.path) {
                    yield def
                }
            }
        }
    }

    // Definitions that don't match expected kind.
    * typeMismatches(): Iterable<Definition> {
        for (let defs of this.idToDef.values()) {
            for (let def of defs) {
                let {done} = def.typeMismatches()[Symbol.iterator]().next()
                if (!done) {
                    yield def
                }
            }
        }
    }

    /**  
     * Add a new definition to the tracker.
     * The definition might be a forward reference.
     */
    private addDefinition(definition: Definition) {
        if (definition.kind && !this.typeToDef.has(definition.kind.name)) {
            this.typeToDef.set(definition.kind.name, [])
        }
        if (definition.id) {
            let add = true
            if (this.idToDef.has(definition.id)) {
                // Reference already existed, check for consistency
                // Merge if possible, otherwise add
                for (let old of this.idToDef.get(definition.id) as Definition[]) {
                    if (!old.dialog && !old.path &&
                        (!old.kind || old.kind === definition.kind || definition.kind?.interfaces.includes(old.kind))) {
                        add = false
                        old.dialog = definition.dialog
                        old.path = definition.path
                        old.kind = definition.kind
                        break
                    }
                }
            } else {
                this.idToDef.set(definition.id, [])
            }
            if (add) {
                (this.idToDef.get(definition.id) as Definition[]).push(definition)
                if (definition.kind) {
                    (this.typeToDef.get(definition.kind.name) as Definition[]).push(definition)
                }
            }
        } else {
            if (definition.kind) {
                (this.typeToDef.get(definition.kind.name) as Definition[]).push(definition)
            }
        }
    }

    /**
     * Add reference to a $id.
     * @param id Reference to a dialog.
     * @param dialog Dialog containing reference.
     * @param path Path in dialog to reference.
     */
    private addReference(id: string, dialog: Dialog, path: string, kind: st.Kind): void {
        if (!this.idToDef.has(id)) {
            // ID does not exist so add place holder
            let definition = new Definition(kind, id)
            this.addDefinition(definition)
            this.idToDef.set(id, [definition])
        }
        let definitions = (this.idToDef.get(id) as Definition[])
        for (let idDef of definitions) {
            idDef.usedBy.push(new Definition(kind, undefined, dialog, path))
        }
    }

    // Remove definition from tracker.
    private removeDefinition(definition: Definition): boolean {
        let found = false
        if (definition.id && this.idToDef.has(definition.id)) {
            // Remove from ids
            const defs = this.idToDef.get(definition.id) as Definition[]
            const newDefs = defs.filter(d => d.compare(definition) !== 0)
            if (newDefs.length === 0) {
                this.idToDef.delete(definition.id)
            } else {
                this.idToDef.set(definition.id, newDefs)
            }
            found = newDefs.length !== defs.length
        }
        if (definition.kind && this.typeToDef.has(definition.kind.name)) {
            const defs = this.typeToDef.get(definition.kind.name) as Definition[]
            const newDefs = defs.filter(d => d.compare(definition) !== 0)
            if (newDefs.length === 0) {
                this.typeToDef.delete(definition.kind.name)
            } else {
                this.typeToDef.set(definition.kind.name, newDefs)
            }
            found = found || newDefs.length !== defs.length
        }

        // Remove from all usedBy.
        for (let def of this.allDefinitions()) {
            def.usedBy = def.usedBy.filter(d => d.compare(definition) !== 0)
        }
        return found
    }

    private findDefinitionsAndReferences(elt: any, path: string, dialog: Dialog, definition?: Definition) {
        if (elt.$kind) {
            // Instance of $kind, add new definition
            const id = definition ? elt.$id : dialog.id()
            const kind = this.schema.kindToKind.get(elt.$kind)
            definition = new Definition(kind, id, dialog, path)
            this.addDefinition(definition)
        } else if (typeof elt === 'string') {
            const kind = this.schema.expectsKind(dialog.id(), path)
            // Reference to a $kind  
            if (kind) {
                this.addReference(elt, dialog, path, kind)
            }
        }

        // Walk further into the structure
        if (Array.isArray(elt)) {
            let i = 0
            for (let val of elt) {
                this.findDefinitionsAndReferences(val, `${path}[${i}]`, dialog, definition)
                ++i
            }
        } else if (typeof elt === 'object') {
            for (let val in elt) {
                this.findDefinitionsAndReferences(elt[val], `${path}/${val}`, dialog, definition)
            }
        }
    }
}
