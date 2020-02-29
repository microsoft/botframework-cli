/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path'
import * as fs from 'fs-extra'
import {CLIError} from '@microsoft/bf-cli-command'
import {MSLGTool} from 'botbuilder-lg'
// eslint-disable-next-line node/no-extraneous-require
const fetch = require('node-fetch')
const NEWLINE = require('os').EOL
const ANY_NEWLINE = /\r\n|\r|\n/g

export enum ErrorType {
  Error = '[Error]',
  Warning = '[Warning]'
}

export class Helper {
  public static findLGFiles(input: string, recurse: boolean): string[] {
    let results: string[] = []
    const lgExt = '.lg'
    input = this.normalizePath(input)
    if (!path.isAbsolute(input)) {
      throw new CLIError('please input the absolute path.')
    }

    if (!fs.existsSync(input)) {
      throw new CLIError(`can not access to ${input}.`)
    }

    const pathState = fs.statSync(input)

    if (pathState.isFile() && input.endsWith(lgExt)) {
      results.push(input)
    } else if (pathState.isDirectory()) {
      for (const dirItem of fs.readdirSync(input)) {
        const dirContent = path.resolve(input, dirItem)
        try {
          const dirContentState = fs.statSync(dirContent)
          if (recurse && dirContentState.isDirectory()) {
            results = results.concat(this.findLGFiles(dirContent, recurse))
          }
          if (dirContentState.isFile() && dirContent.endsWith(lgExt)) {
            results.push(dirContent)
          }
        } catch (error) {
          // do nothing, just continue the iterator
        }
      }
    } else {
      throw new Error('file states is not support.')
    }

    return results
  }

  public static collect(tool: MSLGTool, out: string, force: boolean, collect: boolean): { content: string; filepath: string | undefined } {
    if (tool.collationMessages.length > 0) {
      tool.collationMessages.forEach(error => {
        if (error.startsWith(ErrorType.Error)) {
          throw new CLIError(`collating lg files failed with error : ${error}.\n`)
        } else {
          throw new CLIError(`collating lg files failed with warning : ${error}.\n`)
        }
      })
    } else if (collect === undefined && tool.nameCollisions.length > 0) {
      throw new CLIError('below template names are defined in multiple files: ' + tool.nameCollisions.toString())
    } else {
      const mergedLgFileContent = tool.collateTemplates()
      if (mergedLgFileContent === undefined || mergedLgFileContent === '') {
        throw new CLIError('generating collated lg file failed.')
      }
      if (out) {
        const filePath = Helper.getCollectFileName(out)

        if (fs.existsSync(filePath)) {
          if (!force) {
            throw new CLIError(`${filePath} exists`)
          }
          fs.removeSync(filePath)
        }

        fs.writeFileSync(filePath, mergedLgFileContent)
        return {content: mergedLgFileContent, filepath: filePath}
      }
      return {content: mergedLgFileContent, filepath: undefined}
    }

    throw new CLIError('collating lg files failed')
  }

  public static getCollectFileName(outOption: string): string {
    let filePath = this.normalizePath(outOption)
    if (!path.isAbsolute(filePath)) {
      return filePath
    }

    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'collect.lg')
    }

    return filePath
  }

  public static normalizePath(ambiguousPath: string): string {
    let result = ''
    if (process.platform === 'win32') {
      // map linux/mac sep -> windows
      result = ambiguousPath.replace(/\//g, '\\')
    } else {
      // map windows sep -> linux/mac
      result = ambiguousPath.replace(/\\/g, '/')
    }

    return path.normalize(result)
  }

  public static sanitizeNewLines(fileContent: string) {
    return fileContent.replace(ANY_NEWLINE, NEWLINE)
  }

  public static async translateText(text: any, subscriptionKey: string, to_lang: string, from_lang: string) {
    const payload = Array.isArray(text) ? text : [{Text: text}]
    let tUri = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' + to_lang + '&includeAlignment=true'
    if (from_lang) tUri += '&from=' + from_lang
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-ClientTraceId': Helper.get_guid(),
      },
    }
    const res = await fetch(tUri, options)
    if (!res.ok) {
      throw (new CLIError('Text translator service call failed with [' + res.status + '] : ' + res.statusText + '.\nPlease check key & language code validity'))
    }

    const data = await res.json()
    return data
  }

  private static get_guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      // eslint-disable-next-line no-mixed-operators
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}

export class Block {
    public block: string;

    public start: number;

    public end: number;

    constructor(block: string, start: number, end: number) {
      this.block = block
      this.start = start
      this.end = end
    }
}

export class TranslateLine {
    public text: string;

    public localize: boolean;

    public idx: number;

    constructor(text: string, localize: boolean, idx = -1) {
      this.text = text
      this.localize = localize
      this.idx = idx
    }
}

export const PARSERCONSTS = {
  TEMPLATENAME: '#',
  CONDITIONIF: 'IF:',
  CONDITIONELSEIF: 'ELSEIF:',
  CONDITIONELSE: 'ELSE:',
  COMMENT: '>',
  MULTILINE: '```',
  SEPARATOR: '-',
}
