/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationShow extends Command {
  static description = 'Shows application information'

  static examples = [`
    $ bf luis:application:show --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
  }

  async run() {
    const {flags} = await this.parse(LuisApplicationShow)
    const flagLabels = Object.keys(LuisApplicationShow.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId}
    utils.validateRequiredProps(requiredProps)

    try {
      const appData = await Application.show({subscriptionKey, endpoint, appId})
      if (appData) {
        await utils.writeToConsole(appData)
      }
    } catch (err) {
      throw new CLIError(`Failed to retrieve application data: ${err}`)
    }
  }

}
