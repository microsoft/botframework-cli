/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../utils/configfilehandler'

export default class ConfigShow extends Command {
  static description = 'Displays the config file'

  static flags: any = {
    key: flags.string({char: 'k', description: 'Shows specific key value'}),
    help: flags.help({char: 'h', description: 'config:show help'})
  }

  async run() {
    const {flags} = this.parse(ConfigShow)
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
