/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LUISRuntimeClient} from '@azure/cognitiveservices-luis-runtime'
import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const testHelper = require('@microsoft/bf-lu/lib/parser/test/testhelper')
const luConverter = require('@microsoft/bf-lu/lib/parser/luis/luConverter')
const exception = require('@microsoft/bf-lu').V2.Exception
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const LuisBuilder = require('@microsoft/bf-lu/lib/parser/luis/luisCollate')
const Luis = require('@microsoft/bf-lu').V2.Luis
import {hasContent} from './../../utils/luisinstanceutils'

export default class LuisTest extends Command {
  static description = 'Test a .lu file or LUIS application JSON model against a published LUIS model'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .lu file or LUIS application JSON model for testing'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    subscriptionKey: flags.string({char: 's', description: 'LUIS cognitive services subscription key', required: true}),
    endpoint: flags.string({description: 'LUIS endpoint hostname', default: 'https://westus.api.cognitive.microsoft.com'}),
    appId: flags.string({char: 'a', description: 'LUIS application Id', required: true}),
    intentOnly: flags.boolean({description: 'Only test intent', default: false}),
    staging: flags.boolean({description: 'Presence of flag targets the staging app, if no flag passed defaults to production', default: false}),
    allowIntentsCount: flags.integer({description: 'Top-scoring intent or top n Intent with score to show in the result', default: 1}),
    force: flags.boolean({description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'luis:test help'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisTest)
      // Check if data piped in stdin
      const stdin = await this.readStdin()

      //Check if file or folder
      //if folder, only lu to luis is supported
      const isLu = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let luisObject: any
      if (isLu) {
        const luFiles = await file.getLuObjects(stdin, flags.in, false, fileExtEnum.LUFile)
        luisObject = await LuisBuilder.build(luFiles, flags.log, flags.culture)
        if (!hasContent(luisObject)) {
          throw new CLIError('No LU content parsed!')
        }
      } else {
        const luisContent = stdin ? stdin : await file.getContentFromFile(flags.in)
        luisObject = new Luis(file.parseJSON(luisContent, 'Luis'))
        if (!hasContent(luisObject)) {
          throw new CLIError('No LUIS content found!')
        }
      }

      const creds = new CognitiveServicesCredentials(flags.subscriptionKey)
      const client = new LUISRuntimeClient(creds, flags.endpoint)
      let slotName = 'production'
      if (flags.staging) slotName = 'staging'

      const options: any = {}
      options.verbose = true
      options.showAllIntents = true

      let predictedResults: any[] = []
      await testHelper.test(client,
        flags.appId,
        slotName,
        options,
        luisObject,
        flags.allowIntentsCount,
        flags.intentOnly,
        predictedResults)

      let result = luConverter(luisObject, flags)
      let detailLog = `${JSON.stringify(predictedResults, null, 2)}`
      if (!result) {
        throw new CLIError('No LU content parsed!')
      }
      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, detailLog)
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

  private async writeOutput(convertedObject: any, flags: any, log: any) {
    let filePath = await file.generateNewFilePath(flags.out, flags.in, false)
    const validatedPath = utils.validatePath(filePath, '', flags.force)
    const validatedLogPath = utils.validatePath(filePath + '.log', '', flags.force)
    // write out the final file
    try {
      await fs.writeFile(validatedPath, convertedObject, 'utf-8')
      await fs.writeFile(validatedLogPath, log, 'utf-8')
    } catch (err) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote LUIS model to ' + validatedPath)
  }
}
