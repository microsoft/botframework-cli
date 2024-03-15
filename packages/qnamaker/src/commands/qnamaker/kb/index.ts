/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerKbIndex extends Command {
  static description = 'Commands for manipulating your knowledge base'

  static flags = {
    help: Flags.help({char: 'h', description: 'display qnamaker:kb available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
