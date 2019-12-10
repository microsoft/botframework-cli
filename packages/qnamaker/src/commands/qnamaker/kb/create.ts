/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnaconfig = require('../../../../utils/qnaconfig')
const qnamaker = require('./../../../../utils/index')
const Knowledgebase = require('./../../../../utils/api/knowledgebase')
const Endpointkeys = require('./../../../../utils/api/endpointkeys')
const createKbJSON = require('./../../../../utils/payloads/createkb')

const readlineSync = require('readline-sync')

import {Inputs, processInputs, updateQnAMakerConfig} from '../../../utils/qnamakerbase'

export default class QnamakerKbCreate extends Command {
  static description = 'Creates a new knowledgebase'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'File path to the CreateKbDTO object to send in the body of the request.'}),
    name: flags.string({description: 'Name of the kb you want to create. This will override the name of KB that might be present in the CreateKb DTO'}),
    save: flags.boolean({description: 'Save the kbId in config.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:create command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbCreate)
    const stdin = await this.readStdin()
    if (!stdin && !flags.in) {
      throw new CLIError('No input. Please set file path with --in or pipe required data to the command')
    }

    let input: Inputs = await processInputs(flags, createKbJSON, this.config.configDir, stdin)

    if (flags.name) {
      input.requestBody.name = flags.name
    }

    if (!input.requestBody.name) {
      let answer = readlineSync.question('What would you like to name your new knowledgebase?')
      if (answer && answer.length > 0) {
        input.requestBody.name = answer.trim()
      }
    }
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    }

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    result = await qnaconfig.waitForOperationSucceeded(input.config, result)

    let kbId = result.resourceLocation.split('/')[2]
    if (flags.save) {
      input.config.kbId = kbId
      await this.updateKbId(input.config)
      await updateQnAMakerConfig(input.config, this.config.configDir)
    } else {
      this.log(JSON.stringify({kbId}, null, 2))
    }
  }

  async updateKbId(config: any) {
    let response = await new Endpointkeys().getEndpointKeys(config)
    config.endpointKey = JSON.parse(await response.text()).primaryEndpointKey

    response = await new Knowledgebase().getKnowledgebaseDetails(config)
    const kb = JSON.parse(await response.text())
    config.hostname = kb.hostName

    return kb
  }
}
