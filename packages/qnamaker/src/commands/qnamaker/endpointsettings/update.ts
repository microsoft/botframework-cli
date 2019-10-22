/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const updateJSON = require('./../../../../utils/payloads/updateendpointsettings')
import {Inputs, processInputs} from './../../../utils/qnamakerbase'

export default class QnamakerEndpointsettingsUpdate extends Command {
  static description = 'Updates endpoint settings for an endpoint.'

  static flags: flags.Input<any> = {
    activelearning: flags.boolean({description: 'Enable active learning. Disables if flag not set', default: false}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:endpointsettings:update command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerEndpointsettingsUpdate)
    let input: Inputs = await processInputs(flags, updateJSON, this.config.configDir)
    input.requestBody = {
      activeLearning: {
        enable: flags.activelearning ? 'True' : 'False'
      }
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
