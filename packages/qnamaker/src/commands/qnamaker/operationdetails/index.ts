/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerOperationdetailsIndex extends Command {
  static description = 'Command to get operation details'

  static flags = {
    help: Flags.help({char: 'h', description: 'display qnamaker:operationdetails available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
