/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../utils/index')
const trainJSON = require('./../../../utils/payloads/train')

import {Inputs, processInputs} from '../../utils/qnamakerbase'
export default class QnamakerTrain extends Command {
  static description = 'Train call to add suggestions to the knowledgebase.'

  static flags = {
    in: Flags.string({description: 'File path to the FeedbackRecordDTO object to send in the body of the request.'}),
    subscriptionKey: Flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in config'}),
    hostname: Flags.string({description: 'Specifies the url for your private QnA service. Overrides the value present in config.'}),
    endpointKey: Flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the value present in config.'}),
    kbId: Flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the value present in the config'}),
    help: Flags.help({char: 'h', description: 'qnamaker:get:kb command help'}),
  }

  async run() {
    const {flags} = await this.parse(QnamakerTrain)
    const stdin = await this.readStdin()

    if (!stdin && !flags.in) {
      throw new CLIError('No input. Please set file path with --in or pipe required data to the command')
    }
    let input: Inputs = await processInputs(flags, trainJSON, this.config.configDir, stdin)
    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
