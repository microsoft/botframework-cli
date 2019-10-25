/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command';
import * as gen from '../../library/formGenerator'
import * as ppath from 'path'

export default class DialogForm extends Command {

    static args = [
        { name: 'form', required: true }
    ]

    static flags: flags.Input<any> = {
        force: flags.boolean({ char: 'f', description: 'Force overwriting generated files' }),
        help: flags.help({ char: 'h' }),
        locale: flags.string({ char: 'l', description: 'Locales to generate. [default: en-us]', multiple: true }),
        output: flags.string({ char: 'o', description: 'Output path for where to put generated .lu, .lg and .dialog files. [default: ./<form>-resources]', default: '.', required: false }),
        schema: flags.string({char: 's', description: 'Path to your app.schema file.', required: false}),
        templates: flags.string({ char: 't', description: 'Directory with templates to use for generating form assets.', multiple: true }),
        verbose: flags.boolean({ description: 'Output verbose logging of files as they are processed', default: false }),
    }

    async run() {
        const { args, flags } = this.parse(DialogForm)
        try {
            let formName = ppath.basename(args.form, '.schema.dialog')
            let outDir = flags.output
            if (!outDir) {
                outDir = ppath.join(formName + '-resources')
            }
            await gen.generate(args.form, outDir, flags.schema, flags.locale, flags.templates, flags.force,
                (type, msg) => {
                    if (type === gen.FeedbackType.error || (type === gen.FeedbackType.info && flags.verbose)) {
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
}
