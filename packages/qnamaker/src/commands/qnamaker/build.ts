/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {processFlags} from '../../utils/qnamakerbase'

const path = require('path')
const fs = require('fs-extra')
const username = require('username')
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')
const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum
const Content = require('@microsoft/bf-lu').V2.LU
const qnaOptions = require('@microsoft/bf-lu/lib/parser/lu/qnaOptions')
const Settings = require('@microsoft/bf-lu/lib/parser/qnabuild/settings')
const MultiLanguageRecognizer = require('@microsoft/bf-lu/lib/parser/qnabuild/multi-language-recognizer')
const Recognizer = require('@microsoft/bf-lu/lib/parser/qnabuild/recognizer')
const Builder = require('@microsoft/bf-lu/lib/parser/qnabuild/builder').Builder
const recognizerType = require('@microsoft/bf-lu/lib/parser/utils/enums/recognizertypes')

export default class QnamakerBuild extends Command {
  static description = 'Build .qna files to create or update qnamaker knowledge bases and qnamaker alterations'

  static examples = [`
    $ bf qnamaker:build --in {INPUT_FILE_OR_FOLDER} --subscriptionKey {SUBSCRIPTION_KEY} --botName {BOT_NAME} --dialog
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Source .qna file or folder'}),
    subscriptionKey: flags.string({char: 's', description: 'QnA maker subscription key'}),
    botName: flags.string({char: 'b', description: 'Bot name'}),
    region: flags.string({description: 'Overrides public endpoint https://<region>.api.cognitive.microsoft.com/qnamaker/v4.0/', default: 'westus'}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .dialog files. If not specified, knowledge base ids will be output to console'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .qna if available. Defaults to en-us if not set'}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --out is set'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in qnamaker kb name. Defaults to current logged in user alias'}),
    dialog: flags.string({description: 'Dialog recognizer type [multiLanguage|crosstrained]', default: 'multiLanguage'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided, overwrites relevant dialog file', default: false}),
    qnaConfig: flags.string({description: 'Path to config for qna build which can contain switches for arguments'}),
    log: flags.boolean({description: 'Write out log messages to console', default: false}),
    endpoint: flags.string({description: 'Qnamaker authoring endpoint for publishing'}),
    schema: flags.string({description: 'Defines $schema for generated .dialog files'})
  }

  async run() {
    try {
      const {flags}: any = this.parse(QnamakerBuild)

      // Luconfig overrides flags
      let files: string[] = []
      if (flags.qnaConfig) {
        const configFilePath = path.resolve(flags.qnaConfig)
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
      let qnamakerBuildFlags = Object.keys(QnamakerBuild.flags)

      let {inVal, subscriptionKey, botName, region, out, defaultCulture, fallbackLocale, suffix, dialog, force, log, endpoint, schema}
        = await processFlags(flags, qnamakerBuildFlags, this.config.configDir)

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !inVal && files.length === 0) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }

      if (!subscriptionKey) {
        throw new CLIError('Missing qnamaker subscription key. Please pass subscription key with --subscriptionKey flag or specify via bf config:set:qnamaker --subscriptionKey.')
      }

      if (!botName) {
        throw new CLIError('Missing bot name. Please pass bot name with --botName flag or specify via --qnaConfig.')
      }

      if (dialog && dialog !== recognizerType.MULTILANGUAGE && dialog !== recognizerType.CROSSTRAINED) {
        throw new CLIError('Recognizer type specified by --dialog is not right. Please specify [multiLanguage|crosstrained]')
      }

      defaultCulture = defaultCulture && defaultCulture !== '' ? defaultCulture : 'en-us'
      region = region && region !== '' ? region : 'westus'
      suffix = suffix && suffix !== '' ? suffix : await username() || 'development'
      fallbackLocale = fallbackLocale && fallbackLocale !== '' ? fallbackLocale : 'en-us'

      endpoint = endpoint && endpoint !== '' ? endpoint : `https://${region}.api.cognitive.microsoft.com/qnamaker/v4.0`

      // create builder class
      const builder = new Builder((input: string) => {
        if (log) this.log(input)
      })

      let qnaContents: any[] = []
      let recognizers = new Map<string, any>()
      let multiRecognizer: any
      let settings: any
      
      if ((inVal && inVal !== '') || files.length > 0) {
        if (log) this.log('Loading files...\n')

        // get qna files from flags.in.
        if (inVal && inVal !== '') {
          const qnaFiles: string[] = await file.getLuFiles(inVal, true, fileExtEnum.QnAFile)
          files.push(...qnaFiles)
        }

        // de-dupe the files list
        files = [...new Set(files)]

        // load qna contents from qna files
        // load existing recognizers, multiRecogniers and settings or create default ones
        const loadedResources = await builder.loadContents(files, botName, suffix, region, defaultCulture, schema)
        qnaContents = loadedResources.qnaContents
        recognizers = loadedResources.recognizers
        multiRecognizer = loadedResources.multiRecognizer
        settings = loadedResources.settings
      } else {
        // load qna content from stdin and create default recognizer, multiRecognier and settings
        if (log) this.log('Load qna content from stdin\n')
        const content = new Content(flags.stdin, new qnaOptions(botName, true, defaultCulture, path.join(process.cwd(), 'stdin')))
        qnaContents.push(content)
        multiRecognizer = new MultiLanguageRecognizer(path.join(process.cwd(), `${botName}.qna.dialog`), {})
        settings = new Settings(path.join(process.cwd(), `qnamaker.settings.${suffix}.${region}.json`), {})
        const recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings, {})
        recognizers.set(content.name, recognizer)
      }

      // update or create and then publish qnamaker kb based on loaded resources
      if (log) this.log('Handling qnamaker knowledge bases...')
      const dialogContents = await builder.build(qnaContents, recognizers, subscriptionKey, endpoint, botName, suffix, fallbackLocale, multiRecognizer, settings)

      // get endpointKeys
      const endpointKeysInfo = await builder.getEndpointKeys(subscriptionKey, endpoint)
      const endpointKeys: any = {
        "primaryEndpointKey": endpointKeysInfo.primaryEndpointKey,
        "secondaryEndpointKey": endpointKeysInfo.secondaryEndpointKey
      }

      // write dialog assets based on config
      if (out) {
        const outputFolder = path.resolve(out)
        const writeDone = await builder.writeDialogAssets(dialogContents, force, outputFolder, dialog, files, schema)
        if (writeDone) {
          this.log(`Successfully wrote .dialog files to ${outputFolder}\n`)
          this.log('QnA knowledge base endpointKeys:')
          this.log(endpointKeys)
        } else {
          this.log(`No changes to .dialog files in ${outputFolder}\n`)
        }
      } else {
        this.log('The published knowledge base setting:')
        this.log(JSON.parse(dialogContents[dialogContents.length - 1].content).qna)
        this.log('\n')
        this.log('QnA knowledge base endpointKeys:')
        this.log(endpointKeys)
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}
