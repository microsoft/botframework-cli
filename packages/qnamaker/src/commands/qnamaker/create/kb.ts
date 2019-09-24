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
    name: flags.string({description: 'Name of the kb you want to create. This will override the name of KB that might be present in the CreateKb DTO'}),
    wait: flags.boolean({description: 'Wait for the operation to complete.'}),
    subscriptionKey: flags.string({description: 'Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource Management section for your Qna Maker cognitive service). Overrides the subscriptionkey value present in config'}),
    help: flags.help({char: 'h', description: 'qnamaker:create:kb command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerCreateKb)

    let input: Inputs = await processInputs(flags, createKbJSON, this.config.configDir)

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
        const answer = await cli.prompt(`Would you like to save ${kb.name} ${kb.id} in your .qnamakerrc so that future commands will be with this KB? [yes] `, {default: 'yes'})
        if (answer[0] === 'y') {
          let userConfig: any = {}
          if (fs.existsSync(path.join(this.config.configDir, 'config.json'))) {
            userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
          } else {
            await fs.mkdirp(this.config.configDir)
          }

          userConfig.qnamaker = input.config
          await fs.writeJson(path.join(this.config.configDir, 'config.json'), userConfig, {spaces: 2})
          this.log('qnamaker config updated')
        }
      }
    }
  }

  async updateKbId(config: any) {
    let response = await new Endpointkeys().getEndpointKeys(config)
    config.endpointKey = JSON.parse(await response.text()).primaryEndpointKey

    response = await new Knowledgebase().getKnowledgebaseDetails(config)
    const kb = JSON.parse(await response.text())
    config.hostname = kb.hostName

    return kb
  }
}
