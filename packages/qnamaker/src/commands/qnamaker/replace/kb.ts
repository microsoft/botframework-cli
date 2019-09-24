import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const replaceKbJSON = require('./../../../../utils/payloads/replacekb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerReplaceKb extends Command {
  static description = 'Replace a knowledgebase contents with new contents'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'The ReplaceKbDTO object to send in the body of the request', required: true}),
    kbId: flags.string({description: 'Knowledgebase id.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in config'}),
    help: flags.help({char: 'h', description: 'qnamaker:replace:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerReplaceKb)
    let input: Inputs = await processInputs(flags, replaceKbJSON, this.config.configDir)
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
