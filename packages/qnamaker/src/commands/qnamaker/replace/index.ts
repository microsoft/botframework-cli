import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerReplaceIndex extends Command {
  static description = 'Replace QnA maker resources'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:replace available commands'}),

  }

  async run() {
    this._help()
  }
}
