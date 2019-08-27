import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerGetIndex extends Command {
  static description = 'Get resources data (Kb and OperationDetails)'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Display qnamaker:get available commands'}),
  }

  async run() {
    this._help()
  }
}
