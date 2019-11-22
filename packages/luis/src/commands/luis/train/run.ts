/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisTrainRun extends Command {
  static description = 'Issues asynchronous training request for LUIS application'

  static examples = [`
    $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: 'Version to show training status (mandatory, defaults to config:LUIS:versionId)'}),
  }

  async run() {
    const {flags} = this.parse(LuisTrainRun)
    const flagLabels = Object.keys(LuisTrainRun.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId, versionId} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const trainingRequestStatus = await client.train.trainVersion(appId, versionId)
      if (trainingRequestStatus) {
        await utils.writeToConsole(trainingRequestStatus)
        this.log('\nTraining request successfully issued')
      }
    } catch (err) {
      throw new CLIError(`Failed to issue training request: ${err}`)
    }
  }

}
