import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const helpers = require('./../../parser/lufile/helpers')
const luTranslator = require('./../../parser/translator/lutranslate')

export default class LuisTranslate extends Command {
  static description = ' Translate given LUIS application JSON model or lu file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model', required: true}),
    recurse: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.string({description: 'When set, machine translate comments found in .lu or .qna file'}),
    translate_link_text: flags.string({description: 'When set, machine translate link description in .lu or .qna file'}),
  }

  inputStat: any

  async run() {
    try {
      const {flags} = this.parse(LuisTranslate)
      this.inputStat = await fs.stat(flags.in)
      let outputStat = await fs.stat(flags.out)

      if (!this.inputStat.isFile() && outputStat.isFile()) {
        throw new CLIError('Specified output cannot be applied to input')
      }

      let isLu = !this.inputStat.isFile() ? true : path.extname(flags.in) === '.lu'

      let result: any
      let luFiles: any
      if (isLu) {
        luFiles = await this.getLuFiles(flags.in, flags.recurse)
        result = await luTranslator.translateLu(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
      }

      if (flags.out) {
        let languages = flags.tgtlang.split(',')
        await this.writeOutput(result, luFiles, isLu, languages, flags.out)
      } else {
        this.log(result)
      }

    } catch (err) {
      throw err
    }
  }

  private async getLuFiles(input: string | undefined, recurse = false): Promise<Array<any>> {
    let filesToParse = []

    if (this.inputStat.isFile()) {
      filesToParse.push(input)
      return filesToParse
    }

    if (!this.inputStat.isDirectory()) {
      throw new CLIError('Sorry, ' + input + ' is not a folder or does not exist')
    }

    filesToParse = helpers.findLUFiles(input, recurse)

    if (filesToParse.length === 0) {
      throw new CLIError('Sorry, no .lu files found in the specified folder.')
    }
    return filesToParse
  }

  private async writeOutput(translatedObject: any, files: Array<string>, isLu: boolean, languages: Array<string>, out: string) {
    let filePath = ''
    try {
      if (isLu) {
        let fileIndex = 0
        while (files.length > fileIndex) {
          let file = files[fileIndex++] + ''
          let lngIndex = 0
          while (languages.length > lngIndex) {
            let lg = languages[lngIndex++] + ''
            filePath = await this.generateNewFilePath(path.basename(file), lg, out)
            await fs.writeFile(filePath, translatedObject[path.basename(file)][lg], 'utf-8')
          }
        }
      } else {
        await fs.writeFile(filePath, translatedObject, 'utf-8')
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote translated model to ' + filePath)
  }

  private async generateNewFilePath(fileName: string, translatedLanguage: string, output: string): Promise<string> {
    let outputStat = await fs.stat(output)
    if (outputStat.isFile()) {
      return path.join(process.cwd(), output)
    } else {
      let base = path.join(process.cwd(), output, translatedLanguage)
      await fs.mkdirp(base)
      return path.join(base, fileName)
    }
  }
}
