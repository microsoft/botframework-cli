import {Command, flags} from '@oclif/command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigQnamakerSet extends Command {
  static description = 'Set the QnAMaker config data'

  static flags = {
    kbid: flags.string({description: 'QnAMaker kbid to be set'}),
    subscriptionkey: flags.string({description: 'QnAMaker subscriptionkey to be set'}),
  }

  async run() {
    const {flags} = this.parse(ConfigQnamakerSet)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    let qnamaker = userConfig.qnamaker

    if (flags.subscriptionkey) {
      if (qnamaker) {
        qnamaker.subscriptionKey = flags.subscriptionkey
      } else {
        userConfig.qnamaker = {subscriptionKey: flags.subscriptionkey}
      }
      this.log('Subscriptionkey set to ' + flags.subscriptionkey)
    }

    if (flags.kbid) {
      if (qnamaker) {
        qnamaker.kbId = flags.kbid
      } else {
        userConfig.qnamaker = {kbId: flags.kbid}
      }
      this.log('Kbid set to ' + flags.kbid)
    }

    if (flags.kbid || flags.subscriptionkey) {
      await writeConfigFile(this.config.configDir, userConfig)
    } else {
      this.log('Plase specify flag')
      this._help()
    }
  }
}
