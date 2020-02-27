/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationRename extends Command {
  static description = 'Renames the application and updates its description'

  static examples = [`
    $ bf luis:application:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name {NAME} --description {DESCRIPTION}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    name: flags.string({description: '(required) Name of LUIS application', required: true}),
    description: flags.string({description: 'Description of LUIS application'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationRename)
    const flagLabels = Object.keys(LuisApplicationRename.flags)
    const configDir = this.config.configDir

    const {
      endpoint,
      subscriptionKey,
      appId,
      name,
      description
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    const applicationUpdateObject = {name, description}

    try {
      const appUpdateStatus = await client.apps.update(appId, applicationUpdateObject)
      if (appUpdateStatus.code === 'Success') {
        this.log('App successfully renamed')
      }
    } catch (err) {
      throw new CLIError(`Failed to rename app: ${err}`)
    }
  }
}
