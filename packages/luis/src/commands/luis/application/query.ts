/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationQuery extends Command {
  static description = 'Queries application for intent predictions'

  static examples = [`
    $ bf luis:application:query --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --query {QUERY} --prod {BOOLEAN}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
    query: flags.string({description: 'Query string to predict (mandatory)'}),
    staging: flags.string({description: 'A value of \'true\' targets the staging app, \'false\' defaults to production'}),
    verbose: flags.string({description: 'Returns all intents, otherwise only top scoring intent. (default: false)'}),
    timezoneOffset: flags.string({description: 'Timezone offset for the location of the request in minutes (optional)'}),
    log: flags.string({description: 'Logs query operation on service (default: true)'}),
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

    const client = utils.getLUISClient(subscriptionKey, endpoint, true)
    const options: any = {}

    let slotName = 'production'

    if (staging === 'true') slotName = 'staging'

    if (verbose) {
      options.verbose = verbose
    }

    if (log) {
      options.log = log
    }

    const predictionRequest: any = {query}

    if (timezoneOffset) {
      const options: any = {
        datetimeReference: timezoneOffset
      }
      predictionRequest.options = options
    }

    try {
      const predictionData = await client.predictionOperations.getSlotPrediction(appId, slotName, predictionRequest, options)
      this.log(`Successfully fetched prediction data ${JSON.stringify(predictionData)}.`)
    } catch (err) {
      throw new CLIError(`Failed to fetch prediction data: ${err}`)
    }
  }
}
