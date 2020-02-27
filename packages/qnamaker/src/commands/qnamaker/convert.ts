/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
import {sortQnA, sortAlterations} from './../../utils/qnamakerinstanceutils'
const exception = require('@microsoft/bf-lu').V2.Exception
const fs = require('fs-extra')
const KB = require('@microsoft/bf-lu').V2.KB
const Alterations = require('@microsoft/bf-lu').V2.Alterations
const QnAMakerBuilder = require('@microsoft/bf-lu/lib/parser/qna/qnamaker/kbCollate')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum


export default class QnamakerConvert extends Command {
  static description = 'Converts .qna file(s) to QnA application JSON models or vice versa.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .qna file(s) or QnA KB JSON file'}),
    alterations: flags.boolean({description: 'Indicates if files is QnA Alterations'}),
    log: flags.boolean({description: 'Enables log messages', default: false}),
    sort: flags.boolean({description: 'When set, questions collections are alphabetically sorted are alphabetically sorted in .qna files', default: false}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .qna file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    name: flags.string({description: 'Name of the QnA KB'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'qnamaker:convert help'}),
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerConvert)

      // Check if data piped in stdin
      const stdin = await this.readStdin()

      // Check if file or folder
      // if folder, only lu to luis is supported
      const isQnA = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let result: any
      if (isQnA) {
        const luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        result = await QnAMakerBuilder.build([...luFiles], false, flags.luis_culture) 
      } else {
        const qnaContent = stdin ? stdin : await file.getContentFromFile(flags.in)
        let QnA 
        let sortFucntion

        if(flags.alterations) {
          QnA = new Alterations(file.parseJSON(qnaContent, 'QnA Alterations')) 
          sortFucntion = sortAlterations
        } else {
          QnA = new KB(file.parseJSON(qnaContent, 'QnA'))
          sortFucntion = sortQnA
        }

        if (flags.sort) {
          sortFucntion(QnA)
        }
        
        result = QnA.parseToLuContent()
      }

      // If result is null or undefined return
      if (!result) {
        throw new CLIError('No LU or QnA content parsed!')
      }

      // Add headers to QnAJson
      if (isQnA) {
        result.kb.name = flags.name || result.name || ''
      }

      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, isQnA)
        return
      }
      if (isQnA) {
        const output = {
          kb: result.kb,
          alterations: result.alterations
        }
        this.log(JSON.stringify(output, null, 2))
      } else {
        this.log(result)
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }

  private async writeOutput(convertedObject: any, flags: any, isQnA: boolean) {
    const filePath = await file.generateNewFilePath(flags.out, flags.in, isQnA, '', fileExtEnum.QnAFile)
    const validatedPath = utils.validatePath(filePath, '', flags.force)
    try {
      if (isQnA) {
        await fs.writeFile(validatedPath, JSON.stringify(convertedObject.kb, null, 2), 'utf-8')
        if (convertedObject.alterations) {
          const filePathAlterations = await file.generateNewFilePath(flags.out, flags.in, isQnA, 'alterations_', fileExtEnum.QnAFile)
          const validatedPathAlter = utils.validatePath(filePathAlterations, '', flags.force)
          await fs.writeFile(validatedPathAlter, JSON.stringify(convertedObject.alterations, null, 2), 'utf-8')
        }
      } else {
        await fs.writeFile(validatedPath, convertedObject, 'utf-8')
      }
    } catch (error) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + error.message)
    }
    this.log('Successfully wrote QnA model to ' + validatedPath)
  }
}
