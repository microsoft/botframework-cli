/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationAssignazureaccount extends Command {
  static description = 'Assign a LUIS azure accounts to an application'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    azureSubscriptionId: flags.string({description: 'Azure Subscription Id', required: true}),
    resourceGroup: flags.string({description: 'Resource Group', required: true}),
    accountName: flags.string({description: 'Account name', required: true}),
    armToken: flags.string({description: 'The bearer authorization header to use; containing the user`s ARM token used to validate azure accounts information', required: true}),
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
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    const appJSON = {
      azureSubscriptionId: flags.azureSubscriptionId,
      resourceGroup: flags.resourceGroup,
      accountName: flags.accountName,
    }

    try {
      let url = endpoint + '/luis/authoring/v3.0-preview/apps/' + appId + '/azureaccounts'
      const headers = {
        Authorization: 'Bearer ' + flags.armToken,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
      const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(appJSON)})
      const messageData = await response.json()

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      const output: string = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : 'Account successfully assigned.'
      this.log(output)

    } catch (err) {
      throw new CLIError(`Failed to assign accout: ${err}`)
    }
  }
}
