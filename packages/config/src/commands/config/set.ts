/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from './../../utils/configfilehandler'

export default class ConfigSet extends Command {
  static description = 'Adds the specified key and value to the config file'

  static flags = {
    key: Flags.string({char: 'k', description: 'Name of the key to add or override', required: true}),
    value: Flags.string({char: 'v', description: 'Value associated with the specified key', required: true}),
    help: Flags.help({char: 'h', description: 'config:set help'})
  }

  async run() {
    const {flags} = await this.parse(ConfigSet)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    userConfig[flags.key] = flags.value
    await writeConfigFile(this.config.configDir, userConfig)
    this.log(`${flags.key} set to ${flags.value}`)
  }
}
