import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../utils/index')
const queryQuestionJSON = require('./../../../utils/payloads/queryquestion')
import {Inputs, processInputs} from '../../utils/qnamakerbase'

export default class QnamakerQuery extends Command {
  static description = 'Query model for prediction'

  static flags: flags.Input<any> = {
    question: flags.string({description: 'Query to get a prediction for.', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:query command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerQuery)
    let input: Inputs = await processInputs(flags, queryQuestionJSON, 'query', undefined)

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    if (typeof result === 'string') {
      this.log(result)
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
