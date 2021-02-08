/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
import {Inputs, processInputs} from '../../../utils/qnamakerbase'
const fs = require('fs-extra')
const path = require('path')
const qnamaker = require('./../../../../utils/index')
const exportKbJSON = require('./../../../../utils/payloads/exportkb')

export default class QnamakerKbExport extends Command {
  static description = 'Echos a knowledgebase in json or qna format to stdout'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to be exported. Overrides the knowledge base id present in the config'}),
    qnaFormat: flags.boolean({description: 'Specifies if the content should be exported to .qna format.', default: false}),
    environment: flags.string({description: 'Specifies whether environment is Test or Prod.', default: 'Prod'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    out: flags.string({char: 'o', description: 'Output file path. If not specified stdout will be used as output.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:export command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbExport)
    let input: Inputs = await processInputs(flags, exportKbJSON, this.config.configDir)

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      if (typeof result !== 'string') {
        result = JSON.stringify(result, null, 2)
      }

      if (flags.out) {
        await this.writeOutput(result, flags)
      } else {
        this.log(result)
      }
    }
  }

  async writeOutput(result: any, flags: any) {
    let fullPath = path.resolve(flags.out)
    let root = path.dirname(fullPath)
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }

    const validatedPath = utils.validatePath(fullPath, '', flags.force)

    try {
      await fs.writeFile(validatedPath, result, 'utf-8')
    } catch (error) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + error.message)
    }
  }
}
