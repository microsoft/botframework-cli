import {Command, flags} from '@microsoft/bf-cli-command'

export default class MslgParse extends Command {
  static description = 'Parse any provided .lg file and collate them into a single lg file.'

  static flags = {
    help: flags.help({char: 'h', description: 'Display MSLG CLI available commnads'}),
  }

  async run() {
    this._help()
  }
}