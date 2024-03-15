/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'
const utils = require('../../../utils/index')

export default class LuisVersionList extends Command {
  static description = 'Returns application\'s versions'

  static examples = [`
    $ bf luis:version:list --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --take 3
    $ bf luis:version:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --out {PATH_TO_JSON_FILE}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    out: Flags.string({char: 'o', description: 'Output results to specified folder and/or file in JSON format, otherwise prints to STDOUT (optional)'}),
    skip: Flags.string({description: 'Number of entries to skip. Default: 0 (no skips)'}),
    take: Flags.string({description: 'Number of etnries to return. Maximum page size is 500. Default: 100'}),
    force: Flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
  }

  async run() {
    const {flags} = await this.parse(LuisVersionList)
    const flagLabels = Object.keys(LuisVersionList.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId, force, out, skip, take} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    try {
      const versionList = await Version.list({subscriptionKey, endpoint, appId}, skip, take)
      if (out) {
        const writtenFilePath: string = await utils.writeToFile(out, versionList, force)
        this.log(`\nList successfully written to file: ${writtenFilePath}`)
      } else {
        await utils.writeToConsole(versionList)
      }
    } catch (err) {
      throw new CLIError(`Failed to export versions list: ${err}`)
    }
  }

}
