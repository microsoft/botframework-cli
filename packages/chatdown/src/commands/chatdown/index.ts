/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class ChatdownIndex extends Command {
  static description = 'Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Chatdown command help'})
  }

  async run() {
    this._help()
  }
}
