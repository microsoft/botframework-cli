import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const replaceAlterationsJSON = require('./../../../../utils/payloads/replacealterations')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerReplaceAlterations extends Command {
  static description = 'Replaces word alterations (synonyms) for the KB with the give records.'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'The WordAlterationsDTO object to send in the body of the request', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in config'}),
    help: flags.help({char: 'h', description: 'qnamaker:replace:alterations command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerReplaceAlterations)
    let input: Inputs = await processInputs(flags, replaceAlterationsJSON, this.config.configDir)
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
