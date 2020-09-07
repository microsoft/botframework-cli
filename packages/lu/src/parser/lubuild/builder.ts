/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LuBuildCore} from './core'
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
const LuisBuilderVerbose = require('./../luis/luisCollate')
const LuisBuilder = require('./../luis/luisBuilder')
const Luis = require('./../luis/luis')
const LUOptions = require('./../lu/luOptions')
const Content = require('./../lu/lu')
const recognizerType = require('./../utils/enums/recognizertypes')

const maxVersionCount = 100

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(
    files: string[],
    culture: string,
    suffix: string,
    region: string,
    schema?: string,
    importResolver?: object) {
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings: any
    let recognizers = new Map<string, Recognizer>()
    let luContents: Array<any> = []
    let crosstrainedRecognizers = new Map<string, CrossTrainedRecognizer>()

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

      let fileContent = ''
      let result
      let luisObj
      let luFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.LUFile)
      this.handler(`${file} loaded\n`)

      // filter empty lu files
      luFiles = luFiles.filter((file: any) => file.content !== '')
      if (luFiles.length <= 0) continue

      try {
        result = await LuisBuilderVerbose.build(luFiles, true, fileCulture, importResolver)
        luisObj = new Luis(result)
        fileContent = luisObj.parseToLuContent()
      } catch (err) {
        if (err.source) {
          err.text = `Invalid LU file ${err.source}: ${err.text}`
        } else {
          err.text = `Invalid LU file ${file}: ${err.text}`
        }
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, err.text))
      }

      const multiRecognizerPath = path.join(fileFolder, `${fileName}.lu.dialog`)
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
        const settingsPath = path.join(fileFolder, `luis.settings.${suffix}.${region}.json`)
        let settingsContent = {}
        if (fs.existsSync(settingsPath)) {
          settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).luis
          this.handler(`${settingsPath} loaded\n`)
        }

        settings = new Settings(settingsPath, settingsContent)
      }

      const content = new Content(fileContent, new LUOptions(fileName, true, fileCulture, file))
      luContents.push(content)

      const dialogFile = path.join(fileFolder, `${content.name}.dialog`)
      let existingDialogObj: any
      if (fs.existsSync(dialogFile)) {
        existingDialogObj = JSON.parse(await fileHelper.getContentFromFile(dialogFile))
        this.handler(`${dialogFile} loaded\n`)
      }

      if (existingDialogObj && schema) {
        existingDialogObj.$schema = schema
      }

      let recognizer = Recognizer.load(content.path, content.name, dialogFile, settings, existingDialogObj, schema)
      recognizers.set(content.name, recognizer)
    }

    // validate if there are duplicated files with same name and locale
    let setOfContents = new Set()
    const hasDuplicates = luContents.some(function (currentObj) {
      return setOfContents.size === setOfContents.add(currentObj.name).size
    })

    if (hasDuplicates) {
      throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Files with same name and locale are found.'))
    }

    return {luContents, recognizers, multiRecognizers, settings, crosstrainedRecognizers}
  }

  async build(
    luContents: any[],
    recognizers: Map<string, Recognizer>,
    authoringKey: string,
    endpoint: string,
    botName: string,
    suffix: string,
    fallbackLocale: string,
    keptVersionCount: number,
    isStaging: boolean,
    multiRecognizers?: Map<string, MultiLanguageRecognizer>,
    settings?: Settings,
    crosstrainedRecognizers?: Map<string, CrossTrainedRecognizer>,
    dialogType?: string,
    luisAPITPS?: number,
    timeBucketOfRequests?: number,
    retryCount?: number,
    retryDuration?: number) {
    // luis api TPS which means 5 concurrent transactions to luis api in 1 second
    // can set to other value if switched to a higher TPS(transaction per second) key
    let luisApiTps = luisAPITPS || 5

    // set luis call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let timeBucket = timeBucketOfRequests || 1100

    // set retry count for rate limit luis API failure
    let countForRetry = retryCount || 1

    // set retry duration for rate limit luis API failure
    let durationForRetry = retryDuration || 1000

    //default returned recognizer values
    let recognizerValues: Recognizer[] = []

    let multiRecognizerValues: MultiLanguageRecognizer[] = []

    let settingsValue: any

    let crosstrainedRecognizerValues: CrossTrainedRecognizer[] = []

    // filter if all lu contents are emtty
    let isAllLuEmpty = fileHelper.isAllFilesSectionEmpty(luContents)

    if (!isAllLuEmpty) {
      const luBuildCore = new LuBuildCore(authoringKey, endpoint, countForRetry, durationForRetry)
      const apps = await luBuildCore.getApplicationList()

      // here we do a while loop to make full use of luis tps capacity
      while (luContents.length > 0) {
        // get a number(set by luisApiTps) of contents for each loop
        const subLuContents = luContents.splice(0, luisApiTps)

        // concurrently handle applications
        await Promise.all(subLuContents.map(async content => {
          // init current application object from lu content
          let currentApp = await this.initApplicationFromLuContent(content, botName, suffix)

          // get recognizer
          let recognizer = recognizers.get(content.name) as Recognizer

          // find if there is a matched name with current app under current authoring key
          if (!recognizer.getAppId()) {
            for (let app of apps) {
              if (app.name === currentApp.name) {
                recognizer.setAppId(app.id)
                break
              }
            }
          }

          let needTrainAndPublish = false

          // compare models to update the model if a match found
          // otherwise create a new application
          if (recognizer.getAppId() && recognizer.getAppId() !== '') {
            // To see if need update the model
            const versionCount = keptVersionCount && keptVersionCount > 0 ? keptVersionCount : maxVersionCount
            needTrainAndPublish = await this.updateApplication(currentApp, luBuildCore, recognizer, timeBucket, versionCount)
          } else {
            // create a new application
            needTrainAndPublish = await this.createApplication(currentApp, luBuildCore, recognizer, timeBucket)
          }

          if (needTrainAndPublish) {
            // train and publish application
            await this.trainAndPublishApplication(luBuildCore, recognizer, timeBucket, isStaging)
          }

          // update multiLanguageRecognizer asset
          if (multiRecognizers && multiRecognizers.has(content.id)) {
            let multiRecognizer = multiRecognizers.get(content.id) as MultiLanguageRecognizer
            multiRecognizer.recognizers[currentApp.culture] = path.basename(recognizer.getDialogPath(), '.dialog')
            if (currentApp.culture.toLowerCase() === fallbackLocale.toLowerCase()) {
              multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
            }
          }

          if (crosstrainedRecognizers && crosstrainedRecognizers.has(content.id)) {
            let crosstrainedRecognizer = crosstrainedRecognizers.get(content.id) as CrossTrainedRecognizer
            if (!crosstrainedRecognizer.recognizers.includes(content.id + '.lu')) {
              crosstrainedRecognizer.recognizers.push(content.id + '.lu')
            }
          }

          // update settings asset
          if (settings) {
            settings.luis[content.name.split('.').join('_').replace(/-/g, '_')] = {
              "appId": recognizer.getAppId(),
              "version": recognizer.versionId
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

  async writeDialogAssets(contents: any[], force: boolean, out: string, luconfig: string) {
    let writeDone = false

    let writeContents = contents.filter(c => c.id.endsWith('.dialog'))
    let settingsContents = contents.filter(c => c.id.endsWith('.json'))

    if (settingsContents && settingsContents.length > 0) {
      let outPath
      if (luconfig) {
        outPath = path.join(path.resolve(path.dirname(luconfig)), settingsContents[0].id)
      } else if (out) {
        outPath = path.join(path.resolve(out), settingsContents[0].id)
      } else {
        outPath = path.resolve(settingsContents[0].id)
      }
      writeContents.push(this.mergeSettingsContent(outPath, settingsContents))
    }

    for (const content of writeContents) {
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

      if (force || !fs.existsSync(outFilePath)) {
        if (!fs.existsSync(path.dirname(outFilePath))) {
          fs.mkdirSync(path.dirname(outFilePath))
        }

        this.handler(`Writing to ${outFilePath}\n`)
        await fs.writeFile(outFilePath, content.content, 'utf-8')
        writeDone = true
      }
    }

    return writeDone
  }

  async getActiveVersionIds(appNames: string[], authoringKey: string, region: string, retryCount?: number, retryDuration?: number) {
    const luBuildCore = new LuBuildCore(authoringKey, `https://${region}.api.cognitive.microsoft.com`, retryCount || 1, retryDuration || 1000)
    const apps = await luBuildCore.getApplicationList()
    let appNameVersionMap = new Map<string, string>()
    for (const appName of appNames) {
      // find if there is a matched name with current app under current authoring key
      appNameVersionMap.set(appName, '')
      for (let app of apps) {
        if (app.name === appName) {
          const appInfo = await luBuildCore.getApplicationInfo(app.id)
          appNameVersionMap.set(appName, appInfo.activeVersion)
          break
        }
      }
    }

    return appNameVersionMap
  }

  async initApplicationFromLuContent(content: any, botName: string, suffix: string) {
    let currentApp = await LuisBuilder.fromLUAsync([content])  // content.parseToLuis(true, content.language)
    currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== 'en-us' ? currentApp.culture : content.language as string
    currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${botName} app, targetting ${suffix}`

    if (currentApp.name === undefined || currentApp.name === '') {
      currentApp.name = `${botName}(${suffix})-${content.name}`
    }

    // remove empty intents from current app to avoid fewLabels error when training
    this.filterEmptyIntents(currentApp)

    return currentApp
  }

  async updateApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, timeBucket: number, keptVersionCount: number) {
    await delay(timeBucket)
    const appInfo = await luBuildCore.getApplicationInfo(recognizer.getAppId())
    recognizer.versionId = appInfo.activeVersion || appInfo.endpoints.PRODUCTION.versionId

    await delay(timeBucket)
    const existingApp = await luBuildCore.exportApplication(recognizer.getAppId(), recognizer.versionId)

    // compare models
    const needUpdate = luBuildCore.compareApplications(currentApp, existingApp)
    if (needUpdate) {
      const newVersionId = luBuildCore.updateVersion(currentApp, existingApp)
      recognizer.versionId = newVersionId
      const options: any = {
        versionId: newVersionId
      }

      this.handler(`${recognizer.getLuPath()} creating version=${newVersionId}\n`)
      await delay(timeBucket)
      await luBuildCore.importNewVersion(recognizer.getAppId(), currentApp, options)
      
      // get all available versions
      await delay(timeBucket)
      const versionObjs = await luBuildCore.listApplicationVersions(recognizer.getAppId())
      if (keptVersionCount < versionObjs.length) {
        const versionObjsToDelete = versionObjs.reverse().splice(0, versionObjs.length - keptVersionCount)
        for (const versionObj of versionObjsToDelete) {
          if (versionObj.version !== newVersionId) {
            this.handler(`${recognizer.getLuPath()} deleting old version=${versionObj.version}`)
            await delay(timeBucket)
            await luBuildCore.deleteVersion(recognizer.getAppId(), versionObj.version)
          }
        }
      }

      return true
    } else {
      this.handler(`${recognizer.getLuPath()} no changes\n`)
      return false
    }
  }

  async createApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, timeBucket: number) {
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' ? currentApp.versionId : '0.1'
    recognizer.versionId = currentApp.versionId
    this.handler(`Creating LUIS.ai application: ${currentApp.name} version:${currentApp.versionId}\n`)
    await delay(timeBucket)
    const response = await luBuildCore.importApplication(currentApp)
    recognizer.setAppId(typeof response === 'string' ? response : response[Object.keys(response)[0]])
    return true
  }

  async trainAndPublishApplication(luBuildCore: LuBuildCore, recognizer: Recognizer, timeBucket: number, isStaging: boolean) {
    // send train application request
    this.handler(`${recognizer.getLuPath()} training version=${recognizer.versionId}\n`)
    await delay(timeBucket)
    await luBuildCore.trainApplication(recognizer.getAppId(), recognizer.versionId)
    this.handler(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...\n`)
    let done = true
    do {
      await delay(timeBucket)

      // get training status to see if training completed
      let trainingStatus = await luBuildCore.getTrainingStatus(recognizer.getAppId(), recognizer.versionId)
      done = true
      for (let status of trainingStatus) {
        if (status.details) {
          if (status.details.status === 'InProgress' || status.details.status === 'Queued') {
            done = false
            break
          }
        }
      }
    } while (!done)
    this.handler('done\n')

    // publish applications
    this.handler(`${recognizer.getLuPath()} publishing version=${recognizer.versionId}\n`)
    await delay(timeBucket)
    await luBuildCore.publishApplication(recognizer.getAppId(), recognizer.versionId, isStaging)
    this.handler(`${recognizer.getLuPath()} publishing finished for ${isStaging ? 'Staging' : 'Production'} slot\n`)
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

  mergeSettingsContent(settingsPath: string, contents: any[]) {
    let settings = new Settings(settingsPath, {})
    for (const content of contents) {
      const luisAppsMap = JSON.parse(content.content).luis
      for (const appName of Object.keys(luisAppsMap)) {
        settings.luis[appName] = {
          "appId": luisAppsMap[appName]["appId"],
          "version": luisAppsMap[appName]["version"]
        }
      }
    }

    return new Content(settings.save(), new LUOptions(path.basename(settings.getSettingsPath()), true, '', settings.getSettingsPath()))
  }

  filterEmptyIntents(app: any) {
    const intents = app.intents
    const utterances = app.utterances
    const patterns = app.patterns

    const emptyIntents = intents.filter((intent: any) => !utterances.some((utterance: any) => utterance.intent === intent.name)
      && !patterns.some((pattern: any) => pattern.intent === intent.name))

    if (emptyIntents && emptyIntents.length > 0) {
      const filteredIntents = intents.filter((intent: any) => !emptyIntents.some((emptyIntent: any) => emptyIntent.name === intent.name))
      this.handler(`[WARN]: empty intent(s) ${emptyIntents.map((intent: any) => '# ' + intent.name).join(', ')} are filtered when handling luis application`)
      app.intents = filteredIntents
    }
  }
}
