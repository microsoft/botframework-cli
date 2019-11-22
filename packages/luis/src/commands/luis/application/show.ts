/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationShow extends Command {
  static description = 'Shows application information'

  static examples = [`
    $ bf luis:application:show --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationShow)
    const flagLabels = Object.keys(LuisApplicationShow.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const appData = await client.apps.get(appId)
      if (appData) {
        await utils.writeToConsole(appData)
        this.log('\nApplication data successfully output to console')
      }
    } catch (err) {
      throw new CLIError(`Failed to retrieve application data: ${err}`)
    }
  }

}
