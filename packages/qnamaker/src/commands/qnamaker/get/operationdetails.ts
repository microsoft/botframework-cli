import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const getOperationDetailsJSON = require('./../../../../utils/payloads/getoperation')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerGetOperationdetails extends Command {
  static description = 'Gets details of a specific long running operation.'

  static flags: flags.Input<any> = {
    operationId: flags.string({description: 'Operation id.', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:get:operationdetails command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerGetOperationdetails)
    let input: Inputs = await processInputs(flags, getOperationDetailsJSON, 'get', 'operationdetails', this.config.configDir)

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
