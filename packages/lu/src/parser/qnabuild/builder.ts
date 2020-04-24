/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {QnaBuildCore} from './core'
import {Settings} from './settings'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Recognizer} from './recognizer'
const path = require('path')
const fs = require('fs-extra')
const delay = require('delay')
const fileHelper = require('./../../utils/filehelper')
const fileExtEnum = require('./../utils/helpers').FileExtTypeEnum
const retCode = require('./../utils/enums/CLI-errors')
const exception = require('./../utils/exception')
const qnaBuilderVerbose = require('./../qna/qnamaker/kbCollate')
const qnaMakerBuilder = require('./../qna/qnamaker/qnaMakerBuilder')
const qnaOptions = require('./../lu/qnaOptions')
const Content = require('./../lu/qna')
const KB = require('./../qna/qnamaker/kb')
const NEWLINE = require('os').EOL

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(
    files: string[],
    inputFolder: string,
    botName: string,
    suffix: string,
    region: string,
    culture: string) {
    let multiRecognizer: any
    let settings: any
    let recognizers = new Map<string, Recognizer>()
    let qnaContents = new Map<string, string>()

    for (const file of files) {
      const qnaFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.QnAFile)

      let fileContent = ''
      let result
      try {
        result = await qnaBuilderVerbose.build(qnaFiles, true)

        // construct qna content without file and url references
        fileContent = result.parseToQnAContent()
      } catch (err) {
        if (err.source) {
          err.text = `Invalid QnA file ${err.source}: ${err.text}`
        } else {
          err.text = `Invalid QnA file ${file}: ${err.text}`
        }
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, err.text))
      }

      this.handler(`${file} loaded\n`)
      let fileCulture: string
      let cultureFromPath = fileHelper.getCultureFromPath(file)
      if (cultureFromPath) {
        fileCulture = cultureFromPath
      } else {
        fileCulture = culture
      }

      if (multiRecognizer === undefined) {
        const multiRecognizerPath = path.join(inputFolder, `${botName}.qna.dialog`)
        let multiRecognizerContent = {}
        if (fs.existsSync(multiRecognizerPath)) {
          multiRecognizerContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath)).recognizers
          this.handler(`${multiRecognizerPath} loaded\n`)
        }

        multiRecognizer = new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent)
      }

      if (settings === undefined) {
        const settingsPath = path.join(inputFolder, `qnamaker.settings.${suffix}.${region}.json`)
        let settingsContent = {}
        if (fs.existsSync(settingsPath)) {
          settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).qna
          this.handler(`${settingsPath} loaded\n`)
        }

        settings = new Settings(settingsPath, settingsContent)
      }

      const content = new Content(fileContent, new qnaOptions(botName, true, fileCulture, file))

      if (!recognizers.has(content.name)) {
        const dialogFile = path.join(inputFolder, `${content.name}.dialog`)
        let existingDialogObj: any
        if (fs.existsSync(dialogFile)) {
          existingDialogObj = JSON.parse(await fileHelper.getContentFromFile(dialogFile))
          this.handler(`${dialogFile} loaded\n`)
        }

        let recognizer = Recognizer.load(content.path, content.name, dialogFile, settings, existingDialogObj)
        recognizers.set(content.name, recognizer)
        qnaContents.set(content.name, content)
      } else {
        // merge contents of qna files with same name
        let existingContent: any = qnaContents.get(content.name)
        existingContent.content = `${existingContent.content}${NEWLINE}${NEWLINE}${content.content}`
        qnaContents.set(content.name, existingContent)
      }
    }

    return {qnaContents: [...qnaContents.values()], recognizers, multiRecognizer, settings}
  }

  async build(
    qnaContents: any[],
    recognizers: Map<string, Recognizer>,
    subscriptionkey: string,
    endpoint: string,
    botName: string,
    suffix: string,
    fallbackLocale: string,
    multiRecognizer?: MultiLanguageRecognizer,
    settings?: Settings) {
    // qna api TPS which means concurrent transactions to qna maker api in 1 second
    let qnaApiTps = 3

    // set qna maker call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let delayDuration = 1100

    const qnaBuildCore = new QnaBuildCore(subscriptionkey, endpoint)
    const kbs = (await qnaBuildCore.getKBList()).knowledgebases

    // here we do a while loop to make full use of qna tps capacity
    while (qnaContents.length > 0) {
      // get a number(set by qnaApiTps) of contents for each loop
      const subQnaContents = qnaContents.splice(0, qnaApiTps)

      // concurrently handle applications
      await Promise.all(subQnaContents.map(async content => {
        // init current kb object from qna content
        const qnaObj = await this.initQnaFromContent(content, botName, suffix)
        let currentKB = qnaObj.kb
        let currentAlt = qnaObj.alterations
        let culture = content.language as string

        // get recognizer
        let recognizer = recognizers.get(content.name) as Recognizer

        let hostName = ''

        // find if there is a matched name with current kb under current authoring key
        if (!recognizer.getKBId()) {
          for (let kb of kbs) {
            if (kb.name === currentKB.name) {
              recognizer.setKBId(kb.id)
              hostName = kb.hostName
              break
            }
          }
        }

        let needPublish = false

        // compare models to update the model if a match found
        // otherwise create a new kb
        if (recognizer.getKBId() && recognizer.getKBId() !== '') {
          // To see if need update the model
          needPublish = await this.updateKB(currentKB, content.content, qnaBuildCore, recognizer, currentKB.name, delayDuration)
        } else {
          // create a new kb
          needPublish = await this.createKB(content.content, qnaBuildCore, recognizer, currentKB.name, delayDuration)
        }

        if (needPublish) {
          // train and publish kb
          await this.publishKB(qnaBuildCore, recognizer, currentKB.name, delayDuration)
        }

        if (hostName === '') hostName = (await qnaBuildCore.getKB(recognizer.getKBId())).hostName

        hostName += '/qnamaker'

        // update alterations if there are
        if (currentAlt.wordAlterations && currentAlt.wordAlterations.length > 0) {
          this.handler('Replacing alterations...\n')
          await qnaBuildCore.replaceAlt(currentAlt)
        }

        // update multiLanguageRecognizer asset
        if (multiRecognizer) {
          multiRecognizer.recognizers[culture] = path.basename(recognizer.getDialogPath(), '.dialog')
          if (culture.toLowerCase() === fallbackLocale.toLowerCase()) {
            multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
          }
        }

        // update settings asset
        if (settings) {
          settings.qna[content.name.split('.').join('_').replace(/-/g, '_')] = recognizer.getKBId()
          settings.qna.hostname = hostName
        }
      }))
    }

    // write dialog assets
    let recognizerValues: Recognizer[] = []
    if (recognizers) {
      recognizerValues = Array.from(recognizers.values())
    }

    const dialogContents = qnaBuildCore.generateDeclarativeAssets(recognizerValues, multiRecognizer as MultiLanguageRecognizer, settings as Settings)

    return dialogContents
  }

  async importUrlReference(
    url: string,
    subscriptionkey: string,
    endpoint: string,
    kbName: string) {
    const qnaBuildCore = new QnaBuildCore(subscriptionkey, endpoint)
    const kbs = (await qnaBuildCore.getKBList()).knowledgebases

    let kbId = ''
    // find if there is a matched name with current kb under current authoring key
    for (let kb of kbs) {
      if (kb.name === kbName) {
        kbId = kb.id
        break
      }
    }

    // compare models to update the model if a match found
    // otherwise create a new kb
    if (kbId !== '') {
      // To see if need update the model
      await this.updateUrlKB(qnaBuildCore, url, kbId)
    } else {
      // create a new kb
      kbId = await this.createUrlKB(qnaBuildCore, url, kbName)
    }

    const kbJson = await qnaBuildCore.exportKB(kbId, 'Prod')
    const kb = new KB(kbJson)
    const kbToLuContent = kb.parseToLuContent()

    return kbToLuContent
  }

  async importFileReference(
    fileName: string,
    fileUri: string,
    subscriptionkey: string,
    endpoint: string,
    kbName: string) {
    const qnaBuildCore = new QnaBuildCore(subscriptionkey, endpoint)
    const kbs = (await qnaBuildCore.getKBList()).knowledgebases

    let kbId = ''
    // find if there is a matched name with current kb under current authoring key
    for (let kb of kbs) {
      if (kb.name === kbName) {
        kbId = kb.id
        break
      }
    }

    // compare models to update the model if a match found
    // otherwise create a new kb
    if (kbId !== '') {
      // To see if need update the model
      await this.updateFileKB(qnaBuildCore, fileName, fileUri, kbId)
    } else {
      // create a new kb
      kbId = await this.createFileKB(qnaBuildCore, fileName, fileUri, kbName)
    }

    const kbJson = await qnaBuildCore.exportKB(kbId, 'Prod')
    const kb = new KB(kbJson)
    const kbToLuContent = kb.parseToLuContent()

    return kbToLuContent
  }

  async writeDialogAssets(contents: any[], force: boolean, out: string) {
    let writeDone = false

    if (out) {
      for (const content of contents) {
        const outFilePath = path.join(path.resolve(out), path.basename(content.path))
        if (force || !fs.existsSync(outFilePath)) {
          this.handler(`Writing to ${outFilePath}\n`)
          await fs.writeFile(outFilePath, content.content, 'utf-8')
          writeDone = true
        }
      }
    } else {
      for (const content of contents) {
        if (force || !fs.existsSync(content.path)) {
          this.handler(`Writing to ${content.path}\n`)
          await fs.writeFile(content.path, content.content, 'utf-8')
          writeDone = true
        }
      }
    }

    return writeDone
  }

  async initQnaFromContent(content: any, botName: string, suffix: string) {
    let currentQna = await qnaMakerBuilder.fromContent(content.content)
    if (!currentQna.kb.name) currentQna.kb.name = `${botName}(${suffix}).${content.language}.qna`

    return {kb: currentQna.kb, alterations: currentQna.alterations}
  }

  async updateKB(currentKB: any, qnaContent: string, qnaBuildCore: QnaBuildCore, recognizer: Recognizer, kbName: string, delayDuration: number) {
    await delay(delayDuration)
    const existingKB = await qnaBuildCore.exportKB(recognizer.getKBId(), 'Prod')

    // compare models
    const isKBEqual = qnaBuildCore.isKBEqual(currentKB, existingKB)
    if (!isKBEqual) {
      try {
        this.handler(`Updating to new version for kb ${kbName}...\n`)
        await delay(delayDuration)
        await qnaBuildCore.replaceKB(recognizer.getKBId(), qnaContent)

        this.handler(`Updating finished for kb ${kbName}\n`)
      } catch (err) {
        err.text = `Updating knowledge base failed: \n${err.text}`
        throw err
      }

      return true
    } else {
      this.handler(`kb ${kbName} has no changes\n`)
      return false
    }
  }

  async createKB(qnaContent: string, qnaBuildCore: QnaBuildCore, recognizer: Recognizer, kbName: string, delayDuration: number) {
    this.handler(`Creating qnamaker KB: ${kbName}...\n`)
    await delay(delayDuration)
    const emptyKBJson = {
      name: kbName,
      qnaList: [],
      urls: [],
      files: []
    }
    let response = await qnaBuildCore.importKB(emptyKBJson)
    let operationId = response.operationId

    try {
      const opResult = await this.getKBOperationStatus(qnaBuildCore, operationId, delayDuration)
      recognizer.setKBId(opResult.resourceLocation.split('/')[2])
      await delay(delayDuration)
      await qnaBuildCore.replaceKB(recognizer.getKBId(), qnaContent)

      this.handler(`Creating finished for kb ${kbName}\n`)
    } catch (err) {
      err.text = `Creating knowledge base failed: \n${err.text}`
      throw err
    }

    return true
  }

  async updateUrlKB(qnaBuildCore: QnaBuildCore, url: string, kbId: string) {
    await qnaBuildCore.replaceKB(kbId, {
      qnaList: [],
      urls: [],
      files: []
    })

    const updateConfig = {
      add: {
        urls: [url]
      }
    }

    const response = await qnaBuildCore.updateKB(kbId, updateConfig)
    const operationId = response.operationId
    await this.getKBOperationStatus(qnaBuildCore, operationId, 1000)
  }

  async createUrlKB(qnaBuildCore: QnaBuildCore, url: string, kbName: string) {
    const kbJson = {
      name: kbName,
      qnaList: [],
      urls: [url],
      files: []
    }

    let response = await qnaBuildCore.importKB(kbJson)
    let operationId = response.operationId
    const opResult = await this.getKBOperationStatus(qnaBuildCore, operationId, 1000)
    const kbId = opResult.resourceLocation.split('/')[2]

    return kbId
  }

  async updateFileKB(qnaBuildCore: QnaBuildCore, fileName: string, fileUri: string, kbId: string) {
    await qnaBuildCore.replaceKB(kbId, {
      qnaList: [],
      urls: [],
      files: []
    })

    let updateConfig = {
      add: {
        files: [{
          fileName,
          fileUri
        }]
      }
    }

    const response = await qnaBuildCore.updateKB(kbId, updateConfig)
    const operationId = response.operationId
    await this.getKBOperationStatus(qnaBuildCore, operationId, 1000)
  }

  async createFileKB(qnaBuildCore: QnaBuildCore, fileName: string, fileUri: string, kbName: string) {
    let kbJson = {
      name: kbName,
      qnaList: [],
      urls: [],
      files: [{
        fileName,
        fileUri
      }]
    }

    let response = await qnaBuildCore.importKB(kbJson)
    let operationId = response.operationId
    const opResult = await this.getKBOperationStatus(qnaBuildCore, operationId, 1000)
    const kbId = opResult.resourceLocation.split('/')[2]

    return kbId
  }

  async getKBOperationStatus(qnaBuildCore: QnaBuildCore, operationId: string, delayDuration: number) {
    let opResult
    let isGetting = true
    while (isGetting) {
      await delay(delayDuration)
      opResult = await qnaBuildCore.getOperationStatus(operationId)

      if (opResult.operationState === 'Failed') {
        throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, JSON.stringify(opResult, null, 4)))
      }

      if (opResult.operationState === 'Succeeded') isGetting = false
    }

    return opResult
  }

  async publishKB(qnaBuildCore: QnaBuildCore, recognizer: Recognizer, kbName: string, delayDuration: number) {
    // publish applications
    this.handler(`Publishing kb ${kbName}...\n`)
    await delay(delayDuration)
    await qnaBuildCore.publishKB(recognizer.getKBId())
    this.handler(`Publishing finished for kb ${kbName}\n`)
  }
}
