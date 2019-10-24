/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigShowQnamaker extends Command {
  static description = 'Display QnAMaker settings'

  static flags = {
    help: flags.help({char: 'h', description: 'config:show:qnamaker help'})
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    let qnaMaker: any = {}
    Object.keys(userConfig).forEach((key: string) => {
      if (key.startsWith('qnamaker__')) {
        qnaMaker[key] = userConfig[key]
      }
    })
    this.log(JSON.stringify(qnaMaker, null, 2))
  }
}
