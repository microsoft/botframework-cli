/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
const crossTrain = require('./../../parser/lu/cross-train')
const path = require('path')

export default class LuisCrossTrian extends Command {
  static description = 'Lu and Qna cross train tool'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:cross-train help'}),
    in: flags.string({char: 'i', description: 'source lu and qna files folder'}),
    out: flags.string({char: 'o', description: 'output folder name. If not specified, the cross trained files will be wrote to cross-trained folder under folder of current command'}),
    config: flags.string({description: 'path to config file of mapping rules which is relative to folder specified by --in. If not specified, it will read default config.json from the folder specified by --in'}),
    intentName: flags.string({description: 'Interuption intent name', default: '_Interuption'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisCrossTrian)

      if (flags.config && flags.config !== '') {
        if (!path.isAbsolute(flags.config)) {
          flags.config = path.resolve(path.join(flags.in, flags.config))
        }
      }
      const trainedResult = await crossTrain.train(flags.in, flags.intentName, flags.config)

      if (flags.out === undefined) {
        flags.out = path.join(process.cwd(), 'cross-trained')
      }

      await crossTrain.writeFiles(trainedResult.luResult, flags.out)
      await crossTrain.writeFiles(trainedResult.qnaResult, flags.out)
    } catch (err) {
      throw err
    }
  }
}
