/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const Lu = require('@microsoft/bf-lu').V2.LU
const Luis = require('@microsoft/bf-lu').V2.Luis
const LuisBuilder = require('@microsoft/bf-lu').V2.LuisBuilder
const exception = require('@microsoft/bf-lu').V2.Exception
const fileHelper = require('@microsoft/bf-lu/lib/utils/filehelper')
const luTranslator = require('@microsoft/bf-lu/lib/parser/translator/lutranslate')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum

export default class LuisTranslate extends Command {
  static description = ' Translate given LUIS application JSON model or lu file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .lu file(s) or LUIS application JSON model'}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out: flags.string({char: 'o', description: 'Output folder name. If not specified stdout will be used as output'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    translate_comments: flags.boolean({description: 'When set, machine translate comments found in .lu file'}),
    translate_link_text: flags.boolean({description: 'When set, machine translate link description in .lu file'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'luis:translate help'}),
  }

  /* tslint:disable:forin no-for-in */
  async run() {
    try {
      const {flags} = this.parse(LuisTranslate)
      // Check if data piped in stdin
      const stdin = await this.readStdin()
      const isLu = await fileHelper.detectLuContent(stdin, flags.in)
      let result: any = {}

      if (isLu) {
        const luFiles = await fileHelper.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.LUFile)
        const translatedLuFiles = await luTranslator.translateLuList(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        luFiles.forEach((lu: any) => {
          if (!result[lu.id]) {
            result[lu.id] = {}
          }
          translatedLuFiles[lu.id].forEach((t: any) => {
            result[t.id][t.language] = t.content
          })
        })
      } else {
        const json = flags.in ? await fileHelper.getContentFromFile(flags.in) : stdin
        const luisObject = new Luis(fileHelper.parseJSON(json, 'Luis'))
        const key = flags.in ? path.basename(flags.in) : 'stdin'
        const translation = new Lu(luisObject.parseToLuContent(), key)
        const translatedLuis = await luTranslator.translateLu(translation, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text)
        result = {
          [key]: {},
        }
        for (const lu of translatedLuis) {
          result[key][lu.language] = await LuisBuilder.fromLUAsync([lu])
        }
      }

      if (flags.out) {
        await this.writeOutput(result, flags.out, isLu, flags.force)
        return
      }

      if (isLu) {
        this.log(result)
      } else {
        this.log(JSON.stringify(result, null, 2))
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }

  private async writeOutput(translatedObject: any, out: string, isLu: boolean, force: boolean) {
    let filePath = ''
    try {
      for (const file in translatedObject) {
        for (const lng in translatedObject[file]) {
          filePath = await fileHelper.generateNewTranslatedFilePath(file, lng, out)
          const content = isLu ? translatedObject[file][lng] : JSON.stringify(translatedObject[file][lng], null, 2)
          const validatedPath = utils.validatePath(filePath, '', force)
          await fs.writeFile(validatedPath, content, 'utf-8')
        }
      }
    } catch (error) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + error.message)
    }
  }
}
