/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const Luis = require('@microsoft/bf-lu').V2.Luis
const LuisBuilder = require('@microsoft/bf-lu/lib/parser/luis/luisCollate')
const exception = require('@microsoft/bf-lu').V2.Exception
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum

import {hasContent, sort} from './../../utils/luisinstanceutils'
export default class LuisConvert extends Command {
  static description = 'Convert .lu file(s) to a LUIS application JSON model or vice versa'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source .lu file(s) or LUIS application JSON model'}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lu file(s)', default: false}),
    log: flags.boolean({description: 'Enables log messages', default: false}),
    sort: flags.boolean({description: 'When set, intent, utterances, entities are alphabetically sorted in .lu files', default: false}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    name: flags.string({description: 'Name of the LUIS application'}),
    description: flags.string({description: 'Text describing the LUIS applicaion'}),
    culture: flags.string({description: 'Lang code for the LUIS application'}),
    versionid: flags.string({description: 'Version ID of the LUIS application'}),
    schemaversion: flags.string({description: 'Schema version of the LUIS application'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'luis:convert help'}),
  }

  async run() {
    try {
      const {flags} = this.parse(LuisConvert)
      // Check if data piped in stdin
      const stdin = await this.readStdin()

      // Check if file or folder
      // if folder, only lu to luis is supported
      const isLu = await file.detectLuContent(stdin, flags.in)

      // Parse the object depending on the input
      let result: any
      if (isLu) {
        const luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.LUFile)
        result = await LuisBuilder.build(luFiles, flags.log, flags.culture)
        if (!hasContent(result)) {
          throw new CLIError('No LU or Luis content parsed!')
        }
      } else {
        const luisContent = stdin ? stdin : await file.getContentFromFile(flags.in)
        const luisObject = new Luis(file.parseJSON(luisContent, 'Luis'))
        if (flags.sort) {
          sort(luisObject)
        }

        result = luisObject.parseToLuContent()
        if (!result) {
          throw new CLIError('No LU or Luis content parsed!')
        }
      }

      // Add headers to Luis Json
      if (isLu) {
        result.luis_schema_version = flags.schemaversion || result.luis_schema_version || '3.2.0'
        result.versionId = flags.versionid || result.versionId || '0.1'
        result.name = flags.name || result.name || ''
        result.desc = flags.description || result.desc || ''
        result.culture = flags.culture || result.culture || 'en-us'
        result.culture = result.culture.toLowerCase()
        result = JSON.stringify(result, null, 2)
      }

      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, isLu)
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

  private async writeOutput(convertedObject: any, flags: any, isLu: boolean) {
    const filePath = await file.generateNewFilePath(flags.out, flags.in, isLu)
    const validatedPath = utils.validatePath(filePath, '', flags.force)
    // write out the final file
    try {
      await fs.writeFile(validatedPath, convertedObject, 'utf-8')
    } catch (error) {
      throw new CLIError('Unable to write file - ' + validatedPath + ' Error: ' + error.message)
    }
    this.log('Successfully wrote LUIS model to ' + validatedPath)
  }
}
