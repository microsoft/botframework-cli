/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const file = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const exception = require('../utils/exception')
const retCode = require('../utils/enums/CLI-errors')
const crossTrainer = require('./crossTrainer')
const confighelper = require('./confighelper')

module.exports = {
  /**
   * Generate cross train config based on input folder and root dialog file.
   * @param {string} inputFolder full path of input lu and qna files folder.
   * @param {string} rootDialogFile full path of root dialog file.
   * @returns {string} config object json string.
   */
  generateConfig: async function (inputFolder, rootDialogFile) {
    const configStr = await confighelper.generateConfig(inputFolder, rootDialogFile)

    return configStr
  },

  /**
   * Cross train lu and qna files.
   * @param {string} input full path of input lu and qna files folder.
   * @param {string} intentName interruption intent name. Default value is _Interruption.
   * @param {string} config path to config of mapping rules or mapping rules json content itself. If undefined, it will read config.json from input folder.
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined if no results.
   */
  train: async function (input, intentName, config) {
    // Get all related file content.
    const luContents = await file.getFilesContent(input, fileExtEnum.LUFile)
    const qnaContents = await file.getFilesContent(input, fileExtEnum.QnAFile)
    const configContent = config && !fs.existsSync(config) ? {id: path.join(input, 'config.json'), content: config} : await file.getConfigContent(config)

    const configObject = file.getConfigObject(configContent, intentName)

    const trainedResult = crossTrainer.crossTrain(luContents, qnaContents, configObject)
    
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
