/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command';
import * as gen from '../../library/dialogGenerator'
import * as ppath from 'path'

export default class GenerateDialog extends Command {

    async run() {
        const { args, flags } = this.parse(GenerateDialog)
        try {
            let formName = ppath.basename(args.schema, '.schema')
            let outDir = flags.output
            if (!outDir) {
                outDir = ppath.join(formName + '-resources')
            }
            await gen.generate(args.schema, outDir, flags.schema, flags.locale, flags.templates, flags.force,
                (type, msg) => {
                    if (type === gen.FeedbackType.message
                        || type === gen.FeedbackType.error
                        || (type === gen.FeedbackType.info && flags.verbose)) {
                        this.progress(msg)
                    }
                })
            return true;
        } catch (e) {
            this.thrownError(e)
        }
    }

    thrownError(err: Error): void {
        this.error(err.message)
    }

    progress(msg: string): void {
        this.error(msg)
    }

    static description = '[PREVIEW] Generate localized .lu, .lg, .qna and .dialog assets to define a bot based on a schema using templates.'

    static examples = [`
      $ bf dialog:generate sandwich.schema --output c:/tmp
    `]

    static args = [
        { name: 'schema', required: true, description: 'JSON Schema .schema file used to drive generation.' }
    ]

    static flags: flags.Input<any> = {
        force: flags.boolean({ char: 'f', description: 'Force overwriting generated files.' }),
        help: flags.help({ char: 'h' }),
        locale: flags.string({ char: 'l', description: 'Locales to generate. [default: en-us]', multiple: true }),
        output: flags.string({ char: 'o', description: 'Output path for where to put generated .lu, .lg, .qna and .dialog files. [default: ./<form>-resources]', default: '.', required: false }),
        schema: flags.string({ char: 's', description: 'Path to your app.schema file.', required: false }),
        templates: flags.string({ char: 't', description: 'Directory with templates to use for generating form assets.', multiple: true }),
        verbose: flags.boolean({ description: 'Output verbose logging of files as they are processed', default: false }),
    }
}
