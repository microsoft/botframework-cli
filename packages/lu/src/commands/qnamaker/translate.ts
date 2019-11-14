/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const fileHelper = require('./../../utils/filehelper')
const exception = require('./../../parser/utils/exception')
const luTranslator = require('./../../parser/translator/lutranslate')
const qnaMaker = require('./../../parser/qna/qnamaker/qnamaker')
const QnA = require('./../../parser/lu/qna')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum

export default class QnamakerTranslate extends Command {
  static description = 'Translate given QnA maker application JSON model or qna file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .qna file(s) or QnA maker application JSON model'}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to find .qna file(s)'}),
    out: flags.string({char: 'o', description: 'Output folder name. If not specified stdout will be used as output'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.boolean({description: 'When set, machine translate comments found in .qna file'}),
    translate_link_text: flags.boolean({description: 'When set, machine translate link description in .qna file'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'qnamaker:translate help'})
  }

  /* tslint:disable:forin no-for-in*/
  async run() {
    try {
      const {flags} = this.parse(QnamakerTranslate)
      // Check if data piped in stdin
      let stdin = await this.readStdin()

      let isLu = await fileHelper.detectLuContent(stdin, flags.in)
      let result: any = {}
      if (isLu) {
        let luFiles = await fileHelper.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        let translatedLuFiles = await luTranslator.translateQnAList(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        luFiles.forEach((lu: any) => {
          if (!result[lu.id]) {
            result[lu.id] = {}
          }
          translatedLuFiles[lu.id].forEach((t: any) => {
            result[t.id][t.language] = t.content
          })
        })
      } else {
        let json = stdin ? stdin : await fileHelper.getContentFromFile(flags.in)
        let qnaM = new qnaMaker(fileHelper.parseJSON(json, 'QnA'))
        let qna = new QnA(qnaM.parseToLuContent())
        let qnaTranslation = await luTranslator.translateQnA(qna, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        let key = stdin ? 'stdin' : path.basename(flags.in)
        result = {
          [key] : {}
        }
        for (let q of qnaTranslation) {
          result[key][q.language] = await q.parseToQna()
        }
      }

      if (flags.out) {
        await this.writeOutput(result, flags.out, isLu, flags.force)
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

  private async writeOutput(translatedObject: any, out: string, isLu: boolean, force: boolean) {
    let filePath = ''
    try {
      for (let file in translatedObject) {
        for (let lng in translatedObject[file]) {
          filePath = await fileHelper.generateNewTranslatedFilePath(file, lng, out)
          let content = isLu ? translatedObject[file][lng] : JSON.stringify(translatedObject[file][lng], null, 2)
          const validatedPath = utils.validatePath(filePath, '', force)
          await fs.writeFile(validatedPath, content, 'utf-8')
        }
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
  }
}
