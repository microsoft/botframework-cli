/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const path = require('path')
const fs = require('fs-extra')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const username = require('username')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const Content = require('@microsoft/bf-lu').V2.LU
const LUOptions = require('@microsoft/bf-lu/lib/parser/lu/luOptions')
const Settings = require('@microsoft/bf-lu/lib/parser/lubuild/settings')
const MultiLanguageRecognizer = require('@microsoft/bf-lu/lib/parser/lubuild/multi-language-recognizer')
const Recognizer = require('@microsoft/bf-lu/lib/parser/lubuild/recognizer')
const Builder = require('@microsoft/bf-lu/lib/parser/lubuild/builder').Builder
const recognizerType = require('@microsoft/bf-lu/lib/parser/utils/enums/recognizertypes')
const utils = require('../../utils/index')

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME} --dialog multiLanguage
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Lu file or folder'}),
    authoringKey: flags.string({description: 'LUIS authoring key'}),
    botName: flags.string({description: 'Bot name'}),
    region: flags.string({description: 'LUIS authoring region [westus|westeurope|australiaeast]', default: 'westus'}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .dialog files. If not specified, application ids will be output to console'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --out is set'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name. Defaults to current logged in user alias'}),
    dialog: flags.string({description: 'Dialog recognizer type [multiLanguage|crosstrained]', default: 'multiLanguage'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided, overwrites relevant dialog file', default: false}),
    luConfig: flags.string({description: 'Path to config for lu build which can contain switches for arguments'}),
    deleteOldVersion: flags.boolean({description: 'Delete old version of LUIS application after building new one.'}),
    log: flags.boolean({description: 'Write out log messages to console', default: false}),
    schema: flags.string({description: 'Defines $schema for generated .dialog files'})
  }

  async run() {
    try {
      const {flags} = this.parse(LuisBuild)

      // Luconfig overrides flags
      let files: string[] = []
      if (flags.luConfig) {
        const configFilePath = path.resolve(flags.luConfig)
        if (await fs.exists(configFilePath)) {
          const configObj = JSON.parse(await file.getContentFromFile(configFilePath))
          for (let prop of Object.keys(configObj)) {
            if (prop === 'models') {
              files = configObj.models.map((m: string) => path.isAbsolute(m) ? m : path.join(path.dirname(configFilePath), m))
            } else if (prop === 'out') {
              flags.out = path.isAbsolute(configObj.out) ? configObj.out : path.join(path.dirname(configFilePath), configObj.out)
            } else {
              flags[prop] = configObj[prop]
            }
          }
        }
      }

      // Flags override userConfig
      let luisBuildFlags = Object.keys(LuisBuild.flags)
      luisBuildFlags.push('endpoint')

      let {inVal, authoringKey, botName, region, out, defaultCulture, fallbackLocale, suffix, dialog, force, luConfig, deleteOldVersion, log, schema, endpoint}
        = await utils.processInputs(flags, luisBuildFlags, this.config.configDir)

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !inVal && files.length === 0) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }

      if (!authoringKey) {
        throw new CLIError('Missing LUIS authoring key. Please pass authoring key with --authoringKey flag or specify via bf config:set:luis.')
      }

      if (!botName) {
        throw new CLIError('Missing bot name. Please pass bot name with --botName flag.')
      }

      if (dialog && dialog !== recognizerType.MULTILANGUAGE && dialog !== recognizerType.CROSSTRAINED) {
        throw new CLIError('Recognizer type specified by --dialog is not right. Please specify [multiLanguage|crosstrained].')
      }

      defaultCulture = defaultCulture && defaultCulture !== '' ? defaultCulture : 'en-us'
      region = region && region !== '' ? region : 'westus'
      suffix = suffix && suffix !== '' ? suffix : await username() || 'development'
      fallbackLocale = fallbackLocale && fallbackLocale !== '' ? fallbackLocale : 'en-us'

      endpoint = endpoint && endpoint !== '' ? endpoint : `https://${region}.api.cognitive.microsoft.com`

      // create builder class
      const builder = new Builder((input: string) => {
        if (log) this.log(input)
      })

      let luContents: any[] = []
      let recognizers = new Map<string, any>()
      let multiRecognizers = new Map<string, any>()
      let settings = new Map<string, any>()

      if ((inVal && inVal !== '') || files.length > 0) {
        if (log) this.log('Loading files...\n')

        // get lu files from in.
        if (inVal && inVal !== '') {
          const luFiles = await file.getLuFiles(inVal, true, fileExtEnum.LUFile)
          files.push(...luFiles)
        }

        // de-dupe the files list
        files = [...new Set(files)]

        // load lu contents from lu files
        // load existing recognizers, multiRecogniers and settings or create default ones
        const loadedResources = await builder.loadContents(files, defaultCulture, suffix, region, schema)
        luContents = loadedResources.luContents
        recognizers = loadedResources.recognizers
        multiRecognizers = loadedResources.multiRecognizers
        settings = loadedResources.settings
      } else {
        // load lu content from stdin and create default recognizer, multiRecognier and settings
        if (log) this.log('Load lu content from stdin\n')
        const content = new Content(flags.stdin, new LUOptions('stdin', true, defaultCulture, path.join(process.cwd(), 'stdin')))
        luContents.push(content)
        multiRecognizers.set('stdin', new MultiLanguageRecognizer(path.join(process.cwd(), 'stdin.lu.dialog'), {}))
        settings.set('stdin', new Settings(path.join(process.cwd(), `luis.settings.${suffix}.${region}.json`), {}))
        const recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings.get('stdin'), {})
        recognizers.set(content.name, recognizer)
      }

      // update or create and then train and publish luis applications based on loaded resources
      if (log) this.log('Handling applications...')
      const dialogContents = await builder.build(luContents, recognizers, authoringKey, endpoint, botName, suffix, fallbackLocale, deleteOldVersion, multiRecognizers, settings)

      // write dialog assets based on config
      if (out) {
        const outputFolder = path.resolve(out)
        const writeDone = await builder.writeDialogAssets(dialogContents, force, outputFolder, dialog, luConfig, schema)
        if (writeDone) {
          this.log(`Successfully wrote .dialog files to ${outputFolder}\n`)
        } else {
          this.log(`No changes to the .dialog files in ${outputFolder}\n`)
        }
      } else {
        this.log('The published application ids:')
        this.log(JSON.parse(dialogContents[dialogContents.length - 1].content).luis)
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}
