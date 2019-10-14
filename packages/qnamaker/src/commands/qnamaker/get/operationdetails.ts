import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../../utils/index')
const getOperationDetailsJSON = require('./../../../../utils/payloads/getoperation')
import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerGetOperationdetails extends Command {
  static description = 'Gets details of a specific long running operation.'

  static flags: flags.Input<any> = {
    operationId: flags.string({description: 'Operation id.', required: true}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:get:operationdetails command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerGetOperationdetails)
    let input: Inputs = await processInputs(flags, getOperationDetailsJSON, this.config.configDir)

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
