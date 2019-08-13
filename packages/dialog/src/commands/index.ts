import { Command, flags } from '@oclif/command';

export default class Index extends Command {
  static description = 'The dialog commands allow you to work with dialog schema.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}