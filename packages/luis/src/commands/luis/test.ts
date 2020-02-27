/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LUISRuntimeClient} from '@azure/cognitiveservices-luis-runtime'
import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const file = require('./../../../node_modules/@microsoft/bf-lu/lib/utils/filehelper')
const luConverterWithTest = require('./../../../../lu/src/parser/test/luconverterwithtest')
const testHelper = require('./../../../../lu/src/utils/testhelper')
const exception = require('./../../../node_modules/@microsoft/bf-lu/lib/parser/utils/exception')
const fileExtEnum = require('./../../../node_modules/@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const LuisBuilder = require('./../../../node_modules/@microsoft/bf-lu/lib/parser/luis/luisBuilder')
const Luis = require('./../../../node_modules/@microsoft/bf-lu/lib/parser/luis/luis')
//const inputUtils = require('../../utils/index')

export default class LuisTest extends Command {
  static description = 'Predict .lu file(s) to test the result'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .lu file(s) or LUIS application JSON model'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    subscriptionKey: flags.string({char: 's', description: '(required) LUIS cognitive services subscription key', required: true}),
    endpoint: flags.string({description: '(required) LUIS endpoint hostname', required: true}),
    appId: flags.string({char: 'a', description: '(required) LUIS application Id', required: true}),
    intentOnly: flags.boolean({description: 'only test intent', default: false}),
    staging: flags.boolean({description: 'Presence of flag targets the staging app, if no flag passed defaults to production', default: false}),
    allowIntentsCount: flags.integer({description: 'intent number to show in the result', default: 1}),
    timezoneOffset: flags.string({description: 'Timezone offset for the location of the request in minutes (optional)'}),
    concurrency: flags.integer({description: 'parallel utterance test number', default: 1}),
    force: flags.boolean({description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'luis:predict help'})
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
        const luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.LUFile)
        luisObject = await LuisBuilder.build(luFiles, flags.log, flags.culture)
        if (!luisObject.hasContent()) {
          throw new CLIError('No LU content parsed!')
        }
      } else {
        const luisContent = stdin ? stdin : await file.getContentFromFile(flags.in)
        luisObject = new Luis(file.parseJSON(luisContent, 'Luis'))
        if (!luisObject.hasContent()) {
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

      await testHelper.build(client, flags.appId, slotName, options, luisObject, flags.allowIntentsCount, flags.intentOnly)

      let result = luConverterWithTest(luisObject, flags)
      if (!result) {
        throw new CLIError('No LU content parsed!')
      }
      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, false)
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

  private async writeOutput(convertedObject: any, flags: any, isLu: boolean) {
    let filePath = await file.generateNewFilePath(flags.out, flags.in, isLu)
    const validatedPath = utils.validatePath(filePath, '', flags.force)
    // write out the final file
    try {
      await fs.writeFile(validatedPath, convertedObject, 'utf-8')
    } catch (err) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote LUIS model to ' + validatedPath)
  }
}
