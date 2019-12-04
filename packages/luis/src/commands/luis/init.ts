/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import { throws } from 'assert'

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
      const response = await utils.promptSaveConfig(flags, configDir)
      if (response) return this.log('Config settings saved')
      return this.log('Unable to save config settings')
    } catch (err) {
      this.log(`Unable to save config settings: ${err}`)
    }
  }

}
