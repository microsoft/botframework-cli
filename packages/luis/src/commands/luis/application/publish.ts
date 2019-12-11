/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationPublish extends Command {
  static description = 'Publishes application\'s version'

  static examples = [`
    $ bf luis:application:publish --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {INITIAL_VERSION_ID} --appId {APP_ID} --staging {BOOLEAN}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: 'Version to publish (mandatory, defaults to config:LUIS:versionId)'}),
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

    const applicationCreateObject = {
      versionId,
      isStaging: staging,
      directVersionPublish: direct
    }

    try {
      const publishedAppData = await client.apps.publish(appId, applicationCreateObject)
      this.log(`${JSON.stringify(publishedAppData, null, 2)}`)
    } catch (err) {
      throw new CLIError(`Failed to publish app: ${err}`)
    }
  }
}
