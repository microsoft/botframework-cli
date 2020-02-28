/* eslint-disable complexity */
/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper, TranslateLine, PARSERCONSTS, Block} from '../../utils'
import {MSLGTool} from 'botbuilder-lg'
import * as txtfile from 'read-text-file'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as os from 'os'
// eslint-disable-next-line node/no-extraneous-require
const fetch = require('node-fetch')

export default class TranslateCommand extends Command {
  static description = 'Translate .lg files to a target language by microsoft translation API.'

  private lgTool = new MSLGTool()

  private readonly MAX_TRANSLATE_BATCH_SIZE = 25

  private readonly MAX_CHAR_IN_REQUEST = 4990

  private readonly NEWLINE = os.EOL

  private readonly DEFAULT_SOURCE_LANG = 'en'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    tgtlang: flags.string({description: 'Comma separated list of target languages.', required: true}),
    translatekey: flags.string({description: 'Machine translation endpoint key.', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    collate: flags.boolean({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    srclang: flags.string({description: 'Source lang code. Auto detect if missing.'}),
    translate_comments: flags.boolean({description: 'When set, machine translate comments found in .lg file'}),
    translate_link_text: flags.boolean({description: 'When set, machine translate link description in .lg file'}),
    help: flags.help({char: 'h', description: 'mslg:translate helper'}),
  }

  // schedule
  // in √
  // tgtlang √
  // translatekey √
  // recurse √
  // out √
  // force √
  // collate √
  // srclang √
  // translate_comments √
  // translate_link_text ×

  async run() {
    const {flags} = this.parse(TranslateCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    await this.translate(flags)

    const collectResult = Helper.collect(this.lgTool, flags.out, flags.force, flags.collate)
    if (collectResult.filepath) {
      this.log(`Collated lg file is generated here: ${collectResult.filepath}.\n`)
    } else {
      this.log(collectResult.content)
    }
  }

  public async translate(flags: any) {
    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)

    let outFolder: string = process.cwd()
    if (flags.out) {
      outFolder = this.getOutputFolder(flags.out)
    }

    while (lgFilePaths.length > 0) {
      const file = lgFilePaths[0]
      let src_lang = this.DEFAULT_SOURCE_LANG
      if (flags.srclang) {
        src_lang = flags.srclang
      }

      await this.translateFile(file, outFolder, flags.translatekey, flags.tgtlang, src_lang, flags.translate_comments)
      lgFilePaths.splice(0, 1)
    }
  }

  private getOutputFolder(output: string): string {
    let outFolder = output
    if (path.isAbsolute(output)) {
      outFolder = output
    } else {
      outFolder = path.resolve('', output)
    }

    if (!fs.existsSync(outFolder)) {
      throw new CLIError('output folder ' + outFolder + ' does not exist')
    }

    return outFolder
  }

  private async translateFile(
    file: string,
    outFolder: string,
    translate_key: string,
    to_lang: string,
    src_lang: string,
    translate_comments: boolean) {
    if (!fs.existsSync(path.resolve(file))) {
      throw new CLIError('unable to open file: ' + file)
    }

    const fileContent = txtfile.readSync(file)
    if (!fileContent) {
      throw new CLIError('unable to read file: ' + file)
    }

    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    const toLangs = to_lang.split(/[, ]/g)
    for (const toLang of toLangs) {
      const tgt_lang = toLang.trim()
      if (tgt_lang !== '') {
        await this.translateFileToSpecificLang(file, outFolder, translate_key, tgt_lang, src_lang, translate_comments, fileContent)
      }
    }
  }

  private async translateFileToSpecificLang(
    file: string,
    outFolder: string,
    translate_key: string,
    tgt_lang: string,
    src_lang: string,
    translate_comments: boolean,
    fileContent: string
  ) {
    const fileName = path.basename(file)
    let parsedLocContent = ''
    try {
      parsedLocContent = await this.parseAndTranslate(fileContent, translate_key, tgt_lang, src_lang, translate_comments)
    } catch (error) {
      throw (error)
    }
    if (!parsedLocContent) {
      throw (new CLIError('Sorry, file : ' + file + ' had invalid content'))
    } else {
      // write out file
      const loutFolder = path.join(outFolder, tgt_lang)
      try {
        fs.mkdirSync(loutFolder)
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw (new CLIError('Unable to create folder - ' + error))
        }
      }
      const outFileName = path.join(loutFolder, fileName)
      try {
        fs.writeFileSync(outFileName, parsedLocContent, 'utf-8')
      } catch (error) {
        throw (new CLIError('Unable to write lg file - ' + outFileName))
      }
    }
  }

  private async parseAndTranslate(
    fileContent: string,
    subscriptionKey: string,
    to_lang: string,
    src_lang: string,
    translate_comments: boolean): Promise<string> {
    const batch_translate_size = this.MAX_TRANSLATE_BATCH_SIZE
    fileContent = Helper.sanitizeNewLines(fileContent)
    const linesInFile = fileContent.split(this.NEWLINE)
    let linesToTranslate: TranslateLine[] = []
    let localizedContent = ''
    let lineCtr = 0
    let isMultiLine = false
    for (const currentLine of linesInFile) {
      lineCtr++
      if (currentLine.trim() === PARSERCONSTS.MULTILINE) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, this.NEWLINE, false)
        isMultiLine = false
        continue
      }

      if (isMultiLine) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, this.NEWLINE, false)
        continue
      }

      if (currentLine.trim().indexOf(PARSERCONSTS.COMMENT) === 0) {
        if (translate_comments) {
          this.addSegment(linesToTranslate, currentLine.substring(0, currentLine.indexOf(PARSERCONSTS.COMMENT) + 1) + ' ', false)
          this.addSegment(linesToTranslate, currentLine.trim().slice(1).trim(), true)
        } else {
          this.addSegment(linesToTranslate, currentLine, false)
        }

        this.addSegment(linesToTranslate, this.NEWLINE, false)
      } else if (currentLine.trim().indexOf(PARSERCONSTS.TEMPLATENAME) === 0) {
        this.addSegment(linesToTranslate, currentLine, false)
        this.addSegment(linesToTranslate, this.NEWLINE, false)
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
          const expressionsFound = content.match(expressionRegex)
          if (expressionsFound) {
            // eslint-disable-next-line max-depth
            for (const expression of expressionsFound) {
              const eStartIndex = content.indexOf(expression)
              const eEndIndex = eStartIndex + expression.length - 1
              blockList.push(new Block(expression, eStartIndex, eEndIndex))
            }
          }

          const refRegex = new RegExp(/\[(.*?)\]/g) // match []
          const refsFound = content.match(refRegex)
          if (refsFound) {
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
            // eslint-disable-next-line max-depth
            if (block.start !== offset) {
              candidateText = content.substring(offset, block.start)
              // eslint-disable-next-line max-depth
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
            // eslint-disable-next-line max-depth
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

        this.addSegment(linesToTranslate, this.NEWLINE, false)
      } else if (currentLine.trim() === '') {
        this.addSegment(linesToTranslate, this.NEWLINE, false)
      } else {
        throw (new Error('Error: Unexpected line encountered when parsing ' + currentLine))
      }

      if ((linesToTranslate.length !== 0) && (lineCtr % batch_translate_size === 0)) {
        try {
          localizedContent += await this.batchTranslateText(linesToTranslate, subscriptionKey, to_lang, src_lang)
          linesToTranslate = []
        } catch (error) {
          throw (error)
        }
      }
    }

    if ((linesToTranslate.length !== 0)) {
      try {
        localizedContent += await this.batchTranslateText(linesToTranslate, subscriptionKey, to_lang, src_lang)
        linesToTranslate = []
      } catch (error) {
        throw (error)
      }
    }

    return localizedContent
  }

  private addSegment(linesToTranslate: TranslateLine[], text: string, localize: boolean) {
    if (text.length >= this.MAX_CHAR_IN_REQUEST) {
      // break it up into smaller segments and add it to the batchRequest payload
      const splitRegExp = new RegExp(`(.{${this.MAX_CHAR_IN_REQUEST}})`)
      const splitLine = text.split(splitRegExp).filter(O => O)
      splitLine.forEach(item => {
        linesToTranslate.push(new TranslateLine(item, localize))
      })
    } else {
      linesToTranslate.push(new TranslateLine(text, localize))
    }
  }

  private async batchTranslateText(linesToTranslate: TranslateLine[], subscriptionKey: string, to_lang: string, src_lang: string) {
    // responsible for breaking localizable text into chunks that are
    // - not more than 5000 characters in combined length
    // - not more than 25 segments in one chunk
    let retValue = ''
    if (!Array.isArray(linesToTranslate) || linesToTranslate.length === 0) return retValue
    let charCountInChunk = 0
    let batchTranslate = []
    for (const idx in linesToTranslate) {
      const item = linesToTranslate[idx]
      if (item.text.length + charCountInChunk >= this.MAX_CHAR_IN_REQUEST) {
        await this.translateAndMap(batchTranslate, subscriptionKey, to_lang, src_lang, linesToTranslate)
        batchTranslate = []
        charCountInChunk = 0
      }
      const currentBatchSize = batchTranslate.length > 0 ? batchTranslate.length : 1
      if (currentBatchSize % this.MAX_TRANSLATE_BATCH_SIZE === 0) {
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
    for (const item of linesToTranslate) {
      retValue += item.text
    }

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
      if (itemInLine) {
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
      throw (new CLIError('Text translator service call failed with [' + res.status + '] : ' + res.statusText + '.\nPlease check key & language code validity'))
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
