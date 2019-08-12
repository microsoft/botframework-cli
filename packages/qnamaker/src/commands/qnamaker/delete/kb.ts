import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const Knowledgebase = require('./../../../../utils/api/knowledgebase')
const deleteKbJSON = require('./../../../../utils/payloads/deleteKb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

const {cli} = require('cli-ux')

export default class QnamakerDeleteKb extends Command {
  static description = 'Delete a knowledgebase by id'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to be deleted', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    force: flags.boolean({description: 'Do not prompt for confirmation, force the operation  '}),
    help: flags.help({char: 'h', description: 'qnamaker:delete:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerDeleteKb)
    let input: Inputs = await processInputs(flags, deleteKbJSON, 'delete', 'kb')

    if (!flags.force) {
      let kbResult = await new Knowledgebase().getKnowledgebaseDetails(input.config)
      let kb = await JSON.parse(await kbResult.text())
      let answer = await cli.prompt(`Are you sure you would like to delete ${kb.name} [${kb.id}]? [no] `, {default: 'no'})
      if (answer.trim()[0] === 'n') {
        this.log('operation canceled')
        return
      }
    }

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
