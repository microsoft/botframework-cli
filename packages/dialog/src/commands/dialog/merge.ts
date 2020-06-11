/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import SchemaMerger from '../../library/schemaMerger'

export default class DialogMerge extends Command {
    static description = 'Merge component information into a single app.schema describing .dialog files and app.resources that describes the order to look for assets.'

    static args = [
        {name: 'patterns', required: true, description: 'Any number of glob regex patterns to match .schema, .csproj, packages.config or package.json files.'},
    ]

    static strict = false

    static flags: flags.Input<any> = {
        debug: flags.boolean({char: 'd', description: 'Generate debug files.', hidden: true, default: false}),
        extension: flags.string({description: 'Extension to include when analyzing resource names.', required: false, multiple: true, default: ['.dialog', '.lg', '.lu', '.schema', '.qna']}),
        help: flags.help({char: 'h'}),
        output: flags.string({char: 'o', description: 'Output path and filename for merged schema.', required: false}),
        verbose: flags.boolean({char: 'v', description: 'Show verbose logging of files as they are processed.', default: false}),
    }

    static examples = [
        '$ bf dialog:merge *.csproj',
        '$ bf dialog:merge package.json -o app.schema'
    ]

    async run() {
        const {argv, flags} = this.parse(DialogMerge)
        let merger = new SchemaMerger(argv, flags.output, flags.verbose, this.log, this.warn, this.error, flags.extension, flags.debug)
        await merger.mergeSchemas()
    }
}
