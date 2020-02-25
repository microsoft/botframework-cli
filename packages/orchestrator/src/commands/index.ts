/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class OrchestratorIndex extends Command {
  static description = 'Display Orchestrator CLI available commands'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Orchestrator command help'})
  }

  async run() {
    this._help()
  }
}
