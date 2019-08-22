import {Command, flags} from '@microsoft/bf-cli-command'
const {Translator} = require('../../utils/translator')

export default class MslgTranslate extends Command {
  static description = 'Translate .lg files to a target language by Microsoft translation API.'

  static examples = [`
  $ bf mslg translate -k your_translate_Key -t your_target_lang --in examples/validExamples/translator.lg -c`]

  static flags = {
    translate_key: flags.string({char: 'k', required: true, description: 'Microsoft translation API key'}),
    target_lang: flags.string({char: 't', required: true, description: 'Target language to localize content to. See https://aka.ms/translate-langs for list of supported languages and codes. You can also specify comma or space delimited list of target languages.'}),
    in: flags.string({description: 'A direct .lg file passed in'}),
    lg_folder: flags.string({char: 'l', description: 'Relative or absolute path to a folder containing .lg files'}),
    subfolder: flags.string({char: 's', description: 'Flag option used to denote that subfolders need to be recursively checked to find .lg files'}),
    out_folder: flags.string({char: 'o', description: 'Output folder to write out the final .lg file'}),
    translate_comments: flags.boolean({char: 'c', description: 'Flag option to indicate if comments in the input file is also translated. Default is set to false'}),
    verbose: flags.boolean({description: 'Flag option used to request verbose output. With this option set, additional useful parse, validate and collate logs are written to stdout.'}),
    help: flags.help({char: 'h', description: 'Output usage information.'})
  }

  async run() {
    const {flags} = this.parse(MslgTranslate)
    const translator: any = new Translator()
    try {
      await translator.Translate(flags)
    } catch (error) {
      this.error(error)
    }
  }
}
