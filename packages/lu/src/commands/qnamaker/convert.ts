/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const exception = require('./../../parser/utils/exception')
const fs = require('fs-extra')
const file = require('./../../utils/filehelper')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum

const QnAMaker = require('./../../parser/qna/qnamaker/qnamaker')
const Alterations = require('./../../parser/qna/alterations/alterations')
const QnAMakerBuilder = require('./../../parser/qna/qnamaker/qnaMakerBuilder')
const alterationsBuilder = require('./../../parser/qna/alterations/alterationsBuilder')

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
    help: flags.help({char: 'h', description: 'qnamaker:convert help'})
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerConvert)

      // Check if data piped in stdin
      const stdin = await this.readStdin()

      //Check if file or folder
      //if folder, only lu to luis is supported
      const isQnA = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let result: any
      if (isQnA) {
        const luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        result = {}
        result.finalQnAJSON = await QnAMakerBuilder.build(luFiles, false, flags.luis_culture)
        result.finalQnAAlterations = await alterationsBuilder.build(luFiles, false, flags.luis_culture)
      } else {
        const qnaContent = stdin ? stdin : await file.getContentFromFile(flags.in)
        const QnA = flags.alterations ? new Alterations(file.parseJSON(qnaContent, 'QnA Alterations')) : new QnAMaker(file.parseJSON(qnaContent, 'QnA'))
        if (flags.sort) {
          QnA.sort()
        }
        result = QnA.parseToLuContent()
      }

      // If result is null or undefined return
      if (!result) {
        throw new CLIError('No LU or QnA content parsed!')
      }

      // Add headers to QnAJson
      if (isQnA) {
        result.finalQnAJSON.name = flags.name || result.name || ''
      }

      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, isQnA)
      } else {
        if (isQnA) {
          this.log(JSON.stringify(result.finalQnAJSON, null, 2))
          this.log(JSON.stringify(result.finalQnAAlterations, null, 2))
        } else {
          this.log(result)
        }
      }
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async writeOutput(convertedObject: any, flags: any, isQnA: boolean) {
    let filePath = await file.generateNewFilePath(flags.out, flags.in, isQnA, '', fileExtEnum.QnAFile)
    const validatedPath = utils.validatePath(filePath, '', flags.force)
    try {
      if (isQnA) {
        await fs.writeFile(validatedPath, JSON.stringify(convertedObject.finalQnAJSON, null, 2), 'utf-8')
        if (convertedObject.finalQnAAlterations) {
          let filePathAlterations = await file.generateNewFilePath(flags.out, flags.in, isQnA, 'alterations_', fileExtEnum.QnAFile)
          const validatedPathAlter = utils.validatePath(filePathAlterations, '', flags.force)
          await fs.writeFile(validatedPathAlter, JSON.stringify(convertedObject.finalQnAAlterations, null, 2), 'utf-8')
        }
      } else {
        await fs.writeFile(validatedPath, convertedObject, 'utf-8')
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote QnA model to ' + validatedPath)
  }
}
