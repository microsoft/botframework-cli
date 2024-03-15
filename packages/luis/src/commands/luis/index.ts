/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'
export default class LuisIndex extends Command {
  static description = 'Manages LUIS assets on service and/or locally.'

  static flags = {
    help: Flags.help({char: 'h', description: 'LUIS command help'})
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
