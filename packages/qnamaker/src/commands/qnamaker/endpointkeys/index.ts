/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command'
import { loadHelpClass } from '@oclif/core'

export default class QnamakerEndpointkeysIndex extends Command {
  static description = 'Commands to refresh and list keys'

  static flags = {
    help: Flags.help({char: 'h', description: 'display qnamaker:endpointkeys available commands'}),
  }

  async run() {
    await new (await loadHelpClass(this.config))(this.config).showHelp([])
  }
}
