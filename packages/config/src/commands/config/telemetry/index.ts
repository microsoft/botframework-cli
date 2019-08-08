import {Command, flags} from '@oclif/command'

export default class ConfigTelemetryIndex extends Command {
  static description = 'The telemetry commands allow the user to enable and disable telemetry'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
