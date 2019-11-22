/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationQuery extends Command {
  static description = 'Queries application for intent predictions'

  static examples = [`
    $ bf luis:application:query --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --culture {CULTURE}
    --domain {DOMAIN} --description {DESCRIPTION} --versionId {INITIAL_VERSION_ID} --usageScenario {USAGE_SCENARIO}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: 'LUIS application Id (mandatory, defaults to config:LUIS:appId)'}),
    query: flags.string({description: 'Query string to predict (mandatory)'}),
    verbose: flags.string({description: 'Returns all intents, otherwise only top scoring intent. (default: false)'}),
    spellcheck: flags.string({description: 'Performs spell checking (optional, default: false)'}),
    staging: flags.string({description: 'Uses staging endpoint slot, otherwise prod endpoint (default: false)'}),
    spellcheckKey: flags.string({description: 'Bing spell-check subscription key (required for spell checking, otherwise optional)'}),
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
      query,
      verbose,
      spellcheck,
      staging,
      spellcheckKey,
      timezoneOffset,
      log
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, query}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)
    const options = {}

    const applicationCreateObject = {name, culture, description, versionId, usageScenario, tokenizerVersion}

    try {
      const newAppId = await client.apps.add(applicationCreateObject, options)
      this.log(`App successfully created with id ${newAppId}.`)
    } catch (err) {
      throw new CLIError(`Failed to create app: ${err}`)
    }
  }
}

