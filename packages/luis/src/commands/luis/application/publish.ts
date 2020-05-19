/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import fetch from 'node-fetch'

const utils = require('../../../utils/index')

export default class LuisApplicationPublish extends Command {
  static description = 'Publishes application\'s version'

  static examples = [`
    $ bf luis:application:publish --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {INITIAL_VERSION_ID} --appId {APP_ID} --staging {BOOLEAN}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Version to publish (defaults to config:LUIS:versionId)'}),
    staging: flags.boolean({description: 'Publishes application version to Staging slot, otherwise publish to production (default: false)'}),
    direct: flags.boolean({description: 'Available only in direct version query. Do not publish to staging or production (default: false)'})
  }

  async run() {
    const {flags} = this.parse(LuisApplicationPublish)
    const flagLabels = Object.keys(LuisApplicationPublish.flags)
    const configDir = this.config.configDir

    const {
      endpoint,
      subscriptionKey,
      appId,
      versionId,
      staging,
      direct
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    const applicationPublishObject = {
      versionId,
      isStaging: staging,
      directVersionPublish: direct
    }

    try {
      let url = endpoint + '/luis/authoring/v3.0-preview/apps/' + appId + '/publish'
      const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
      const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(applicationPublishObject)})
      const messageData = await response.json()

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      this.log(`${JSON.stringify(messageData, null, 2)}`)
    } catch (err) {
      throw new CLIError(`Failed to publish app: ${err}`)
    }
  }
}
