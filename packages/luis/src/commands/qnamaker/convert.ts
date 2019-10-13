import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const exception = require('./../../parser/lufile/classes/exception')
const fs = require('fs-extra')
const file = require('./../../utils/filehelper')
const luConverter = require('./../../parser/converters/qnatoqnajsonconverter')
const qnaConverter = require('./../../parser/converters/qnajsontoqnaconverter')
const fileExtEnum = require('./../../parser/lufile/helpers').FileExtTypeEnum

export default class QnamakerConvert extends Command {
  static description = 'Convert .lu file(s) to a QnA application JSON model or vice versa'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .qna file(s) or QnA KB JSON file', required: true}),
    alterations: flags.boolean({description: 'Indicates if files is QnA Alterations'}),
    log: flags.boolean({description: 'Enables log messages', default: false}),
    sort: flags.boolean({description: 'When set, questions collections are alphabetically sorted are alphabetically sorted in .lu files', default: false}),
    recurse: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .qna file(s)'}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output'}),
    name: flags.string({description: 'Name of the QnA KB'}),
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerConvert)

      // Check if data piped in stdin
      let stdin = await this.readStdin()

      //Check if file or folder
      //if folder, only lu to luis is supported
      let isQnA = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let result: any
      if (isQnA) {
        let luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        result = await luConverter.parseQnaToJson(luFiles, false, flags.luis_culture)
      } else {
        const qnAFile = stdin ? stdin : await file.getContentFromFile(flags.in)
        result = await qnaConverter.parseQnAObjectToLu(qnAFile, flags.sort, flags.alterations)
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
    let filePath = await file.generateNewFilePath(flags.out, flags.in, isQnA)
    try {
      if (isQnA) {
        await fs.writeFile(filePath, JSON.stringify(convertedObject.finalQnAJSON, null, 2), 'utf-8')
        if (convertedObject.finalQnAAlterations) {
          let filePathAlterations = await file.generateNewFilePath(flags.out, flags.in, isQnA, 'alterations_')
          await fs.writeFile(filePathAlterations, JSON.stringify(convertedObject.finalQnAAlterations, null, 2), 'utf-8')
        }
      } else {
        await fs.writeFile(filePath, convertedObject, 'utf-8')
      }
    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote QnA model to ' + filePath)
  }
}
