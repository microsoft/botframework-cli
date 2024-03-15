/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'
const path = require('path')
export default class ConfigIndex extends Command {
  static description = 'Configure various settings within the cli.'

  static flags = {
    help: Flags.help({char: 'h', description: 'config help'})
  }

  async run() {
    this.log(`\nConfig file location: ' ${path.join(this.config.configDir, 'config.json')} \n `)
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
