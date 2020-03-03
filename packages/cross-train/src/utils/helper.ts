/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')

const dialogExt = '.dialog'
const luExt = '.lu'

export async function generateConfig(inputFolder: string, rootDialogFile: string) {
  let dialogFiles: string[] = []
  await getDialogFiles(inputFolder, dialogFiles)

  let rootDialogObject = JSON.parse(await getInputFromFile(rootDialogFile))
  rootDialogObject.path = rootDialogFile
  rootDialogObject.isRoot = true  

  let dialogObjects: any[] = []
  for (const dialogFile of dialogFiles) {
    let dialogObject = JSON.parse(await getInputFromFile(dialogFile))
    dialogObject.path = dialogFile
    dialogObjects.push(dialogObject)
  }

  const configObject = createConfig(rootDialogObject, dialogObjects, inputFolder)

  return JSON.stringify(configObject)
}

async function getDialogFiles(inputFolder: string, results: string[]) {
  fs.readdirSync(inputFolder).forEach(async (dirContent: string) => {
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

async function getInputFromFile(path: string) {
  if (path) {
    try {
      return await utils.readTextFile(path)
    } catch (error) {
      throw new CLIError(`Failed to read file: ${error}`)
    }
  }
  return ''
}

function createConfig(rootDialog: any, dialogs: any[], configPath: string) {
  let result: any = {}

  const key: string = createPath(rootDialog.path, configPath)
  const rootLuPath = rootDialog.path.replace(dialogExt, luExt)

  if (!fs.existsSync(rootLuPath)) {
    throw new CLIError(`Failed to parse mapping rules config from file system: ${rootLuPath} does not exist. Please provide config file by --config`)
  }

  rootDialog.triggers.forEach((trigger: any) => {
    if (trigger['$type'] && trigger['$type'] === 'Microsoft.OnIntent') {
      const actions = trigger['actions'] || []
      for (const action of actions) {
        if (action['$type'] && action['$type'] === 'Microsoft.BeginDialog') {
          const dialogName = action.dialog
          const target = dialogs.find(dialog => path.basename(dialog.path, dialogExt) === dialogName)
          if (target) {
            const relativePath = createPath(target.path, configPath)
            if (!result[key]) result[key] = { triggers: {} }
            if (!result[key].triggers[trigger.intent]) {
              result[key].triggers[trigger.intent] = relativePath
            } else if (typeof result[key].triggers[trigger.intent] === 'string') {
              result[key].triggers[trigger.intent] = [result[key].triggers[trigger.intent], relativePath]
            } else {
              result[key].triggers[trigger.intent].push(relativePath)
            }

            result = { ...result, ...createConfig(target, dialogs, configPath) }
          }
        }
      }
    }
  })

  if (rootDialog.isRoot && result[key]) result[key].rootDialog = true

  return result
}

function createPath(dialogPath: string, configPath: string) {
  const luFilePath = dialogPath.replace('.dialog', '.lu')
  const relativePath = path.relative(configPath, luFilePath)
  return relativePath
}