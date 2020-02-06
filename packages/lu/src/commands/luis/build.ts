/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'
import {Builder} from '../../parser/lubuild/builder'

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
    culture: flags.string({description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us'}),
    region: flags.string({description: 'LUIS authoring region'}),
    suffix: flags.string({description: 'Environment name as a suffix identifier to include in LUIS app name'}),
    force: flags.boolean({char: 'f', description: 'Force write dialog and settings files', default: false}),
    dialog: flags.boolean({description: 'Write out .dialog files', default: false}),
    fallbackLocale: flags.string({description: 'Locale to be used at the fallback if no locale specific recognizer is found. Only valid if --dialog is set'})
  }

  async run() {
    const {flags} = this.parse(LuisBuild)

    flags.stdin = await this.readStdin()

    if (!flags.stdin && !flags.in) {
      throw new Error('Missing input. Please use stdin or pass a file or folder location with --in flag')
    }

    flags.culture = flags.culture && flags.culture !== '' ? flags.culture : 'en-us'
    flags.region = flags.region && flags.region !== '' ? flags.region : 'westus'
    flags.suffix = flags.suffix && flags.suffix !== '' ? flags.suffix : 'development'
    flags.fallbackLocale = flags.fallbackLocale && flags.fallbackLocale !== '' ? flags.fallbackLocale : 'en-us'

    // create builder class
    const builder = new Builder((input: string) => {
      this.log(input)
    })

    // load lu contents from lu files
    // load existing recognizers, multiRecogniers and settings or create new ones
    let {luContents, recognizers, multiRecognizers, settings} = await builder.LoadContents(flags.in, flags.culture, flags.suffix, flags.region, flags.stdin)

    // update or create and train and publish luis applications based on loaded resources
    const dialogContents = await builder.build(luContents, recognizers, flags.authoringKey, flags.region, flags.botName, flags.suffix, flags.fallbackLocale, multiRecognizers, settings)

    // write dialog assets based on config
    await builder.writeDialogAssets(dialogContents, flags.dialog, flags.force, flags.out)

    this.log('All tasks done\n')
  }
}
