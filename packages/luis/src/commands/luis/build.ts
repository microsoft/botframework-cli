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
const Builder = require('@microsoft/bf-lu/lib/parser/lubuild/builder').Builder
const recognizerType = require('@microsoft/bf-lu/lib/parser/utils/enums/recognizertypes')
const utils = require('../../utils/index')

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:build command help'}),
    in: flags.string({char: 'i', description: 'Lu file or folder'}),
    authoringKey: flags.string({description: 'LUIS authoring key'}),
    botName: flags.string({description: 'Bot name'}),
    region: flags.string({description: 'LUIS authoring region [westus|westeurope|australiaeast]', default: 'westus'}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .dialog and settings files. If not specified, application setting will be output to console'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --out is set'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name. Defaults to current logged in user alias'}),
    dialog: flags.string({description: 'Dialog recognizer type [multiLanguage|crosstrained]. No dialog recognizers will be generated if not specified. Only valid if --out is set'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    luConfig: flags.string({description: 'Path to config for lu build which can contain switches for arguments'}),
    deleteOldVersion: flags.boolean({description: 'Deletes old version of LUIS application after building new one.'}),
    log: flags.boolean({description: 'Writes out log messages to console', default: false}),
    endpoint: flags.string({description: 'Luis authoring endpoint for publishing'}),
    schema: flags.string({description: 'Defines $schema for generated .dialog files'}),
    isStaging: flags.boolean({description: 'Publishes luis application to staging slot if set. Default to production slot', default: false}),
    directVersionPublish: flags.boolean({description: 'Available only in direct version query. Do not publish to staging or production', default: false})
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

      let {inVal, authoringKey, botName, region, out, defaultCulture, fallbackLocale, suffix, dialog, force, luConfig, deleteOldVersion, log, endpoint, schema, isStaging, directVersionPublish}
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

      if ((inVal && inVal !== '') || files.length > 0) {
        if (log) this.log('Loading files...\n')

        // get lu files from in.
        if (inVal && inVal !== '') {
          const luFiles = await file.getLuFiles(inVal, true, fileExtEnum.LUFile)
          files.push(...luFiles)
        }

        // de-dupe the files list
        files = Array.from(new Set(files))

        // load lu contents from lu files
        // load existing recognizers, multiRecogniers and settings or create default ones
        luContents = await builder.loadContents(files, {
          culture: defaultCulture,
          log
        })
      } else {
        // load lu content from stdin and create default recognizer, multiRecognier and settings
        if (log) this.log('Load lu content from stdin\n')
        const content = new Content(flags.stdin, new LUOptions('stdin', true, defaultCulture, path.join(process.cwd(), 'stdin')))
        luContents.push(content)
      }

      // update or create and then train and publish luis applications based on loaded resources
      if (log) this.log('Handling applications...')

      // LUIS support maximun 100 versions for an application, keepVersions default set to 100 if deleteOldVersion is not specified.
      let keptVersionCount = 100
      if (deleteOldVersion) keptVersionCount = 1

      const settingsContent = await builder.build(luContents, authoringKey, botName, {
        endpoint,
        suffix,
        region,
        keptVersionCount,
        isStaging,
        schema,
        directVersionPublish
      })

      // write dialog assets based on config
      if (out) {
        const outputFolder = path.resolve(out)
        if (dialog) {
          const dialogContents = await builder.generateDialogs(luContents, {
            fallbackLocale,
            schema,
            dialog
          })

          let writeDone = await builder.writeDialogAssets(dialogContents, {
            force,
            out: outputFolder,
            luConfig
          })

          if (writeDone) {
            this.log(`Successfully wrote .dialog files to ${outputFolder}\n`)
          } else {
            this.log(`No changes to the .dialog files in ${outputFolder}\n`)
          }
        }

        let writeDone = await builder.writeDialogAssets(settingsContent, {
          force,
          out: outputFolder,
          luConfig
        })

        if (writeDone) {
          this.log(`Successfully wrote settings file to ${outputFolder}\n`)
        } else {
          this.log(`No changes to settings file in ${outputFolder}\n`)
        }
      } else {
        this.log('The published application setting:')
        this.log(JSON.stringify(JSON.parse(settingsContent[0].content).luis, null, 4))
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}
