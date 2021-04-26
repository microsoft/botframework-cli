/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationAssignazureaccount extends Command {
  static description = 'Assign a LUIS azure accounts to an application'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:set:luis --appId {APPLICATION_ID})'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:set:luis --subscriptionKey {SUBSCRIPTION_KEY})'}),
    azureSubscriptionId: flags.string({description: 'Azure Subscription Id', required: true}),
    resourceGroup: flags.string({description: 'Resource Group', required: true}),
    accountName: flags.string({description: 'Account name', required: true}),
    armToken: flags.string({description: '(required) User`s ARM token used to validate azure accounts information (default: config:set:luis --armToken {ARM_TOKEN})'}),
    json: flags.boolean({description: 'Display output as JSON'})
  }

  async run() {
    const {flags} = this.parse(LuisApplicationAssignazureaccount)
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
