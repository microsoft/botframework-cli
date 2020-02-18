/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigShowLuis extends Command {
  static description = 'Display LUIS settings'

  static flags: any = {
    help: flags.help({char: 'h', description: 'config:show:luis help'})
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    let luis: any = {}
    Object.keys(userConfig).forEach((key: string) => {
      if (key.startsWith('luis__')) {
        luis[key] = userConfig[key]
      }
    })
    this.log(JSON.stringify(luis, null, 2))
  }
}
