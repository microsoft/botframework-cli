import {Command, flags} from '@microsoft/bf-cli-command'
import {getConfigFile, writeConfigFile, Config} from '../../../utils/configfilehandler'

export default class ConfigSetTelemetry extends Command {
  static description = 'Enable or disable telemetry'

  static flags = {
    help: flags.help({char: 'h'}),
    disable: flags.boolean({char: 'd', description: 'Disable tlemetry'}),
    enable: flags.boolean({char: 'e', description: 'Enable tlemetry'})
  }

  async run() {
    const {flags} = this.parse(ConfigSetTelemetry)
    let userConfig: Config = await getConfigFile(this.config.configDir)
    if (!flags.enable && !flags.disable) {
      this._help()
    }
    userConfig.telemetry = flags.enable ? true : false
    await writeConfigFile(this.config.configDir, userConfig)
    this.log('Telemetry set to ' + !flags.disable)
  }
}
