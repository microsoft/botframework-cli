/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

import Version from './../../../api/version'

const utils = require('../../../utils/index')

export default class LuisVersionExport extends Command {
  static description = 'Exports a LUIS application to JSON format'

  static examples = [`
    $ bf luis:version:export --appId {APP_ID} --versionId {VERSION_ID} --out {FILENAME.json or PATH/FILENAME.json} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Version to export (defaults to config:LUIS:versionId)'}),
    exportLU: flags.boolean({description: 'Export format type as LU'}),
    out: flags.string({char: 'o', description: 'Save exported application to specified file, uses STDOUT if not specified (optional)'}),
    force: flags.boolean({char: 'f', description: 'Overwrites output file if exists, otherwise creates a parallel numbered file (optional)', default: false}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
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

    try {
      const messageData = await Version.export({subscriptionKey, endpoint, appId}, versionId, flags.exportLU ? 'lu' : 'json')

      if (messageData.error) {
        throw new CLIError(messageData.error.message)
      }

      if (out) {
        const writtenFilePath: string = await utils.writeToFile(out, messageData, force)
        this.log(`File successfully written: ${writtenFilePath}`)
      } else {
        this.log(flags.exportLU ? messageData : JSON.stringify(messageData, null, 2))
      }
    } catch (error) {
      throw new CLIError(error)
    }
  }
}
