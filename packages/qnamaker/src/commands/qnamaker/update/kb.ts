import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnaconfig = require('../../../../utils/qnaconfig')
const qnamaker = require('./../../../../utils/index')
const updateKbJSON = require('./../../../../utils/payloads/updatekb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerUpdateKb extends Command {
  static description = 'Add or delete QnA Pairs and / or URLs to an existing knowledge base'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'The UpdateKbOperationDTO object to send in the body of the request.', required: true}),
    kbId: flags.string({description: 'Knowledgebase id.'}),
    wait: flags.boolean({description: 'Wait for the operation to complete.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in config'}),
    help: flags.help({char: 'h', description: 'qnamaker:update:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerUpdateKb)
    let input: Inputs = await processInputs(flags, updateKbJSON, this.config.configDir)
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
