import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../../utils/index')
const updateJSON = require('./../../../../utils/payloads/updateendpointsettings')
import {Inputs, processInputs} from './../../../utils/qnamakerbase'

export default class QnamakerUpdateEndpointsettings extends Command {
  static description = 'Updates endpoint settings for an endpoint.'

  static flags: flags.Input<any> = {
    activelearning: flags.boolean({description: 'Enable active learning. Disables if flag not set', default: false}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:update:endpointsettings command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerUpdateEndpointsettings)
    let input: Inputs = await processInputs(flags, updateJSON, this.config.configDir)
    input.requestBody = {
      activeLearning: {
        enable: flags.activelearning ? 'True' : 'False'
      }
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }
  }
}
