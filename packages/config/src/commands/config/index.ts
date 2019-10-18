import {Command, flags} from '@oclif/command'

export default class ConfigIndex extends Command {
  static description = 'Configure various settings within the cli.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
