/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command'
import { SchemaMerger } from '../../library/schemaMerger'

export default class DialogMerge extends Command {
    static description = 'Merge `<kind>.schema` and `<kind>[.<locale>].uischema` definitions from a project and its dependencies into a single .schema for describing .dialog files and a per locale .uischema for describing how Composer shows them.  If a dependent package has an "exported" directory it is copied to /<package> in the --imports directory. You can make use of negative patterns like !**/generated/** to exclude particular directories or files, although some directories like bin, obj and node_modules are automatically excluded.'

    static args = [
        { name: 'patterns', required: true, description: 'Any number of glob regex patterns to match .csproj, .nuspec or package.json files.' },
    ]

    static strict = false

    static flags: flags.Input<any> = {
        checkOnly: flags.boolean({ char: 'c', description: 'Check and do not write files.', default: false }),
        debug: flags.boolean({ char: 'd', description: 'Generate debug files.', hidden: true, default: false }),
        extension: flags.string({ description: 'Extension to include as a resource.', required: false, multiple: true, default: ['.dialog', '.lg', '.lu', '.schema', '.qna', '.uischema'] }),
        help: flags.help({ char: 'h' }),
        imports: flags.string({ description: 'Output path for imported assets.  Defaults to the directory of --out with an imported directory.', required: false }),
        nugetRoot: flags.string({ description: 'Nuget root directory for debugging.', hidden: true }),
        output: flags.string({ char: 'o', description: 'Output path and optional filename for merged .schema and .uischema.  Defaults to first project name.', required: false }),
        schema: flags.string({ char: 's', description: 'Path to merged .schema file to use if merging .uischema only.', required: false }),
        verbose: flags.boolean({ char: 'v', description: 'Show verbose logging of files as they are processed.', default: false }),
    }

    static examples = [
        '$ bf dialog:merge myProject.csproj plugins/*.nuspec',
        '$ bf dialog:merge package.json -o app.schema'
    ]

    async run() {
        const { argv, flags } = this.parse(DialogMerge)
        let merger = new SchemaMerger(argv, flags.output, flags.imports, flags.checkOnly, flags.verbose, this.log, this.warn, this.error, flags.extension, flags.schema, flags.debug, flags.nugetRoot)
        await merger.merge()
    }
}
