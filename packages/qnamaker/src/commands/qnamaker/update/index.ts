import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerUpdateIndex extends Command {
  static description = 'Updates KB or Endpoint settings'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:update available commands'}),

  }

  async run() {
    this._help()
  }
}
