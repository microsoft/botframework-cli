/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command';
import * as fs from '../../library/formSchema'
import * as gen from '../../library/formGenerator'
import * as path from 'path'
let util: any = require('util')

export default class DialogForm extends Command {

    static args = [
        { name: 'schema', required: true }
    ]

    static flags: flags.Input<any> = {
        force: flags.boolean({ char: 'f', description: 'Force overwriting generated files' }),
        help: flags.help({ char: 'h' }),
        locale: flags.string({ char: 'l', description: 'Locales to generate. [default: en-us]', multiple: true }),
        output: flags.string({ char: 'o', description: 'Output path for where to put generated .lu, .lg and .dialog files. [default: ./<schema>-resources]', default: '.', required: false }),
        templates: flags.string({ char: 't', description: "Directory with templates to use for generating form assets." }),
        verbose: flags.boolean({ description: 'Output verbose logging of files as they are processed', default: false }),
    }

    async run() {
        const { args, flags } = this.parse(DialogForm)
        try {
            let schemaName = path.basename(args.schema, '.schema.dialog')
            let outDir = flags.output
            if (!outDir) {
                outDir = path.join(schemaName + "-resources")
            }
            this.progress(`Generating resources for ${args.schema} in ${outDir}`)
            let schema = await fs.FormSchema.readSchema(args.schema)
            await gen.generate(schema, outDir, flags.locale, flags.templates, flags.force,
                (type, msg) => {
                    if (type == gen.FeedbackType.error || (type == gen.FeedbackType.info && flags.verbose)) {
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
