import {Command, flags} from '@microsoft/bf-cli-command'
import cli from 'cli-ux'

const Knowledgebase = require('./../../../utils/api/knowledgebase')
const Endpointkeys = require('./../../../utils/api/endpointkeys')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

export default class QnamakerInit extends Command {
  static description = 'Initializes the .qnamakerrc file with settings.'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'qnamaker:init command help'}),
  }

  async run() {
    const result = await this.initializeConfig()
    if (result) {
      this.log(`Successfully wrote ${process.cwd()}/.qnamakerrc`)
    }
  }

  async initializeConfig(): Promise<boolean> {
    this.log(chalk.cyan.bold('\nThis util will walk you through creating a .qnamakerrc file\n\nPress ^C at any time to quit.\n\n'))
    const questions = [
      'What is your QnAMaker access/subscription key? (found on the Cognitive Services Azure portal page under "access keys") ',
      'What would you like to use as your active knowledgebase ID? [none] '
    ]

    const answers = []
    /* tslint:disable: prefer-for-of */
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const answer = await cli.prompt(question)
      answers.push(answer)
    }

    let [subscriptionKey, kbId] = answers
    /* tslint:disable: prefer-object-spread */
    const config = Object.assign({}, {subscriptionKey, kbId})

    if (subscriptionKey && kbId) {
      await this.updateKbId(config)
    }

    let confirmation: boolean
    try {
      confirmation = await cli.confirm(`Does this look ok?\n${JSON.stringify(config, null, 2)}\n[Yes]/No:`)
      /* tslint:disable: no-unused */
    } catch (e) {
      return false
    }

    if (confirmation) {
      //await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})
      let userConfig: any = {}
      if (fs.existsSync(path.join(this.config.configDir, 'config.json'))) {
        userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
      } else {
        await fs.mkdirp(this.config.configDir)
      }

      userConfig.qnamaker = config
      await fs.writeJson(path.join(this.config.configDir, 'config.json'), userConfig, {spaces: 2})
    }
    return confirmation
  }

  async updateKbId(config: any) {
    let response = await new Endpointkeys().getEndpointKeys(config)
    config.endpointKey = JSON.parse(await response.text()).primaryEndpointKey

    response = await new Knowledgebase().getKnowledgebaseDetails(config)
    let kb = await JSON.parse(await response.text())
    config.hostname = kb.hostName
  }
}
