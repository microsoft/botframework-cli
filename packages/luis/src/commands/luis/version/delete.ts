/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'
const utils = require('../../../utils/index')

export default class LuisVersionDelete extends Command {
  static description = 'Deletes a LUIS application version'

  static examples = [`
    $ bf luis:version:delete --appId {APP_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Version to delete'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    json: flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = this.parse(LuisVersionDelete)
    const flagLabels = Object.keys(LuisVersionDelete.flags)
    const configDir = this.config.configDir

    const {
      appId,
      versionId,
      endpoint,
      subscriptionKey,
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, versionId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    try {
      const result = await Version.delete({subscriptionKey, endpoint, appId}, versionId)
      if (result.code === 'Success') {
        const output = flags.json ? JSON.stringify({Status: 'Success', version: versionId}, null, 2) : `Successfully deleted version ${versionId}`
        this.log(output)
      }
    } catch (err) {
      throw new CLIError(`Failed to delete app version: ${err}`)
    }
  }
}
