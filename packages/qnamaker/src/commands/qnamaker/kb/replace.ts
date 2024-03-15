/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

const qnaBuilderVerbose = require('@microsoft/bf-lu/lib/parser/qna/qnamaker/kbCollate')
const qnaMakerBuilder = require('@microsoft/bf-lu/lib/parser/qna/qnamaker/qnaMakerBuilder')
const fileHelper = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const qnamaker = require('./../../../../utils/index')
const replaceKbJSON = require('./../../../../utils/payloads/replacekb')

export default class QnamakerKbReplace extends Command {
  static description = 'Replace a knowledgebase contents with new contents'

  static flags = {
    in: Flags.string({char: 'i', description: 'File path to the ReplaceKbDTO object to send in the body of the request. Alternately this can be path to a .qna file'}),
    kbId: Flags.string({description: 'Knowledgebase id. Overrides the knowledge base id present in the config'}),
    subscriptionKey: Flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: Flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: Flags.help({char: 'h', description: 'qnamaker:kb:replace command help'}),
  }

  async run() {
    const {flags} = await this.parse(QnamakerKbReplace)
    const stdin = await this.readStdin()
    if (!stdin && !flags.in) {
      throw new CLIError('No input. Please set file path with --in or pipe required data to the command')
    }

    let input: Inputs = await processInputs(flags, replaceKbJSON, this.config.configDir, stdin)
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    } else if (flags.qnaFormat) {
      const qnaFiles = await fileHelper.getLuObjects(stdin, flags.in, false, fileExtEnum.QnAFile)
      const result = await qnaBuilderVerbose.build(qnaFiles)
      const qnamaker = await qnaMakerBuilder.fromContent(result.parseToQnAContent())
      input.requestBody = qnamaker ? JSON.parse(JSON.stringify(qnamaker.kb)) : undefined
      flags.qnaFormat = false
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
