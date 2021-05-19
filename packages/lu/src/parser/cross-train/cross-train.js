/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path')
const fs = require('fs-extra')
const filehelper = require('../../utils/filehelper')
const fileExtEnum = require('../utils/helpers').FileExtTypeEnum
const crossTrainer = require('./crossTrainer')
const LuisBuilder = require('./../luis/luisCollate')
const parseUtterancesToLu = require('./../luis/luConverter').parseUtterancesToLu

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
  train: async function (input, intentName, config, verbose, trainingOpt, exclude) {
    // get excluded foleders
    let excludedFolders = undefined
    if (exclude) {
      excludedFolders = exclude.split(',').map(e => e.trim())
    }

    // Get all related file content.
    const luContents = await filehelper.getFilesContent(input, fileExtEnum.LUFile, excludedFolders)
    const qnaContents = await filehelper.getFilesContent(input, fileExtEnum.QnAFile, excludedFolders)
    const configContent = await filehelper.getConfigContent(config)
    const defaultLocale = 'en-us'

    let importResolver = async function (id, idsToFind) {
      let importedContents = []
      const idWithoutExt = path.basename(id, path.extname(id))
      const locale = /\w\.\w/.test(idWithoutExt) ? idWithoutExt.split('.').pop() : defaultLocale
      const intentFilteringHandler = async (filePathOrFound, intent, isAbsolutePath) => {
        let luObj = {}
        let importFile = {}
        if (isAbsolutePath) {
          importFile = (await filehelper.getFileContent(filePathOrFound, fileExtEnum.LUFile))[0]
          luObj = await LuisBuilder.build([importFile.content], false, undefined, importResolver)
        } else {
          luObj = await LuisBuilder.build(filePathOrFound, false, undefined, importResolver) 
        }

        const matchedUtterence = luObj.utterances.find(e => e.intent === intent)
        const fileContent = `# ${intent}\r\n${parseUtterancesToLu([matchedUtterence], luObj)}`
        let cloned = {...(isAbsolutePath ? importFile : filePathOrFound[0])}
        cloned.content = fileContent
        importedContents.push(cloned)
      }

      for (let idx = 0; idx < idsToFind.length; idx++) {
        let file = idsToFind[idx]
        if (path.isAbsolute(file.filePath)) {
          if (file.filePath.endsWith(fileExtEnum.LUFile)) {
            if (!file.intent) {
              importedContents.push(...await filehelper.getFilesContent(file.filePath, fileExtEnum.LUFile))
            } else {
              await intentFilteringHandler(file.filePath, file.intent, true)
            }
          } else if (file.filePath.endsWith(fileExtEnum.QnAFile)) {
            importedContents.push(...await filehelper.getFilesContent(file.filePath, fileExtEnum.QnAFile))
          }
        } else {
          const fileName = path.basename(file.filePath)
          const updateImportedContents = async function(typedContents, fileExt) {
            let found = []
            // import resolver should be capable to find implicit import files with locale, for example '[import](b.lu)' is defined in a.en-us.lu, the resolver should find b.en-us.lu
            const foundWithLocale = typedContents.filter(content => content.id === `${path.basename(fileName, fileExt)}.${locale}`)
            if (foundWithLocale.length > 0) {
              found = foundWithLocale
            } else {
              //if no locale specified file is found, just to check whether there is file without locale matched
              found =  typedContents.filter(content => content.id === path.basename(fileName, fileExt))
            }

            if(found.length > 0) {
              if (!file.intent) {
                importedContents.push(...found)
              } else {
                await intentFilteringHandler(found, file.intent, false)
              }
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