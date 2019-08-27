import {Command, flags} from '@microsoft/bf-cli-command'
const toLU = require('../../../../utils/toLU')

export default class LuisTransformTolu extends Command {
  static description = 'Transformation from a given LUIS application JSON model to a .lu file.'

  static flags = {
    LUIS_File: flags.string({description: 'Source LUIS application JSON file', required: true}),
    out_folder: flags.string({description: 'Output folder name'}),
    lu_File: flags.string({description: 'Output file name'}),
  }

  async run() {
    const {flags} = this.parse(LuisTransformTolu)

    try {
      await toLU.generateMarkdown(flags)
    } catch (err) {
      this.error(err.text + '\n')
      this.error('Stopping further processing. \n')
    }
  }
}
