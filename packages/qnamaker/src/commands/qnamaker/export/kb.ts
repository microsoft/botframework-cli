import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const exportKbJSON = require('./../../../../utils/payloads/exportkb')
const exportlegacyKbJSON = require('./../../../../utils/payloads/exportlegacykb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerExportKb extends Command {
  static description = 'Export a knowledgebase to .json file'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to be exported.', required: true}),
    environment: flags.string({description: 'Specifies whether environment is Test or Prod.', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    legacy: flags.boolean({description: 'Specifies if is a legacy knowlegebase.'}),
    help: flags.help({char: 'h', description: 'qnamaker:export:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerExportKb)
    const payload = flags.legacy ? exportlegacyKbJSON : exportKbJSON
    const kbType = flags.legacy ? 'legacykb' : 'kb'
    let input: Inputs = await processInputs(flags, payload, 'export', kbType)

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      if (typeof result === 'string')
        this.log(result)
      else
        this.log(JSON.stringify(result, null, 2))
    }
  }
}
