/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'
import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationAssignazureaccount extends Command {
  static description = 'Assign a LUIS azure accounts to an application'

  static flags = {
    help: Flags.help({char: 'h'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:set:luis --appId {APPLICATION_ID})'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:set:luis --subscriptionKey {SUBSCRIPTION_KEY})'}),
    azureSubscriptionId: Flags.string({description: 'Azure Subscription Id', required: true}),
    resourceGroup: Flags.string({description: 'Resource Group', required: true}),
    accountName: Flags.string({description: 'Account name', required: true}),
    armToken: Flags.string({description: '(required) User`s ARM token used to validate azure accounts information (default: config:set:luis --armToken {ARM_TOKEN})'}),
    json: Flags.boolean({description: 'Display output as JSON'})
  }

  async run() {
    const {flags} = await this.parse(LuisApplicationAssignazureaccount)
    const flagLabels = Object.keys(LuisApplicationAssignazureaccount.flags)
    const configDir = this.config.configDir

    const {
      appId,
      endpoint,
      subscriptionKey,
      armToken
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey, armToken}
    utils.validateRequiredProps(requiredProps)

    try {
      const messageData = await Application.assignAzureAccount(
        {appId, endpoint, subscriptionKey},
        armToken,
        flags.azureSubscriptionId,
        flags.resourceGroup,
        flags.accountName
      )

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      const output: string = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : 'Account successfully assigned.'
      this.log(output)

    } catch (err) {
      throw new CLIError(`Failed to assign account: ${err}`)
    }
  }
}
