/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class LuisIndex extends Command {
  static description = 'Converts, translates luis/lu files or generates source code.'

  static flags = {
    help: flags.help({char: 'h', description: 'Display Luis available commands'}),
  }

  async run() {
    this._help()
  }
}
