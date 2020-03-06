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

  public static isPathDictionary(outPath: string): boolean {
    if (outPath === undefined || outPath === '') {
      return false
    }
    let outputFilePath = ''
    if (!path.isAbsolute(outPath)) {
      outputFilePath = path.join(process.cwd(), outPath)
    }

    outputFilePath = Helper.normalizePath(outputFilePath)

    if (fs.statSync(outputFilePath).isDirectory()) {
      return true
    }

    return false
  }

  public static tryParseFilePath(filePath: string): string | undefined {
    if (filePath === undefined || filePath === '') {
      return undefined
    }

    let outputFilePath = ''
    if (!path.isAbsolute(filePath)) {
      outputFilePath = path.join(process.cwd(), filePath)
    }

    outputFilePath = Helper.normalizePath(outputFilePath)
    try {
      if (fs.statSync(outputFilePath).isFile()) {
        return outputFilePath
      }
    } catch (error) {
      return undefined
    }

    return undefined
  }

  public static checkInputAndOutput(lgFiles: string[], out: string| undefined) {
    if (lgFiles === undefined || lgFiles.length === 0) {
      throw new Error('there is no lg file in the input folder/file.')
    }

    if (out) {
      if (lgFiles.length > 1 && !this.isPathDictionary(out)) {
        throw new Error('multiple inputs and single output is not allowed')
      }
    }
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

  public static async translateText(text: any[], translateOption: TranslateOption) {
    const payload = Array.isArray(text) ? text : [{Text: text}]
    const baseUri = 'https://api.cognitive.microsofttranslator.com/translate'
    let tUri = `${baseUri}?api-version=3.0&to=${translateOption.to_lang}&includeAlignment=true`
    if (translateOption.src_lang) tUri += `&from=${translateOption.src_lang}`
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': translateOption.subscriptionKey,
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

  public static writeContentIntoFile(filePath: string, content: string, force = false) {
    if (fs.existsSync(filePath)) {
      if (!force) {
        throw new Error(`${filePath} exists`)
      }
      fs.removeSync(filePath)
    }
    fs.writeFileSync(filePath, content)
  }
}

/**
 * Translate options, including translate key, source language and target language
 */
export class TranslateOption {
  /**
   * translate key, see https://azure.microsoft.com/en-us/services/cognitive-services/translator-text-api/
   */
  public subscriptionKey: string

  /**
   * target language
   */
  public to_lang: string

  /**
   * source language
   */
  public src_lang: string

  constructor(subscriptionKey: string, to_lang: string, src_lang: string) {
    this.subscriptionKey = subscriptionKey
    this.to_lang = to_lang
    this.src_lang = src_lang
  }
}

export class TranslateParts {
  /**
   * LG comments, start with ">"
   */
  public comments: boolean

  /**
   * LG link in import part, [abc](link) the abc part
   */
  public link: boolean

  constructor(comments = false, link = false) {
    this.comments = comments
    this.link = link
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
  COMMENT: '>',
  MULTILINE: '```',
  DASH: '-',
  LEFT_SQUARE_BRACKET: '[',
  RIGHT_SQUARE_BRACKET: ']',
}
