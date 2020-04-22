/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command'
import { SchemaMerger } from '../../library/schemaMerger'

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
        verbose: flags.boolean({ description: 'Show verbose logging of files as they are processed.', default: false }),
    }

    static examples = [
        '$ bf dialog:merge *.csproj',
        '$ bf dialog:merge libraries/*.schema -o app.schema'
    ]

    async run() {
        const { argv, flags } = this.parse(DialogMerge)
        let merger = new SchemaMerger(argv, flags.output, flags.verbose, this.log, this.warn, this.error)
        await merger.mergeSchemas()
    }
}
