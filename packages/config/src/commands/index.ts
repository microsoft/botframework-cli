import {Command, flags} from '@oclif/command'

export default class Index extends Command {
  static description = 'The config plugin allows users to configure various settings within the cli.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
