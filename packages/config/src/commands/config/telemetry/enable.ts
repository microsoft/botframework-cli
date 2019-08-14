import {Command, flags} from '@oclif/command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigTelemetryEnable extends Command {
  static description = 'Enable Telemetry'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    let userConfig: Config = await getConfigFile(this.config.configDir)
    userConfig.telemetry = true
    await writeConfigFile(this.config.configDir, userConfig)
    this.log('Telemetry has been enabled.')
  }
}
