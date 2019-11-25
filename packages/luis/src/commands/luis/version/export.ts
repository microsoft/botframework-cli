/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisVersionExport extends Command {
  static description = 'Exports a LUIS application to JSON format'

  static examples = [`
    $ bf luis:version:export --appId {APP_ID} --versionId {VERSION_ID} --out {FILENAME.json or PATH/FILENAME.json} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: 'LUIS application Id'}),
    versionId: flags.string({description: 'LUIS application version Id'}),
    out: flags.string({char: 'o', description: 'Path to the directory where the exported file will be placed.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)'}),
  }

  async run() {
    const {flags} = this.parse(LuisVersionExport)
    const flagLabels = Object.keys(LuisVersionExport.flags)
    const configDir = this.config.configDir

    let {
      appId,
      versionId,
      endpoint,
      force,
      out,
      subscriptionKey,
    } = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {appId, versionId, endpoint, subscriptionKey}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const appJSON = await client.versions.exportMethod(appId, versionId)
      if (!appJSON) throw new CLIError('Failed to export file')
      if (out) {
        const writtenFilePath: string = await utils.writeToFile(out, appJSON, force)
        this.log(`File successfully written: ${writtenFilePath}`)
      } else {
        await utils.writeToConsole(appJSON)
        this.log('App successfully exported\n')
      }
    } catch (error) {
      throw new CLIError(error)
    }
  }
}
