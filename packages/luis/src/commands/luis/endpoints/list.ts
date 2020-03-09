/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisEndpointsList extends Command {
  static description = 'Returns available deployment endpoints'

  static examples = [`
    $ bf luis:endpoints:list --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --out {PATH_TO_JSON_FILE}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    out: flags.string({char: 'o', description: 'Output results to specified file in JSON format, otherwise prints to STDOUT (optional)'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
  }

  async run() {
    const {flags} = this.parse(LuisEndpointsList)
    const flagLabels = Object.keys(LuisEndpointsList.flags)
    const configDir = this.config.configDir
    const options: any = {}

    let {endpoint, subscriptionKey, appId, force, out} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const endpointsList = await client.apps.listEndpoints(appId, options)
      if (out) {
        const writtenFilePath: string = await utils.writeToFile(out, endpointsList, force)
        this.log(`\nList successfully written to file: ${writtenFilePath}`)
      } else {
        await utils.writeToConsole(endpointsList)
      }
    } catch (err) {
      throw new CLIError(`Failed to export endpoints list: ${err}`)
    }
  }

}
