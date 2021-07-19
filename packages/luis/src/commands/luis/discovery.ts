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

       console.log(inVal, out) 

      flags.stdin = await this.readStdin()

      if (!flags.stdin && !inVal && files.length === 0) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag')
      }
    } catch (error) {
      if (error instanceof exception) {
        throw new CLIError(error.text)
      }
      throw error
    }
  }
}