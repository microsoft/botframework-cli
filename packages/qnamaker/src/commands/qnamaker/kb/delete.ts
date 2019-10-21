import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const Knowledgebase = require('./../../../../utils/api/knowledgebase')
const deleteKbJSON = require('./../../../../utils/payloads/deleteKb')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

const {cli} = require('cli-ux')

export default class QnamakerKbDelete extends Command {
  static description = 'Delete a knowledgebase by id'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to be deleted. Overrides the knowledge base id present in the config'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    force: flags.boolean({description: 'Do not prompt for confirmation, force the operation'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:delete command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbDelete)
    let input: Inputs = await processInputs(flags, deleteKbJSON, this.config.configDir)

    if (!flags.force) {
      let kbResult = await new Knowledgebase().getKnowledgebaseDetails(input.config)
      let kb = await JSON.parse(await kbResult.text())
      let answer = await cli.confirm(`Are you sure you would like to delete ${kb.name} [${kb.id}]? (y/n)`)
      if (!answer) {
        this.log('operation canceled')
        return
      }
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    this.log('Success')
  }
}
