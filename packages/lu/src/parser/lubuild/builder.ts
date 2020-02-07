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

  async LoadContents(
    input: string,
    culture: string,
    suffix: string,
    region: string) {
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings: Settings
    let recognizers = new Map<string, Recognizer>()
    let dialogFilePath = process.cwd()
    let luContents: Array<any> = []

    dialogFilePath = input.endsWith(fileExtEnum.LUFile) ? path.dirname(path.resolve(input)) : path.resolve(input)
    let settingsPath = path.join(dialogFilePath, `luis.settings.${suffix}.${region}.json`)
    let settingsContent: any = {}
    if (fs.existsSync(settingsPath)) {
      settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).luis
      this.handler(`${settingsPath} loaded\n`)
    }

    settings = new Settings(settingsPath, settingsContent)

    let files = await fileHelper.getLuFiles(input, true, fileExtEnum.LUFile)
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

      const multiRecognizerPath = path.join(path.dirname(file), `${fileName}.lu.dialog`)
      if (!multiRecognizers.has(fileName)) {
        let multiRecognizerContent = {}
        if (fs.existsSync(multiRecognizerPath)) {
          multiRecognizerContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath)).recognizers
          this.handler(`${multiRecognizerPath} loaded\n`)
        }

        multiRecognizers.set(fileName, new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent))
      }

      const content = new Content(fileContent, fileName, true, fileCulture, file)
      luContents.push(content)

      const dialogFile = path.join(path.dirname(file), `${content.name}.dialog`)
      let existingDialogObj: any
      if (fs.existsSync(dialogFile)) {
        existingDialogObj = JSON.parse(await fileHelper.getContentFromFile(dialogFile))
        this.handler(`${dialogFile} loaded\n`)
      }

      let recognizer = Recognizer.load(content.path, content.name, dialogFile, settings, existingDialogObj)
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
    multiRecognizers?: Map<string, MultiLanguageRecognizer>,
    settings?: Settings) {
    // luis api TPS which means 5 concurrent transactions to luis api in 1 second
    // can set to other value if switched to a higher TPS(transaction per second) key
    let luisApiTps = 5

    // set luis call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let delayDuration = 1100

    const defaultLuisSchemeVersion = '4.0.0'
    const luBuildCore = new LuBuildCore(authoringKey, `https://${region}.api.cognitive.microsoft.com`)
    const apps = await luBuildCore.GetApplicationList()

    // here we do a while loop to make full use of luis tps capacity
    while (luContents.length > 0) {
      // get a number(set by luisApiTps) of contents for each loop
      const subLuContents = luContents.splice(0, luisApiTps)

      // concurrently handle applications
      await Promise.all(subLuContents.map(async content => {
        // init current application object from lu content
        let currentApp = await this.InitApplicationFromLuContent(content, botName, suffix, defaultLuisSchemeVersion)

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
          needTrainAndPublish = await this.UpdateApplication(currentApp, luBuildCore, recognizer, delayDuration)
        } else {
          // create a new application
          needTrainAndPublish = await this.CreateApplication(currentApp, luBuildCore, recognizer, delayDuration)
        }

        if (needTrainAndPublish) {
          // train and publish application
          await this.TrainAndPublishApplication(luBuildCore, recognizer, delayDuration)
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
        if (settings) {
          settings.luis[content.name.split('.').join('_')] = recognizer.getAppId()
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

    const dialogContents = luBuildCore.GenerateDeclarativeAssets(recognizerValues, multiRecognizerValues, settings)

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

  async InitApplicationFromLuContent(content: any, botName: string, suffix: string, defaultLuisSchemeVersion: string) {
    let currentApp = await content.parseToLuis(true, content.language)
    currentApp.culture = currentApp.culture && currentApp.culture !== '' ? currentApp.culture : content.language as string
    currentApp.luis_schema_version = currentApp.luis_schema_version && currentApp.luis_schema_version !== '' ? currentApp.luis_schema_version : defaultLuisSchemeVersion
    currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${botName} app, targetting ${suffix}`

    if (currentApp.name === undefined || currentApp.name === '') {
      currentApp.name = `${botName}(${suffix})-${content.name}`
    }

    return currentApp
  }

  async UpdateApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number) {
    await delay(delayDuration)
    const appInfo = await luBuildCore.GetApplicationInfo(recognizer.getAppId())
    recognizer.versionId = appInfo.activeVersion

    await delay(delayDuration)
    const existingApp = await luBuildCore.ExportApplication(recognizer.getAppId(), recognizer.versionId)

    // compare models
    const needUpdate = luBuildCore.CompareApplications(currentApp, existingApp)
    if (needUpdate) {
      const newVersionId = luBuildCore.UpdateVersion(currentApp, existingApp)
      recognizer.versionId = newVersionId
      const options: any = {
        versionId: newVersionId
      }

      this.handler(`${recognizer.getLuPath()} creating version=${newVersionId}\n`)
      await delay(delayDuration)
      await luBuildCore.ImportNewVersion(recognizer.getAppId(), currentApp, options)
      return true
    } else {
      this.handler(`${recognizer.getLuPath()} no changes\n`)
      return false
    }
  }

  async CreateApplication(currentApp: any, luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number) {
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' ? currentApp.versionId : '0.1'
    recognizer.versionId = currentApp.versionId
    this.handler(`Creating LUIS.ai application: ${currentApp.name} version:${currentApp.versionId}\n`)
    await delay(delayDuration)
    const response = await luBuildCore.ImportApplication(currentApp)
    recognizer.setAppId(typeof response.body === 'string' ? response.body : response.body[Object.keys(response.body)[0]])
    return true
  }

  async TrainAndPublishApplication(luBuildCore: LuBuildCore, recognizer: Recognizer, delayDuration: number) {
    // send train application request
    this.handler(`${recognizer.getLuPath()} training version=${recognizer.versionId}\n`)
    await delay(delayDuration)
    await luBuildCore.TrainApplication(recognizer.getAppId(), recognizer.versionId)
    this.handler(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`)
    let done = true
    do {
      await delay(delayDuration)

      // get training status to see if training completed
      let trainingStatus = await luBuildCore.GetTrainingStatus(recognizer.getAppId(), recognizer.versionId)
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
    await luBuildCore.PublishApplication(recognizer.getAppId(), recognizer.versionId)
    this.handler(`${recognizer.getLuPath()} publishing finished\n`)
  }
}
