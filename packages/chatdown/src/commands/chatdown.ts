import {Command, flags} from '@oclif/command'
const runProgram = require('../utils/chatdown.js')

export default class Chatdown extends Command {
  static description = 'Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file'

  static examples = ['$ bf chatdown']

  static flags = {
    help: flags.help({char: 'h'}),
    static: flags.boolean({description: 'Use static timestamps when generating timestamps on activities.'}),
  }

  static args = [{name: 'chat', description: 'The path of the chat file to be parsed. If omitted, stdin will be used.'}]

  async run() {
    const {argv} = this.parse(Chatdown)
    await runProgram.runChatdown(argv)
  }
}
