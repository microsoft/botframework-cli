/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const crossTrain = require('@microsoft/bf-lu/lib/parser/cross-train/cross-train')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const path = require('path')

export default class QnamakerCrossTrain extends Command {
  static description = 'Lu and Qna cross train tool'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:cross-train help'}),
    in: flags.string({char: 'i', description: 'source lu and qna files folder'}),
    out: flags.string({char: 'o', description: 'output folder name. If not specified, the cross trained files will be written to cross-trained folder under folder of current command'}),
    config: flags.string({description: 'path to config file of mapping rules'}),
    intentName: flags.string({description: 'Interruption intent name', default: '_Interruption'}),
    rootDialog: flags.string({description: 'rootDialog file path. If --config not specified, cross-trian will automatically construct the config from file system based on root dialog file'})
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerCrossTrain)
      
      if (!flags.in) {
        throw new CLIError('Missing input. Please specify a folder with --in flag')
      }
      
      flags.in = path.resolve(flags.in)
      
      if (flags.config && flags.config !== '') {
        flags.config = path.resolve(flags.config)
      } else if (flags.rootDialog && flags.rootDialog !== '') {
        flags.rootDialog = path.resolve(flags.rootDialog)
        flags.config = await crossTrain.generateConfig(flags.in, flags.rootDialog)
      } else {
        throw new CLIError('Missing cross train config. Please provide config by --config or automatically construct config with --rootDialog.')
      }

      const trainedResult = await crossTrain.train(flags.in, flags.intentName, flags.config)

      if (flags.out === undefined) {
        flags.out = path.join(process.cwd(), 'cross-trained')
      }

      await crossTrain.writeFiles(trainedResult.luResult, flags.out)
      await crossTrain.writeFiles(trainedResult.qnaResult, flags.out)
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }
}
