import {Command} from 'cli-command'
import {flags} from '@oclif/command'

export default class Telemetry extends Command {
  static description = 'The telemetry commands allow the user to enable and disable telemetry.'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    this.log(Telemetry.description)
  }
}