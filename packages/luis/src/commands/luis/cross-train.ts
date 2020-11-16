/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const crossTrain = require('@microsoft/bf-lu/lib/parser/cross-train/cross-train')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum

export default class LuisCrossTrain extends Command {
  static description = 'Lu and Qna cross train tool'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Luis:cross-train command help'}),
    in: flags.string({char: 'i', description: 'Source lu and qna files folder'}),
    out: flags.string({char: 'o', description: 'Output folder name. If not specified, the cross trained files will be written to cross-trained folder under folder of current command'}),
    config: flags.string({description: 'Path to config file of mapping rules'}),
    intentName: flags.string({description: 'Interruption intent name', default: '_Interruption'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    log: flags.boolean({description: 'Writes out log messages to console', default: false})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisCrossTrain)

      if (!flags.in) {
        throw new CLIError('Missing input. Please specify a folder with --in flag')
      }

      flags.in = path.resolve(flags.in)

      if (flags.config && flags.config !== '') {
        flags.config = path.resolve(flags.config)
      } else {
        throw new CLIError('Missing cross train config. Please provide config file path by --config.')
      }

      const trainedResult = await crossTrain.train(flags.in, flags.intentName, flags.config, flags.log)

      if (flags.out === undefined) {
        flags.out = path.join(process.cwd(), 'cross-trained')
      }

      await this.writeFiles(trainedResult.luResult, flags.out, flags.force, fileExtEnum.LUFile)
      await this.writeFiles(trainedResult.qnaResult, flags.out, flags.force, fileExtEnum.QnAFile)
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  async writeFiles(fileIdToLuResourceMap: any, out: string, force: boolean, fileExt: any) {
    if (fileIdToLuResourceMap) {
      let newFolder
      if (out) {
        newFolder = out
        if (!path.isAbsolute(out)) {
          newFolder = path.resolve(out)
        }

        if (!fs.existsSync(newFolder)) {
          fs.mkdirSync(newFolder)
        }
      }

      for (const fileId of fileIdToLuResourceMap.keys()) {
        try {
          let validatedPath
          if (newFolder) {
            const fileName = path.basename(fileId)
            const newFileId = path.join(newFolder, fileName)
            validatedPath = utils.validatePath(newFileId + fileExt, '', force)
          } else {
            validatedPath = utils.validatePath(fileId + fileExt, '', force)
          }

          await fs.writeFile(validatedPath, fileIdToLuResourceMap.get(fileId).Content, 'utf-8')
        } catch (err) {
          throw new CLIError(`Unable to write to file ${fileId}. Error: ${err.message}`)
        }
      }
    }
  }
}
