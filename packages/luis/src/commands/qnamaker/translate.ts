import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const fileHelper = require('./../../utils/filehelper')
const exception = require('./../../parser/lufile/classes/exception')
const luTranslator = require('./../../parser/translator/lutranslate')
const qnaConverter = require('./../../parser/converters/qnajsontoqnaconverter')
const luConverter = require('./../../parser/lufile/parseFileContents')
const fileExtEnum = require('./../../parser/lufile/helpers').FileExtTypeEnum

export default class QnamakerTranslate extends Command {
  static description = 'Translate given QnA maker application JSON model or qna file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .qna file(s) or QnA maker application JSON model', required: true}),
    recurse: flags.boolean({description: 'Indicates if sub-folders need to be considered to find .qna file(s)'}),
    out: flags.string({description: 'Output folder name. If not specified stdout will be used as output'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.string({description: 'When set, machine translate comments found in .qna file'}),
    translate_link_text: flags.string({description: 'When set, machine translate link description in .qna file'}),
  }

  /* tslint:disable:forin no-for-in*/
  async run() {
    try {
      const {flags} = this.parse(QnamakerTranslate)
      // Check if data piped in stdin
      let stdin = await this.readStdin()
      let outputStat = flags.out ? await fs.stat(flags.out) : null

      if (outputStat && outputStat.isFile()) {
        throw new CLIError('Output can only be writen to a folder')
      }

      let isLu = await fileHelper.detectLuContent(stdin, flags.in)
      let result: any
      if (isLu) {
        let luFiles = await fileHelper.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        result = await luTranslator.translateLuList(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
      } else {
        let json = stdin ? stdin : await fileHelper.getContentFromFile(flags.in)
        let translation = await qnaConverter.parseQnAObjectToLu(json, false, false)
        translation = await luTranslator.translateLuObj(translation, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        let key = stdin ? 'stdin' : path.basename(flags.in)
        result = {
          [key] : {}
        }
        for (let lng in translation) {
          let translatedJSON = await luConverter.parseFile(translation[lng], false)
          result[key][lng] = await translatedJSON.qnaJsonStructure
        }
      }

      if (flags.out) {
        await this.writeOutput(result, flags.out, isLu)
      } else {
        if (isLu) {
          this.log(result)
        } else {
          this.log(JSON.stringify(result, null, 2))
        }
      }

    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async writeOutput(translatedObject: any, out: string, isLu: boolean) {
    let filePath = ''
    try {
      for (let file in translatedObject) {
        for (let lng in translatedObject[file]) {
          filePath = await fileHelper.generateNewTranslatedFilePath(file, lng, out)
          let content = isLu ? translatedObject[file][lng] : JSON.stringify(translatedObject[file][lng], null, 2)
          await fs.writeFile(filePath, content, 'utf-8')
        }
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
  }
}
