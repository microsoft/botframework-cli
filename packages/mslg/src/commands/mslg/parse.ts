import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const {Parser} = require('../../utils/parser')

export default class MslgParse extends Command {
  static description = 'Parse any provided .lg file and collate them into a single lg file.'

  static examples = [`
  $ bf mslg parse --in examples/exceptionExamples/EmptyTemplate.lg
  $ bf mslg parse -l examples/validExamples -s --out finalResult -c`]

  static flags = {
    in: flags.string({description: 'The .lg file to parse'}),
    lg_folder: flags.string({description: 'Folder that has the .lg file. By default mslg will only look at the current folder. To look at all subfolders, include -s.'}),
    subfolder: flags.boolean({description: 'Include sub-folders as well when looking for .lg files.'}),
    out: flags.string({description: 'Output .lg file name.'}),
    out_folder: flags.string({description: 'Output folder for all files the tool will generate.'}),
    stdin: flags.boolean({description: 'Read .lg file as stream from stdin to validate and collate.'}),
    stdout: flags.boolean({description: 'When set, write out the final file to stdout.'}),
    verbose: flags.boolean({description: 'Flag option used to request verbose output. With this option set, additional useful parse, validate and collate logs are written to stdout.'}),
    collate: flags.boolean({description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    help: flags.help({description: 'Output usage information.'})
  }

  async run() {
    try {
      const {flags} = this.parse(MslgParse)
      const parser: any = new Parser()
      await parser.Parser(flags)
    } catch (error) {
      throw new CLIError(error.message)
    }
  }
}
