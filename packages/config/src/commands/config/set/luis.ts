/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
const {cli} = require('cli-ux')
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigSetLuis extends Command {
  static description = 'Stores default LUIS application values in global config.'

  static examples = [`
    $ bf config:set:luis --appId {APPLICATION_ID} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {VERSION_ID} --endpoint {ENDPOINT}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
    appId: flags.string({description: 'LUIS application Id'}),
    versionId: flags.string({description: 'LUIS version Id'}),
    endpoint: flags.string({description: 'LUIS application endpoint hostname, ex: <region>.api.cognitive.microsoft.com'}),
    force: flags.boolean({description: 'Force save config without prompt'}),
  }

  async run() {
    const {flags} = this.parse(ConfigSetLuis)
    const configDir = this.config.configDir

    if (Object.entries(flags).length === 0 && flags.constructor === Object) {
      return this.log('No config settings specified')
    }

    try {
      const response = await this.saveConfig(flags, configDir)
      if (response) return this.log('Config settings saved')
      return this.log('Unable to save config settings')
    } catch (err) {
      this.log(`Unable to save config settings: ${err}`)
      this._help()
    }
  }

  async saveConfig(flags: any, configPath: string) {
    const configPrefix = 'luis__'
    let saveConfigOptIn = false
    let userConfig: Config = await getConfigFile(configPath)
    if (!flags.force) {
      saveConfigOptIn = await cli.confirm('Would you like to save the provided values to your global config file? (Y/N)')
    }
    if (saveConfigOptIn || flags.force) {
      const flagLabels = Object.keys(flags)
      flagLabels.map(label => {
        if (label !== 'force') userConfig[`${configPrefix}${label}`] = flags[label]
      })
      await writeConfigFile(configPath, userConfig)
      return true
    }
    return false
  }

}
