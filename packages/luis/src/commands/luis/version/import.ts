/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisVersionImport extends Command {
  static description = 'Imports a new version into a LUIS application from JSON or LU content.'

  static examples = [`
    $ bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --in {PATH_TO_JSON} --versionId {VERSION_ID}
    $ echo {SERIALIZED_JSON} | bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: 'Version to export (defaults to config:LUIS:versionId)'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    in: flags.string({char: 'i', description: '(required) File path containing LUIS application contents, uses STDIN if not specified'})
  }

  async run() {
    const {flags} = this.parse(LuisVersionImport)
    const flagLabels = Object.keys(LuisVersionImport.flags)
    const configDir = this.config.configDir
    const stdin = await this.readStdin()
    const options: any = {}

    let {appId, versionId, endpoint, subscriptionKey, inVal} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    inVal = inVal ? inVal.trim() : flags.in

    const appJSON = stdin ? stdin : await utils.getInputFromFile(inVal)
    if (!appJSON) throw new CLIError('No import data found - please provide input through stdin or the --in flag')

    if (versionId) options.versionId = versionId

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const newVersionId = await client.versions.importMethod(appId, JSON.parse(appJSON), options)
      this.log(`App version successfully imported as version ${newVersionId}.`)
    } catch (err) {
      throw new CLIError(`Failed to import app version: ${err}`)
    }
  }

}
