/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationImport extends Command {
  static description = 'Imports LUIS application from JSON or LU content.'

  static examples = [`
    $ bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --in {PATH_TO_JSON}
    $ echo {SERIALIZED_JSON} | bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: '(required) LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config subscriptionKey)'}),
    name: flags.string({description: 'LUIS application name (optional)'}),
    in: flags.string({char: 'i', description: '(required) File path containing LUIS application contents, uses STDIN if not specified'}),
    save: flags.boolean({description: 'Save configuration settings from imported app (appId, subscriptionKey & endpoint)'}),
    json: flags.boolean({description: 'Display output as JSON'})
  }

  async run() {
    const {flags} = this.parse(LuisApplicationImport)
    const flagLabels = Object.keys(LuisApplicationImport.flags)
    const configDir = this.config.configDir
    const stdin = await this.readStdin()

    let {endpoint, subscriptionKey, name, inVal} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    inVal = inVal ? inVal.trim() : flags.in

    const appJSON = inVal ? await utils.getInputFromFile(inVal) : stdin
    if (!appJSON) throw new CLIError('No import data found - please provide input through stdin or the --in flag')

    // const client = utils.getLUISClient(subscriptionKey, endpoint)

    const options: any = {}
    if (name) options.appName = name

    try {
      // const response = await client.apps.importMethod(JSON.parse(appJSON), options)

      name = name ? '?appName=' + name : ''
      let url = endpoint + '/luis/authoring/v3.0-preview/apps/import' + name
      const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
      const response = await fetch(url, {method: 'POST', headers, body: appJSON})
      const messageData = await response.json()

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      const output: string = flags.json ? JSON.stringify({Status: 'Success', id: messageData}, null, 2) : `App successfully imported with id ${messageData}.`
      this.log(output)

      if (flags.save) {
        const config = {
          appId: response.body,
          endpoint,
          subscriptionKey
        }
        await this.saveImportedConfig(config, configDir)
        if (!flags.json) {
          this.log('Config settings saved')
        }
      }
    } catch (err) {
      throw new CLIError(`Failed to import app: ${err}`)
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
  }

}
