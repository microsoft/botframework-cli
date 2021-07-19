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

export default class LuisDiscovery extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME}
  `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'luis:discovery command help'}),
    in: flags.string({char: 'i', description: '(required) The of bot dialog files folder'}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .json file of discovered luis models. If not specified, application setting will be output to console'}),
  }

  async run() {
    try {
      const {flags} = this.parse(LuisDiscovery)

      // Luconfig overrides flags
      let files: string[] = []

      // Flags override userConfig
      let LuisDiscoveryFlags = Object.keys(LuisDiscovery.flags)

      let {inVal, out}
        = await utils.processInputs(flags, LuisDiscoveryFlags, this.config.configDir)

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !inVal && files.length === 0) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }


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
          }, directVersionPublish)

          let writeDone = await builder.writeDialogAssets(dialogContents, {
            force,
            out: outputFolder,
            luConfig
          }, directVersionPublish)

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
        }, directVersionPublish)

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
