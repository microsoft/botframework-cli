/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'

const utils = require('../../../utils/index')

export default class LuisVersionClone extends Command {
  static description = 'Creates a new version equivalent to the current snapshot of the selected application version.'

  static examples = [`
    $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Source version to clone (defaults to config:LUIS:versionId)'}),
    targetVersionId: flags.string({description: '(required) Destination version to create'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS authoring (Ocp-Apim-subscription) key'}),
    json: flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = this.parse(LuisVersionClone)
    const flagLabels = Object.keys(LuisVersionClone.flags)
    const configDir = this.config.configDir

    const {appId, endpoint, subscriptionKey, versionId, targetVersionId} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey, versionId, targetVersionId}
    utils.validateRequiredProps(requiredProps)

    try {
      const messageData = await Version.clone({subscriptionKey, endpoint, appId}, flags.versionId, flags.targetVersionId)

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      const output = flags.json ? JSON.stringify({Status: 'Success', version: messageData}, null, 2) : `App successfully cloned. Latest version is now: ${messageData}`
      this.log(output)
    } catch (err) {
      throw new CLIError(`Failed to clone app: ${err}`)
    }
  }
}
