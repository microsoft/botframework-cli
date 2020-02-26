/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
const path = require('path')
const fs = require('fs-extra')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const Content = require('@microsoft/bf-lu').LU
const Settings = require('@microsoft/bf-lu/lib/parser/lubuild/settings')
const MultiLanguageRecognizer = require('@microsoft/bf-lu/lib/parser/lubuild/multi-language-recognizer')
const Recognizer = require('@microsoft/bf-lu/lib/parser/lubuild/recognizer')
const Builder = require('@microsoft/bf-lu/lib/parser/lubuild/builder').Builder

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME} --dialog {true}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Lu file or folder'}),
    authoringKey: flags.string({description: 'LUIS authoring key', required: true}),
    botName: flags.string({description: 'Bot name'}),
    out: flags.string({description: 'Output location'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    region: flags.string({description: 'LUIS authoring region'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name'}),
    force: flags.boolean({char: 'f', description: 'Force write dialog and settings files', default: false}),
    dialog: flags.boolean({description: 'Write out .dialog files', default: false}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --dialog is set'}),
    luConfig: flags.string({description: 'Path to config for lu build'}),
    log: flags.boolean({description: 'write out log messages to console', default: false}),
  }

  async run() {
    const {flags} = this.parse(LuisBuild)

    flags.stdin = await this.readStdin()

    let files: string[] = []
    if (flags.luConfig) {
      const configFilePath = path.resolve(flags.luConfig)
      if (fs.existsSync(configFilePath)) {
        const configObj = JSON.parse(await file.getContentFromFile(configFilePath))
        if (configObj.name && configObj.name !== '') flags.botName = configObj.name
        if (configObj.defaultLanguage && configObj.defaultLanguage !== '') flags.defaultCulture = configObj.defaultLanguage
        if (configObj.deleteOldVersion) flags.deleteOldVersion = true
        if (configObj.out && configObj.out !== '') flags.out = configObj.out
        if (configObj.writeDialogFiles) flags.dialog = true
        if (configObj.models && configObj.models.length > 0) {
          files = configObj.models.map((m: string) => path.resolve(m))
        }
      }
    }

    if (!flags.stdin && !flags.in && files.length === 0) {
      throw new Error('Missing input. Please use stdin or pass a file or folder location with --in flag')
    }

    if (!flags.botName) {
      throw new Error('Missing bot name. Please pass bot name with --botName flag')
    }

    flags.defaultCulture = flags.defaultCulture && flags.defaultCulture !== '' ? flags.defaultCulture : 'en-us'
    flags.region = flags.region && flags.region !== '' ? flags.region : 'westus'
    flags.suffix = flags.suffix && flags.suffix !== '' ? flags.suffix : 'development'
    flags.fallbackLocale = flags.fallbackLocale && flags.fallbackLocale !== '' ? flags.fallbackLocale : 'en-us'

    // create builder class
    const builder = new Builder((input: string) => {
      if (flags.log) this.log(input)
    })

    let luContents: any[] = []
    let recognizers = new Map<string, any>()
    let multiRecognizers = new Map<string, any>()
    let settings = new Map<string, any>()

    if (flags.stdin && flags.stdin !== '') {
      // load lu content from stdin and create default recognizer, multiRecognier and settings
      this.log('Load lu content from stdin')
      const content = new Content(flags.stdin, 'stdin', true, flags.defaultCulture, path.join(process.cwd(), 'stdin'))
      luContents.push(content)
      multiRecognizers.set('stdin', new MultiLanguageRecognizer(path.join(process.cwd(), 'stdin.lu.dialog'), {}))
      settings.set('stdin', new Settings(path.join(process.cwd(), `luis.settings.${flags.suffix}.${flags.region}.json`), {}))
      const recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings.get('stdin'), {})
      recognizers.set(content.name, recognizer)
    } else {
      this.log('Start to load lu files')

      // get lu files from flags.in
      if (flags.in && flags.in !== '') {
        const luFiles = await file.getLuFiles(flags.in, true, fileExtEnum.LUFile)
        files.push(...luFiles)
      }

      // load lu contents from lu files
      // load existing recognizers, multiRecogniers and settings or create default ones
      const loadedResources = await builder.loadContents(files, flags.defaultCulture, flags.suffix, flags.region)
      luContents = loadedResources.luContents
      recognizers = loadedResources.recognizers
      multiRecognizers = loadedResources.multiRecognizers
      settings = loadedResources.settings
    }

    // update or create and then train and publish luis applications based on loaded resources
    this.log('Start to handle applications')
    const dialogContents = await builder.build(luContents, recognizers, flags.authoringKey, flags.region, flags.botName, flags.suffix, flags.fallbackLocale, flags.deleteOldVersion, multiRecognizers, settings)

    // write dialog assets based on config
    if (flags.dialog) {
      const writeDone = await builder.writeDialogAssets(dialogContents, flags.force, flags.out)
      const dialogFilePath = (flags.stdin || !flags.in) ? process.cwd() : flags.in.endsWith(fileExtEnum.LUFile) ? path.dirname(path.resolve(flags.in)) : path.resolve(flags.in)
      const outputFolder = flags.out ? path.resolve(flags.out) : dialogFilePath
      if (writeDone) {
        this.log(`Successfully wrote .dialog files to ${outputFolder}`)
      } else {
        this.log(`No changes to the .dialog files in ${outputFolder}`)
      }
    } else {
      this.log('The published application ids:')
      this.log(JSON.parse(dialogContents[dialogContents.length - 1].content).luis)
    }
  }
}
