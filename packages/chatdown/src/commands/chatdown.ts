import {flags} from '@oclif/command'
import {Command} from 'cli-command'
const runProgram = require('../utils/chatdown.js')

export default class Chatdown extends Command {
  static description = 'Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file'

  static examples = ['$ bf chatdown']

  static flags = {
    help: flags.help({char: 'h'}),
    static: flags.boolean({description: 'Use static timestamps when generating timestamps on activities.'}),
    folder: flags.string({char: 'f'}),
    out_folder: flags.string({char: 'o'}),
    version: flags.boolean({char: 'v'}),
    prefix: flags.boolean()
  }

  static args = [{name: 'chat', description: 'The path of the chat file to be parsed. If omitted, stdin will be used.'}]

  async run() {
    try {
      const {flags, argv} = this.parse(Chatdown)
      await runProgram.runChatdown(argv.length === 0 ? flags : argv)

    } catch (err) {
      if (err instanceof Error) {
        this.error(err)
      } else {
        this._help()
      }
      this.exit(1)
    }
  }
}
