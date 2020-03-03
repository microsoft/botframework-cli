/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {readTextFile} from './textfilereader'
const exception = require('./../parser/utils/exception')
const retCode = require('./../parser/utils/enums/CLI-errors')
const fs = require('fs-extra')
const path = require('path')
const helpers = require('./../parser/utils/helpers')
const luObject = require('./../parser/lu/lu')
const LUOptions = require('./../parser/lu/luOptions')

/* tslint:disable:prefer-for-of no-unused*/

export async function getLuObjects(stdin: string, input: string, recurse = false, extType: string | undefined) {
  let luObjects: any = []
  if (stdin) {
    luObjects.push(new luObject(stdin, new LUOptions('stdin')))
  } else {
    let luFiles = await getLuFiles(input, recurse, extType)
    for (let i = 0; i < luFiles.length; i++) {
      let luContent = await getContentFromFile(luFiles[i])
      const opts = new LUOptions(path.resolve(luFiles[i]))
      luObjects.push(new luObject(luContent, opts))
    }
  }

  return luObjects
}

export async function getLuFiles(input: string | undefined, recurse = false, extType: string | undefined): Promise<Array<any>> {
  let filesToParse: any[] = []
  let fileStat = await fs.stat(input)
  if (fileStat.isFile()) {
    filesToParse.push(path.resolve(input))
    return filesToParse
  }

  if (!fileStat.isDirectory()) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, ' + input + ' is not a folder or does not exist'))
  }

  filesToParse = helpers.findLUFiles(input, recurse, extType)

  return filesToParse
}

export async function getContentFromFile(file: string) {
  // catch if input file is a folder
  if (fs.lstatSync(file).isDirectory()) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, "' + file + '" is a directory! Unable to read as a file'))
  }
  if (!fs.existsSync(path.resolve(file))) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry [' + file + '] does not exist'))
  }
  let fileContent
  try {
    fileContent = await readTextFile(file)
  } catch (err) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, error reading file: ' + file))
  }
  return fileContent
}

export async function generateNewFilePath(outFileName: string, inputfile: string, isLu: boolean, prefix = '', extType: string = helpers.FileExtTypeEnum.LUFile): Promise<string> {
  let base = path.resolve(outFileName)
  let root = path.dirname(base)
  if (!fs.existsSync(root)) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Path not found: ' + root))
  }

  let extension = path.extname(base)
  if (extension) {
    return path.join(root, prefix + path.basename(base))
  }

  let name = ''
  let inputStat = await fs.stat(inputfile)
  if (inputStat.isFile()) {
    name += path.basename(inputfile, path.extname(inputfile)) + (isLu ? '.json' : extType)
  } else {
    name += isLu ? 'converted.json' : `converted.${extType}`
  }
  return path.join(base, prefix + name)
}

export async function generateNewTranslatedFilePath(fileName: string, translatedLanguage: string, output: string): Promise<string> {
  let newPath = path.resolve(output)

  let extension = path.extname(newPath)
  if (extension) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Output can only be writen to a folder'))
  }

  if (!fs.existsSync(newPath)) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Path not found: ' + newPath))
  }

  newPath = path.join(output, translatedLanguage)
  await fs.mkdirp(newPath)
  return path.join(newPath, path.basename(fileName))
}

export function validatePath(outputPath: string, defaultFileName: string, forceWrite = false): string {
  let completePath = path.resolve(outputPath)
  const containingDir = path.dirname(completePath)

  // If the cointaining folder doesnt exist
  if (!fs.existsSync(containingDir)) throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Containing directory path doesn't exist: ${containingDir}`))

  const baseElement = path.basename(completePath)
  const pathAlreadyExist = fs.existsSync(completePath)

  // If the last element in the path is a file
  if (baseElement.includes('.')) {
    return pathAlreadyExist && !forceWrite ? enumerateFileName(completePath) : completePath
  }

  // If the last element in the path is a folder
  if (!pathAlreadyExist) throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Target directory path doesn't exist: ${completePath}`))
  completePath = path.join(completePath, defaultFileName)
  return fs.existsSync(completePath) && !forceWrite ? enumerateFileName(completePath) : completePath
}

function enumerateFileName(filePath: string): string {
  const fileName = path.basename(filePath)
  const containingDir = path.dirname(filePath)

  if (!fs.existsSync(containingDir)) throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Containing directory path doesn't exist: ${containingDir}`))

  const extension = path.extname(fileName)
  const baseName = path.basename(fileName, extension)
  let nextNumber = 0
  let newPath = ''

  do {
    newPath = path.join(containingDir, baseName + `(${++nextNumber})` + extension)
  } while (fs.existsSync(newPath))

  return newPath
}

export async function detectLuContent(stdin: string, input: string) {
  if (!stdin && !input) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Missing input. Please use stdin or pass a file location with --in flag'))
  }

  if (!stdin) {
    if (!fs.existsSync(path.resolve(input))) {
      throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Sorry unable to open [${input}]`))
    }

    let inputStat = await fs.stat(input)
    return !inputStat.isFile() ? true : (path.extname(input) === '.lu' || path.extname(input) === '.qna')
  }

  try {
    await JSON.parse(stdin)
  } catch (error) {
    return true
  }
  return false
}

export async function getConfigContent(input: string): Promise<string> {
  let configFilePath
  let fileStat = await fs.stat(input)
  if (fileStat.isFile()) {
    configFilePath = input
  } else {
    if (!fileStat.isDirectory()) {
      throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Sorry, ${input} is not a folder or does not exist`))
    }

    configFilePath = helpers.findConfigFile(input)

    if (configFilePath === undefined || configFilePath === '') {
      throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Sorry, no config file found in folder ${input}.`))
    }
  }

  const configContent = await getContentFromFile(configFilePath)

  return configContent
}

export function getConfigObject(configContent: string, configFileDir: string) {
  let finalLuConfigObj = Object.create(null)
  let rootLuFiles: string[] = []
  if (configContent && configContent !== '') {
    try {
      const luConfigObj = JSON.parse(configContent)
      for (const rootluFilePath of Object.keys(luConfigObj)) {
        const rootLuFileFullPath = path.resolve(configFileDir, rootluFilePath)
        const triggerObj = luConfigObj[rootluFilePath]
        for (const triggerObjKey of Object.keys(triggerObj)) {
          if (triggerObjKey === 'rootDialog') {
            if (triggerObj[triggerObjKey]) {
              rootLuFiles.push(rootLuFileFullPath)
            }
          } else if (triggerObjKey === 'triggers') {
            const triggers = triggerObj[triggerObjKey]
            for (const triggerKey of Object.keys(triggers)) {
              const destLuFiles = triggers[triggerKey] instanceof Array ? triggers[triggerKey] : [triggers[triggerKey]]
              for (const destLuFile of destLuFiles) {
                const destLuFileFullPath = path.resolve(configFileDir, destLuFile)
                if (rootLuFileFullPath in finalLuConfigObj) {
                  const finalDestLuFileToIntent = finalLuConfigObj[rootLuFileFullPath]
                  finalDestLuFileToIntent[destLuFileFullPath] = triggerKey
                } else {
                  let finalDestLuFileToIntent = Object.create(null)
                  finalDestLuFileToIntent[destLuFileFullPath] = triggerKey
                  finalLuConfigObj[rootLuFileFullPath] = finalDestLuFileToIntent
                }
              }
            }
          }
        }
      }
    } catch (err) {
      throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Sorry, invalid cross training config: ${err}`))
    }
  }

  return {rootIds: rootLuFiles, triggerRules: finalLuConfigObj}
}

export function parseJSON(input: string, appType: string) {
  try {
    return JSON.parse(input)
  } catch (error) {
    throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, `Sorry, error parsing content as ${appType} JSON`))
  }
}

export function getCultureFromPath(file: string): string | null {
  let fn = path.basename(file, path.extname(file))
  let lang = path.extname(fn).substring(1)
  switch (lang.toLowerCase()) {
  case 'en-us':
  case 'zh-cn':
  case 'nl-nl':
  case 'fr-fr':
  case 'fr-ca':
  case 'de-de':
  case 'it-it':
  case 'ja-jp':
  case 'ko-kr':
  case 'pt-br':
  case 'es-es':
  case 'es-mx':
  case 'tr-tr':
    return lang
  default:
    return null
  }
}
