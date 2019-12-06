/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisVersionRename extends Command {
  static description = 'Renames application version'

  static examples = [`
    $ bf luis:version:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name {NAME} --description {DESCRIPTION}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: 'Version to update (mandatory, defaults to config:LUIS:versionId)'}),
    newVersionId: flags.string({description: 'New version name (mandatory)'}),
  }

  async run() {
    const {flags} = this.parse(LuisVersionRename)
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

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    const versionUpdateObject = {version: newVersionId}

    try {
      await client.versions.update(appId, versionId, versionUpdateObject)
      this.log('App version successfully renamed')
    } catch (err) {
      throw new CLIError(`Failed to rename app version: ${err}`)
    }
  }
}
