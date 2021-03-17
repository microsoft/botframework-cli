/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from './../../utils/configfilehandler'

export default class ConfigRemove extends Command {
  static description = 'Removes the specified key from the config file'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'config:remove help'}),
    key: flags.string({char: 'k', description: 'Name of the key to remove', required: true}),
  }

  async run() {
    const {flags} = this.parse(ConfigRemove)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    if (userConfig[flags.key]) {
      delete userConfig[flags.key]
      await writeConfigFile(this.config.configDir, userConfig)
    }
    this.log(`${flags.key} deleted`)
  }
}
