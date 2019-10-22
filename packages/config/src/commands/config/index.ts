/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@oclif/command'

export default class ConfigIndex extends Command {
  static description = 'The config plugin allows users to configure various settings within the cli.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.log(`\nConfig file location: ' ${this.config.configDir}/config.json \n `)
    this._help()
  }
}
