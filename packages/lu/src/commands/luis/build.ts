/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {Builder} from './../../parser/lubuild/builder'
import {Settings} from './../../parser/lubuild/settings'
import {MultiLanguageRecognizer} from './../../parser/lubuild/multi-language-recognizer'
import {Recognizer} from './../../parser/lubuild/recognizer'
const path = require('path')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const Content = require('./../../parser/lu/lu')

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME} --dialog {true}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Lu file or folder'}),
    authoringKey: flags.string({description: 'LUIS authoring key', required: true}),
    botName: flags.string({description: 'Bot name', required: true}),
    out: flags.string({description: 'Output location'}),
    defaultCulture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    region: flags.string({description: 'LUIS authoring region'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name'}),
    force: flags.boolean({char: 'f', description: 'Force write dialog and settings files', default: false}),
    dialog: flags.boolean({description: 'Write out .dialog files', default: false}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --dialog is set'}),
    log: flags.boolean({description: 'write out log messages to console', default: false})
  }

  async run() {
    const {flags} = this.parse(LuisBuild)

    flags.stdin = await this.readStdin()

    if (!flags.stdin && !flags.in) {
      throw new Error('Missing input. Please use stdin or pass a file or folder location with --in flag')
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
    let recognizers = new Map<string, Recognizer>()
    let multiRecognizers = new Map<string, MultiLanguageRecognizer>()
    let settings: Settings

    if (flags.stdin && flags.stdin !== '') {
      // load lu content from stdin and create default recognizer, multiRecognier and settings
      this.log('Load lu content from stdin')
      const content = new Content(flags.stdin, 'stdin', true, flags.defaultCulture, path.join(process.cwd(), 'stdin'))
      luContents.push(content)
      multiRecognizers.set('stdin', new MultiLanguageRecognizer(path.join(process.cwd(), 'stdin.lu.dialog'), {}))
      settings = new Settings(path.join(process.cwd(), `luis.settings.${flags.suffix}.${flags.region}.json`), {})
      let recognizer = Recognizer.load(content.path, content.name, path.join(process.cwd(), `${content.name}.dialog`), settings, {})
      recognizers.set(content.name, recognizer)
    } else {
      // load lu contents from lu files
      // load existing recognizers, multiRecogniers and settings or create default ones
      this.log('Start to load lu files')
      const loadedResources = await builder.LoadContents(flags.in, flags.defaultCulture, flags.suffix, flags.region)
      luContents = loadedResources.luContents
      recognizers = loadedResources.recognizers
      multiRecognizers = loadedResources.multiRecognizers
      settings = loadedResources.settings
    }

    // update or create and then train and publish luis applications based on loaded resources
    this.log('Start to handle applications')
    const dialogContents = await builder.build(luContents, recognizers, flags.authoringKey, flags.region, flags.botName, flags.suffix, flags.fallbackLocale, multiRecognizers, settings)

    // write dialog assets based on config
    if (flags.dialog) {
      const writeDone = await builder.writeDialogAssets(dialogContents, flags.force, flags.out)
      const dialogFilePath = flags.stdin ? process.cwd() : flags.in.endsWith(fileExtEnum.LUFile) ? path.dirname(path.resolve(flags.in)) : path.resolve(flags.in)
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
