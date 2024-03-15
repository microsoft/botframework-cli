/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigShowTelemetry extends Command {
  static description = 'Display telemetry settings'

  static flags = {
    help: Flags.help({char: 'h', description: 'config:show:telemetry help'})
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    this.log(JSON.stringify(userConfig.telemetry, null, 2))
  }
}
