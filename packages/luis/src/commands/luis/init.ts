/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import { throws } from 'assert'
const {cli} = require('cli-ux')
const utils = require('../../utils/index')

export default class LuisInit extends Command {
  static description = 'Stores default LUIS application values in global config.'

  static examples = [`
    $ bf luis:init --appId {APPLICATION_ID} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {VERSION_ID} --region {REGION}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
    appId: flags.string({description: 'LUIS application Id'}),
    versionId: flags.string({description: 'LUIS version Id'}),
    region: flags.string({description: 'LUIS application region. Will be prepended to endpoint hostname: <region>.api.cognitive.microsoft.com. Available Regions: westus, westeurope, australiaeast'}),
  }

  async run() {
    const {flags} = this.parse(LuisInit)
    const configDir = this.config.configDir

    if (Object.entries(flags).length === 0 && flags.constructor === Object) {
      return this.log('No config settings specified')
    }

    try {
      const response = await this.promptSaveConfig(flags, configDir)
      if (response) return this.log('Config settings saved')
      return this.log('Unable to save config settings')
    } catch (err) {
      this.log(`Unable to save config settings: ${err}`)
    }
  }

  async promptSaveConfig(flags: any, configPath: string) {
    const configPrefix = 'luis__'
    let userConfig = await utils.getUserConfig(configPath)
    if (userConfig === null) {
      await utils.createConfigFile(configPath)
      userConfig = {}
    }
    const saveConfigOptIn = await cli.confirm('Would you like to save the provided values to your global config file? (Y/N)')
    if (saveConfigOptIn) {
      // save config
      const flagLabels = Object.keys(flags)
      flagLabels.map(label => {
        userConfig[`${configPrefix}${label}`] = flags[label]
      })
      await utils.writeUserConfig(userConfig, configPath)
      return true
    }
    return false
  }

}
