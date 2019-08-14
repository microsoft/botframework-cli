import {Command, flags} from '@oclif/command'
import {getConfigFile, writeConfigFile, Config} from '../../utils/configfilehandler'

export default class ConfigGet extends Command {
  static description = 'Displays the config file'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    this.log(JSON.stringify(userConfig, null, 2))
  }
}
