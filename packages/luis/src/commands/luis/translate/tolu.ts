import {Command, flags} from '@microsoft/bf-cli-command'
const translate = require('../../../../utils/translate')

export default class LuisTranslateTolu extends Command {
  static description = 'Translate given input and write out .lu file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source LUIS application JSON file .OR. source .lu file'}),
    lu_folder: flags.string({description: 'Source folder that contains .lu file(s)'}),
    subfolder: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out_folder: flags.string({description: 'Output folder name'}),
    src_lang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    to_lang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translate_key: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.boolean({description: 'When set, machine translate comments found in .lu or .qna file'}),
    translate_link_text: flags.boolean({description: 'When set, machine translate link description in .lu or .qna file'}),
  }

  async run() {
    const {flags} = this.parse(LuisTranslateTolu)
    if (!flags.in && !flags.lu_folder) {
      this.error('No .lu file or folder specified.\n')
      this._help()
    }

    try {
      await translate.translateContent(flags)
    } catch (err) {
      this.error(err.text + '\n')
      this.error('Stopping further processing. \n')
    }
  }
}
