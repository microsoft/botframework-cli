/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command';

export default class SamplerIndex extends Command {
  static description: string = 'Display Sampler CLI available commands';

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Sampler commands help'}),
  }

  async run(): Promise<void> {
    this._help();
  }
}
