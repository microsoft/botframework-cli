/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

const qnaconfig = require('../../../../utils/qnaconfig')
const qnamaker = require('./../../../../utils/index')
const updateKbJSON = require('./../../../../utils/payloads/updatekb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerKbUpdate extends Command {
  static description = 'Add or delete QnA Pairs and / or URLs to an existing knowledge base'

  static flags = {
    in: Flags.string({char: 'i', description: 'The file path to the UpdateKbOperationDTO object to send in the body of the request.'}),
    kbId: Flags.string({description: 'Knowledgebase id. Overrides the knowledge base id present in the config'}),
    wait: Flags.boolean({description: 'Wait for the operation to complete.'}),
    subscriptionKey: Flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: Flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: Flags.help({char: 'h', description: 'qnamaker:kb:update command help'}),
  }

  async run() {
    const {flags} = await this.parse(QnamakerKbUpdate)
    const stdin = await this.readStdin()
    if (!stdin && !flags.in) {
      throw new CLIError('No input. Please set file path with --in or pipe required data to the command')
    }
    let input: Inputs = await processInputs(flags, updateKbJSON, this.config.configDir, stdin)
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    }

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    if (flags.wait) {
      result = await qnaconfig.waitForOperationSucceeded(input.config, result)
    }

    this.log(JSON.stringify(result, null, 2))
  }
}
