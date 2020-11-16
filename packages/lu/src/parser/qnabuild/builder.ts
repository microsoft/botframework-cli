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
const Content = require('./../lu/qna')
const KB = require('./../qna/qnamaker/kb')
const recognizerType = require('./../utils/enums/recognizertypes')
const qnaOptions = require('./../lu/qnaOptions')

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(files: string[], options: any = {}) {
    let culture = options.culture
    let importResolver = options.importResolver
    let log = options.log || false

    let qnaContents: any[] = []
    
    for (const file of files) {
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

      let fileContent = ''

      let qnaFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.QnAFile)
      this.handler(`${file} loaded\n`)

      // filter empty qna files
      qnaFiles = qnaFiles.filter((file: any) => file.content !== '')
      if (qnaFiles.length <= 0) {
        const content = new Content(fileContent, new qnaOptions(fileName, true, fileCulture, file))
        qnaContents.push(content)
        continue
      }

      try {
        let result = await qnaBuilderVerbose.build(qnaFiles, log, importResolver)
        fileContent = result.parseToQnAContent()
      } catch (err) {
        if (err.source) {
          err.text = `Invalid QnA file ${err.source}: ${err.text}`
        } else {
          err.text = `Invalid QnA file ${file}: ${err.text}`
        }
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, err.text))
      }
     
      const content = new Content(fileContent, new qnaOptions(fileName, true, fileCulture, file))
      qnaContents.push(content)
    }

    return qnaContents
  }

  generateDialogs(qnaContents: any[], options: any = {}) {
    let fallbackLocale = options.fallbackLocale || 'en-us'
    let dialog = options.dialog || recognizerType.MULTILANGUAGE
    let schema = options.schema

    let assets: any[] = []

    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let recognizers = new Map<string, Recognizer>()
    let crosstrainedRecognizers = new Map<string, CrossTrainedRecognizer>()

    // concurrently handle applications
    qnaContents.map(content => {
      const fileFolder = path.dirname(content.path)

      // init crosstrainedRecognizer asset even for empty content
      if (!crosstrainedRecognizers.has(content.id)) {
        const crossTrainedRecognizerPath = path.join(fileFolder, content.id + '.lu.qna.dialog')
        crosstrainedRecognizers.set(content.id, new CrossTrainedRecognizer(crossTrainedRecognizerPath, [], schema))
      }

      // content is not empty
      if (!fileHelper.isFileSectionEmpty(content)) {
        // update crosstrainedRecognizer if not empty
        let crosstrainedRecognizer = crosstrainedRecognizers.get(content.id) as CrossTrainedRecognizer
        if (!crosstrainedRecognizer.recognizers.includes(content.id + '.qna')) {
          crosstrainedRecognizer.recognizers.push(content.id + '.qna')
        }

        // init recognizer asset
        const dialogFile = path.join(fileFolder, `${content.name}.dialog`)
        let recognizer = new Recognizer(content.path, content.name, dialogFile, schema)
        recognizers.set(content.name, recognizer)

        let culture = content.language

        // init or update multiLanguageRecognizer asset
        if (!multiRecognizers.has(content.id)) {
          const multiRecognizerPath = path.join(fileFolder, `${content.id}.qna.dialog`)
          multiRecognizers.set(content.id, new MultiLanguageRecognizer(multiRecognizerPath, {}, schema))
        }

        let multiRecognizer = multiRecognizers.get(content.id) as MultiLanguageRecognizer
        multiRecognizer.recognizers[culture] = path.basename(recognizer.getDialogPath(), '.dialog')
        if (culture.toLowerCase() === fallbackLocale.toLowerCase()) {
          multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
        }
      }
    })

    // write dialog assets
    assets.push(...Array.from(recognizers.values()))
    assets.push(...Array.from(multiRecognizers.values()))

    if (dialog === recognizerType.CROSSTRAINED) {
      assets.push(...Array.from(crosstrainedRecognizers.values()))
    }

    return this.generateDeclarativeAssets(assets)
  }

  async build(
    qnaContents: any[],
    subscriptionkey: string,
    botName: string,
    options: any = {}) {
    // set qnamaker api call endpoint
    let endpoint = options.endpoint || "https://westus.api.cognitive.microsoft.com/qnamaker/v4.0"

    // set suffix default to development
    let suffix = options.suffix || 'development'

    // set region default to westus
    let region = options.region || 'westus'

    // qna api TPS which means concurrent transactions to qna maker api in 1 second
    let qnaAPITPS = options.qnaAPITPS || 3

    // set qna maker call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let timeBucketOfRequests = options.timeBucketOfRequests || 1100

    // settings assets like kb id and hostname returned from qnamaker api call
    let settingsAssets: any[] = []


    // filter if all qna contents are emtty
    const filesSectionEmptyStatus = fileHelper.filesSectionEmptyStatus(qnaContents)
    let isAllQnAEmpty = [...filesSectionEmptyStatus.values()].every((isEmpty) => isEmpty)

    if (!isAllQnAEmpty) {
      // merge contents of same locale
      let contentsPerLocale = new Map<string, any[]>()
      qnaContents.forEach(content => {
        let culture = content.language
        let contentArray = contentsPerLocale.get(culture) || []
        if (content.content !== '') contentArray.push(content)

        contentsPerLocale.set(culture, contentArray)
      })

      let mergedContents: any[] = []
      for (const [culture, contents] of contentsPerLocale) {
        let result = await qnaBuilderVerbose.build(contents, true)
        mergedContents.push({
          qnamakerObject: JSON.parse(JSON.stringify(result)),
          qnamakerContent: new Content(result.parseToQnAContent(), new qnaOptions('', true, culture, ''))
        })
      }

      let settingsPerCulture = new Map<string, any>()

      try {
        const qnaBuildCore = new QnaBuildCore(subscriptionkey, endpoint)
        const kbs = (await qnaBuildCore.getKBList()).knowledgebases

        // here we do a while loop to make full use of qna tps capacity
        while (mergedContents.length > 0) {
          // get a number(set by qnaApiTps) of contents for each loop
          const subContents = mergedContents.splice(0, qnaAPITPS)

          // concurrently handle applications
          await Promise.all(subContents.map(async content => {
            let qnamakerContent = content.qnamakerContent
            if (!fileHelper.isFileSectionEmpty(qnamakerContent)) {
              let currentQna = content.qnamakerObject

              // set kb name
              if (!currentQna.kb.name) currentQna.kb.name = `${botName}(${suffix}).${qnamakerContent.language}.qna`

              let currentKB = currentQna.kb
              let currentAlt = currentQna.alterations
              let hostName = ''
              let kbId = ''

              // find if there is a matched name with current kb under current key 
              for (let kb of kbs) {
                if (kb.name === currentKB.name) {
                  kbId = kb.id
                  hostName = kb.hostName
                  break
                }
              }

              let needPublish = false

              // compare models to update the model if a match found
              // otherwise create a new kb
              if (kbId !== '') {
                // To see if need update the model
                needPublish = await this.updateKB(currentKB, qnaBuildCore, kbId, timeBucketOfRequests)
              } else {
                // create a new kb
                kbId = await this.createKB(currentKB, qnaBuildCore, timeBucketOfRequests)
                needPublish = true
              }

              if (needPublish) {
                // train and publish kb
                await this.publishKB(qnaBuildCore, kbId, currentKB.name, timeBucketOfRequests)
              }

              if (hostName === '') hostName = (await qnaBuildCore.getKB(kbId)).hostName

              hostName += '/qnamaker'

              // update alterations if there are
              if (currentAlt.wordAlterations && currentAlt.wordAlterations.length > 0) {
                this.handler('Replacing alterations...\n')
                await qnaBuildCore.replaceAlt(currentAlt)
              }

              settingsPerCulture.set(qnamakerContent.language, {
                kbId,
                hostName
              })
            }
          }))
        }
      } catch (error) {
        throw(new exception(retCode.errorCode.QNAMAKER_BUILD_FAILED, `Qnamaker build failed: ${error.message}`))
      }

      let settings: any
      for (const content of qnaContents) {
        // skip empty content
        if (filesSectionEmptyStatus.get(content.path)) continue
        
        // init settings asset
        if (settings === undefined) {
          const settingsPath = path.join(path.dirname(content.path), `qnamaker.settings.${suffix}.${region}.json`)
          settings = new Settings(settingsPath, {})
        }

        if (settingsPerCulture.has(content.language)) {
          let kbInfo = settingsPerCulture.get(content.language)
          settings.qna[content.name.split('.').join('_').replace(/-/g, '_')] = kbInfo.kbId
          settings.qna.hostname = kbInfo.hostName
        }
      }
      

      // write dialog assets
      settingsAssets.push(settings)
    }

    const settingsContent = this.generateDeclarativeAssets(settingsAssets)

    return settingsContent
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

  async writeDialogAssets(contents: any[], options: any = {}) {
    let force = options.force || false
    let out = options.out
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

  generateDeclarativeAssets(assets: Array<any>): Array<any> {
    let contents = new Array<any>()
    for (const asset of assets) {
      let content: any
      if (asset instanceof Settings) {
        content = new Content(asset.save(), new qnaOptions(path.basename(asset.getSettingsPath()), true, '', asset.getSettingsPath()))
      } else {
        content = new Content(asset.save(), new qnaOptions(path.basename(asset.getDialogPath()), true, '', asset.getDialogPath()))
      }

      contents.push(content)
    }

    return contents
  }

  async updateKB(currentKB: any, qnaBuildCore: QnaBuildCore, kbId: string, delayDuration: number) {
    await delay(delayDuration)
    const existingKB = await qnaBuildCore.exportKB(kbId, 'Prod')

    // compare models
    const isKBEqual = qnaBuildCore.isKBEqual(currentKB, existingKB)
    if (!isKBEqual) {
      try {
        this.handler(`Updating to new version for kb ${currentKB.name}...\n`)
        await delay(delayDuration)
        await qnaBuildCore.replaceKB(kbId, currentKB)

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

  async createKB(currentKB: any, qnaBuildCore: QnaBuildCore, delayDuration: number) {
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

    return kbId
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

  async publishKB(qnaBuildCore: QnaBuildCore, kbId: string, kbName: string, delayDuration: number) {
    // publish applications
    this.handler(`Publishing kb ${kbName}...\n`)
    await delay(delayDuration)
    await qnaBuildCore.publishKB(kbId)
    this.handler(`Publishing finished for kb ${kbName}\n`)
  }
}
