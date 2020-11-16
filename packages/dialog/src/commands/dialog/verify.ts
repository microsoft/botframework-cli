/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command';
import * as chalk from 'chalk';
import {Definition, DialogTracker, SchemaTracker} from '../../library/dialogTracker';

export default class DialogVerify extends Command {
    static description = 'Verify .dialog files match their app.schema.'

    static args = [
        {name: 'patterns', required: true, description: 'Any number of glob regex patterns to match .dialog files.'}
    ]

    static strict = false

    static flags: flags.Input<any> = {
        help: flags.help({char: 'h'}),
        schema: flags.string({char: 's', description: 'Default schema to use if no $schema in dialog file.'}),
        verbose: flags.boolean({char: 'v', description: 'Show verbose output', default: false}),
    }

    private currentFile = ''
    private files = 0
    private errors = 0
    private warnings = 0

    async run() {
        const {argv, flags} = this.parse(DialogVerify)
        await this.execute(argv, flags.verbose, flags.schema)
    }

    async execute(dialogFiles: string[], verbose?: boolean, schemaPath?: string): Promise<void> {
        const schema = new SchemaTracker()
        const tracker = new DialogTracker(schema, undefined, schemaPath)

        await tracker.addDialogFiles(dialogFiles)

        if (tracker.dialogs.length === 0) {
            this.error('No  dialogs found!')
        } else {
            for (let dialog of tracker.dialogs) {
                this.files++
                this.currentFile = dialog.file
                if (dialog.errors.length === 0) {
                    if (verbose) {
                        this.consoleLog(`${dialog}`)
                    }
                } else {
                    for (let error of dialog.errors) {
                        this.consoleError(`${error.message}`, 'DLG001')
                    }
                }
            }
            this.currentFile = ''

            for (let defs of tracker.multipleDefinitions()) {
                let def = (defs as Definition[])[0]
                this.consoleError(`Multiple definitions for ${def} ${def.usedByString()}`, 'DLG002')
                for (let def of defs) {
                    this.consoleError(`  ${def.pathString()}`, 'DLG002')
                }
            }

            for (let def of tracker.missingDefinitions()) {
                this.consoleError(`Missing definition for ${def} ${def.usedByString()}`, 'DLG003')
            }

            for (let def of tracker.typeMismatches()) {
                for (let use of def.typeMismatches()) {
                    this.consoleError(`Type mismatch ${def} does not match ${use}`, 'DLG004')
                }
            }

            for (let def of tracker.unusedIDs()) {
                this.consoleWarn(`Unused id ${def}`, 'DLG005')
            }

            if (verbose) {
                for (let [type, definitions] of tracker.typeToDef) {
                    this.consoleMsg(`Instances of ${type}`)
                    for (let def of definitions) {
                        this.consoleMsg(`  ${def.locatorString()}`)
                    }
                }
            }

            this.log(`${this.files} files processed.`)
            if (this.warnings > 0) {
                this.warn(`Warnings: ${this.warnings} found.`)
            }
            if (this.errors > 0) {
                this.error(`Errors: ${this.errors} found.`)
            }
        }
    }

    consoleMsg(msg: string): void {
        this.log(chalk.default(msg))
    }

    consoleLog(msg: string): void {
        this.log(chalk.default.gray(msg))
    }

    consoleWarn(msg: string, code: string): void {
        this.warnings++
        this.warn(`${this.currentFile ? `${this.currentFile} - ` : ''}Warning ${code || ''}: ${msg}`)
    }

    consoleError(msg: string, code: string): void {
        this.errors++
        this.error(`${this.currentFile ? `${this.currentFile} - ` : ''}Error ${code || ''}: ${msg}`)
    }
}
