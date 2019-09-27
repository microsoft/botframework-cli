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
      this._help()
    }
  }

  setValue(key: string, value: string, userConfig: Config) {
    let qnamaker = userConfig.qnamaker
    if (!qnamaker) {
      userConfig.qnamaker = {}
    }

    userConfig.qnamaker[key] = value
    this.log(`${key} set to ${value}`)
  }
}
