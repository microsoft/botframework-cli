/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class LuisIndex extends Command {
  static description = 'Manages LUIS assets on service and/or locally.'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'LUIS command help'})
  }

  async run() {
    this._help()
  }
}