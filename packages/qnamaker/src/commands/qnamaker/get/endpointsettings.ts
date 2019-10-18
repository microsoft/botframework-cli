import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const getEndpointJSON = require('./../../../../utils/payloads/getendpointsettings')
import {Inputs, processInputs} from './../../../utils/qnamakerbase'

export default class QnamakerGetEndpointsettings extends Command {
  static description = 'Gets endpoint settings for an endpoint.'

  static flags: flags.Input<any> = {
    kbId: flags.string({description: 'Knowledgebase id to get metadata.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config'}),
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:get:endpointsettings command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerGetEndpointsettings)
    let input: Inputs = await processInputs(flags, getEndpointJSON, this.config.configDir)
    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
