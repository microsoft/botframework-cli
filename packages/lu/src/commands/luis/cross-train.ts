/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
const crossTrain = require('./../../parser/lu/cross-train')

export default class LuisCrossTrian extends Command {
  static description = 'Lu and Qna cross train tool'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:cross-train help'}),
    in: flags.string({char: 'i', description: 'source lu and qna files folder'}),
    out: flags.string({char: 'o', description: 'output folder name. If not specified, source files will be updated'}),
    root: flags.string({description: 'root lu file to do cross training. Separated by comma if multiple root files exist'}),
    intentName: flags.string({description: 'Interuption intent name', default: '_Interuption'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisCrossTrian)
      const trainedResult = await crossTrain.train(flags.in, flags.root, flags.intentName)
      await crossTrain.writeFiles(trainedResult.luResult, flags.out)
      await crossTrain.writeFiles(trainedResult.qnaResult, flags.out)
    } catch (err) {
      throw err
    }
  }
}
