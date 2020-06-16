/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command'
import SchemaMerger from '../../library/schemaMerger'

export default class DialogMerge extends Command {
    static description = 'Merge component .schema files into an app.schema.'

    static args = [
        { name: 'patterns', required: true, description: 'Any number of glob regex patterns to match .schema, .csproj, or package.json files.'},
    ]

    static strict = false

    static flags: flags.Input<any> = {
        debug: flags.boolean({ char: 'd', description: 'Generate debug files.', hidden: true, default: false}),
        help: flags.help({ char: 'h' }),
        output: flags.string({ char: 'o', description: 'Output path and filename for merged schema.', default: 'app.schema', required: false }),
        verbose: flags.boolean({ char: 'v', description: 'Show verbose logging of files as they are processed.', default: false }),
    }

    static examples = [
        '$ bf dialog:merge *.csproj',
        '$ bf dialog:merge libraries/**/*.schema **/*.csproj -o app.schema'
    ]

    async run() {
        const { argv, flags } = this.parse(DialogMerge)
        let merger = new SchemaMerger(argv, flags.output, flags.verbose, this.log, this.warn, this.error, flags.debug)
        await merger.mergeSchemas()
    }
}
