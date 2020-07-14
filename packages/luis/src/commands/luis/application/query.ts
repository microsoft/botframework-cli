/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationQuery extends Command {
  static description = 'Queries application for intent predictions'

  static examples = [`
    $ bf luis:application:query --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --query {QUERY} --prod {BOOLEAN}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    query: flags.string({description: '(required) Query string to predict'}),
    staging: flags.boolean({description: 'Presence of flag targets the staging app, if no flag passed defaults to production'}),
    verbose: flags.boolean({description: 'Returns all intents, otherwise only top scoring intent. (default: false)'}),
    timezoneOffset: flags.string({description: 'Timezone offset for the location of the request in minutes (optional)'}),
    log: flags.boolean({description: 'Logs query operation on service (default: true)'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationQuery)
    const flagLabels = Object.keys(LuisApplicationQuery.flags)
    const configDir = this.config.configDir

    const {
      endpoint,
      subscriptionKey,
      appId,
      staging,
      query,
      verbose,
      timezoneOffset,
      log
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, query}
    utils.validateRequiredProps(requiredProps)

    let slotName = 'production'

    if (staging) slotName = 'staging'

    try {
      const predictionData = await Application.query({subscriptionKey, endpoint, appId}, slotName, query, log, verbose, timezoneOffset)
      this.log(`${JSON.stringify(predictionData, null, 2)}`)
    } catch (err) {
      throw new CLIError(`Failed to fetch prediction data: ${err}`)
    }
  }
}
