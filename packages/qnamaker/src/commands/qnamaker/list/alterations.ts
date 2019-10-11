import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const listAlterationsJSON = require('./../../../../utils/payloads/listalterations')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerListAlterations extends Command {
  static description = 'Downloads all word alterations (synonyms) that have been added by the user.'

  static flags: flags.Input<any> = {
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    help: flags.help({char: 'h', description: 'qnamaker:list:alterations command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerListAlterations)
    let input: Inputs = await processInputs(flags, listAlterationsJSON, this.config.configDir)

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else if (typeof result === 'string') {
      this.log(result)
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
