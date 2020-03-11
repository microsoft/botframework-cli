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
const LUOptions = require('@microsoft/bf-lu/lib/parser/lu/luOptions')
const Settings = require('@microsoft/bf-lu/lib/parser/qnabuild/settings')
const MultiLanguageRecognizer = require('@microsoft/bf-lu/lib/parser/qnabuild/multi-language-recognizer')
const Recognizer = require('@microsoft/bf-lu/lib/parser/qnabuild/recognizer')
const Builder = require('@microsoft/bf-lu/lib/parser/qnabuild/builder').Builder

export default class QnamakerBuild extends Command {
  static description = 'Build qna files to create and publish qnamaker knowledge bases'

  static examples = [`
    $ bf qnamaker:build --in {INPUT_FILE_OR_FOLDER} --subscriptionkey {SUBSCRIPTION_KEY} --botName {BOT_NAME} --dialog
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'QnA file or folder'}),
    subscriptionkey: flags.string({description: 'QnA maker subscription key', required: true}),
    botName: flags.string({description: 'Bot name'}),
    region: flags.string({description: 'LUIS api endpoint region [westus|westeurope|australiaeast]', default: 'westus'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified, current directory will be used as output'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .qna if available. Defaults to en-us'}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --dialog is set'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in qnamaker kb name. Defaults to current logged in useralias'}),
    dialog: flags.boolean({description: 'Write out .dialog files', default: false}),
    force: flags.boolean({char: 'f', description: 'If --dialog flag is provided, overwirtes relevant dialog file', default: false}),
    log: flags.boolean({description: 'write out log messages to console', default: false}),
  }

  async run() {
    try {
      const {flags} = this.parse(QnamakerBuild)

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !flags.in) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }

      if (!flags.botName) {
        throw new CLIError('Missing bot name. Please pass bot name with --botName flag')
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
      let multiRecognizers = new Map<string, any>()
      let settings = new Map<string, any>()

      if (flags.stdin && flags.stdin !== '') {
        // load qna content from stdin and create default recognizer, multiRecognier and settings
        if (flags.log) this.log('Load qna content from stdin\n')
        const content = new Content(flags.stdin, new LUOptions('stdin', true, flags.defaultCulture, path.join(process.cwd(), 'stdin')))
        qnaContents.push(content)
        multiRecognizers.set('stdin', new MultiLanguageRecognizer(path.join(process.cwd(), 'stdin.qna.dialog'), {}))
        settings.set('stdin', new Settings(path.join(process.cwd(), `qnamaker.settings.${flags.suffix}.${flags.region}.json`), {}))
        const recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings.get('stdin'), {})
        recognizers.set(content.name, recognizer)
      } else {
        if (flags.log) this.log('Loading files...\n')

        let files = []

        // get qna files from flags.in.
        if (flags.in && flags.in !== '') {
          const qnaFiles = await file.getLuFiles(flags.in, true, fileExtEnum.QnAFile)
          files.push(...qnaFiles)
        }

        // de-dupe the files list
        files = [...new Set(files)]

        // load qna contents from qna files
        // load existing recognizers, multiRecogniers and settings or create default ones
        const loadedResources = await builder.loadContents(files, flags.defaultCulture, flags.suffix, flags.region)
        qnaContents = loadedResources.qnaContents
        recognizers = loadedResources.recognizers
        multiRecognizers = loadedResources.multiRecognizers
        settings = loadedResources.settings
      }

      // update or create and then publish qnamaker kb based on loaded resources
      if (flags.log) this.log('Handling qnamaker knowledge bases...')
      const dialogContents = await builder.build(qnaContents, recognizers, flags.subscriptionkey, endpoint, flags.botName, flags.suffix, flags.fallbackLocale, multiRecognizers, settings)

      // write dialog assets based on config
      if (flags.dialog) {
        const writeDone = await builder.writeDialogAssets(dialogContents, flags.force, flags.out)
        const dialogFilePath = (flags.stdin || !flags.in) ? process.cwd() : flags.in.endsWith(fileExtEnum.QnAFile) ? path.dirname(path.resolve(flags.in)) : path.resolve(flags.in)
        const outputFolder = flags.out ? path.resolve(flags.out) : dialogFilePath
        if (writeDone) {
          this.log(`Successfully wrote .dialog files to ${outputFolder}\n`)
        } else {
          this.log(`No changes to the .dialog files in ${outputFolder}\n`)
        }
      } else {
        this.log('The published knowledge base ids:')
        this.log(JSON.parse(dialogContents[dialogContents.length - 1].content).qnamaker)
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}
