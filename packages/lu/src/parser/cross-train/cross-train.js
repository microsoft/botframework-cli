/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path')
const fs = require('fs-extra')
const filehelper = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const crossTrainer = require('./crossTrainer')
const { lte } = require('lodash')

module.exports = {
  /**
   * Cross train lu and qna files.
   * @param {string} input full path of input lu and qna files folder.
   * @param {string} intentName interruption intent name. Default value is _Interruption.
   * @param {string} config path to config file of mapping rules.
   * @param {boolean} verbose verbose to indicate whether log warnings and errors or not when parsing cross-train files.
   * @param {inner: boolean, intra: boolean} trainingOpt trainingOpt indicates whether you want to control do the inner or intra dialog training seperately
   * @returns {luResult: any, qnaResult: any} trainedResult of luResult and qnaResult or undefined if no results.
   */
  train: async function (input, intentName, config, verbose, trainingOpt, ignore) {
    // get ignored foleders
    let ignoredFolders = undefined
    if (ignore) {
      ignoredFolders = ignore.split(',').map(e => e.trim())
    }

    // Get all related file content.
    const luContents = await filehelper.getFilesContent(input, fileExtEnum.LUFile, ignoredFolders)
    const qnaContents = await filehelper.getFilesContent(input, fileExtEnum.QnAFile, ignoredFolders)
    const configContent = await filehelper.getConfigContent(config)
    const defaultLocale = 'en-us'

    let importResolver = async function (id, idsToFind) {
      let importedContents = []
      const idWithoutExt = path.basename(id, path.extname(id))
      const locale = /\w\.\w/.test(idWithoutExt) ? idWithoutExt.split('.').pop() : defaultLocale;
      for (let idx = 0; idx < idsToFind.length; idx++) {
        let file = idsToFind[idx]
        if (path.isAbsolute(file.filePath)) {
          if (file.filePath.endsWith(fileExtEnum.LUFile)) {
            importedContents.push(...await filehelper.getFilesContent(file.filePath, fileExtEnum.LUFile))
          } else if (file.filePath.endsWith(fileExtEnum.QnAFile)) {
            importedContents.push(...await filehelper.getFilesContent(file.filePath, fileExtEnum.QnAFile))
          }
        } else {
          const fileName = path.basename(file.filePath)
          const updateImportedContents = async function(typedContents, fileExt) {
            // import resolver should be capable to find implicit import files with locale, for example '[import](b.lu)' is defined in a.en-us.lu, the resolver shoulf find b.en-us.lu
            const found = typedContents.filter(content => (content.id === path.basename(fileName, fileExt) || content.id === `${path.basename(fileName, fileExt)}.${locale}`))
            if(found.length > 0) {
              importedContents.push(...found)
            } else {
              const matchedLuisFiles = typedContents.filter(content => path.basename(content.fullPath) === id)
              for (const matchFile of matchedLuisFiles) {
                const sourceFileDir = path.dirname(matchFile.fullPath)
                const targetPath = path.resolve(sourceFileDir, file.filePath)
                if (fs.existsSync(targetPath)) {
                  const importContent = await filehelper.getFilesContent(targetPath, fileExt)
                  importedContents.push(...importContent)
                }
              }
            }
          }

          if (fileName.endsWith(fileExtEnum.LUFile)) {
            await updateImportedContents(luContents, fileExtEnum.LUFile)
          } else if (fileName.endsWith(fileExtEnum.QnAFile)) {
            await updateImportedContents(qnaContents, fileExtEnum.QnAFile)
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
      importResolver,
      trainingOpt
    })

    return trainedResult
  }
}