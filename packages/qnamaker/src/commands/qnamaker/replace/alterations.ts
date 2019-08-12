import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const replaceAlterationsJSON = require('./../../../../utils/payloads/replacealterations')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerReplaceAlterations extends Command {
  static description = 'Replaces word alterations (synonyms) for the KB with the give records.'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'The WordAlterationsDTO object to send in the body of the request', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:replace:alterations command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerReplaceAlterations)
    let input: Inputs = await processInputs(flags, replaceAlterationsJSON, 'replace', 'alterations')
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    }

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
