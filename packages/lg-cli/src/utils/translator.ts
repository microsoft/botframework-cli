
/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable complexity */
/* eslint-disable max-depth */

import * as fs from 'fs-extra'
import {Helper, Block, TranslateLine, PARSERCONSTS} from './helper'
import * as path from 'path'
import * as txtfile from 'read-text-file'
import * as chalk from 'chalk'
// eslint-disable-next-line node/no-extraneous-require
const fetch = require('node-fetch')

const NEWLINE = require('os').EOL
const MAX_TRANSLATE_BATCH_SIZE = 25
const MAX_CHAR_IN_REQUEST = 4990

export class Translator {
  public async translate(program: any) {
    let filesToParse: any[] = []
    let folderStat: any
    if (program.in) {
      filesToParse.push(program.in)
    }

    if (program.lg_folder) {
      try {
        folderStat = fs.statSync(program.lg_folder)
      } catch (error) {
        throw new Error(program.lg_folder + ' is not a folder or does not exist')
      }
      if (!folderStat.isDirectory()) {
        throw new Error(program.lg_folder + ' is not a folder or does not exist')
      }
      if (program.subfolder) {
        filesToParse = Helper.findLGFiles(program.lg_folder, true)
      } else {
        filesToParse = Helper.findLGFiles(program.lg_folder, false)
      }
      if (filesToParse.length === 0) {
        throw new Error('no .lg files found in the specified folder.')
      }
    }

    let outFolder: string = process.cwd()
    if (program.out_folder) {
      if (path.isAbsolute(program.out_folder)) {
        outFolder = program.out_folder
      } else {
        outFolder = path.resolve('', program.out_folder)
      }

      if (!fs.existsSync(outFolder)) {
        throw new Error('output folder ' + outFolder + ' does not exist')
      }
    }

    while (filesToParse.length > 0) {
      const file = filesToParse[0]
      const src_lang = 'en'
      await this.parseFile(file, outFolder, program.translate_key, program.target_lang, src_lang, program.translate_comments, program.verbose)
      filesToParse.splice(0, 1)
    }
  }

  private async parseFile(
    file: string,
    outFolder: string,
    translate_key: string,
    to_lang: string,
    src_lang: string,
    translate_comments: boolean,
    verbose: boolean) {
    const fileName = path.basename(file)
    if (!fs.existsSync(path.resolve(file))) {
      throw new Error('unable to open file: ' + file)
    }

    const fileContent = txtfile.readSync(file)
    if (!fileContent) {
      throw new Error('unable to read file: ' + file)
    }

    if (verbose) process.stdout.write(chalk.default.whiteBright('Parsing file: ' + fileName + '\n'))

    let parsedLocContent = ''

    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    const toLangs = to_lang.split(/[, ]/g)
    for (const toLang of toLangs) {
      const tgt_lang = toLang.trim()
      if (tgt_lang === '') continue
      try {
        parsedLocContent = await this.parseAndTranslate(fileContent, translate_key, tgt_lang, src_lang, translate_comments, verbose)
      } catch (error) {
        throw (error)
      }
      if (!parsedLocContent) {
        throw (new Error('Sorry, file : ' + file + ' had invalid content'))
      } else {
        // write out file
        const loutFolder = path.join(outFolder, tgt_lang)
        try {
          fs.mkdirSync(loutFolder)
        } catch (error) {
          if (error.code !== 'EEXIST') {
            throw (new Error('Unable to create folder - ' + error))
          }
        }
        const outFileName = path.join(loutFolder, fileName)
        try {
          fs.writeFileSync(outFileName, parsedLocContent, 'utf-8')
        } catch (error) {
          throw (new Error('Unable to write lg file - ' + outFileName))
        }
        if (verbose) process.stdout.write(chalk.default.italic('Successfully wrote to ' + outFileName + '\n\n'))
      }
    }
  }

  private async parseAndTranslate(
    fileContent: string,
    subscriptionKey: string,
    to_lang: string,
    src_lang: string,
    translate_comments: boolean,
    verbose: boolean): Promise<string> {
    const batch_translate_size = MAX_TRANSLATE_BATCH_SIZE
    fileContent = Helper.sanitizeNewLines(fileContent)
    const linesInFile = fileContent.split(NEWLINE)
    let linesToTranslate: TranslateLine[] = []
    let localizedContent = ''
    let lineCtr = 0
    let isMultiLine = false
    for (const currentLine of linesInFile) {
      lineCtr++
      if (currentLine.trim() === PARSERCONSTS.MULTILINE) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, NEWLINE, false)
        isMultiLine = false
        continue
      }

      if (isMultiLine) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, NEWLINE, false)
        continue
      }

      if (currentLine.trim().indexOf(PARSERCONSTS.COMMENT) === 0) {
        if (translate_comments) {
          this.addSegment(linesToTranslate, currentLine.substring(0, currentLine.indexOf(PARSERCONSTS.COMMENT) + 1) + ' ', false)
          this.addSegment(linesToTranslate, currentLine.trim().slice(1).trim(), true)
        } else {
          this.addSegment(linesToTranslate, currentLine, false)
        }

        this.addSegment(linesToTranslate, NEWLINE, false)
      } else if (currentLine.trim().indexOf(PARSERCONSTS.TEMPLATENAME) === 0) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, NEWLINE, false)
      } else if (currentLine.trim().indexOf(PARSERCONSTS.SEPARATOR) === 0) {
        const blockList: Block[] = []
        let content = currentLine.trim().slice(1).trim().replace(/\s+/, '')
        if (content.indexOf(PARSERCONSTS.CONDITIONIF) === 0 ||
                    content.indexOf(PARSERCONSTS.CONDITIONELSEIF) === 0 ||
                    content.indexOf(PARSERCONSTS.CONDITIONELSE) === 0) {
          this.addSegment(linesToTranslate, currentLine, false)
        } else if (content.includes('{') || content.includes('[')) {
          this.addSegment(linesToTranslate, currentLine.substring(0, currentLine.indexOf(PARSERCONSTS.SEPARATOR) + 1) + ' ', false)
          content = currentLine.trim().slice(1).trim()
          const expressionRegex = new RegExp(/\{(.*?)\}/g) // match {}
          const expressionsFound: RegExpMatchArray | null = content.match(expressionRegex)
          if (expressionsFound !== null && expressionsFound !== undefined) {
            // eslint-disable-next-line max-depth
            for (const expression of expressionsFound) {
              const eStartIndex = content.indexOf(expression)
              const eEndIndex = eStartIndex + expression.length - 1
              blockList.push(new Block(expression, eStartIndex, eEndIndex))
            }
          }

          const refRegex = new RegExp(/\[(.*?)\]/g) // match []
          const refsFound: RegExpMatchArray | null = content.match(refRegex)
          if (refsFound !== null && refsFound !== undefined) {
            // eslint-disable-next-line max-depth
            for (const ref of refsFound) {
              const eStartIndex = content.indexOf(ref)
              const eEndIndex = eStartIndex + ref.length - 1
              blockList.push(new Block(ref, eStartIndex, eEndIndex))
            }
          }

          let offset = 0
          let candidateText = ''
          // Tokenize the input utterance.
          for (const block of blockList) {
            if (block.start !== offset) {
              candidateText = content.substring(offset, block.start)
              if (candidateText.trim() !== '') {
                this.addSegment(linesToTranslate, candidateText, true)
              } else {
                this.addSegment(linesToTranslate, candidateText, false)
              }
            }

            this.addSegment(linesToTranslate, block.block, false)
            offset = block.end + 1
          }

          if (offset !== content.length) {
            candidateText = content.substring(offset)
            if (candidateText.trim() !== '') {
              this.addSegment(linesToTranslate, candidateText, true)
            } else {
              this.addSegment(linesToTranslate, candidateText, false)
            }
          }
        } else if (content.indexOf(PARSERCONSTS.MULTILINE) === 0) {
          this.addSegment(linesToTranslate, currentLine, false)
          isMultiLine = true
        } else {
          this.addSegment(linesToTranslate, currentLine.substring(0, currentLine.indexOf(PARSERCONSTS.SEPARATOR) + 1) + ' ', false)
          this.addSegment(linesToTranslate, currentLine.trim().slice(1).trim(), true)
        }

        this.addSegment(linesToTranslate, NEWLINE, false)
      } else if (currentLine.trim() === '') {
        this.addSegment(linesToTranslate, NEWLINE, false)
      } else {
        throw (new Error('Error: Unexpected line encountered when parsing ' + currentLine))
      }

      if ((linesToTranslate.length !== 0) && (lineCtr % batch_translate_size === 0)) {
        try {
          localizedContent += await this.batchTranslateText(linesToTranslate, subscriptionKey, to_lang, src_lang, verbose)
          linesToTranslate = []
        } catch (error) {
          throw (error)
        }
      }
    }

    if ((linesToTranslate.length !== 0)) {
      try {
        localizedContent += await this.batchTranslateText(linesToTranslate, subscriptionKey, to_lang, src_lang, verbose)
        linesToTranslate = []
      } catch (error) {
        throw (error)
      }
    }

    return localizedContent
  }

  private addSegment(linesToTranslate: TranslateLine[], text: string, localize: boolean) {
    if (text.length >= MAX_CHAR_IN_REQUEST) {
      // break it up into smaller segments and add it to the batchRequest payload
      const splitRegExp = new RegExp(`(.{${MAX_CHAR_IN_REQUEST}})`)
      const splitLine = text.split(splitRegExp).filter(O => O)
      splitLine.forEach(item => {
        linesToTranslate.push(new TranslateLine(item, localize))
      })
    } else {
      linesToTranslate.push(new TranslateLine(text, localize))
    }
  }

  private async batchTranslateText(linesToTranslate: TranslateLine[], subscriptionKey: string, to_lang: string, src_lang: string, verbose: boolean) {
    // responsible for breaking localizable text into chunks that are
    // - not more than 5000 characters in combined length
    // - not more than 25 segments in one chunk
    let retValue = ''
    if (!Array.isArray(linesToTranslate) || linesToTranslate.length === 0) return retValue
    let charCountInChunk = 0
    let batchTranslate = []
    for (const idx in linesToTranslate) {
      const item = linesToTranslate[idx]
      if (item.text.length + charCountInChunk >= MAX_CHAR_IN_REQUEST) {
        await this.translateAndMap(batchTranslate, subscriptionKey, to_lang, src_lang, linesToTranslate)
        batchTranslate = []
        charCountInChunk = 0
      }
      const currentBatchSize = batchTranslate.length > 0 ? batchTranslate.length : 1
      if (currentBatchSize % MAX_TRANSLATE_BATCH_SIZE === 0) {
        await this.translateAndMap(batchTranslate, subscriptionKey, to_lang, src_lang, linesToTranslate)
        batchTranslate = []
        charCountInChunk = 0
      }
      if (item.localize) {
        item.idx = batchTranslate.length
        batchTranslate.push({Text: item.text})
        charCountInChunk += item.text.length
      }
    }
    if (batchTranslate.length !== 0) {
      await this.translateAndMap(batchTranslate, subscriptionKey, to_lang, src_lang, linesToTranslate)
      batchTranslate = []
      charCountInChunk = 0
    }
    // eslint-disable-next-line no-return-assign
    linesToTranslate.forEach(item => retValue += item.text)
    if (verbose) process.stdout.write(chalk.default.gray(retValue))
    return retValue
  }

  private async translateAndMap(batchRequest: any, subscriptionKey: string, to_lang: string, src_lang: string, linesToTranslateCopy: TranslateLine[]) {
    if (batchRequest.length === 0) return
    let data
    try {
      data = await this.translateText(batchRequest, subscriptionKey, to_lang, src_lang)
    } catch (error) {
      throw (error)
    }
    data.forEach((item: any, idx: number) => {
      // find the correponding item in linesToTranslate
      const itemInLine = linesToTranslateCopy.find(item => item.idx === idx)
      if (itemInLine !== undefined) {
        itemInLine.text = item.translations[0].text
        itemInLine.idx = -1
      }
    })
  }

  private async translateText(text: any, subscriptionKey: string, to_lang: string, from_lang: string) {
    const payload = Array.isArray(text) ? text : [{Text: text}]
    let tUri = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' + to_lang + '&includeAlignment=true'
    if (from_lang) tUri += '&from=' + from_lang
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-ClientTraceId': this.get_guid(),
      },
    }
    const res = await fetch(tUri, options)
    if (!res.ok) {
      throw (new Error('Text translator service call failed with [' + res.status + '] : ' + res.statusText + '.\nPlease check key & language code validity'))
    }

    const data = await res.json()
    return data
  }

  private get_guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      // eslint-disable-next-line no-mixed-operators
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
