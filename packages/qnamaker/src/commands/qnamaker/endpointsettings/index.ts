/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerEndpointsettingsIndex extends Command {
  static description = 'Commands to get and update endpoint settings'

  static flags = {
    help: Flags.help({char: 'h', description: 'display qnamaker:update available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
