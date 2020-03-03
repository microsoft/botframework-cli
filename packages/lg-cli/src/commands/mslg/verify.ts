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
import {MSLGTool} from 'botbuilder-lg'
import * as txtfile from 'read-text-file'

export default class VerifyCommand extends Command {
  static description = 'Verify any provided .lg file and collate them into a single file.'

  private lgTool = new MSLGTool()

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    collate: flags.boolean({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    help: flags.help({char: 'h', description: 'mslg:parse helper'}),
  }

  // schedule
  // in √
  // recurse √
  // out √
  // force √
  // collate √

  async run() {
    const {flags} = this.parse(VerifyCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    const filePaths = Helper.findLGFiles(flags.in, flags.recurse)
    for (const filePath of filePaths) {
      const fileContent = txtfile.readSync(filePath)
      const errors = this.lgTool.validateFile(fileContent, filePath)
      this.log(errors.join(', '))
    }

    const collectResult = Helper.collect(this.lgTool, flags.out, flags.force, flags.collate)
    if (collectResult.filepath) {
      this.log(`Collated lg file is generated here: ${collectResult.filepath}.\n`)
    } else {
      this.log('collect result:')
      this.log(collectResult.content)
    }
  }
}
