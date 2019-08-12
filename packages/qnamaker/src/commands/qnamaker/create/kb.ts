import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnaconfig = require('../../../../utils/qnaconfig')
const qnamaker = require('./../../../../utils/index')
const Knowledgebase = require('./../../../../utils/api/knowledgebase')
const Endpointkeys = require('./../../../../utils/api/endpointkeys')
const createKbJSON = require('./../../../../utils/payloads/createKb')

const fs = require('fs-extra')
const path = require('path')
const readlineSync = require('readline-sync')
const {cli} = require('cli-ux')

import {Inputs, processInputs} from '../../../utils/qnamakerbase'

export default class QnamakerCreateKb extends Command {
  static description = 'Creates a new knowledgebase'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'The CreateKbDTO object to send in the body of the request.', required: true}),
    name: flags.string({description: 'Name of the kb you want to create.'}),
    wait: flags.boolean({description: 'Wait for the operation to complete.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker subscription key/access keys (found on the Cognitive Services Azure portal page under "access keys"). Overrides the .qnamakerrc value and the QNAMAKER_SUBSCRIPTION_KEY environment variable.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the .qnamakerrc value and the QNAMAKER_HOSTNAME environment variable.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY environment variable.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    stdin: flags.boolean({description: 'Specifies qnamaker configuration is being passed via stdin. Overrides the .qnamakerrc value and the QNAMAKER_KBID environment variable.'}),
    help: flags.help({char: 'h', description: 'qnamaker:create:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerCreateKb)

    let input: Inputs = await processInputs(flags, createKbJSON, 'create', 'kb')

    if (flags.name) {
      input.requestBody.name = flags.name
    }

    if (!input.requestBody.name) {
      if (!(flags.q || flags.quiet)) {
        let answer = readlineSync.question('What would you like to name your new knowledgebase?')
        if (answer && answer.length > 0) {
          input.requestBody.name = answer.trim()
        }
      }
    }
    // hack to map incorrect export property from expected import.  Export uses qnaDocuments, create/update/replace qnaList :(
    if (input.requestBody.qnaDocuments && !input.requestBody.qnaList) {
      input.requestBody.qnaList = input.requestBody.qnaDocuments
      delete input.requestBody.qnaDocuments
    }

    let result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)

    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    if (flags.wait) {
      result = await qnaconfig.waitForOperationSucceeded(input.config, result)

      let kbId = result.resourceLocation.split('/')[2]
      input.config.kbId = kbId
      let kb = await this.updateKbId(input.config)

      this.log(JSON.stringify(result, null, 2))

      if (flags.wait) {
        let answer = await cli.prompt(`Would you like to save ${kb.name} ${kb.id} in your .qnamakerrc so that future commands will be with this KB? [yes] `, {default: 'yes'})
        if (answer[0] === 'y') {
          await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), input.config, {spaces: 2})
          await this.log('.qnamakerrc updated')
        }
      }
    }
  }

  async updateKbId(config: any) {
    let response = await new Endpointkeys().getEndpointKeys(config)
    config.endpointKey = JSON.parse(await response.text()).primaryEndpointKey

    response = await new Knowledgebase().getKnowledgebaseDetails(config)
    let kb = JSON.parse(await response.text())
    config.hostname = kb.hostName

    return kb
  }
}
