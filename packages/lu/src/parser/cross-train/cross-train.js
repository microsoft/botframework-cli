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

    const trainedResult = await crossTrainer.crossTrain(
      luContents,
      qnaContents,
      JSON.parse(configContent.content), {
      configId: configContent.id,
      intentName,
      verbose
    })

    return trainedResult
  }
}
