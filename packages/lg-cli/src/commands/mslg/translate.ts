/* eslint-disable complexity */
/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper, TranslateLine, PARSERCONSTS, Block, TranslateOption, TranslateParts} from '../../utils'
import {MSLGTool} from 'botbuilder-lg'
import * as txtfile from 'read-text-file'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as os from 'os'
// eslint-disable-next-line node/no-extraneous-require

export default class TranslateCommand extends Command {
  static description = 'Translate .lg files to a target language by microsoft translation API.'

  private lgTool = new MSLGTool()

  private readonly MAX_TRANSLATE_BATCH_SIZE = 25

  private readonly MAX_CHAR_IN_REQUEST = 4990

  private readonly NEWLINE = os.EOL

  private readonly DEFAULT_SOURCE_LANG = 'en'

  private readonly ImportRegex = /^\[.+\]\(.+\)$/g

  private readonly ConditionRegex = /^(if|(else\s*if)|else|switch|case|default)\s*:.*/gi

  private readonly ExpressionRegex = /(?<!\\)\$\{(('[^'\r\n]*')|("[^"\r\n]*")|(`(\\`|[^`])*`)|([^\r\n{}'"`]))+\}?/g

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
  // translate_link_text √

  async run() {
    const {flags} = this.parse(TranslateCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)
    for (const filePath of lgFilePaths) {
      await this.translateLGFile(filePath, flags)
    }

    const collectResult = Helper.collect(this.lgTool, flags.out, flags.force, flags.collate)
    if (collectResult.filepath) {
      this.log(`Collated lg file is generated here: ${collectResult.filepath}.\n`)
    } else {
      this.log('collect result:')
      this.log(collectResult.content)
    }
  }

  private async translateLGFile(filePath: string, flags: any) {
    let outFolder: string = process.cwd()
    if (flags.out) {
      outFolder = this.getOutputFolder(flags.out)
    }

    if (!fs.existsSync(path.resolve(filePath))) {
      throw new CLIError('unable to open file: ' + filePath)
    }

    const fileContent = txtfile.readSync(filePath)
    if (!fileContent) {
      throw new CLIError('unable to read file: ' + filePath)
    }

    const errors = this.lgTool.validateFile(fileContent, filePath)
    this.log(errors.join(', '))

    let src_lang = this.DEFAULT_SOURCE_LANG
    if (flags.srclang) {
      src_lang = flags.srclang
    }

    const translateParts = new TranslateParts(Boolean(flags.translate_comments), Boolean(flags.translate_link_text))

    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    const toLangs = flags.tgtlang.split(/[, ]/g)
    for (const toLang of toLangs) {
      const tgt_lang = toLang.trim()
      if (tgt_lang !== '') {
        const translateOption = new TranslateOption(flags.translatekey, toLang, src_lang)
        await this.translateLGFileToSpecificLang(filePath, outFolder, translateOption, translateParts)
      }
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

  private async translateLGFileToSpecificLang(
    filePath: string,
    outFolder: string,
    translateOption: TranslateOption,
    translateParts: TranslateParts
  ) {
    const fileName = path.basename(filePath)
    const fileContent = txtfile.readSync(filePath)
    if (!fileContent) {
      throw new CLIError('unable to read file: ' + filePath)
    }
    const parsedLocContent = await this.parseAndTranslate(fileContent, translateOption, translateParts)

    if (!parsedLocContent) {
      throw (new CLIError('Sorry, file : ' + filePath + ' had invalid content'))
    } else {
      // write out file
      const loutFolder = path.join(outFolder, translateOption.to_lang)
      try {
        fs.mkdirSync(loutFolder)
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw (new CLIError('Unable to create folder - ' + error))
        }
      }
      const outFilePath = path.join(loutFolder, fileName)
      try {
        fs.writeFileSync(outFilePath, parsedLocContent, 'utf-8')
        this.log(`file has writtern into ${outFilePath}`)
      } catch (error) {
        throw (new CLIError('Unable to write lg file - ' + outFilePath))
      }
    }
  }

  // eslint-disable-next-line no-warning-comments
  // TODO: this part should refactoring
  private async parseAndTranslate(
    fileContent: string,
    translateOption: TranslateOption,
    translateParts: TranslateParts): Promise<string> {
    fileContent = Helper.sanitizeNewLines(fileContent)
    const linesInFile = fileContent.split(this.NEWLINE)
    let linesToTranslate: TranslateLine[] = []
    let localizedContent = ''
    let lineCtr = 0
    let inMultiLine = false
    let inStructure = false
    for (const currentLine of linesInFile) {
      lineCtr++
      if (inStructure) {
        // structure mode
        const equalIndex = currentLine.indexOf('=')
        if (equalIndex > 0) {
          this.addSegment(linesToTranslate, currentLine.substr(0, equalIndex + 1), false)
          this.addSegmentWithExpression(linesToTranslate, currentLine.substr(equalIndex + 1))
        } else {
          this.addSegment(linesToTranslate, currentLine, false)
        }
      } else if (inMultiLine) {
        // multiline
        this.addSegment(linesToTranslate, currentLine, false)
      } else if (this.ImportRegex.test(currentLine.trim())) {
        // [abc](def) -> transfer abc
        if (translateParts.link) {
          const linkValueRegEx = new RegExp(/\(.*?\)/g)
          let linkValue = ''
          const linkValueList = currentLine.trim().match(linkValueRegEx)
          if (linkValueList && linkValueList.length > 0 && linkValueList[0]) {
            linkValue = linkValueList[0].replace('(', '').replace(')', '')
          }

          const linkTextRegEx = new RegExp(/\[.*\]/g)
          let linkTextValue = ''
          const linkTextList = currentLine.trim().match(linkTextRegEx)
          if (linkTextList && linkTextList.length > 0 && linkTextList[0]) {
            linkTextValue = linkTextList[0].replace('[', '').replace(']', '')
          }

          this.addSegment(linesToTranslate, '[', false)
          this.addSegment(linesToTranslate, linkTextValue, true)
          this.addSegment(linesToTranslate, ']', false)
          this.addSegment(linesToTranslate, '(' + linkValue + ')', false)
        } else {
          this.addSegment(linesToTranslate, currentLine, false)
        }
        // > abc -> translate abc
      } else if ((inMultiLine && currentLine.trim().endsWith(PARSERCONSTS.MULTILINE)) ||  // meet abc ```, multi line end mark
      // meet - ``` abc, start multi line
      (!inMultiLine && currentLine.trim().startsWith(PARSERCONSTS.DASH) && currentLine.trim().substr(PARSERCONSTS.DASH.length).trim().startsWith(PARSERCONSTS.MULTILINE))) {
        this.addSegment(linesToTranslate, currentLine, false)
        inMultiLine = !inMultiLine
      }  else if ((!inStructure && currentLine.trim().startsWith(PARSERCONSTS.LEFT_SQUARE_BRACKET)) || // start structure
      (inStructure && currentLine.trim() === PARSERCONSTS.RIGHT_SQUARE_BRACKET)) { // end structure
        this.addSegment(linesToTranslate, currentLine, false)
        inStructure = !inStructure
      }  else if (currentLine.trim().startsWith(PARSERCONSTS.COMMENT)) {
        // comments. > abc
        if (translateParts.comments) {
          const commentIndex = currentLine.trim().indexOf(PARSERCONSTS.COMMENT)
          this.addSegment(linesToTranslate, currentLine.substr(0, commentIndex + 1) + ' ', false)
          this.addSegment(linesToTranslate, currentLine.trim().substr(commentIndex + 1), true)
        } else {
          this.addSegment(linesToTranslate, currentLine, false)
        }
      } else if (currentLine.trim().startsWith(PARSERCONSTS.DASH)) {
        // - abc dash
        // 1. normal template string
        // 2. condition/switch expression template string
        // 3. condition/swich template string
        // 4. structure value
        const dashIndex = currentLine.indexOf(PARSERCONSTS.DASH)

        this.addSegment(linesToTranslate, currentLine.substr(0, dashIndex + 1) + ' ', false)
        const content = currentLine.substr(dashIndex + 1).trim()
        if (this.ConditionRegex.test(content)) {
          // condition/switch expression template string
          this.addSegment(linesToTranslate, content, false)
        }  else {
          // other template string
          this.addSegmentWithExpression(linesToTranslate, content)
        }
      } else if (currentLine.trim() === '') {
        // do nothing
      } else {
        // add default value
        this.addSegment(linesToTranslate, currentLine, false)
      }
      // add new line for each line
      this.addSegment(linesToTranslate, this.NEWLINE, false)

      if ((linesToTranslate.length !== 0) && (lineCtr % this.MAX_TRANSLATE_BATCH_SIZE === 0)) {
        localizedContent += await this.batchTranslateText(linesToTranslate, translateOption)
        linesToTranslate = []
      }
    }

    if ((linesToTranslate.length !== 0)) {
      localizedContent += await this.batchTranslateText(linesToTranslate, translateOption)
      linesToTranslate = []
    }

    return localizedContent
  }

  private addSegmentWithExpression(linesToTranslate: TranslateLine[], content: string) {
    const blockList: Block[] = []
    const expressionsFound = content.match(this.ExpressionRegex)
    if (expressionsFound) {
      for (const expression of expressionsFound) {
        const eStartIndex = content.indexOf(expression)
        const eEndIndex = eStartIndex + expression.length - 1
        blockList.push(new Block(expression, eStartIndex, eEndIndex))
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

  private async batchTranslateText(linesToTranslate: TranslateLine[], translateOption: TranslateOption) {
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
        await this.translateAndMap(batchTranslate, translateOption, linesToTranslate)
        batchTranslate = []
        charCountInChunk = 0
      }
      const currentBatchSize = batchTranslate.length > 0 ? batchTranslate.length : 1
      if (currentBatchSize % this.MAX_TRANSLATE_BATCH_SIZE === 0) {
        await this.translateAndMap(batchTranslate, translateOption, linesToTranslate)
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
      await this.translateAndMap(batchTranslate, translateOption, linesToTranslate)
      batchTranslate = []
      charCountInChunk = 0
    }
    for (const item of linesToTranslate) {
      retValue += item.text
    }

    return retValue
  }

  private async translateAndMap(batchRequest: any, translateOption: TranslateOption, linesToTranslateCopy: TranslateLine[]) {
    if (batchRequest.length === 0) return
    const data = await Helper.translateText(batchRequest, translateOption)

    data.forEach((item: any, idx: number) => {
      // find the correponding item in linesToTranslate
      const itemInLine = linesToTranslateCopy.find(item => item.idx === idx)
      if (itemInLine) {
        itemInLine.text = item.translations[0].text
        itemInLine.idx = -1
      }
    })
  }
}
