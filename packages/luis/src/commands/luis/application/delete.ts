/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const {cli} = require('cli-ux')
const utils = require('../../../utils/index')

export default class LuisApplicationDelete extends Command {
  static description = 'Deletes a LUIS application'

  static examples = [`
    $ bf luis:application:delete --appId {APP_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationDelete)
    const flagLabels = Object.keys(LuisApplicationDelete.flags)
    const configDir = this.config.configDir

    const {
      appId,
      endpoint,
      subscriptionKey,
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    if (!flags.appId) {
      const deleteAppConfirmation = await cli.confirm(`Are you sure you would like to delete app with id: ${appId}? (Y/N)`)
      if (!deleteAppConfirmation) {
        return this.log('No action taken')
      }
    }

    try {
      const result = await client.apps.deleteMethod(appId)
      if (result.code === 'Success') {
        this.log('App successfully deleted.')
      }
    } catch (err) {
      throw new CLIError(`Failed to delete app: ${err}`)
    }
  }
}
