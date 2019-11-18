/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisApplicationCreate extends Command {
  static description = 'Creates a new LUIS application'

  static examples = [`
    $ bf luis:application:create --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --culture {CULTURE}
    --domain {DOMAIN} --description {DESCRIPTION} --versionId {INITIAL_VERSION_ID} --usageScenario {USAGE_SCENARIO}
  `]

  static flags = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
    name: flags.string({description: 'LUIS application name'}),
    culture: flags.string({description: 'LUIS application culture'}),
    description: flags.string({description: 'LUIS application description'}),
    versionId: flags.string({description: 'LUIS application initial version Id'}),
    tokenizerVersion: flags.string({description: 'Version specifies how sentences are tokenized.'}),
  }

  async run() {
    const {flags} = this.parse(LuisApplicationCreate)
    const flagLabels = Object.keys(LuisApplicationCreate.flags)
    const configDir = this.config.configDir

    const {
      endpoint,
      subscriptionKey,
      name,
      culture,
      description,
      versionId,
      tokenizerVersion
    } = await utils.processInputs(flags, flagLabels, configDir)

    const usageScenario = 'Bot Framework'

    const requiredProps = {endpoint, subscriptionKey, name}
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
