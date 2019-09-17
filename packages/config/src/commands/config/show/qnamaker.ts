import {Command, flags} from '@oclif/command'
import {getConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigShowQnamaker extends Command {
  static description = 'Display QnAMaker settings'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    this.log(JSON.stringify(userConfig.qnamaker, null, 2))
  }
}
