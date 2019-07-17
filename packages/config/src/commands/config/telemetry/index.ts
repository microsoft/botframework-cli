import {Command, flags} from '@microsoft/bf-cli-command'

export default class ConfigTelemetryIndex extends Command {
  static description = 'The telemetry commands allow the user to enable and disable telemetry'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
