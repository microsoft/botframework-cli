import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const {Expander} = require('../../utils/expander')

export default class MslgExpand extends Command {
  static description = 'Expand one or all templates in a .lg file or an inline expression.'

  static examples = [`
  $ bf mslg expand --in examples/validExamples/simple.lg -t FinalGreeting`]

  static flags = {
    in: flags.string({required: true, description: 'The .lg file to expand'}),
    template: flags.string({description: 'Name of the template to expand. Template names with spaces must be enclosed in quotes.'}),
    inline: flags.string({description: 'Inline expression provided as a string to evaluate.'}),
    all: flags.boolean({description: 'Flag option to request that all templates in the .lg file be expanded.'}),
    interactive: flags.boolean({description: 'Flag option to request that all missing entity value references be obtained through interactive prompts.'}),
    testInput: flags.string({description: 'Full or relative path to a JSON file containing test input for all variable references.'}),
    help: flags.help({description: 'Output usage information.'})
  }

  async run() {
    try {
      const {flags} = this.parse(MslgExpand)
      const expander: any = new Expander()
      await expander.Expand(flags)
    } catch (error) {
      throw new CLIError(error.message)
    }
  }
}
