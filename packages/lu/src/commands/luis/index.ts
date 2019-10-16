import {Command, flags} from '@microsoft/bf-cli-command'

export default class LuisIndex extends Command {
  static description = 'Convert, translate luis/lu files or generate source code'

  static flags = {
    help: flags.help({char: 'h', description: 'Display Luis available commnads'}),
  }

  async run() {
    this._help()
  }
}
