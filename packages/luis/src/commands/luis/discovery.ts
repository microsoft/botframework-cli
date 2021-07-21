/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CLIError, Command, flags } from '@microsoft/bf-cli-command'
const path = require('path')
const fs = require('fs-extra')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const utils = require('../../utils/index')

export default class LuisDiscovery extends Command {
    static description = 'Discover all dialogs which use Luis Recognizer'
    static luisRecognizer = 'Microsoft.LuisRecognizer'

    static examples = [`
    $ bf luis:discovery --in {INPUT_FILE_OR_FOLDER} --out {OUTPUT_FILE_OR_FOLDER}
  `]

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h', description: 'luis:discovery command help' }),
        in: flags.string({ char: 'i', description: '(required) The of bot dialog files folder' }),
        log: flags.boolean({ description: 'Writes out log messages to console', default: false }),
        out: flags.string({ char: 'o', description: 'Output folder name to write out .json file of discovered luis models. If not specified, application setting will be output to console' }),
    }

    async run() {
        try {
            const { flags } = this.parse(LuisDiscovery)
            let files: string[] = []

            // Flags override userConfig
            let LuisDiscoveryFlags = Object.keys(LuisDiscovery.flags)

            let { inVal, log, out }
                = await utils.processInputs(flags, LuisDiscoveryFlags, this.config.configDir)

            flags.stdin = await this.readStdin()

            if (!flags.stdin && !inVal) {
                throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
            }

            if ((inVal && inVal !== '')) {
                if (log) this.log('Loading files...\n')

                // get lu files from in.
                if (inVal && inVal !== '') {
                    const dialogFiles = await file.getLuDialogFiles(inVal, true)
                    files.push(...dialogFiles)
                }

                // de-dupe the files list
                files = Array.from(new Set(files))
                const luisDialogs = []
                for (let i = 0; i < files.length; i++) {
                    let dialogContent = await file.getContentFromFile(files[i])
                    const luDialog = JSON.parse(dialogContent)
                    if (luDialog['$kind'] === LuisDiscovery.luisRecognizer) {
                        const dialogName = path.parse(files[i]).base;
                        const nameWithLocale = dialogName.substr(0, dialogName.length - 10)
                        const nameLocaleSegments = nameWithLocale.split('.');
                        if (nameLocaleSegments.length === 1) {
                            luisDialogs.push({ dialog: nameLocaleSegments[0] + '.dialog', language: '' })
                        } else if (nameLocaleSegments.length === 2) {
                            luisDialogs.push({ dialog: nameLocaleSegments[0] + '.dialog', language: nameLocaleSegments[1] })
                        }
                    }
                }

                const result = { Luis: luisDialogs }

                // write dialog assets based on config
                if (out) {
                    const outputFolder = path.resolve(out)
                    await fs.writeFile(outputFolder, JSON.stringify(result), 'utf-8')
                    this.log(`Successfully wrote .json files to ${outputFolder}\n`)
                } else {
                    this.log('Dialogs using Luis Recognizers:')
                    this.log(JSON.stringify(result, null, 4))
                }

            }
        } catch (error) {
            if (error instanceof exception) {
                throw new CLIError(error.text)
            }
            throw error
        }
    }
}