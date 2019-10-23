/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../utils/configfilehandler'

export default class ConfigShow extends Command {
  static description = 'Displays the config file'

  static flags = {
    help: flags.help({char: 'h', description: 'config:show help'})
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    this.log(JSON.stringify(userConfig, null, 2))
  }
}
