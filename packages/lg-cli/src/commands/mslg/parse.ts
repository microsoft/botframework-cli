/* eslint-disable complexity */
/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper} from '../../utils'

export default class ParseCommand extends Command {
  static description = 'Parse any provided .lg file and collate them into a single file.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    recurse: flags.string({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.string({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    collate: flags.string({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    help: flags.help({char: 'h', description: 'mslg:parse helper'}),
  }

  async run() {
    const {flags} = this.parse(ParseCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)
    for (const lgFilePath of lgFilePaths) {
      const lgFile = LGFile.parseFile(lgFilePath)
      const diagnostics = lgFile.diagnostics;
      this.log(diagnostics)
    }

    if (flags.collate) {
      Helper.handlerCollect()
    }
  }
}
