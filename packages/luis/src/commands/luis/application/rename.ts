/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationRename extends Command {
  static description = 'Renames the application and updates its description'

  static examples = [`
    $ bf luis:application:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name {NAME} --description {DESCRIPTION}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    name: Flags.string({description: '(required) Name of LUIS application', required: true}),
    description: Flags.string({description: 'Description of LUIS application'}),
    json: Flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = await this.parse(LuisApplicationRename)
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

    try {
      const appUpdateStatus = await Application.rename({subscriptionKey, endpoint, appId}, name, description)

      if (appUpdateStatus.code === 'Success') {
        const output = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : 'App successfully renamed'
        this.log(output)
      }

    } catch (err) {
      throw new CLIError(`Failed to rename app: ${err}`)
    }
  }
}
