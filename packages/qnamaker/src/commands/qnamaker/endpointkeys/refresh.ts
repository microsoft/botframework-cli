/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const refreshEndpointKeysJSON = require('./../../../../utils/payloads/refreshendpointkeys')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerEndpointkeysRefresh extends Command {
  static description = 'Re-generates an endpoint key, in case you suspect your keys have been compromised'

  static flags = {
    keyType: Flags.string({description: 'Type of Key. (PrimaryKey/SecondaryKey)', required: true}),
    subscriptionKey: Flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: Flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: Flags.help({char: 'h', description: 'qnamaker:endpoints:refresh command help'}),
  }

  async run() {
    const {flags} = await this.parse(QnamakerEndpointkeysRefresh)
    let input: Inputs = await processInputs(flags, refreshEndpointKeysJSON, this.config.configDir)

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    this.log(JSON.stringify(result, null, 2))
  }
}
