/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {QnaBuildCore} from './core'
import {Settings} from './settings'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Recognizer} from './recognizer'
import {CrossTrainedRecognizer} from './cross-trained-recognizer'
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
const recognizerType = require('./../utils/enums/recognizertypes')
const LUOptions = require('./../lu/luOptions')

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(
    files: string[],
    botName: string,
    suffix: string,
    region: string,
    culture: string,
    schema?: string,
    importResolver?: object) {
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings: any
    let recognizers = new Map<string, Recognizer>()
    let qnaContents = new Map<string, any>()
    let crosstrainedRecognizers = new Map<string, CrossTrainedRecognizer>()
    let qnaObjects = new Map<string, any[]>()

    for (const file of files) {
      let fileCulture: string
      let fileName: string
      let cultureFromPath = fileHelper.getCultureFromPath(file)
      if (cultureFromPath) {
        fileCulture = cultureFromPath
        let fileNameWithCulture = path.basename(file, path.extname(file))
        fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - cultureFromPath.length - 1)
      } else {
        fileCulture = culture
        fileName = path.basename(file, path.extname(file))
      }

      const fileFolder = path.dirname(file)
      const crossTrainedFileName = fileName + '.lu.qna.dialog'
      const crossTrainedRecognizerPath = path.join(fileFolder, crossTrainedFileName)
      if (!crosstrainedRecognizers.has(fileName)) {
        let crosstrainedRecognizerContent = []
        let crosstrainedRecognizerSchema = schema
        if (fs.existsSync(crossTrainedRecognizerPath)) {
          let crosstrainedRecognizerObject = JSON.parse(await fileHelper.getContentFromFile(crossTrainedRecognizerPath))
          crosstrainedRecognizerContent = crosstrainedRecognizerObject.recognizers
          crosstrainedRecognizerSchema = crosstrainedRecognizerSchema || crosstrainedRecognizerObject.$schema
          this.handler(`${crossTrainedRecognizerPath} loaded\n`)
        }

        crosstrainedRecognizers.set(fileName, new CrossTrainedRecognizer(crossTrainedRecognizerPath, crosstrainedRecognizerContent, crosstrainedRecognizerSchema as string))
      }

      let qnaFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.QnAFile)
      this.handler(`${file} loaded\n`)

      // filter empty qna files
      qnaFiles = qnaFiles.filter((file: any) => file.content !== '')
      if (qnaFiles.length <= 0) continue

      const multiRecognizerPath = path.join(fileFolder, `${fileName}.qna.dialog`)
      if (!multiRecognizers.has(fileName)) {
        let multiRecognizerContent = {}
        let multiRecognizerSchema = schema
        if (fs.existsSync(multiRecognizerPath)) {
          let multiRecognizerObject = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath))
          multiRecognizerContent = multiRecognizerObject.recognizers
          multiRecognizerSchema = multiRecognizerSchema || multiRecognizerObject.$schema
          this.handler(`${multiRecognizerPath} loaded\n`)
        }

        multiRecognizers.set(fileName, new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent, multiRecognizerSchema as string))
      }

      if (settings === undefined) {
        const settingsPath = path.join(fileFolder, `qnamaker.settings.${suffix}.${region}.json`)
        let settingsContent = {}
        if (fs.existsSync(settingsPath)) {
          settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).qna
          this.handler(`${settingsPath} loaded\n`)
        }

        settings = new Settings(settingsPath, settingsContent)
      }

      const dialogName = `${fileName}.${fileCulture}.qna`
      const dialogFile = path.join(fileFolder, dialogName + '.dialog')
      let existingDialogObj: any
      if (fs.existsSync(dialogFile)) {
        existingDialogObj = JSON.parse(await fileHelper.getContentFromFile(dialogFile))
        this.handler(`${dialogFile} loaded\n`)
      }

      if (existingDialogObj && schema) {
        existingDialogObj.$schema = schema
      }

      let recognizer = Recognizer.load(file, dialogName, dialogFile, settings, existingDialogObj, schema)
      recognizers.set(dialogName, recognizer)

      if (!qnaContents.has(fileCulture)) {
        let contentPerCulture = new Content('', new qnaOptions(botName, true, fileCulture, file))
        qnaContents.set(fileCulture, contentPerCulture)
        qnaObjects.set(fileCulture, qnaFiles)
      } else {
        // merge contents of qna files with same culture
        let qnaObject = qnaObjects.get(fileCulture)
        if (qnaObject !== undefined) {
          qnaObject.push(...qnaFiles)
        }
      }
    }

    await this.resolveMergedQnAContentIds(qnaContents, qnaObjects, importResolver)

    return {qnaContents: [...qnaContents.values()], recognizers, multiRecognizers, settings, crosstrainedRecognizers}
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
    settings?: Settings,
    crosstrainedRecognizers?: Map<string, CrossTrainedRecognizer>,
    dialogType?: string) {
    // qna api TPS which means concurrent transactions to qna maker api in 1 second
    let qnaApiTps = 3

    // set qna maker call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let delayDuration = 1100

    //default returned recognizer values
    let recognizerValues: Recognizer[] = []

    let multiRecognizerValues: MultiLanguageRecognizer[] = []

    let settingsValue: any

    let crosstrainedRecognizerValues: CrossTrainedRecognizer[] = []

    // filter if all qna contents are emtty
    let isAllQnAEmpty = fileHelper.isAllFilesSectionEmpty(qnaContents)

    if (!isAllQnAEmpty) {
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

          let hostName = ''

          // get recognizer
          let recognizersOfContentCulture: Recognizer[] = []
          for (let [dialogFileName, recognizer] of recognizers) {
            const fileNameSplit = dialogFileName.split('.')
            if (fileNameSplit[fileNameSplit.length - 2] === culture) {
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

              recognizersOfContentCulture.push(recognizer)
            }
          }

          let needPublish = false

          // compare models to update the model if a match found
          // otherwise create a new kb
          let recognizerWithKBId = recognizersOfContentCulture.find((r: Recognizer) => r.getKBId() !== '')
          if (recognizerWithKBId !== undefined) {
            // To see if need update the model
            needPublish = await this.updateKB(currentKB, qnaBuildCore, recognizerWithKBId, delayDuration)
          } else {
            // create a new kb
            needPublish = await this.createKB(currentKB, qnaBuildCore, recognizersOfContentCulture, delayDuration)
          }

          const publishRecognizer = recognizerWithKBId || recognizersOfContentCulture[0]

          if (needPublish) {
            // train and publish kb
            await this.publishKB(qnaBuildCore, publishRecognizer, currentKB.name, delayDuration)
          }

          if (hostName === '') hostName = (await qnaBuildCore.getKB(publishRecognizer.getKBId())).hostName

          hostName += '/qnamaker'

          // update alterations if there are
          if (currentAlt.wordAlterations && currentAlt.wordAlterations.length > 0) {
            this.handler('Replacing alterations...\n')
            await qnaBuildCore.replaceAlt(currentAlt)
          }

          for (const recognizer of recognizersOfContentCulture) {
            // update multiLanguageRecognizer asset
            const dialogName = path.basename(recognizer.getDialogPath(), `.${culture}.qna.dialog`)
            const dialogFileName = path.basename(recognizer.getDialogPath(), '.dialog')
            if (multiRecognizers && multiRecognizers.has(dialogName)) {
              let multiRecognizer = multiRecognizers.get(dialogName) as MultiLanguageRecognizer
              multiRecognizer.recognizers[culture] = dialogFileName
              if (culture.toLowerCase() === fallbackLocale.toLowerCase()) {
                multiRecognizer.recognizers[''] = dialogFileName
              }
            }

            if (crosstrainedRecognizers && crosstrainedRecognizers.has(dialogName)) {
              let crosstrainedRecognizer = crosstrainedRecognizers.get(dialogName) as CrossTrainedRecognizer
              if (!crosstrainedRecognizer.recognizers.includes(dialogName + '.qna')) {
                crosstrainedRecognizer.recognizers.push(dialogName + '.qna')
              }
            }

            // update settings asset
            if (settings) {
              settings.qna[dialogFileName.split('.').join('_').replace(/-/g, '_')] = recognizer.getKBId()
              settings.qna.hostname = hostName
            }
          }
        }))
      }

      // write dialog assets
      if (recognizers) {
        recognizerValues = Array.from(recognizers.values())
      }

      if (multiRecognizers) {
        multiRecognizerValues = Array.from(multiRecognizers.values())
      }

      if (settings) {
        settingsValue = settings as Settings
      }
    }

    if (dialogType === recognizerType.CROSSTRAINED && crosstrainedRecognizers) {
      crosstrainedRecognizerValues = Array.from(crosstrainedRecognizers.values())
    }

    const dialogContents = this.generateDeclarativeAssets(recognizerValues, multiRecognizerValues, settingsValue, crosstrainedRecognizerValues)

    return dialogContents
  }

  async getEndpointKeys(subscriptionkey: string, endpoint: string) {
    const qnaBuildCore = new QnaBuildCore(subscriptionkey, endpoint)
    const endPointKeys = await qnaBuildCore.getEndpointKeys()

    return endPointKeys
  }

  async importUrlReference(
    url: string,
    subscriptionkey: string,
    endpoint: string,
    kbName: string,
    enableHierarchicalExtraction: boolean = false,
    defaultAnswerUsedForExtraction: string = 'More Answers') {
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

    // delete the kb if it already exists
    if (kbId !== '') {
      await qnaBuildCore.deleteKB(kbId)
    }

    // create a new kb
    kbId = await this.createUrlKB(qnaBuildCore, url, kbName, enableHierarchicalExtraction, defaultAnswerUsedForExtraction)

    const kbJson = await qnaBuildCore.exportKB(kbId, 'Test')
    const kb = new KB(kbJson)
    const kbToLuContent = kb.parseToLuContent()
    await qnaBuildCore.deleteKB(kbId)

    return kbToLuContent
  }

  async importFileReference(
    fileName: string,
    fileUri: string,
    subscriptionkey: string,
    endpoint: string,
    kbName: string,
    enableHierarchicalExtraction: boolean = false,
    defaultAnswerUsedForExtraction: string = 'More Answers') {
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

    // delete the kb if it already exists
    if (kbId !== '') {
      await qnaBuildCore.deleteKB(kbId)
    }

    // create a new kb
    kbId = await this.createFileKB(qnaBuildCore, fileName, fileUri, kbName, enableHierarchicalExtraction, defaultAnswerUsedForExtraction)

    const kbJson = await qnaBuildCore.exportKB(kbId, 'Test')
    const kb = new KB(kbJson)
    const kbToLuContent = kb.parseToLuContent()
    await qnaBuildCore.deleteKB(kbId)

    return kbToLuContent
  }

  async writeDialogAssets(contents: any[], force: boolean, out: string) {
    let writeDone = false

    for (const content of contents) {
      let outFilePath
      if (out) {
        outFilePath = path.join(path.resolve(out), path.basename(content.path))
      } else {
        outFilePath = content.path
      }

      let fileExists = fs.existsSync(outFilePath)
      if (fileExists && outFilePath.endsWith('.lu.qna.dialog')) {
        let existingCTRecognizerObject = JSON.parse(await fileHelper.getContentFromFile(outFilePath))
        let currentCTRecognizerObject = JSON.parse(content.content)
        let ctRecognizerToBeMerged = currentCTRecognizerObject.recognizers.filter((r: string) => !existingCTRecognizerObject.recognizers.includes(r))
        existingCTRecognizerObject.recognizers = existingCTRecognizerObject.recognizers.concat(ctRecognizerToBeMerged)
        content.content = JSON.stringify(existingCTRecognizerObject, null, 4)
      }

      if (force || !fileExists) {
        this.handler(`Writing to ${outFilePath}\n`)
        await fs.writeFile(outFilePath, content.content, 'utf-8')
        writeDone = true
      }
    }

    return writeDone
  }

  generateDeclarativeAssets(recognizers: Array<Recognizer>, multiRecognizers: Array<MultiLanguageRecognizer>, settings: Settings, crosstrainedRecognizers: Array<CrossTrainedRecognizer>)
    : Array<any> {
    let contents = new Array<any>()
    for (const recognizer of recognizers) {
      let content = new Content(recognizer.save(), new LUOptions(path.basename(recognizer.getDialogPath()), true, '', recognizer.getDialogPath()))
      contents.push(content)
    }

    for (const multiRecognizer of multiRecognizers) {
      const multiLangContent = new Content(multiRecognizer.save(), new LUOptions(path.basename(multiRecognizer.getDialogPath()), true, '', multiRecognizer.getDialogPath()))
      contents.push(multiLangContent)
    }

    if (settings) {
      const settingsContent = new Content(settings.save(), new LUOptions(path.basename(settings.getSettingsPath()), true, '', settings.getSettingsPath()))
      contents.push(settingsContent)
    }

    for (const crosstrainedRecognizer of crosstrainedRecognizers) {
      const crosstrainedContent = new Content(crosstrainedRecognizer.save(), new LUOptions(path.basename(crosstrainedRecognizer.getDialogPath()), true, '', crosstrainedRecognizer.getDialogPath()))
      contents.push(crosstrainedContent)
    }

    return contents
  }

  async initQnaFromContent(content: any, botName: string, suffix: string) {
    let currentQna = await qnaMakerBuilder.fromContent(content.content)
    if (!currentQna.kb.name) currentQna.kb.name = `${botName}(${suffix}).${content.language}.qna`

    return {kb: currentQna.kb, alterations: currentQna.alterations}
  }

  async updateKB(currentKB: any, qnaBuildCore: QnaBuildCore, recognizer: Recognizer, delayDuration: number) {
    await delay(delayDuration)
    const existingKB = await qnaBuildCore.exportKB(recognizer.getKBId(), 'Prod')

    // compare models
    const isKBEqual = qnaBuildCore.isKBEqual(currentKB, existingKB)
    if (!isKBEqual) {
      try {
        this.handler(`Updating to new version for kb ${currentKB.name}...\n`)
        await delay(delayDuration)
        await qnaBuildCore.replaceKB(recognizer.getKBId(), currentKB)

        this.handler(`Updating finished for kb ${currentKB.name}\n`)
      } catch (err) {
        err.text = `Updating knowledge base failed: \n${err.text}`
        throw err
      }

      return true
    } else {
      this.handler(`kb ${currentKB.name} has no changes\n`)
      return false
    }
  }

  async createKB(currentKB: any, qnaBuildCore: QnaBuildCore, recognizers: Recognizer[], delayDuration: number) {
    this.handler(`Creating qnamaker KB: ${currentKB.name}...\n`)
    await delay(delayDuration)
    const emptyKBJson = {
      name: currentKB.name,
      qnaList: [],
      urls: [],
      files: []
    }
    let response = await qnaBuildCore.importKB(emptyKBJson)
    let operationId = response.operationId
    let kbId = ''

    try {
      const opResult = await this.getKBOperationStatus(qnaBuildCore, operationId, delayDuration)
      kbId = opResult.resourceLocation.split('/')[2]
      await delay(delayDuration)
      await qnaBuildCore.replaceKB(kbId, currentKB)

      this.handler(`Creating finished for kb ${currentKB.name}\n`)
    } catch (err) {
      err.text = `Creating knowledge base failed: \n${err.text}`
      throw err
    }

    recognizers.forEach((recogizer: Recognizer) => recogizer.setKBId(kbId))

    return true
  }

  async createUrlKB(qnaBuildCore: QnaBuildCore, url: string, kbName: string, enableHierarchicalExtraction: boolean, defaultAnswerUsedForExtraction: string) {
    let kbJson: any = {
      name: kbName,
      qnaList: [],
      urls: [url],
      files: [],
    }

    if (enableHierarchicalExtraction) {
      kbJson.enableHierarchicalExtraction = true
      kbJson.defaultAnswerUsedForExtraction = defaultAnswerUsedForExtraction
    }

    let response = await qnaBuildCore.importKB(kbJson)
    let operationId = response.operationId
    const opResult = await this.getKBOperationStatus(qnaBuildCore, operationId, 1000)
    const kbId = opResult.resourceLocation.split('/')[2]

    return kbId
  }

  async createFileKB(qnaBuildCore: QnaBuildCore, fileName: string, fileUri: string, kbName: string, enableHierarchicalExtraction: boolean, defaultAnswerUsedForExtraction: string) {
    let kbJson: any = {
      name: kbName,
      qnaList: [],
      urls: [],
      files: [{
        fileName,
        fileUri
      }]
    }

    if (enableHierarchicalExtraction) {
      kbJson.enableHierarchicalExtraction = true
      kbJson.defaultAnswerUsedForExtraction = defaultAnswerUsedForExtraction
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

  async resolveMergedQnAContentIds(contents: Map<string, any>, objects: Map<string, any[]>, importResolver?: object) {
    for (const [name, content] of contents) {
      let qnaObjects = objects.get(name)
      try {
        let result = await qnaBuilderVerbose.build(qnaObjects, true, importResolver)
        let mergedContent = result.parseToQnAContent()
        content.content = mergedContent
        contents.set(name, content)
      } catch (err) {
        if (err.source) {
          err.text = `Invalid QnA file ${err.source}: ${err.text}`
        } else {
          err.text = `Invalid QnA file ${content.path}: ${err.text}`
        }
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, err.text))
      }
    }
  }
}
