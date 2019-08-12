import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const publishKbJSON = require('./../../../../utils/payloads/publishkb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerPublishKb extends Command {
  static description = 'Publish all unpublished in the knowledgebase to the prod endpoint.'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to pubish.', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:publish:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerPublishKb)
    let input: Inputs = await processInputs(flags, publishKbJSON, 'publish', 'kb')

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
