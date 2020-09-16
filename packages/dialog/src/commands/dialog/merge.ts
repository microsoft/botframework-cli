/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import SchemaMerger from '../../library/schemaMerger'

export default class DialogMerge extends Command {
    static description = 'Merge `<kind>.schema` and `<kind>[.<locale>].uischema` definitions from a project and its dependencies into a single .schema for describing .dialog files and a per locale .uischema for describing how Composer shows them.  If a dependent package has an ExportedAssets directory it is copied to ImportedAssets/<package> in the --imports directory.'

    static args = [
        {name: 'patterns', required: true, description: 'Any number of glob regex patterns to match .csproj, .nuspec or package.json files.'},
    ]

    static strict = false

    static flags: flags.Input<any> = {
        debug: flags.boolean({char: 'd', description: 'Generate debug files.', hidden: true, default: false}),
        extension: flags.string({description: 'Extension to include as a resource for C#.', required: false, multiple: true, default: ['.dialog', '.lg', '.lu', '.schema', '.qna', '.uischema']}),
        help: flags.help({char: 'h'}),
        nugetRoot: flags.string({description: 'Nuget root directory for debugging.', hidden: true}),
        imports: flags.string({description: 'Output path for imported assets.  Defaults to the directory of --out with an ImportedAssets directory.', required: false}),
        output: flags.string({char: 'o', description: 'Output path and filename for merged .schema and .uischema.  Defaults to first project name.', required: false}),
        schema: flags.string({char: 's', description: 'Path to merged .schema file to use if merging .uischema only.', required: false}),
        verbose: flags.boolean({char: 'v', description: 'Show verbose logging of files as they are processed.', default: false}),
    }

    static examples = [
        '$ bf dialog:merge myProject.csproj plugins/*.nuspec',
        '$ bf dialog:merge package.json -o app.schema'
    ]

    async run() {
        const {argv, flags} = this.parse(DialogMerge)
        let merger = new SchemaMerger(argv, flags.output, flags.imports, flags.verbose, this.log, this.warn, this.error, flags.extension, flags.schema, flags.debug, flags.nugetRoot)
        await merger.merge()
    }
}
