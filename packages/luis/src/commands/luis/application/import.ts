/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationImport extends Command {
  static description = 'Imports an application to LUIS'

  static examples = [`
    $ bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --in {PATH_TO_JSON}
    $ echo {SERIALIZED_JSON} | bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME}
  `]

  static flags = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
    name: flags.string({description: 'LUIS application name'}),
    in: flags.string({char: 'i', description: 'File path containing LUIS application contents'})
  }

  async run() {
    const {flags} = this.parse(LuisApplicationImport)
    const flagLabels = Object.keys(LuisApplicationImport.flags)
    const configDir = this.config.configDir
    let appJSON

    let {endpoint, subscriptionKey, name, inVal} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, name}
    utils.validateRequiredProps(requiredProps)

    if (!inVal) inVal = flags.in
    if (inVal) inVal = inVal.trim()

    try {
      appJSON = await utils.getInputFromFileOrStdin(inVal)
    } catch (error) {
      throw new CLIError(`Failed to read app JSON: ${error}`)
    }

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const newAppId = await client.apps.importMethod(JSON.parse(appJSON), undefined)
      this.log(`App successfully imported with id ${newAppId}.`)
    } catch (err) {
      throw new CLIError(`Failed to import app: ${err}`)
    }
  }
}
