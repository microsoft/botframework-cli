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
const LUOptions = require('./../lu/luOptions')
const Content = require('./../lu/lu')
const recognizerType = require('./../utils/enums/recognizertypes')

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

      let fileContent = ''
      let result
      try {
        result = await LuisBuilderVerbose.build(luFiles, true, culture)
        fileContent = result.parseToLuContent()
      } catch (err) {
        if (err.source) {
          err.text = `Invalid LU file ${err.source}: ${err.text}`
        } else {
          err.text = `Invalid LU file ${file}: ${err.text}`
        }
        throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, err.text))
      }

      this.handler(`${file} loaded\n`)
      let cultureFromPath = fileHelper.getCultureFromPath(file)
      if (cultureFromPath) {
        fileCulture = cultureFromPath
        let fileNameWithCulture = path.basename(file, path.extname(file))
        fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - fileCulture.length - 1)
      } else {
        fileCulture = result.culture !== 'en-us' ? result.culture : culture
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

      const content = new Content(fileContent, new LUOptions(fileName, true, fileCulture, file))
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
      throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Files with same name and locale are found.'))
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

    const luBuildCore = new LuBuildCore(authoringKey, `https://${region}.api.cognitive.microsoft.com`)
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
          setting.luis[content.name.split('.').join('_').replace(/-/g, '_')] = recognizer.getAppId()
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

  async writeDialogAssets(contents: any[], force: boolean, out: string, dialogType: string, luconfig: string) {
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

    if (out) {
      for (const content of writeContents) {
        const outFilePath = path.join(path.resolve(out), path.basename(content.path))
        if (force || !fs.existsSync(outFilePath)) {
          if (!fs.existsSync(path.dirname(outFilePath))) {
            fs.mkdirSync(path.dirname(outFilePath))
          }

          this.handler(`Writing to ${outFilePath}\n`)
          await this.writeDialog(content.content, outFilePath, dialogType)
          writeDone = true
        }
      }
    } else {
      for (const content of writeContents) {
        if (force || !fs.existsSync(content.path)) {
          if (!fs.existsSync(path.dirname(content.path))) {
            fs.mkdirSync(path.dirname(content.path))
          }

          this.handler(`Writing to ${content.path}\n`)
          await this.writeDialog(content.content, content.path, dialogType)
          writeDone = true
        }
      }
    }

    return writeDone
  }

  async getActiveVersionIds(appNames: string[], authoringKey: string, region: string) {
    const luBuildCore = new LuBuildCore(authoringKey, `https://${region}.api.cognitive.microsoft.com`)
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
            this.handler(`${recognizer.getLuPath()} deleting old version=${versionObj.version}`)
            await delay(delayDuration)
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
    recognizer.setAppId(typeof response === 'string' ? response : response[Object.keys(response)[0]])
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

  mergeSettingsContent(settingsPath: string, contents: any[]) {
    let settings = new Settings(settingsPath, {})
    for (const content of contents) {
      const luisAppsMap = JSON.parse(content.content).luis
      for (const appName of Object.keys(luisAppsMap)) {
        settings.luis[appName] = luisAppsMap[appName]
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

  async writeDialog(content: string, filePath: string, dialogType: string) {
    const fileName = path.basename(filePath, '.dialog')

    if (fs.existsSync(filePath)) {
      const existingDialog = JSON.parse(await fileHelper.getContentFromFile(filePath))

      if (existingDialog.$kind === 'Microsoft.LuisRecognizer') {
        if (dialogType === recognizerType.CROSSTRAINED) {
          const recognizers = [fileName]
          content = new CrossTrainedRecognizer(filePath, recognizers).save()
        }
      } else if (existingDialog.$kind === 'Microsoft.CrossTrainedRecognizerSet') {
        if (dialogType !== recognizerType.CROSSTRAINED) {
          throw (new exception(retCode.errorCode.INVALID_INPUT, "CrossTrainedRecognizerSet cannot be updated to other recognizer. Please specify the right recognizer type with '--dialog crosstrained'."))
        }

        if (!existingDialog.recognizers.includes(fileName)) {
          existingDialog.recognizers.push(fileName)
        }

        content = JSON.stringify(existingDialog, null, 4)
      }

      await fs.writeFile(filePath, content, 'utf-8')
    } else {
      const contentObj = JSON.parse(content)

      if (dialogType === recognizerType.CROSSTRAINED && contentObj.$kind === 'Microsoft.LuisRecognizer') {
        const recognizers = [fileName]
        content = new CrossTrainedRecognizer(filePath, recognizers).save()
      }

      await fs.writeFile(filePath, content, 'utf-8')
    }
  }
}
