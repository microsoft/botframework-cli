import {CLIError, utils} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const helpers = require('./../parser/lufile/helpers')
const luObject = require('./../parser/lufile/classes/luObject')
/* tslint:disable:prefer-for-of no-unused*/

export async function getLuFiles(input: string | undefined, recurse = false): Promise<Array<any>> {
  let filesToParse = []
  let fileStat = await fs.stat(input)
  if (fileStat.isFile()) {
    filesToParse.push(input)
    return filesToParse
  }

  if (!fileStat.isDirectory()) {
    throw new CLIError('Sorry, ' + input + ' is not a folder or does not exist')
  }

  filesToParse = helpers.findLUFiles(input, recurse)

  if (filesToParse.length === 0) {
    throw new CLIError('Sorry, no .lu files found in the specified folder.')
  }
  return filesToParse
}

export async function getLuObjects(input: string | undefined, recurse = false) {
  let luFiles = await getLuFiles(input, recurse)
  let luObjects: any = []

  for (let i = 0; i < luFiles.length; i++) {
    let luContent = await readLuFile(luFiles[i])
    luObjects.push(new luObject(path.resolve(luFiles[i]), luContent))
  }

  return luObjects
}

export async function generateNewFilePath(outFileName: string, inputfile: string, isLu: boolean, prefix = ''): Promise<string> {
  let base = !path.isAbsolute(outFileName) ? path.join(process.cwd(), outFileName) : outFileName
  let extension = path.extname(base)
  if (extension) {
    let root = path.dirname(base)
    let file = path.basename(base)
    return path.join(root, prefix + file)
  }

  let name = ''
  let inputStat = await fs.stat(inputfile)
  if (inputStat.isFile()) {
    name += path.basename(inputfile, path.extname(inputfile)) + (isLu ? '.json' : '.lu')
  } else {
    name += isLu ? 'converted.json' : 'converted.lu'
  }
  return path.join(base, prefix + name)
}

export async function generateNewTranslatedFilePath(fileName: string, translatedLanguage: string, output: string): Promise<string> {
  let newPath = ''
  if (!path.isAbsolute(output)) {
    newPath = path.join(process.cwd(), '')
  }

  newPath = path.join(newPath, translatedLanguage)
  await fs.mkdirp(newPath)
  return path.join(newPath, fileName)
}

async function readLuFile(file: string) {
  if (!fs.existsSync(path.resolve(file))) {
    throw new CLIError(`Sorry unable to open [${file}]`)
  }
  let fileContent
  try {
    fileContent = await utils.readTextFile(file)
  } catch (err) {
    throw new CLIError(`Sorry, error reading file: ${file}`)
  }
  return fileContent
}
