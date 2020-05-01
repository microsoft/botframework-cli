/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const crossTrain = require('@microsoft/bf-lu/lib/parser/cross-train/cross-train')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const path = require('path')

export default class LuisCrossTrain extends Command {
  static description = 'Lu and Qna cross train tool'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:cross-train help'}),
    in: flags.string({char: 'i', description: 'source lu and qna files folder'}),
    out: flags.string({char: 'o', description: 'output folder name. If not specified, the cross trained files will be wrote to cross-trained folder under folder of current command'}),
    config: flags.string({description: 'path to config file of mapping rules which is relative to folder specified by --in. If not specified, it will read default config.json from the folder specified by --in'}),
    intentName: flags.string({description: 'Interruption intent name', default: '_Interruption'}),
    rootDialog: flags.string({description: 'rootDialog file path which is relative to folder specified by --in. If --config not specified, cross-trian will automatically construct the config from file system based on root dialog file'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisCrossTrain)

      if (!path.isAbsolute(flags.in)) {
        flags.in = path.resolve(flags.in)
      }

      if (flags.config && flags.config !== '' && !path.isAbsolute(flags.config)) {
        flags.config = path.join(flags.in, flags.config)
      } else if (flags.rootDialog && flags.rootDialog !== '') {
        flags.rootDialog = !path.isAbsolute(flags.rootDialog) ? path.join(flags.in, flags.rootDialog) : flags.rootDialog
        flags.config = await crossTrain.generateConfig(flags.in, flags.rootDialog)
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
