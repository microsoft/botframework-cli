/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'
const utils = require('../../../utils/index')

export default class LuisVersionRename extends Command {
  static description = 'Renames application version'

  static examples = [`
    $ bf luis:version:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name {NAME} --description {DESCRIPTION}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: Flags.string({description: '(required) Version to update (defaults to config:LUIS:versionId)'}),
    newVersionId: Flags.string({description: '(required) New version id'}),
    json: Flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = await this.parse(LuisVersionRename)
    const flagLabels = Object.keys(LuisVersionRename.flags)
    const configDir = this.config.configDir

    const {
      endpoint,
      subscriptionKey,
      appId,
      versionId,
      newVersionId,
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId, newVersionId}
    utils.validateRequiredProps(requiredProps)

    try {
      await Version.rename({subscriptionKey, endpoint, appId}, versionId, newVersionId)
      const output = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : 'App version successfully renamed'
      this.log(output)
    } catch (err) {
      throw new CLIError(`Failed to rename app version: ${err}`)
    }
  }
}
