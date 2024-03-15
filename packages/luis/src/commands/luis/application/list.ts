/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

import Application from './../../../api/application'

const utils = require('../../../utils/index')

export default class LuisApplicationList extends Command {
  static description = 'Lists all applications on LUIS service.'

  static examples = [`
    $ bf luis:application:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --take 3
    $ bf luis:application:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --out {PATH_TO_JSON_FILE}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    out: Flags.string({char: 'o', description: 'Output results to specified file in JSON format, otherwise prints to STDOUT (optional)'}),
    force: Flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    skip: Flags.string({description: 'Number of entries to skip. Default: 0 (no skips)'}),
    take: Flags.string({description: 'Number of etnries to return. Maximum page size is 500. Default: 100'}),
  }

  async run() {
    const {flags} = await this.parse(LuisApplicationList)
    const flagLabels = Object.keys(LuisApplicationList.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, force, out, skip, take} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    try {
      const appList = await Application.list({subscriptionKey, endpoint}, skip, take)
      if (out) {
        const writtenFilePath: string = await utils.writeToFile(out, appList, force)
        this.log(`\nList successfully written to file: ${writtenFilePath}`)
      } else {
        await utils.writeToConsole(appList)
      }
    } catch (err) {
      throw new CLIError(`Failed to export application list: ${err}`)
    }
  }

}
