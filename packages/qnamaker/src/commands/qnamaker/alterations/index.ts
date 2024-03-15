/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerAlterationsIndex extends Command {
  static description = 'Commands for replacing and listing your alterations'

  static flags = {
    help: Flags.help({char: 'h', description: 'display qnamaker:alterations available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
