/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path')
const file = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const crossTrainer = require('./crossTrainer')

module.exports = {
  /**
   * Cross train lu and qna files.
   * @param {string} input full path of input lu and qna files folder.
   * @param {string} intentName interruption intent name. Default value is _Interruption.
   * @param {string} config path to config file of mapping rules.
   * @param {boolean} verbose verbose to indicate whether log warnings and errors or not when parsing cross-train files.
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined if no results.
   */
  train: async function (input, intentName, config, verbose) {
    // Get all related file content.
    const luContents = await file.getFilesContent(input, fileExtEnum.LUFile)
    const qnaContents = await file.getFilesContent(input, fileExtEnum.QnAFile)
    const configContent = await file.getConfigContent(config)

    let importResolver = async function (_, idsToFind) {
      let importedContents = []
      for (let idx = 0; idx < idsToFind.length; idx++) {
        let file = idsToFind[idx]
        if (path.isAbsolute(file.filePath)) {
          if (file.filePath.endsWith(fileExtEnum.LUFile)) {
            importedContents.push(...await file.getFilesContent(file.filePath, fileExtEnum.LUFile))
          } else if (file.filePath.endsWith(fileExtEnum.QnAFile)) {
            importedContents.push(...await file.getFilesContent(file.filePath, fileExtEnum.QnAFile))
          }
        } else {
          const fileName = path.basename(file.filePath)
          if (fileName.endsWith(fileExtEnum.LUFile)) {
            importedContents.push(...luContents.filter(luContent => luContent.id === path.basename(fileName, fileExtEnum.LUFile)))
          } else if (fileName.endsWith(fileExtEnum.QnAFile)) {
            importedContents.push(...qnaContents.filter(qnaContent => qnaContent.id === path.basename(fileName, fileExtEnum.QnAFile)))
          }
        }
      }

      return importedContents
    }

    const trainedResult = await crossTrainer.crossTrain(
      luContents,
      qnaContents,
      JSON.parse(configContent.content), {
      configId: configContent.id,
      intentName,
      verbose,
      importResolver
    })

    return trainedResult
  }
}
