/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, Flags } from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'
export { Component, Import, Imports, SchemaMerger} from '../../library/schemaMerger'

export default class DialogIndex extends Command {
    static description = 'Dialog related commands for working with .schema and .dialog files.'

    static flags = {
        help: Flags.help({ char: 'h', description: 'Dialog command help' })
    }

    async run() {
        await new (await loadHelpClass(this.config))(this.config).showHelp([])
    }
}
