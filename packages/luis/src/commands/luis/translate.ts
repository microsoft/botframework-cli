import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const fileHelper = require('./../../utils/filehelper')
const exception = require('./../../../parser/lufile/classes/exception')
const luTranslator = require('./../../../parser/translator/lutranslate')
const luisConverter = require('./../../../parser/converters/luistoluconverter')
const luConverter = require('./../../../parser/lufile/parseFileContents')

export default class LuisTranslate extends Command {
  static description = ' Translate given LUIS application JSON model or lu file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model', required: true}),
    recurse: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out: flags.string({description: 'Output folder name. If not specified stdout will be used as output'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.string({description: 'When set, machine translate comments found in .lu or .qna file'}),
    translate_link_text: flags.string({description: 'When set, machine translate link description in .lu or .qna file'}),
  }

  /* tslint:disable:forin no-for-in*/
  async run() {
    try {
      const {flags} = this.parse(LuisTranslate)
      let inputStat = await fs.stat(flags.in)
      let outputStat = flags.out ? await fs.stat(flags.out) : undefined

      if (outputStat && outputStat.isFile()) {
        throw new CLIError('Output can only be writen to a folder')
      }

      let isLu = !inputStat.isFile() ? true : path.extname(flags.in) === '.lu'
      let result: any
      if (isLu) {
        let luFiles = await fileHelper.getLuFiles(flags.in, flags.recurse)
        result = await luTranslator.translateLuFile(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
      } else {
        let translation = await luisConverter.parseLuisFileToLu(flags.in, false)
        translation = await luTranslator.translateLuObj(result, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        result = {}
        Object.keys(translation).forEach(async idx => {
          result[flags.in][idx] = await luConverter.parseFile(translation[idx][0], false, undefined)
        })
      }

      if (flags.out) {
        await this.writeOutput(result, flags.out)
      } else {
        this.log(result)
      }

    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async writeOutput(translatedObject: any, out: string) {
    let filePath = ''
    try {
      for (let file in translatedObject) {
        for (let lng in translatedObject[file]) {
          filePath = await fileHelper.generateNewTranslatedFilePath(file, lng, out)
          await fs.writeFile(filePath, translatedObject[path.basename(file)][lng], 'utf-8')
        }
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
  }
}
