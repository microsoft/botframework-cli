/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {updateQnAMakerConfig} from '../../utils/qnamakerbase'
import cli from 'cli-ux'

const Knowledgebase = require('./../../../utils/api/knowledgebase')
const Endpointkeys = require('./../../../utils/api/endpointkeys')
const chalk = require('chalk')

export default class QnamakerInit extends Command {
  static description = 'Initializes the config file with settings.'

  static flags: flags.Input<any> = {
    endpoint: flags.string({description: 'Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/'}),
    help: flags.help({char: 'h', description: 'qnamaker:init command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerInit)
    const result = await this.initializeConfig(flags.endpoint)
    if (result) {
      this.log(`Successfully wrote ${this.config.configDir}/config.json`)
    }
  }

  async initializeConfig(endpoint: string | undefined): Promise<boolean> {
    this.log(chalk.cyan.bold('\nThis util will walk you through the QnA Maker config settings\n\nPress ^C at any time to quit.\n\n'))
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
    const config = Object.assign({}, {subscriptionKey, kbId, endpoint, endpointKey: '', hostname: ''})

    if (subscriptionKey && kbId) {
      cli.action.start('Updating config file hostname and endpoint key')
      await this.updateKbId(config)
      cli.action.stop()
    }

    let confirmation: boolean
    delete config.endpoint
    try {
      confirmation = await cli.confirm(`Does this look ok?\n${JSON.stringify(config, null, 2)}\n[Yes]/No:`)
      /* tslint:disable: no-unused */
    } catch (e) {
      return false
    }

    if (confirmation) {
      await updateQnAMakerConfig(config, this.config.configDir)
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
