import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const listKbsJSON = require('./../../../../utils/payloads/listkbs')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerKbList extends Command {
  static description = 'List all of your knowledgebases'

  static flags: flags.Input<any> = {
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:kb:list command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerKbList)
    let input: Inputs = await processInputs(flags, listKbsJSON, this.config.configDir)

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
