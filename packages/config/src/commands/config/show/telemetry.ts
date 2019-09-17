import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigShowTelemetry extends Command {
  static description = 'Display telemetry settings'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const userConfig: Config = await getConfigFile(this.config.configDir)
    this.log(JSON.stringify(userConfig.telemetry, null, 2))
  }
}
