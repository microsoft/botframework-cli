/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigSetQnamaker extends Command {
  static description = 'Set the QnAMaker config data'

  static flags = {
    kbId: flags.string({description: 'QnAMaker kbId to be set'}),
    subscriptionKey: flags.string({description: 'QnAMaker subscriptionkey to be set'}),
    hostname: flags.string({description: 'QnAMaker hostname to be set'}),
    endpointKey: flags.string({description: 'QnAMaker endpointKey to be set'}),
  }

  async run() {
    const {flags} = this.parse(ConfigSetQnamaker)
    let userConfig: Config = await getConfigFile(this.config.configDir)

    if (flags.subscriptionKey) {
      this.setValue('qnamaker__subscriptionKey', flags.subscriptionKey, userConfig)
    }

    if (flags.kbId) {
      this.setValue('qnamaker__kbId', flags.kbId, userConfig)
    }

    if (flags.hostname) {
      this.setValue('qnamaker__hostname', flags.hostname, userConfig)
    }

    if (flags.endpointKey) {
      this.setValue('qnamaker__endpointKey', flags.endpointKey, userConfig)
    }

    if (flags.kbId || flags.subscriptionKey || flags.hostname || flags.endpointKey) {
      await writeConfigFile(this.config.configDir, userConfig)
    } else {
      this.log('Plase specify flag')
      this._help()
    }
  }

  setValue(key: string, value: string, userConfig: Config) {
    userConfig[key] = value
    this.log(`${key} set to ${value}`)
  }
}
