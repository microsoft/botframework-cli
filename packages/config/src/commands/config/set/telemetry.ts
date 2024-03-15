/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'
import { loadHelpClass } from '@oclif/core'

export default class ConfigSetTelemetry extends Command {
  static description = 'Enable or disable anonymous data collection to improve the products. (Command group calls and flags usage)'

  static flags = {
    disable: Flags.boolean({char: 'd', description: 'Disable tlemetry'}),
    enable: Flags.boolean({char: 'e', description: 'Enable tlemetry'}),
    help: Flags.help({char: 'h', description: 'config:set:telemetry help'})
  }

  async run() {
    const {flags} = await this.parse(ConfigSetTelemetry)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    if (!flags.enable && !flags.disable) {
      await new (await loadHelpClass(this.config))(this.config).showHelp([])
    }
    userConfig.telemetry = flags.enable ? true : false
    await writeConfigFile(this.config.configDir, userConfig)
    this.log('Telemetry set to ' + userConfig.telemetry)
  }
}
