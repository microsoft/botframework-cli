/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationCreate extends Command {
  static description = 'Creates a new LUIS application'

  static examples = [`
    $ bf luis:application:create --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --culture {CULTURE}
    --domain {DOMAIN} --description {DESCRIPTION} --versionId {INITIAL_VERSION_ID} --usageScenario {USAGE_SCENARIO}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    name: flags.string({description: '(required) Name of LUIS application'}),
    culture: flags.string({description: 'Specify culture language (default: en-us)'}),
    description: flags.string({description: 'Description of LUIS application'}),
    versionId: flags.string({description: '(required) LUIS version Id. (defaults to config:LUIS:versionId)'}),
    tokenizerVersion: flags.string({description: 'Version specifies how sentences are tokenized (optional). See also: https://aka.ms/luistokens'}),
    save: flags.boolean({description: 'Save configuration settings from imported app (appId & endpoint)'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationCreate)
    const flagLabels = Object.keys(LuisApplicationCreate.flags)
    const configDir = this.config.configDir

    let {
      endpoint,
      subscriptionKey,
      name,
      culture,
      description,
      versionId,
      save,
      tokenizerVersion
    } = await utils.processInputs(flags, flagLabels, configDir)

    const usageScenario = 'Bot Framework'

    if (!culture) culture = 'en-us'

    const requiredProps = {endpoint, subscriptionKey, name}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)
    const options = {}

    const applicationCreateObject = {name, culture, description, versionId, usageScenario, tokenizerVersion}

    try {
      const response = await client.apps.add(applicationCreateObject, options)
      this.log(`App successfully created with id ${response.body}.`)
      if (save) {
        const config = {
          appId: response.body,
          endpoint,
          subscriptionKey
        }
        const saveConfigResponse = await this.saveImportedConfig(config, configDir)
        if (saveConfigResponse) this.log('Config settings saved')
      }
    } catch (err) {
      throw new CLIError(`Failed to create app: ${err}`)
    }
  }

  async saveImportedConfig(configSettings: any, configDir: string) {
    const configPrefix = 'luis__'
    let userConfig = await utils.getUserConfig(configDir)
    if (userConfig === null) {
      await utils.createConfigFile(configDir)
      userConfig = {}
    }
    // save config
    const configLabels = Object.keys(configSettings)
    configLabels.map(config => {
      userConfig[`${configPrefix}${config}`] = configSettings[config]
    })
    await utils.writeUserConfig(userConfig, configDir)
    return true
  }
}
