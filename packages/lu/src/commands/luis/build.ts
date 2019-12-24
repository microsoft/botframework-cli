/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {LuBuildCore} from './../../parser/lubuild/core'
import {Content} from './../../parser/lubuild/content'
import {Settings} from './../../parser/lubuild/settings'
import {MultiLanguageRecognizer} from '../../parser/lubuild/multi-language-recognizer'
import {Recognizer} from './../../parser/lubuild/recognizer'
const path = require('path')
const fs = require('fs-extra')
const fileHelper = require('./../../utils/filehelper')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const LuisBuilder = require('./../../parser/luis/luisBuilder')

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringkey {AUTHORING_KEY} --botname {BOT_NAME} --dialog {true}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Lu file or folder', required: true}),
    authoringkey: flags.string({description: 'LUIS authoring key', required: true}),
    botname: flags.string({description: 'Bot name', required: true}),
    out: flags.string({description: 'Output location'}),
    culture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    region: flags.string({description: 'LUIS authoring region'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name'}),
    force: flags.boolean({char: 'f', description: 'Force write dialog and settings files', default: false}),
    dialog: flags.boolean({description: 'Write out .dialog files', default: false}),
    fallbacklocale: flags.string({description: 'Locale to be used at the fall back if no locale specific recognizer is found. Only valid if --dialog is set'})
  }

  async run() {
    const {flags} = this.parse(LuisBuild)

    flags.culture = flags.culture && flags.culture !== '' ? flags.culture : 'en-us'
    flags.region = flags.region && flags.region !== '' ? flags.region : 'westus'
    flags.suffix = flags.suffix && flags.suffix !== '' ? flags.suffix : 'development'
    flags.fallbacklocale = flags.fallbacklocale && flags.fallbacklocale !== '' ? flags.fallbacklocale : 'en-us'

    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings: Settings
    let recognizers: Recognizer[] = []
    let luContents: Array<Content> = []
    let dialogFilePath = process.cwd

    // Check if data piped in stdin
    const stdin = await this.readStdin()
    if (stdin && stdin !== '') {
      this.log('Load lu content from stdin')
      const lucontentFromStdin = new Content('stdin', path.join(process.cwd(), 'stdin'), stdin, flags.culture)
      luContents.push(lucontentFromStdin)
      multiRecognizers.set('stdin', new MultiLanguageRecognizer(path.join(process.cwd(), 'stdin.lu.dialog'), {}))
      settings = new Settings(path.join(process.cwd(), `luis.settings.${flags.suffix}.${flags.region}.json`), {})
    } else {
      this.log('Start to load lu files\n')

      dialogFilePath = flags.in.endsWith(fileExtEnum.LUFile) ? path.dirname(path.resolve(flags.in)) : path.resolve(flags.in)

      let files = await fileHelper.getLuFiles(flags.in, true, fileExtEnum.LUFile)

      for (const file of files) {
        let fileCulture: string
        let fileName: string
        const luFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.LUFile)
        const result = await LuisBuilder.build(luFiles, true, flags.culture)
        const fileContent = result.parseToLuContent()
        this.log(`${file} loaded\n`)
        let cultureFromPath = fileHelper.getCultureFromPath(file)
        if (cultureFromPath) {
          fileCulture = cultureFromPath
          let fileNameWithCulture = path.basename(file, path.extname(file))
          fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - fileCulture.length - 1)
        } else {
          fileCulture = flags.culture
          fileName = path.basename(file, path.extname(file))
        }

        const multiRecognizerPath = path.join(dialogFilePath, `${fileName}.lu.dialog`)
        if (!multiRecognizers.has(fileName)) {
          let multiRecognizerContent = {}
          if (fs.existsSync(multiRecognizerPath)) {
            multiRecognizerContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerPath)).recognizers
            this.log(`${multiRecognizerPath} loaded\n`)
          }

          multiRecognizers.set(fileName, new MultiLanguageRecognizer(multiRecognizerPath, multiRecognizerContent))
        }

        luContents.push(new Content(fileName, file, fileContent, fileCulture))
      }

      let settingsPath = path.join(dialogFilePath, `luis.settings.${flags.suffix}.${flags.region}.json`)
      let settingsContent: any = {}
      if (fs.existsSync(settingsPath)) {
        settingsContent = JSON.parse(await fileHelper.getContentFromFile(settingsPath)).luis
        this.log(`${settingsPath} loaded\n`)
      }

      settings = new Settings(settingsPath, settingsContent)
    }

    // validate if there are duplicated files with same name and locale
    let setOfContents = new Set()
    const hasDuplicates = luContents.some(function (currentObj) {
      return setOfContents.size === setOfContents.add(currentObj.Name).size
    })

    if (hasDuplicates) {
      throw new CLIError('Files with same name and locale are found.')
    }

    this.log('Start to handle applications\n')

    const defaultLuisSchemeVersion = '4.0.0'
    const luBuildCore = new LuBuildCore()
    const client = luBuildCore.InitLuisClient(flags.authoringkey, `https://${flags.region}.api.cognitive.microsoft.com`)
    const apps = await luBuildCore.GetApplicationList(client)
    for (const content of luContents) {
      let locale = content.Locale || flags.culture
      let appName = ''

      let currentApp = await luBuildCore.ParseLuContent(content.Content, locale)

      locale = currentApp.culture && currentApp.culture !== '' ? currentApp.culture : locale
      appName = currentApp.name && currentApp.name !== '' ? currentApp.name : appName

      currentApp.luis_schema_version = currentApp.luis_schema_version && currentApp.luis_schema_version !== '' ? currentApp.luis_schema_version : defaultLuisSchemeVersion

      if (appName === '') {
        appName = `${flags.botname}(${flags.suffix})-${content.Name}`
      }

      let dialogFile = path.join(dialogFilePath, `${content.Name}.dialog`)
      let recognizer = Recognizer.load(content.Path, content.Name, dialogFile)

      for (let app of apps) {
        if (app.name === appName) {
          recognizer.setAppId(app.id)
          break
        }
      }

      // add to multiLanguageRecognizer
      if (multiRecognizers.has(content.ID)) {
        let multiRecognizer = multiRecognizers.get(content.ID) as MultiLanguageRecognizer
        multiRecognizer.recognizers[locale] = path.basename(dialogFile, '.dialog')
        if (locale.toLowerCase() === flags.fallbacklocale.toLowerCase()) {
          multiRecognizer.recognizers[''] = path.basename(dialogFile, '.dialog')
        }
      }

      let needTrainAndPublish = false
      if (recognizer.getAppId() !== '') {
        let appInfo = await client.apps.get(recognizer.getAppId())
        recognizer.versionId = appInfo.activeVersion

        // export model from luis
        const existingApp = await luBuildCore.ExportApplication(client, recognizer.getAppId(), recognizer.versionId)

        // compare models
        const needUpdate = luBuildCore.CompareApplications(currentApp, existingApp)

        if (needUpdate) {
          const newVersionId = luBuildCore.UpdateVersion(currentApp, existingApp)
          recognizer.versionId = newVersionId
          const options: any = {}
          options.versionId = newVersionId
          this.log(`${recognizer.getLuPath()} creating version=${newVersionId}\n`)
          await luBuildCore.ImportNewVersion(client, recognizer.getAppId(), currentApp, options)
          needTrainAndPublish = true
        } else {
          this.log(`${recognizer.getLuPath()} no changes\n`)
        }
      } else {
        // create the application with version 0.1
        currentApp.name = appName
        currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${flags.botname} app, targetting ${flags.suffix}`
        currentApp.culture = locale
        currentApp.versionId = '0.1'
        recognizer.versionId = '0.1'
        this.log(`Creating LUIS.ai application: ${appName} version:0.1\n`)
        const appId = await luBuildCore.ImportApplication(client, currentApp)
        recognizer.setAppId(appId)
        needTrainAndPublish = true
      }

      if (needTrainAndPublish) {
        this.log(`${recognizer.getLuPath()} training version=${recognizer.versionId}\n`)
        await luBuildCore.TrainApplication(client, recognizer.getAppId(), recognizer.versionId)

        this.log(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`)
        let done = true
        do {
          let trainingStatus = await luBuildCore.GetTrainingStatus(client, recognizer.getAppId(), recognizer.versionId)
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
        this.log('done\n')

        // publish the version
        this.log(`${recognizer.getLuPath()} publishing version=${recognizer.versionId}\n`)
        await luBuildCore.PublishApplication(client, recognizer.getAppId(), recognizer.versionId)

        this.log(`${recognizer.getLuPath()} publishing finished\n`)
      }

      settings.luis[content.Name.split('.').join('_')] = recognizer.getAppId()
      recognizers.push(recognizer)
    }

    if (flags.dialog) {
      const contents = luBuildCore.GenerateDeclarativeAssets(recognizers, Array.from(multiRecognizers.values()), settings)
      for (const content of contents) {
        if (flags.out) {
          this.log(`Writing to ${content.Path}\n`)
          await fs.writeFile(path.join(flags.out, path.basename(content.Path)), content.Content, 'utf-8')
        } else {
          if (flags.force || !fs.existsSync(content.Path)) {
            this.log(`Writing to ${content.Path}\n`)
            await fs.writeFile(content.Path, content.Content, 'utf-8')
          }
        }
      }
    }

    this.log('All tasks done\n')
  }
}
