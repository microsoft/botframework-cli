import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerListIndex extends Command {
  static description = 'List QnA MAker resources (Alterations and Endpoint Keys)'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Display qnamaker:list available commands'}),
  }

  async run() {
    this._help()
  }
}
