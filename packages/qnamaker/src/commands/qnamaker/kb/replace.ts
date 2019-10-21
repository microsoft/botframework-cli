import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const replaceKbJSON = require('./../../../../utils/payloads/replacekb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerKbReplace extends Command {
  static description = 'Replace a knowledgebase contents with new contents'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'File path to the ReplaceKbDTO object to send in the body of the request'}),
    kbId: flags.string({description: 'Knowledgebase id. Overrides the knowledge base id present in the config'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:replace command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbReplace)
    const stdin = await this.readStdin()
    if (!stdin && !flags.in) {
      throw new CLIError('No input. Please set file path with --in or pipe required data to the command')
    }

    let input: Inputs = await processInputs(flags, replaceKbJSON, this.config.configDir, stdin)
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
