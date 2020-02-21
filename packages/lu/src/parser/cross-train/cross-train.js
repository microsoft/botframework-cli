/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const file = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const exception = require('../utils/exception')
const retCode = require('../utils/enums/CLI-errors');
const crossTrainer = require('./crossTrainer')

module.exports = {
  /**
   * Cross train lu and qna files.
   * @param {string} input input lu and qna files folder.
   * @param {string} intentName interuption intent name. Default value is _Interuption.
   * @param {string} configPath path to config of mapping rules. If undefined, it will read config.json from input folder.
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined if no results.
   */
  train: async function (input, intentName, configPath) {
    let trainedResult

    // Parse lu and qna objects
    const luObjects = await file.getLuObjects(undefined, input, true, fileExtEnum.LUFile)
    const qnaObjects = await file.getLuObjects(undefined, input, true, fileExtEnum.QnAFile)

    let configObject
    if (configPath && configPath !== '') {
      configObject = await file.getConfigObject(configPath)
    } else {
      configObject = await file.getConfigObject(input)
    }

    if (configObject.rootIds.length > 0) {
      let crossTrainConfig = {
        rootIds: configObject.rootIds,
        triggerRules: configObject.triggerRules,
        intentName: intentName,
        verbose: true
      }

      trainedResult = crossTrainer.crossTrain(luObjects, qnaObjects, JSON.stringify(crossTrainConfig))
    } else {
      throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'rootDialog property is required in config file'))
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
          throw (new exception(retCode.errorCode.OUTPUT_FOLDER_INVALID, `Unable to write to file ${fileId}. Error: ${err.message}`))
        }
      }
    }
  }
}
