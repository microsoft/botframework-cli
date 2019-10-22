/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const path = require('path')
import {CLIError} from './clierror'

async function readTextFile(file: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(file)) {
        return reject('ENOENT: no such file or directory, ' + file)
      }
      let fileBuffer = await fs.readFile(file)
      if (fileBuffer) {
        // If the data starts with BOM, we know it is UTF
        if (fileBuffer[0] === 0xEF && fileBuffer[1] === 0xBB && fileBuffer[2] === 0xBF) {
          // EF BB BF  UTF-8 with BOM
          fileBuffer = fileBuffer.slice(3)
        } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
          // FF FE 00 00  UTF-32, little-endian BOM
          fileBuffer = fileBuffer.slice(4)
        } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFE && fileBuffer[3] === 0xFF) {
          // 00 00 FE FF  UTF-32, big-endian BOM
          fileBuffer = fileBuffer.slice(4)
        } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
          // FE FF 00 00  UCS-4, unusual octet order BOM (3412)
          fileBuffer = fileBuffer.slice(4)
        } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFF && fileBuffer[3] === 0xFE) {
          // 00 00 FF FE  UCS-4, unusual octet order BOM (2143)
          fileBuffer = fileBuffer.slice(4)
        } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE) {
          // FF FE  UTF-16, little endian BOM
          fileBuffer = fileBuffer.slice(2)
        } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF) {
          // FE FF  UTF-16, big endian BOM
          fileBuffer = fileBuffer.slice(2)
        }
      }
      return resolve(fileBuffer.toString('utf8').replace(/\0/g, ''))
    } catch (err) {
      if (err.message.match(/ENOENT: no such file or directory/)) {
        return reject(new CLIError(err.message))
      }

      return reject(`Invalid Input. Sorry, unable to parse file: ${err}`)
    }
  })
}

function validatePath(outputPath: string, defaultFileName: string, forceWrite = false): string {
  let completePath = path.resolve(outputPath)
  const containingDir = path.dirname(completePath)

  // If the cointaining folder doesnt exist
  if (!fs.existsSync(containingDir)) throw new CLIError(`Containing directory path doesn't exist: ${containingDir}`)

  const baseElement = path.basename(completePath)
  const pathAlreadyExist = fs.existsSync(completePath)

  // If the last element in the path is a file
  if (baseElement.includes('.')) {
    return pathAlreadyExist && !forceWrite ? enumerateFileName(completePath) : completePath
  }

  // If the last element in the path is a folder
  if (!pathAlreadyExist) throw new CLIError(`Target directory path doesn't exist: ${completePath}`)
  completePath = path.join(completePath, defaultFileName)
  return fs.existsSync(completePath) && !forceWrite ? enumerateFileName(completePath) : completePath
}

function enumerateFileName(filePath: string): string {
  const fileName = path.basename(filePath)
  const containingDir = path.dirname(filePath)

  if (!fs.existsSync(containingDir)) throw new CLIError(`Containing directory path doesn't exist: ${containingDir}`)

  const extension = path.extname(fileName)
  const baseName = path.basename(fileName, extension)
  let nextNumber = 0
  let newPath = ''

  do {
    newPath = path.join(containingDir, baseName + `(${++nextNumber})` + extension)
  } while (fs.existsSync(newPath))

  return newPath
}

export default {
  readTextFile,
  validatePath
}
