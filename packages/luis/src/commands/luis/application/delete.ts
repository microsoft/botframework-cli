/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationDelete extends Command {
  static description = 'Deletes a LUIS application'

  static examples = [`
    $ bf luis:application:delete --appId {APP_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: 'LUIS application Id'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
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
