import {Command, flags} from '@microsoft/bf-cli-command'
const fParser = require('../../../../utils/parser')
const cmdEnum = require('../../../../utils/enums/parsecommands')

export default class LuisTransformTomodel extends Command {
  static description = 'describe the command here'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file'}),
    lu_folder: flags.string({description: 'Source folder that contains .lu file(s)'}),
    subfolder: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out: flags.string({description: 'Output file name'}),
    out_folder: flags.string({description: 'Output folder name'}),
    luis_name: flags.string({description: 'Name of the LUIS application'}),
    luis_desc: flags.string({description: 'Text describing the LUIS applicaion'}),
    luis_culture: flags.string({description: 'Lang code for the LUIS application'}),
    luis_versionId: flags.string({description: 'Version ID of the LUIS application'}),
  }

  async run() {
    const {flags} = this.parse(LuisTransformTomodel)
    if (flags.luis_culture) {
      // List of supported LUIS.ai locales.
      // From: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-language-support
      const LUISLocales = ['en-us', 'fr-ca', 'zh-cn', 'nl-nl', 'fr-fr', 'de-de', 'it-it', 'ja-jp', 'ko-kr', 'pt-br', 'es-es', 'es-mx']
      if (!(LUISLocales.includes(flags.luis_culture.toLowerCase()))) {
        this.error(`\nWARN: Unrecognized LUIS locale. Supported locales are - ${LUISLocales.toString()} \n\n`)
      }
    }
    if (!flags.in && !flags.lu_folder) {
      this.error('\n  No .lu file or folder specified.\n')
      this._help()
    }

    try {
      await fParser.handleFile(flags, cmdEnum.luis)
    } catch (err) {
      this.error(err.text)
      this.error('Stopping further processing.')
    }
  }
}
