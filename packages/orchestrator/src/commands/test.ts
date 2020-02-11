import {Command, flags} from '@microsoft/bf-cli-command'

export default class Test extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Test)

    const name = flags.name || 'world'
    this.log(`hello ${name} from D:\\src\\botframework-cli\\packages\\orchestrator\\src\\commands\\test.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
