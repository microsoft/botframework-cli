/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const file = require('./../../utils/filehelper')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const crossTrainer = require('./../../parser/lu/crossTrainer')

export const CrossTrain = {
  /**
   * Cross train lu and qna files
   * @param input input lu and qna files folder
   * @param root root lu files to do cross training. Separated by comma if multiple root files exist.
   * @param intentname interuption intent name. Default value is _Interuption
   * @param out output folder name. If not specified, source lu and qna files will be updated
   * @returns trainedResult of luResult and qnaResult or undefined
   */
  async train(input: string, root: string, intentname = '_Interuption')
    : Promise<{luResult: any, qnaResult: any}> {
    let trainedResult: any
    //Check if file or folder
    //if folder, only lu to luis is supported
    const isLu = await file.detectLuContent(undefined, input)

    // Parse the object depending on the input
    if (isLu && root) {
      const luObjects = await file.getLuObjects(undefined, input, true, fileExtEnum.LUFile)
      const qnaObjects = await file.getLuObjects(undefined, input, true, fileExtEnum.QnAFile)
      const rootObjects = await file.getLuObjects(undefined, root, true, fileExtEnum.LUFile)
      const luConfigObject = await file.getConfigObject(input, true)

      let crossTrainConfig = {
        rootIds: rootObjects.map((r: any) => r.id),
        triggerRules: luConfigObject,
        intentName: intentname,
        verbose: true
      }

      trainedResult = crossTrainer.crossTrain(luObjects, qnaObjects, JSON.stringify(crossTrainConfig))
    }

    return trainedResult
  },

  /**
   * Write lu and qna files
   * @param fileIdToLuResourceMap lu or qna file id to lu resource map
   * @param out output folder name. If not specified, source lu and qna files will be updated
   */
  async writeFiles(fileIdToLuResourceMap: Map<string, any>, out?: string) {
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
          if (newFolder) {
            const fileName = path.basename(fileId)
            const newFileId = path.join(newFolder, fileName)
            await fs.writeFile(newFileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8')
          } else {
            await fs.writeFile(fileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8')
          }
        } catch (err) {
          throw new Error('Unable to write file - ' + fileId + ' Error: ' + err.message)
        }
      }
    }
  }
}
