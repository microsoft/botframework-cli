import {Command, flags} from '@oclif/command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigTelemetryDisable extends Command {
  static description = 'Disable telemetry'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    let userConfig: Config = await getConfigFile(this.config.configDir)
    userConfig.telemetry = false
    await writeConfigFile(this.config.configDir, userConfig)
    this.log('Telemetry has been disabled.')
  }
}
