/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const getEndpointJSON = require('./../../../../utils/payloads/getendpointsettings')
import {Inputs, processInputs} from './../../../utils/qnamakerbase'

export default class QnamakerEndpointsettingsGet extends Command {
  static description = 'Gets endpoint settings for an endpoint.'

  static flags = {
    kbId: Flags.string({description: 'Knowledgebase id to get metadata.'}),
    subscriptionKey: Flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: Flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: Flags.help({char: 'h', description: 'qnamaker:endpointsettings:get command help'}),
  }

  async run() {
    const {flags} = await this.parse(QnamakerEndpointsettingsGet)
    let input: Inputs = await processInputs(flags, getEndpointJSON, this.config.configDir)
    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
