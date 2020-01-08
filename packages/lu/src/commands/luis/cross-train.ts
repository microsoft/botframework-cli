/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const exception = require('./../../parser/utils/exception')
const fs = require('fs-extra')
const path = require('path')
const file = require('./../../utils/filehelper')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const crossTrainer = require('./../../parser/lu/crossTrainer')

export default class LuisCrossTrian extends Command {
  static description = 'Convert interuption intents among .lu file(s)'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:cross-train help'}),
    in: flags.string({char: 'i', description: 'source .lu file(s)'}),
    out: flags.string({char: 'o', description: 'output folder name. If not specified, source lu file(s) will be updated'}),
    recurse: flags.boolean({char: 'r', description: 'indicates if sub-folders need to be considered to file .lu file(s)', default: false}),
    log: flags.boolean({description: 'enable log messages', default: false}),
    root: flags.string({description: 'root lu files to do cross training. Separated by comma if multiple root files exist.'}),
    intentname: flags.string({description: 'interuption intent name', default: '_Interuption'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisCrossTrian)

      //Check if file or folder
      //if folder, only lu to luis is supported
      const isLu = await file.detectLuContent(undefined, flags.in)

      // Parse the object depending on the input
      let luResult: any
      let qnaResult: any
      if (isLu && flags.root) {
        const luObjects = await file.getLuObjects(undefined, flags.in, flags.recurse, fileExtEnum.LUFile)
        const qnaObjects = await file.getLuObjects(undefined, flags.in, flags.recurse, fileExtEnum.QnAFile)
        const rootObjects = await file.getLuObjects(undefined, flags.root, flags.recurse, fileExtEnum.LUFile)
        const luConfigObject = await file.getConfigObject(flags.in, flags.recurse)

        let crossTrainConfig = {
          rootIds: rootObjects.map((r: any) => r.id),
          triggerRules: luConfigObject,
          intentName: flags.intentname,
          verbose: flags.log
        }

        const trainedResult = crossTrainer.crossTrain(luObjects, qnaObjects, JSON.stringify(crossTrainConfig))
        luResult = trainedResult.luResult
        qnaResult = trainedResult.qnaResult
      }

      // If result is null or undefined return
      if (!luResult) {
        throw new CLIError('No LU content parsed!')
      }

      await this.writeFiles(luResult, flags)
      await this.writeFiles(qnaResult, flags)
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async writeFiles(fileIdToLuResourceMap: Map<string, any>, flags?: any) {
    if (fileIdToLuResourceMap === undefined) return
    
    let newFolder
    if (flags && flags.out) {
      newFolder = flags.out
      if (!path.isAbsolute(flags.out)) {
        newFolder = path.resolve(flags.out)
      }

      if (!fs.existsSync(newFolder)) {
        fs.mkdirSync(newFolder)
      }
    }

    for (const fileId of fileIdToLuResourceMap.keys()) {
      try {
        if (newFolder) {
          const fileName = path.basename(fileId)
          const newFileId = path.join(newFolder, fileName)
          await fs.writeFile(newFileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8')
          this.log('Successfully wrote to ' + newFileId)
        } else {
          await fs.writeFile(fileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8')
          this.log('Successfully wrote to ' + fileId)
        }
      } catch (err) {
        throw new CLIError('Unable to write file - ' + fileId + ' Error: ' + err.message)
      }
    }
  }
}
