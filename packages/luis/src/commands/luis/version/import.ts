/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'
const utils = require('../../../utils/index')

export default class LuisVersionImport extends Command {
  static description = 'Imports a new version into a LUIS application from JSON or LU content.'

  static examples = [`
    $ bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --in {PATH_TO_JSON} --versionId {VERSION_ID}
    $ echo {SERIALIZED_JSON} | bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: 'Version to export (defaults to config:LUIS:versionId)'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    in: flags.string({char: 'i', description: '(required) File path containing LUIS application contents, uses STDIN if not specified'}),
    json: flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = this.parse(LuisVersionImport)
    const flagLabels = Object.keys(LuisVersionImport.flags)
    const configDir = this.config.configDir
    const stdin = await this.readStdin()

    let {appId, versionId, endpoint, subscriptionKey, inVal} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    inVal = inVal ? inVal.trim() : flags.in

    const appJSON = inVal ? await utils.getInputFromFile(inVal) : stdin
    if (!appJSON) throw new CLIError('No import data found - please provide input through stdin or the --in flag')

    try {
      const messageData = await Version.import({subscriptionKey, endpoint, appId}, JSON.parse(appJSON), versionId)

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      const output = flags.json ? JSON.stringify({Status: 'Success', version: messageData}, null, 2) : `App version successfully imported as version ${messageData}.`
      this.log(output)
    } catch (err) {
      throw new CLIError(`Failed to import app version: ${err}`)
    }
  }

}
