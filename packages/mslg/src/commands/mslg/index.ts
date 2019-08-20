import {Command, flags} from '@microsoft/bf-cli-command'

export default class MslgIndex extends Command {
  static description = 'MSLG is a command line tool to parse, collate, expand and translate lg files.'

  static flags = {
    help: flags.help({char: 'h', description: 'Display MSLG CLI available commnads'}),
  }

  async run() {
    this._help()
  }
}
