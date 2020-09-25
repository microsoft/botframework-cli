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

  async loadContents(files: string[], options: any) {
    let culture = options.culture || "en-us"
    let importResolver = options.importResolver

    // lu contents that will be returned
    let luContents: Array<any> = []

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
      let result
      let luisObj
      let luFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.LUFile)
      this.handler(`${file} loaded\n`)

      // filter empty lu files
      luFiles = luFiles.filter((file: any) => file.content !== '')
      if (luFiles.length <= 0) {
        const content = new Content(fileContent, new LUOptions(fileName, true, fileCulture, file))
        luContents.push(content)
        continue
      }

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

      const content = new Content(fileContent, new LUOptions(fileName, true, fileCulture, file))
      luContents.push(content)
    }

    // validate if there are duplicated files with same name and locale
    let setOfContents = new Set()
    const hasDuplicates = luContents.some(function (currentObj) {
      return setOfContents.size === setOfContents.add(currentObj.name).size
    })

    if (hasDuplicates) {
      throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Files with same name and locale are found.'))
    }

    return luContents
  }

  async generateDialogs(luContents: any[], options: any) {
    let fallbackLocale = options.fallbackLocale || 'en-us'
    let schema = options.schema
    let dialog = options.dialog

    let assets: any[] = []

    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let recognizers = new Map<string, Recognizer>()
    let crosstrainedRecognizers = new Map<string, CrossTrainedRecognizer>()

    // concurrently handle applications
    await Promise.all(luContents.map(async content => {
      const fileFolder = path.dirname(content.path)

      // init crosstrainedRecognizer asset even for empty content
      if (!crosstrainedRecognizers.has(content.id)) {
        const crossTrainedRecognizerPath = path.join(fileFolder, content.id + '.lu.qna.dialog')
        crosstrainedRecognizers.set(content.id, new CrossTrainedRecognizer(crossTrainedRecognizerPath, [], schema))
      }

      // content is not empty
      if (!fileHelper.isAllFilesSectionEmpty([content])) {
        // update crosstrainedRecognizer if not empty
        let crosstrainedRecognizer = crosstrainedRecognizers.get(content.id) as CrossTrainedRecognizer
        if (!crosstrainedRecognizer.recognizers.includes(content.id + '.lu')) {
          crosstrainedRecognizer.recognizers.push(content.id + '.lu')
        }

        // init recognizer asset
        const dialogFile = path.join(fileFolder, `${content.name}.dialog`)
        let recognizer = new Recognizer(content.path, content.name, dialogFile, schema)
        recognizers.set(content.name, recognizer)

        // get culture from content or default to content.language
        let luisObj = await LuisBuilder.fromLUAsync([content])
        luisObj.culture = luisObj.culture && luisObj.culture !== '' && luisObj.culture !== 'en-us' ? luisObj.culture : content.language as string

        // init or update multiLanguageRecognizer asset
        if (!multiRecognizers.has(content.id)) {
          const multiRecognizerPath = path.join(fileFolder, `${content.id}.lu.dialog`)
          multiRecognizers.set(content.id, new MultiLanguageRecognizer(multiRecognizerPath, {}, schema))
        }

        let multiRecognizer = multiRecognizers.get(content.id) as MultiLanguageRecognizer
        multiRecognizer.recognizers[luisObj.culture] = path.basename(recognizer.getDialogPath(), '.dialog')
        if (luisObj.culture.toLowerCase() === fallbackLocale.toLowerCase()) {
          multiRecognizer.recognizers[''] = path.basename(recognizer.getDialogPath(), '.dialog')
        }
      }   
    }))

    // write dialog assets
    assets.push(...Array.from(recognizers.values()))
    assets.push(...Array.from(multiRecognizers.values()))

    if (dialog === recognizerType.CROSSTRAINED) {
      assets.push(...Array.from(crosstrainedRecognizers.values()))
    }

    return this.generateDeclarativeAssets(assets)
  }

  async build(
    luContents: any[],
    authoringKey: string,
    botName: string,
    options: any) {
    // set luis api call endpoint
    let endpoint = options.endpoint || "https://westus.api.cognitive.microsoft.com"
    
    // set suffix default to development
    let suffix = options.suffix || 'development'

    // set region default to westus
    let region = options.region || 'westus'
    
    // set kept version count which means how many versions would be kept in luis service
    let keptVersionCount = options.keptVersionCount && options.keptVersionCount > 0 ? options.keptVersionCount : maxVersionCount
    
    // set if publish this application to staging or production slot
    // default to production
    let isStaging = options.isStaging || false

    // set schema
    let schema = options.schema

    // luis api TPS which means 5 concurrent transactions to luis api in 1 second
    // can set to other value if switched to a higher TPS(transaction per second) key
    let luisAPITPS = options.luisAPITPS || 5

    // set luis call delay duration to 1100 millisecond because 1000 can hit corner case of rate limit
    let timeBucketOfRequests = options.timeBucketOfRequests || 1100

    // set retry count for rate limit luis API failure
    let retryCount = options.retryCount || 1

    // set retry duration for rate limit luis API failure
    let retryDuration = options.retryDuration || 1000

    // settings assets like app id and version returned from luis api call
    let settingsAssets: any[] = []

    // deep clone luContents
    let clonedLuContents = [...luContents]

    // filter if all lu contents are emtty
    let isAllLuEmpty = fileHelper.isAllFilesSectionEmpty(clonedLuContents)

    if (!isAllLuEmpty) {
      const luBuildCore = new LuBuildCore(authoringKey, endpoint, retryCount, retryDuration)
      const apps = await luBuildCore.getApplicationList()

      let settings: any

      // here we do a while loop to make full use of luis tps capacity
      while (clonedLuContents.length > 0) {
        // get a number(set by luisApiTps) of contents for each loop
        const subLuContents = clonedLuContents.splice(0, luisAPITPS)

        // concurrently handle applications
        await Promise.all(subLuContents.map(async content => {
          if (!fileHelper.isAllFilesSectionEmpty([content])) {
            // init current application object from lu content
            let currentApp = await this.initApplicationFromLuContent(content, botName, suffix)

            // init recognizer asset
            const dialogFile = path.join(path.dirname(content.path), `${content.name}.dialog`)
            let recognizer = new Recognizer(content.path, content.name, dialogFile, schema)

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
              needTrainAndPublish = await this.updateApplication(currentApp, luBuildCore, recognizer, timeBucketOfRequests, keptVersionCount)
            } else {
              // create a new application
              needTrainAndPublish = await this.createApplication(currentApp, luBuildCore, recognizer, timeBucketOfRequests)
            }

            if (needTrainAndPublish) {
              // train and publish application
              await this.trainAndPublishApplication(luBuildCore, recognizer, timeBucketOfRequests, isStaging)
            }

            // init settings asset
            if (settings === undefined) {
              const settingsPath = path.join(path.dirname(content.path), `luis.settings.${suffix}.${region}.json`)
              settings = new Settings(settingsPath, {})
            }

            // update settings asset
            settings.luis[content.name.split('.').join('_').replace(/-/g, '_')] = {
              "appId": recognizer.getAppId(),
              "version": recognizer.versionId
            }
          }
        }))
      }

      // write dialog assets
      settingsAssets.push(settings)
    }

    const settingsContent = this.generateDeclarativeAssets(settingsAssets)

    return settingsContent
  }

  async writeDialogAssets(contents: any[], options: any) {
    let force = options.force || false
    let out = options.out
    let luConfig = options.luConfig
    let writeDone = false

    let writeContents = contents.filter(c => c.id.endsWith('.dialog'))
    let settingsContents = contents.filter(c => c.id.endsWith('.json'))

    if (settingsContents && settingsContents.length > 0) {
      let outPath
      if (luConfig) {
        outPath = path.join(path.resolve(path.dirname(luConfig)), settingsContents[0].id)
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

  generateDeclarativeAssets(assets: Array<any>): Array<any> {
    let contents = new Array<any>()
    for (const asset of assets) {
      let content: any
      if (asset instanceof Settings) {
        content = new Content(asset.save(), new LUOptions(path.basename(asset.getSettingsPath()), true, '', asset.getSettingsPath()))
      } else {
        content = new Content(asset.save(), new LUOptions(path.basename(asset.getDialogPath()), true, '', asset.getDialogPath()))
      }

      contents.push(content)
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
