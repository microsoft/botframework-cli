/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const file = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
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
   * @param {boolean} verbose verbose to indicate whether log warnings and errors or not when parsing cross-train files.
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined if no results.
   */
  train: async function (input, intentName, config, verbose) {
    // Get all related file content.
    const luContents = await file.getFilesContent(input, fileExtEnum.LUFile)
    const qnaContents = await file.getFilesContent(input, fileExtEnum.QnAFile)
    const configContent = config && !fs.existsSync(config) ? {id: path.join(input, 'config.json'), content: config} : await file.getConfigContent(config)

    const configObject = file.getConfigObject(configContent, intentName, verbose)

    const trainedResult = await crossTrainer.crossTrain(luContents, qnaContents, configObject)
    
    return trainedResult
  }
}
