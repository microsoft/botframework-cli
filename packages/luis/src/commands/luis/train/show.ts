/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisTrainShow extends Command {
  static description = 'Shows training status'

  static examples = [`
    $ bf luis:train:show --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Version to show training status (defaults to config:LUIS:versionId)'}),
  }

  async run() {
    const {flags} = this.parse(LuisTrainShow)
    const flagLabels = Object.keys(LuisTrainShow.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId, versionId} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const trainingStatus = await client.train.getStatus(appId, versionId)
      if (trainingStatus) {
        await utils.writeToConsole(trainingStatus)
        this.log('\nTraining status successfully output to console')
      }
    } catch (err) {
      throw new CLIError(`Failed to retrieve training status: ${err}`)
    }
  }

}
