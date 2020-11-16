/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command'
export { Component, Import, Imports, SchemaMerger} from '../../library/schemaMerger'

export default class DialogIndex extends Command {
    static description = 'Dialog related commands for working with .schema and .dialog files.'

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h', description: 'Dialog command help' })
    }

    async run() {
        this._help()
    }
}
