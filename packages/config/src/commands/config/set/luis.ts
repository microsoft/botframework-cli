/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigSetLuis extends Command {
  static description = 'Stores default LUIS application values in global config.'

  static examples = [`
    $ bf config:set:luis --appId {APPLICATION_ID} --authoringKey {AUTHORING_KEY} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {VERSION_ID} --endpoint {ENDPOINT}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: 'LUIS application Id'}),
    authoringKey: flags.string({description: 'LUIS cognitive services authoring key (aka Ocp-Apim-Subscription-Key).'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
    armToken: flags.string({description: 'User`s ARM token used to validate azure accounts information)'}),
    versionId: flags.string({description: 'LUIS version Id'}),
    endpoint: flags.string({description: 'LUIS application endpoint hostname, ex: <region>.api.cognitive.microsoft.com'}),
  }

  async run() {
    const {flags} = this.parse(ConfigSetLuis)

    if (Object.entries(flags).length === 0 && flags.constructor === Object) {
      return this.log('No config settings specified')
    }

    let userConfig: Config = await getConfigFile(this.config.configDir)
    await this.saveConfig(flags, userConfig)
    await writeConfigFile(this.config.configDir, userConfig)
  }

  async saveConfig(flags: any, userConfig: any) {
    const configPrefix = 'luis__'
    const flagLabels = Object.keys(flags)
    flagLabels.map(label => {
      userConfig[`${configPrefix}${label}`] = flags[label]
      this.log(`${label} set to ${flags[label]}`)
    })
  }

}
