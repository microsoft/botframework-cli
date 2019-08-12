import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const listAlterationsJSON = require('./../../../../utils/payloads/listalterations')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerListAlterations extends Command {
  static description = 'Downloads all word alterations (synonyms) that have been automatically mined or added by the user.'

  static flags: flags.Input<any> = {
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:list:alterations command help'}),

  }

  async run() {
    const {flags} = this.parse(QnamakerListAlterations)
    let input: Inputs = await processInputs(flags, listAlterationsJSON, 'list', 'alterations')

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else if (typeof result === 'string') {
      this.log(result)
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
