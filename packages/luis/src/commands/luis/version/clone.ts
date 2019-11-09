/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command} from '@microsoft/bf-cli-command'
import {flags} from '@oclif/command'

const utils = require('../../../../utils/index')

export default class LuisVersionClone extends Command {
  static description = 'Creates a new version equivalent to the current snapshot of the selected application version.'

  static examples = [`
    $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: 'LUIS application Id'}),
    versionId: flags.string({description: 'LUIS version Id'}),
    targetVersionId: flags.string({description: 'LUIS target version Id'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
  }

  async run() {
    try {
      const {flags} = this.parse(LuisVersionClone)

      const appId = flags.appId || await utils.getPropFromConfig('appId')
      const endpoint = flags.endpoint || await utils.getPropFromConfig('endpoint')
      const subscriptionKey = flags.subscriptionKey || await utils.getPropFromConfig('subscriptionKey')
      const versionId = flags.versionId || await utils.getPropFromConfig('versionId')
      const targetVersionId = flags.targetVersionId || await utils.getPropFromConfig('targetVersionId')

      const requiredProps = {appId, endpoint, subscriptionKey, versionId, targetVersionId}
      utils.validateRequiredProps(requiredProps)

      const client = utils.getLUISClient(subscriptionKey, endpoint)
      const options = {
        versionCloneObject: {
          version: targetVersionId
        }
      }

      try {
        const latestVersion = await client.versions.clone(appId, versionId, options)
        this.log(`App successfully cloned. Latest version is now: ${latestVersion}`)
      } catch (err) {
        throw new CLIError(`Failed to clone app: ${err}`)
      }

    } catch (err) {
      if (err.message.match(/Malformed configurations options detected/)) {
        throw new CLIError(err.message)
      }
      throw err
    }

  }
}
