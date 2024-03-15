/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'
import { loadHelpClass } from '@oclif/core'

export default class ConfigSetQnamaker extends Command {
  static description = 'Set the QnAMaker config data'

  static flags = {
    kbId: Flags.string({description: 'QnAMaker kbId to be set'}),
    subscriptionKey: Flags.string({description: 'QnAMaker subscriptionkey to be set'}),
    hostname: Flags.string({description: 'QnAMaker hostname to be set'}),
    endpointKey: Flags.string({description: 'QnAMaker endpointKey to be set'}),
    help: Flags.help({char: 'h', description: 'config:set:qnamaker help'})
  }

  static examples = [`
  {
    "qnamaker_kbId": "3bda64af-dddd-dddd-dddd-021906b093b1",
    "qnamaker_subscriptionKey": "nnnnnnnnnnnnnnnnnnnnnnnnn",
    "qnamaker_endpointKey": "6b5ecf9c-kkkk-kkkk-kkkk-761489817e5f",
    "qnamaker_hostname": "https://{qnaservice-hostname}.azurewebsites.net"
  }
  `]

  async run() {
    const {flags} = await this.parse(ConfigSetQnamaker)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    if (flags.subscriptionKey) {
      this.setValue('subscriptionKey', flags.subscriptionKey, userConfig)
    }

    if (flags.kbId) {
      this.setValue('kbId', flags.kbId, userConfig)
    }

    if (flags.hostname) {
      this.setValue('hostname', flags.hostname, userConfig)
    }

    if (flags.endpointKey) {
      this.setValue('endpointKey', flags.endpointKey, userConfig)
    }

    if (flags.kbId || flags.subscriptionKey || flags.hostname || flags.endpointKey) {
      await writeConfigFile(this.config.configDir, userConfig)
    } else {
      this.log('Plase specify flag')
      await new (await loadHelpClass(this.config))(this.config).showHelp([])
    }
  }

  setValue(key: string, value: string, userConfig: Config) {
    userConfig['qnamaker__' + key] = value
    this.log(`${key} set to ${value}`)
  }
}
