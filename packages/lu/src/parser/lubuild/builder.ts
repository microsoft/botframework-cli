/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LuBuildCore} from './core'
import {Settings} from './settings'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Recognizer} from './recognizer'
const path = require('path')
const fs = require('fs-extra')
const delay = require('delay')
const fileHelper = require('./../../utils/filehelper')
const fileExtEnum = require('./../utils/helpers').FileExtTypeEnum
const LuisBuilder = require('./../luis/luisBuilder')
const Content = require('./../lu/lu')

export class Builder {
  private readonly handler: (input: string) => any

  constructor(handler: any) {
    this.handler = handler
  }

  async loadContents(
    files: string[],
    culture: string,
    suffix: string,
    region: string) {
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings = new Map<string, Settings>()
    let recognizers = new Map<string, Recognizer>()
    let luContents: Array<any> = []

    for (const file of files) {
      let fileCulture: string
      let fileName: string
      const luFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.LUFile)
      const result = await LuisBuilder.build(luFiles, true, culture)
      const fileContent = result.parseToLuContent()
      this.handler(`${file} loaded\n`)
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
      const multiRecognizerPath = path.join(fileFolder, `${fileName}.lu.dialog`)
      if (!multiRecognizers.has(fileName)) {
        let multiRecognizerContent = {}
        if (fs.existsSync(multiRecognizerPath)) {
          multiRecognizerContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath)).recognizers
          this.handler(`${multiRecognizerPath} loaded\n`)
        }

        multiRecognizers.set(fileName, new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent))
      }

      const settingsPath = path.join(fileFolder, `luis.settings.${suffix}.${region}.json`)
      if (!settings.has(fileFolder)) {
        let settingsContent = {}
        if (fs.existsSync(settingsPath)) {
          settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).luis
          this.handler(`${settingsPath} loaded\n`)
        }

        settings.set(fileFolder, new Settings(settingsPath, settingsContent))
      }

      const content = new Content(fileContent, fileName, true, fileCulture, file)
      luContents.push(content)

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
    const hasDuplicates = luContents.some(function (currentObj) {
      return setOfContents.size === setOfContents.add(currentObj.name).size
    })

    if (hasDuplicates) {
      throw new Error('Files with same name and locale are found.')
    }

    return {luContents, recognizers, multiRecognizers, settings}
  }

  async build(
    luContents: any[],
    recognizers: Map<string, Recognizer>,
    authoringKey: string,
    region: string,
    botName: string,
    suffix: string,
    fallbackLocale: string,
    deleteOldVersion: boolean,
    multiRecognizers?: Map<string, MultiLanguageRecognizer>,
    settings?: Map<string, Settings>) {
    // luis api TPS which means 5 concurrent transactions to luis api in 1 second
    // can set to other value if switched to a higher TPS(transaction per second) key
    let luisApiTps = 5

    // set luis call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let delayDuration = 1100

    const defaultLuisSchemeVersion = '4.0.0'
    const luBuildCore = new LuBuildCore(authoringKey, `https://${region}.api.cognitive.microsoft.com`)
    const apps = await luBuildCore.getApplicationList()

    // here we do a while loop to make full use of luis tps capacity
    while (luContents.length > 0) {
      // get a number(set by luisApiTps) of contents for each loop
      const subLuContents = luContents.splice(0, luisApiTps)

      // concurrently handle applications
      await Promise.all(subLuContents.map(async content => {
        // init current application object from lu content
        let currentApp = await this.initApplicationFromLuContent(content, botName, suffix, defaultLuisSchemeVersion)

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
          needTrainAndPublish = await this.updateApplication(currentApp, luBuildCore, recognizer, delayDuration, deleteOldVersion)
        } else {
          // create a new application
          needTrainAndPublish = await this.createApplication(currentApp, luBuildCore, recognizer, delayDuration)
        }

        if (needTrainAndPublish) {
          // train and publish application
          await this.trainAndPublishApplication(luBuildCore, recognizer, delayDuration)
        }

        // update multiLanguageRecognizer asset
        if (multiRecognizers && multiRecognizers.has(content.id)) {
          let multiRecognizer = multiRecognizers.get(content.id) as MultiLanguageRecognizer
          multiRecognizer.recognizers[currentApp.culture] = path.basename(recognizer.getDialogPath(), '.dialog')
          if (currentApp.culture.toLowerCase() === fallbackLocale.toLowerCase()) {
            multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
          }
        }

        // update settings asset
        if (settings && settings.has(path.dirname(content.path))) {
          let setting = settings.get(path.dirname(content.path)) as Settings
          setting.luis[content.name.split('.').join('_')] = recognizer.getAppId()
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

    const dialogContents = luBuildCore.generateDeclarativeAssets(recognizerValues, multiRecognizerValues, settingValues)

    return dialogContents
  }

  async writeDialogAssets(contents: any[], force: boolean, out: string) {
    let writeDone = false
    for (const content of contents) {
      if (out) {
        const outFilePath = path.join(path.resolve(out), path.basename(content.path))
        if (force || !fs.existsSync(outFilePath)) {
          this.handler(`Writing to ${outFilePath}\n`)
          await fs.writeFile(outFilePath, content.content, 'utf-8')
          writeDone = true
        }
      } else {
        if (force || !fs.existsSync(content.path)) {
          this.handler(`Writing to ${content.path}\n`)
          await fs.writeFile(content.path, content.content, 'utf-8')
          writeDone = true
        }
      }
    }

    return writeDone
  }

  async initApplicationFromLuContent(content: any, botName: string, suffix: string, defaultLuisSchemeVersion: string) {
    let currentApp = await content.parseToLuis(true, content.language)
    currentApp.culture = currentApp.culture && currentApp.culture !== '' ? currentApp.culture : content.language as string
    currentApp.luis_schema_version = currentApp.luis_schema_version && currentApp.luis_schema_version !== '' ? currentApp.luis_schema_version : defaultLuisSchemeVersion
    currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${botName} app, targetting ${suffix}`

    if (currentApp.name === undefined || currentApp.name === '') {
      currentApp.name = `${botName}(${suffix})-${content.name}`
    }

    return currentApp
  }

  async updateApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number, deleteOldVersion: boolean) {
    await delay(delayDuration)
    const appInfo = await luBuildCore.getApplicationInfo(recognizer.getAppId())
    recognizer.versionId = appInfo.activeVersion

    await delay(delayDuration)
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
      await delay(delayDuration)
      await luBuildCore.importNewVersion(recognizer.getAppId(), currentApp, options)

      if (deleteOldVersion) {
        await delay(delayDuration)
        const versionObjs = await luBuildCore.listApplicationVersions(recognizer.getAppId())
        for (const versionObj of versionObjs) {
          if (versionObj.version !== newVersionId) {
            this.handler(`deleting old version=${versionObj.version}`)
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

  async createApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number) {
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' ? currentApp.versionId : '0.1'
    recognizer.versionId = currentApp.versionId
    this.handler(`Creating LUIS.ai application: ${currentApp.name} version:${currentApp.versionId}\n`)
    await delay(delayDuration)
    const response = await luBuildCore.importApplication(currentApp)
    recognizer.setAppId(typeof response.body === 'string' ? response.body : response.body[Object.keys(response.body)[0]])
    return true
  }

  async trainAndPublishApplication(luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number) {
    // send train application request
    this.handler(`${recognizer.getLuPath()} training version=${recognizer.versionId}\n`)
    await delay(delayDuration)
    await luBuildCore.trainApplication(recognizer.getAppId(), recognizer.versionId)
    this.handler(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`)
    let done = true
    do {
      await delay(delayDuration)

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
    await delay(delayDuration)
    await luBuildCore.publishApplication(recognizer.getAppId(), recognizer.versionId)
    this.handler(`${recognizer.getLuPath()} publishing finished\n`)
  }
}