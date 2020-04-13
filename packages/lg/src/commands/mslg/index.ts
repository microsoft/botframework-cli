/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class LGIndex extends Command {
  static description = 'MSLG is a command line tool to parse, collate, expand and translate lg files.'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Display MSLG CLI available commands'}),
  }

  async run() {
    this._help()
  }
}
