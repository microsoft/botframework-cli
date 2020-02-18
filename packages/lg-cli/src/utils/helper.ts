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
const NEWLINE = require('os').EOL
const ANY_NEWLINE = /\r\n|\r|\n/g

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
        if (recurse && fs.statSync(dirContent).isDirectory()) {
          results = results.concat(this.findLGFiles(dirContent, recurse))
        }
        if (fs.statSync(dirContent).isFile()) {
          if (dirContent.endsWith(lgExt)) {
            results.push(dirContent)
          }
        }
      }
    } else {
      throw new CLIError('file states is not support.')
    }

    return results
  }

  public static handlerCollect() {
    // todo
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
}

export enum ErrorType {
    Error = '[Error]',
    Warning = '[Warning]'
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
