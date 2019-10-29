/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@oclif/command'
const path = require('path')
export default class ConfigIndex extends Command {
  static description = 'Configure various settings within the cli.'

  static flags = {
    help: flags.help({char: 'h', description: 'config help'})
  }

  async run() {
    this.log(`\nConfig file location: ' ${path.join(this.config.configDir, 'config.json')} \n `)
    this._help()
  }
}
