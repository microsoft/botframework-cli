/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const publishKbJSON = require('./../../../../utils/payloads/publishkb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerKbPublish extends Command {
  static description = 'Publish all unpublished in the knowledgebase to the prod endpoint.'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to pubish. Overrides the knowledge base id present in the config'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:publish command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbPublish)
    let input: Inputs = await processInputs(flags, publishKbJSON, this.config.configDir)

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    this.log('Successs')
  }
}
