import {Command, flags} from '@microsoft/bf-cli-command'

export default class ConfigIndex extends Command {
  static description = 'The config plugin allows users to configure various settings within the cli.'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
