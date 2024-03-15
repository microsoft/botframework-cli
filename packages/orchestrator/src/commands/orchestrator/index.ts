/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, Flags} from '@microsoft/bf-cli-command';

export default class OrchestratorIndex extends Command {
  static description: string = 'Display Orchestrator CLI available commands';

  static flags = {
    help: Flags.help({char: 'h', description: 'Orchestrator commands help'}),
  }

  async run(): Promise<number> {
    this._help();
  }
}
