/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class LGIndex extends Command {
  static description = 'Parse, collate, expand and translate lg files.'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'lg command help'}),
  }

  async run() {
    this._help()
  }
}
