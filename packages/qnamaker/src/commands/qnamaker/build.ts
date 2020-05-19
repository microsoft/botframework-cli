/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const path = require('path')
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
    subscriptionKey: flags.string({char: 's', description: 'QnA maker subscription key', required: true}),
    botName: flags.string({char: 'b', description: 'Bot name', required: true}),
    region: flags.string({description: 'Overrides public endpoint https://<region>.api.cognitive.microsoft.com/qnamaker/v4.0/', default: 'westus'}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .dialog files. If not specified, only application ids will be output to console'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .qna if available. Defaults to en-us if not set'}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --out is set'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in qnamaker kb name. Defaults to current logged in user alias'}),
    dialog: flags.string({description: 'Dialog recognizer type [multiLanguage|crosstrained]', default: 'multiLanguage'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided, overwrites relevant dialog file', default: false}),
    log: flags.boolean({description: 'write out log messages to console', default: false}),
  }

  async run() {
    try {
      const {flags}: any = this.parse(QnamakerBuild)

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !flags.in) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }

      if (flags.dialog && flags.dialog !== recognizerType.MULTILANGUAGE && flags.dialog !== recognizerType.CROSSTRAINED) {
        throw new CLIError('Recognizer type specified by --dialog is not right. Please specify [multiLanguage|crosstrained]')
      }

      flags.defaultCulture = flags.defaultCulture && flags.defaultCulture !== '' ? flags.defaultCulture : 'en-us'
      flags.region = flags.region && flags.region !== '' ? flags.region : 'westus'
      flags.suffix = flags.suffix && flags.suffix !== '' ? flags.suffix : await username() || 'development'
      flags.fallbackLocale = flags.fallbackLocale && flags.fallbackLocale !== '' ? flags.fallbackLocale : 'en-us'

      const endpoint = `https://${flags.region}.api.cognitive.microsoft.com/qnamaker/v4.0`

      // create builder class
      const builder = new Builder((input: string) => {
        if (flags.log) this.log(input)
      })

      let qnaContents: any[] = []
      let recognizers = new Map<string, any>()
      let multiRecognizer: any
      let settings: any

      const dialogFilePath = (flags.stdin || !flags.in) ? process.cwd() : flags.in.endsWith(fileExtEnum.QnAFile) ? path.dirname(path.resolve(flags.in)) : path.resolve(flags.in)
      
      let files: string[] = []

      if (flags.stdin && flags.stdin !== '') {
        // load qna content from stdin and create default recognizer, multiRecognier and settings
        if (flags.log) this.log('Load qna content from stdin\n')
        const content = new Content(flags.stdin, new qnaOptions(flags.botName, true, flags.defaultCulture, path.join(process.cwd(), 'stdin')))
        qnaContents.push(content)
        multiRecognizer = new MultiLanguageRecognizer(path.join(process.cwd(), `${flags.botName}.qna.dialog`), {})
        settings = new Settings(path.join(process.cwd(), `qnamaker.settings.${flags.suffix}.${flags.region}.json`), {})
        const recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings, {})
        recognizers.set(content.name, recognizer)
      } else {
        if (flags.log) this.log('Loading files...\n')

        // get qna files from flags.in.
        if (flags.in && flags.in !== '') {
          const qnaFiles: string[] = await file.getLuFiles(flags.in, true, fileExtEnum.QnAFile)
          files.push(...qnaFiles)
        }

        // de-dupe the files list
        files = [...new Set(files)]

        // load qna contents from qna files
        // load existing recognizers, multiRecogniers and settings or create default ones
        const loadedResources = await builder.loadContents(files, dialogFilePath, flags.botName, flags.suffix, flags.region, flags.defaultCulture)
        qnaContents = loadedResources.qnaContents
        recognizers = loadedResources.recognizers
        multiRecognizer = loadedResources.multiRecognizer
        settings = loadedResources.settings
      }

      // update or create and then publish qnamaker kb based on loaded resources
      if (flags.log) this.log('Handling qnamaker knowledge bases...')
      const dialogContents = await builder.build(qnaContents, recognizers, flags.subscriptionKey, endpoint, flags.botName, flags.suffix, flags.fallbackLocale, multiRecognizer, settings)

      // write dialog assets based on config
      if (flags.out) {
        const outputFolder = path.resolve(flags.out)
        const writeDone = await builder.writeDialogAssets(dialogContents, flags.force, outputFolder, flags.dialog, files)
        if (writeDone) {
          this.log(`Successfully wrote .dialog files to ${outputFolder}\n`)
        } else {
          this.log(`No changes to .dialog files in ${outputFolder}\n`)
        }
      } else {
        this.log('The published knowledge base setting:')
        this.log(JSON.parse(dialogContents[dialogContents.length - 1].content).qna)
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}
