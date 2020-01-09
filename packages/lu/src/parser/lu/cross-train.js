/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const file = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const crossTrainer = require('./crossTrainer')

module.exports = {
  /**
   * Cross train lu and qna files.
   * @param {string} input input lu and qna files folder.
   * @param {string} root root lu files to do cross training. Separated by comma if multiple root files exist.
   * @param {string} intentname interuption intent name. Default value is _Interuption.
   * @param {string} out output folder name. If not specified, source lu and qna files will be updated.
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined.
   */
  train: async function (input, root, intentname = '_Interuption') {
    let trainedResult
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
        rootIds: rootObjects.map(r => r.id),
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
   * @param {Map<string, any>} fileIdToLuResourceMap lu or qna file id to lu resource map.
   * @param {string} out output folder name. If not specified, source lu and qna files will be updated.
   * @throws {exception} Throws on errors.
   */
  writeFiles: async function (fileIdToLuResourceMap, out) {
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
