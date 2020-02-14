/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import { Translator } from '../../utils'

export default class TranslateCommand extends Command {
  static description = 'Translate .lg files to a target language by microsoft translation API.'

  static flags: flags.Input<any> = {
    translatorKey: flags.string({char: 'k', description: 'Microsoft translation API key'}),
    targetLang: flags.string({char: 't', description: 'Target language to localize content to. See https://aka.ms/translate-langs for list of supported languages and codes. You can also specify comma or space delimited list of target languages.'}),
    in: flags.string({char: 'i', description: 'A direct .lg file passed in'}),
    folderName: flags.string({required: false, char: 'l', description: 'Relative or absolute path to a folder containing .lg files'}),
    subfolder: flags.string({required: false, char: 's', description: 'Flag option used to denote that subfolders need to be recursively checked to find .lg files'}),
    outputFolder: flags.string({required: false, char: 'o', description: 'output folder to write out the final .lg file'}),
    comments: flags.string({required: false, char: 'c', description: 'Flag option to indicate if comments in the input file is also translated. Default is set to false'}),
    verbose: flags.string({required: false, char: 'v', description: 'Flag option used to request verbose output. With this option set, additional useful parse, validate and collate logs are written to stdout'}),
    help: flags.help({char: 'h', description: 'lg help'}),
  }

  async run() {
    const {flags} = this.parse(TranslateCommand)

    // Check stdin or in parameter
    const stdin = await this.readStdin()
    if (!stdin && !flags.in) {
      throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
    }

    try {
      //const translator: Translator = new Translator()
      //translator.Translate(program)
    } catch (error) {
      throw new CLIError(error)
    }
  }
}
