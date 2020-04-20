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
const QnaBuilderVerbose = require('./../qna/qnamaker/kbCollate')
const LUOptions = require('./../lu/luOptions')
const Content = require('./../lu/qna')

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(
    files: string[],
    suffix: string,
    region: string,
    culture: string) {
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings = new Map<string, Settings>()
    let recognizers = new Map<string, Recognizer>()
    let qnaContents: Array<any> = []

    for (const file of files) {
      const qnaFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.QnAFile)

      let fileContent = ''
      let jsonContent
      let result
      try {
        result = await QnaBuilderVerbose.build(qnaFiles, true)

        // json content parsed from qna content
        // this is mainly used in create and update api
        jsonContent = JSON.stringify(result)

        // construct qna content without file and url references
        // this is mainly used in replace api
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
      let fileName: string
      let cultureFromPath = fileHelper.getCultureFromPath(file)
      if (cultureFromPath) {
        fileCulture = cultureFromPath
        let fileNameWithCulture = path.basename(file, path.extname(file))
        fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - fileCulture.length - 1)
      } else {
        fileCulture = culture
        fileName = path.basename(file, path.extname(file))
      }

      const fileFolder = path.dirname(file)
      const multiRecognizerPath = path.join(fileFolder, `${fileName}.qna.dialog`)
      if (!multiRecognizers.has(fileName)) {
        let multiRecognizerContent = {}
        if (fs.existsSync(multiRecognizerPath)) {
          multiRecognizerContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath)).recognizers
          this.handler(`${multiRecognizerPath} loaded\n`)
        }

        multiRecognizers.set(fileName, new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent))
      }

      const settingsPath = path.join(fileFolder, `qnamaker.settings.${suffix}.${region}.json`)
      if (!settings.has(fileFolder)) {
        let settingsContent = {}
        if (fs.existsSync(settingsPath)) {
          settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).qna
          this.handler(`${settingsPath} loaded\n`)
        }

        settings.set(fileFolder, new Settings(settingsPath, settingsContent))
      }

      const content = new Content(jsonContent, new LUOptions(fileName, true, fileCulture, file))
      content.textContent = fileContent
      qnaContents.push(content)

      const dialogFile = path.join(fileFolder, `${content.name}.dialog`)
      let existingDialogObj: any
      if (fs.existsSync(dialogFile)) {
        existingDialogObj = JSON.parse(await fileHelper.getContentFromFile(dialogFile))
        this.handler(`${dialogFile} loaded\n`)
      }

      let recognizer = Recognizer.load(content.path, content.name, dialogFile, settings.get(fileFolder) as Settings, existingDialogObj)
      recognizers.set(content.name, recognizer)
    }

    // validate if there are duplicated files with same name and locale
    let setOfContents = new Set()
    const hasDuplicates = qnaContents.some(function (currentObj) {
      return setOfContents.size === setOfContents.add(currentObj.name).size
    })

    if (hasDuplicates) {
      throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Files with same name and locale are found.'))
    }

    return {qnaContents, recognizers, multiRecognizers, settings}
  }

  async build(
    qnaContents: any[],
    recognizers: Map<string, Recognizer>,
    subscriptionkey: string,
    endpoint: string,
    botName: string,
    suffix: string,
    fallbackLocale: string,
    multiRecognizers?: Map<string, MultiLanguageRecognizer>,
    settings?: Map<string, Settings>) {
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
          needPublish = await this.updateKB(currentKB, content.textContent, qnaBuildCore, recognizer, delayDuration)
        } else {
          // create a new kb
          needPublish = await this.createKB(currentKB, content.textContent, qnaBuildCore, recognizer, currentKB.name, delayDuration)
        }

        if (needPublish) {
          // train and publish kb
          await this.publishKB(qnaBuildCore, recognizer, delayDuration)
        }

        if (hostName === '') hostName = (await qnaBuildCore.getKB(recognizer.getKBId())).hostName + '/qnamaker'

        // update alterations if there are
        if (currentAlt.wordAlterations && currentAlt.wordAlterations.length > 0) {
          this.handler(`${recognizer.getQnaPath()} replacing alterations...\n`)
          await qnaBuildCore.replaceAlt(currentAlt)
        }

        // update multiLanguageRecognizer asset
        if (multiRecognizers && multiRecognizers.has(content.id)) {
          let multiRecognizer = multiRecognizers.get(content.id) as MultiLanguageRecognizer
          multiRecognizer.recognizers[culture] = path.basename(recognizer.getDialogPath(), '.dialog')
          if (culture.toLowerCase() === fallbackLocale.toLowerCase()) {
            multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
          }
        }

        // update settings asset
        if (settings && settings.has(path.dirname(content.path))) {
          let setting = settings.get(path.dirname(content.path)) as Settings
          setting.qna[content.name.split('.').join('_')] = recognizer.getKBId()
          setting.qna.hostname = hostName
        }
      }))
    }

    // write dialog assets
    let recognizerValues: Recognizer[] = []
    if (recognizers) {
      recognizerValues = Array.from(recognizers.values())
    }

    let multiRecognizerValues: MultiLanguageRecognizer[] = []
    if (multiRecognizers) {
      multiRecognizerValues = Array.from(multiRecognizers.values())
    }

    let settingValues: Settings[] = []
    if (settings) {
      settingValues = Array.from(settings.values())
    }

    const dialogContents = qnaBuildCore.generateDeclarativeAssets(recognizerValues, multiRecognizerValues, settingValues)

    return dialogContents
  }

  async writeDialogAssets(contents: any[], force: boolean, out: string) {
    let writeDone = false

    let writeContents = contents.filter(c => c.id.endsWith('.dialog'))
    let settingsContents = contents.filter(c => c.id.endsWith('.json'))

    if (out) {
      const outPath = path.join(path.resolve(out), settingsContents[0].id)
      writeContents.push(this.mergeSettingsContent(outPath, settingsContents))
    } else {
      writeContents = writeContents.concat(settingsContents)
    }

    if (out) {
      for (const content of writeContents) {
        const outFilePath = path.join(path.resolve(out), path.basename(content.path))
        if (force || !fs.existsSync(outFilePath)) {
          this.handler(`Writing to ${outFilePath}\n`)
          await fs.writeFile(outFilePath, content.content, 'utf-8')
          writeDone = true
        }
      }
    } else {
      for (const content of writeContents) {
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
    let currentQna = await JSON.parse(content.content)
    if (!currentQna.kb.name) currentQna.kb.name = `${botName}(${suffix})-${content.name}`

    return {kb: currentQna.kb, alterations: currentQna.alterations}
  }

  async updateKB(currentKB: any, qnaContent: string, qnaBuildCore: QnaBuildCore, recognizer: Recognizer, delayDuration: number) {
    await delay(delayDuration)
    const existingKB = await qnaBuildCore.exportKB(recognizer.getKBId(), 'Prod')

    // compare models
    const isKBEqual = qnaBuildCore.isKBEqual(currentKB, existingKB)
    if (!isKBEqual) {
      try {
        this.handler(`${recognizer.getQnaPath()} updating to new version...\n`)
        await delay(delayDuration)
        await qnaBuildCore.replaceKB(recognizer.getKBId(), qnaContent)
        if (currentKB.urls.length > 0 || currentKB.files.length > 0) {
          const urlsAndFiles = {
            add: {
              urls: currentKB.urls,
              files: currentKB.files
            }
          }

          await delay(delayDuration)
          const response = await qnaBuildCore.updateKB(recognizer.getKBId(), urlsAndFiles)
          const operationId = response.operationId
          await this.getKBOperationStatus(qnaBuildCore, operationId, delayDuration)
        }

        this.handler(`${recognizer.getQnaPath()} updating finished\n`)
      } catch (err) {
        err.text = `Updating knowledge base failed: \n${err.text}`
        throw err
      }

      return true
    } else {
      this.handler(`${recognizer.getQnaPath()} no changes\n`)
      return false
    }
  }

  async createKB(currentKB: any, qnaContent: string, qnaBuildCore: QnaBuildCore, recognizer: Recognizer, kbName: string, delayDuration: number) {
    this.handler(`${recognizer.getQnaPath()} creating qnamaker KB: ${kbName}...\n`)
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
      if (currentKB.urls.length > 0 || currentKB.files.length > 0) {
        const urlsAndFiles = {
          add: {
            urls: currentKB.urls,
            files: currentKB.files
          }
        }

        await delay(delayDuration)
        response = await qnaBuildCore.updateKB(recognizer.getKBId(), urlsAndFiles)
        operationId = response.operationId
        await this.getKBOperationStatus(qnaBuildCore, operationId, delayDuration)
      }

      this.handler(`${recognizer.getQnaPath()} creating finished\n`)
    } catch (err) {
      err.text = `Creating knowledge base failed: \n${err.text}`
      throw err
    }

    return true
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

  async publishKB(qnaBuildCore: QnaBuildCore, recognizer: Recognizer, delayDuration: number) {
    // publish applications
    this.handler(`${recognizer.getQnaPath()} publishing...\n`)
    await delay(delayDuration)
    await qnaBuildCore.publishKB(recognizer.getKBId())
    this.handler(`${recognizer.getQnaPath()} publishing finished\n`)
  }

  mergeSettingsContent(settingsPath: string, contents: any[]) {
    let settings = new Settings(settingsPath, {})
    for (const content of contents) {
      const qnaMakerKBsMap = JSON.parse(content.content).qna
      for (const kbName of Object.keys(qnaMakerKBsMap)) {
        settings.qna[kbName] = qnaMakerKBsMap[kbName]
      }
    }

    return new Content(settings.save(), new LUOptions(path.basename(settings.getSettingsPath()), true, '', settings.getSettingsPath()))
  }
}
