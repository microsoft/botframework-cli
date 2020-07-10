/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
import {sortQnA, sortAlterations} from './../../utils/qnamakerinstanceutils'
const exception = require('@microsoft/bf-lu').V2.Exception
const fs = require('fs-extra')
//const KB = require('@microsoft/bf-lu').V2.KB
const KB = require('../../../../lu/src/parser/qna/qnamaker/kb')
const Alterations = require('@microsoft/bf-lu').V2.Alterations
//const QnAMakerBuilder = require('@microsoft/bf-lu/lib/parser/qna/qnamaker/kbCollate')
const QnAMakerBuilder = require('../../../../lu/src/parser/qna/qnamaker/kbCollate')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum

const qnamaker = require('./../../../utils/index')
const queryQuestionJSON = require('./../../../utils/payloads/queryquestion')
import {getFileInput, Inputs, processInputs} from '../../utils/qnamakerbase'

export default class QnamakerTest extends Command {
  static description = 'Test a .lu file or QnA application JSON models against a published QnA model'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .qna file(s) or QnA KB JSON file'}),
    alterations: flags.boolean({description: 'Indicates if files is QnA Alterations'}),
    log: flags.boolean({description: 'Enables log messages', default: false}),
    sort: flags.boolean({description: 'When set, questions collections are alphabetically sorted are alphabetically sorted in .qna files', default: false}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .qna file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    name: flags.string({description: 'Name of the QnA KB'}),
    subscriptionKey: flags.string({description: 'subscriptionKey'}),
    top: flags.integer({description: 'Specifies the number of matching results'}),
    test: flags.boolean({description: 'Query against the test index', default: false}),
    scorethreshold: flags.integer({description: 'Specifies the confidence score threshold for the returned answer.'}),
    qnaId: flags.integer({description: 'Exact qnaId to fetch from the knowledgebase, this field takes priority over question'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the value present in config'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service (From qnamaker.ai portal user settings page). Overrides the value present in config'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the value present in the config'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'qnamaker:test help'}),
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerTest)

      // Check if data piped in stdin
      const stdin = await this.readStdin()

      // Check if file or folder
      // if folder, only lu to luis is supported
      const isQnA = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let kbObject: any
      if (isQnA) {
        const luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile)
        kbObject = await QnAMakerBuilder.build([...luFiles], false, flags.luis_culture)
      } else {
        const qnaContent = flags.in ? await file.getContentFromFile(flags.in) : stdin
        kbObject = new KB(file.parseJSON(qnaContent, 'QnA'))
      }

      // If result is null or undefined return
      if (!kbObject) {
        throw new CLIError('No LU or QnA content parsed!')
      }

      const queryFlags = Object.assign({}, {
        subscriptionKey: flags.subscriptionKey, 
        kbId: flags.subscriptionKey, 
        endpointKey: flags.endpointKey, 
        hostname: flags.hostname,
        question: "test"
      })

      let input: Inputs = await processInputs(queryFlags, queryQuestionJSON, this.config.configDir)
      input.requestBody = {
        isTest: flags.test
      }

      if (flags.top) {
        input.requestBody.top = flags.top
      }
  
      if (flags.qnaId) {
        input.requestBody.qnaId = flags.qnaId
      }
  
      if (flags.scorethreshold) {
        input.requestBody.scoreThreshold = flags.scorethreshold
      }

      for (const qna of kbObject.kb.qnaList) {
        input.requestBody.strictFilters = qna.metadata
        qna.predicted_results = {}
        for (const question of qna.questions) {
          input.requestBody.question = question
          const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
          result.pass = result.answers[0].answer == qna.answer ? "PASS" : "FAIL"
          qna.predicted_results[question] = result
          console.log(qna.answer)
          console.log(result)
        }
      }

      const result = kbObject.parseToQnAContent()
      console.log(result)

      // Add headers to QnAJson
      if (isQnA) {
        kbObject.kb.name = flags.name || kbObject.kb.name || ''
      }

      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, false)
        return
      }
      if (isQnA) {
        const output = {
          kb: kbObject.kb,
          alterations: kbObject.alterations
        }
        this.log(JSON.stringify(output, null, 2))
      } else {
        this.log(kbObject)
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
