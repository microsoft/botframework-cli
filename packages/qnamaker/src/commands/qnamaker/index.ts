/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerIndex extends Command {
  static description = 'QnA Maker'

  static flags = {
    help: Flags.help({char: 'h', description: 'Display QnA Maker CLI available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
