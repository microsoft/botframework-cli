/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class ExpandCommand extends Command {
  static description = 'Expand one or all templates in a .lg file or an inline expression.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    recurse: flags.string({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.string({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    collate: flags.string({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    templateName: flags.string({description: 'Name of the template to expand. Template names with spaces must be enclosed in quotes.'}),
    expression: flags.string({description: ' Inline expression provided as a string to evaluate.'}),
    all: flags.string({description: 'Flag option to request that all templates in the .lg file be expanded.'}),
    interactive: flags.string({description: 'Flag option to request that all missing entity value references be obtained through interactive prompts.'}),
    testInput: flags.string({description: 'full or relative path to a JSON file containing test input for all variable references.'}),
    help: flags.help({char: 'h', description: 'mslg:expand helper'}),
  }

  async run() {
    this.log('expand')
  }
}
