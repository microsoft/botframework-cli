import {Command, flags} from '@microsoft/bf-cli-command'
import {Parser} from '../../utils/parser';

export default class MslgParse extends Command {
  static description = 'Parse any provided .lg file and collate them into a single lg file.'

  static examples = [`
  $ bf mslg parse --in examples/exceptionExamples/EmptyTemplate.lg
  $ bf mslg parse -l examples/validExamples -s --out finalResult -c`]

  static flags = {
    in: flags.string({required: true, description: 'The .lg file to parse'}),
    lg_folder: flags.string({char: 'l', description: 'Folder that has the .lg file. By default mslg will only look at the current folder. To look at all subfolders, include -s.'}),
    subfolder: flags.boolean({char: 's', description: 'Include sub-folders as well when looking for .lg files.'}),
    out: flags.string({description: 'Output .lg file name.'}),
    out_folder: flags.string({char: 'o', description: 'Output folder for all files the tool will generate.'}),
    stdin: flags.boolean({description: 'Read .lg file as stream from stdin to validate and collate.'}),
    stdout: flags.boolean({description: 'When set, write out the final file to stdout.'}),
    verbose: flags.boolean({description: 'Flag option used to request verbose output. With this option set, additional useful parse, validate and collate logs are written to stdout.'}),
    collate: flags.boolean({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    help: flags.help({char: 'h', description: 'Output usage information.'})
  }

  async run() {
    try {
      const {flags} = this.parse(MslgParse)
      const parser: any = new Parser();
      await parser.Parser(flags);
    } catch(error) {
      this.error(error)
    }
  }
}