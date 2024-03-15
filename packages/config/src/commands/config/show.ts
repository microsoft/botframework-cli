/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../utils/configfilehandler'

export default class ConfigShow extends Command {
  static description = 'Displays the config file'

  static flags = {
    key: Flags.string({char: 'k', description: 'Shows specific key value'}),
    help: Flags.help({char: 'h', description: 'config:show help'})
  }

  async run() {
    const {flags} = await this.parse(ConfigShow)
    const userConfig: Config = await getConfigFile(this.config.configDir)
    let value
    if (flags.key) {
      value = userConfig[flags.key] ? userConfig[flags.key] : 'undefined'
    } else {
      value = userConfig
    }
    this.log(JSON.stringify(value, null, 2))
  }
}
