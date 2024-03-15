/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'
export default class ChatdownIndex extends Command {
  static description = 'Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.'

  static flags = {
    help: Flags.help({char: 'h', description: 'Chatdown command help'})
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
