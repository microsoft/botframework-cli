/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
const exception = require('../utils/exception')
const retCode = require('../utils/enums/CLI-errors')
const fileHelper = require('../../utils/filehelper')

const dialogExt = '.dialog'
const luExt = '.lu'

module.exports = {
  generateConfig: async function (inputFolder, rootDialogFile) {
    let dialogFiles = []
    await getDialogFiles(inputFolder, dialogFiles)
  
    let rootDialogObject = JSON.parse(await getInputFromFile(rootDialogFile))
    rootDialogObject.path = rootDialogFile
    rootDialogObject.isRoot = true
  
    let dialogObjects = []
    for (const dialogFile of dialogFiles) {
      let dialogObject = JSON.parse(await getInputFromFile(dialogFile))
      dialogObject.path = dialogFile
      dialogObjects.push(dialogObject)
    }
  
    const configObject = createConfig(rootDialogObject, dialogObjects, inputFolder)
  
    return JSON.stringify(configObject)
  }
}

const getDialogFiles = async function (inputFolder, results) {
  fs.readdirSync(inputFolder).forEach(async dirContent => {
    dirContent = path.resolve(inputFolder, dirContent)
    if (fs.statSync(dirContent).isDirectory()) {
      await getDialogFiles(dirContent, results)
    }

    if (fs.statSync(dirContent).isFile()) {
      if (dirContent.endsWith(dialogExt)) {
        results.push(dirContent)
      }
    }
  })
}

const getInputFromFile = async function (path) {
  if (path) {
    try {
      return await fileHelper.getContentFromFile(path)
    } catch (error) {
      throw (new exception(retCode.errorCode.INVALID_INPUT, `Failed to read file: ${error}`))
    }
  }
  return ''
}

const createConfig = function (rootDialog, dialogs, configPath) {
  let result = {}

  const key = createPath(rootDialog.path, configPath)
  const rootLuPath = rootDialog.path.replace(dialogExt, luExt)

  if (!fs.existsSync(rootLuPath)) {
    throw (new exception(retCode.errorCode.INVALID_INPUT, `Failed to parse mapping rules config from file system: ${rootLuPath} does not exist. Please provide config file by --config`))
  }

  rootDialog.triggers.forEach(trigger => {
    if (trigger.$type && trigger.$type === 'Microsoft.OnIntent') {
      const actions = trigger.actions || []
      for (const action of actions) {
        if (action.$type && action.$type === 'Microsoft.BeginDialog') {
          const dialogName = action.dialog
          const target = dialogs.find(dialog => path.basename(dialog.path, dialogExt) === dialogName)
          if (target) {
            const relativePath = createPath(target.path, configPath)
            if (!result[key]) result[key] = {triggers: {}}
            if (!result[key].triggers[trigger.intent]) {
              result[key].triggers[trigger.intent] = relativePath
            } else if (typeof result[key].triggers[trigger.intent] === 'string') {
              result[key].triggers[trigger.intent] = [result[key].triggers[trigger.intent], relativePath]
            } else {
              result[key].triggers[trigger.intent].push(relativePath)
            }

            result = {...result, ...createConfig(target, dialogs, configPath)}
          }
        }
      }
    }
  })

  if (rootDialog.isRoot && result[key]) result[key].rootDialog = true

  return result
}

const createPath = function (dialogPath, configPath) {
  const luFilePath = dialogPath.replace('.dialog', '.lu')
  const relativePath = path.relative(configPath, luFilePath)
  return relativePath
}
