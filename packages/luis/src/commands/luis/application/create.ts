/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationCreate extends Command {
  static description = 'Creates a new LUIS application'

  static examples = [`
    $ bf luis:application:create --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --culture {CULTURE}
    --domain {DOMAIN} --description {DESCRIPTION} --versionId {INITIAL_VERSION_ID}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    name: Flags.string({description: '(required) Name of LUIS application'}),
    culture: Flags.string({description: 'Specify culture language (default: en-us)'}),
    description: Flags.string({description: 'Description of LUIS application'}),
    versionId: Flags.string({description: '(required) LUIS version Id. (defaults to config:LUIS:versionId)'}),
    tokenizerVersion: Flags.string({description: 'Version specifies how sentences are tokenized (optional). See also: https://aka.ms/luistokens'}),
    save: Flags.boolean({description: 'Save configuration settings from imported app (appId & endpoint)'}),
    json: Flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = await this.parse(LuisApplicationCreate)
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

    const applicationCreateObject = {name, culture, description, versionId, usageScenario, tokenizerVersion}

    try {
      const response = await Application.create({subscriptionKey, endpoint}, applicationCreateObject)

      const output: string = flags.json ? JSON.stringify({Status: 'App successfully created', id: response}, null, 2) : `App successfully created with id ${response}.`
      this.log(output)

      if (save) {
        const config = {
          appId: response.body,
          endpoint,
          subscriptionKey
        }
        const saveConfigResponse = await this.saveImportedConfig(config, configDir)
        if (saveConfigResponse && !flags.json) this.log('Config settings saved')
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
