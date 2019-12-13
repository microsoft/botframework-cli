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

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    name: flags.string({description: 'LUIS application name (optional)'}),
    in: flags.string({char: 'i', description: 'File path containing LUIS application contents, uses STDOUT if not specified (mandatory)'})
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

    const appJSON = stdin ? stdin : await utils.getInputFromFile(inVal)
    if (!appJSON) throw new CLIError('No import data found - please provide input through stdin or the --in flag')

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    const options: any = {}

    if (name) options.appName = name

    try {
      const newAppId = await client.apps.importMethod(JSON.parse(appJSON), options)
      this.log(`App successfully imported with id ${newAppId}.`)
    } catch (err) {
      throw new CLIError(`Failed to import app: ${err}`)
    }
  }

}
