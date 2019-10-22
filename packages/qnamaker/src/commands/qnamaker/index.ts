/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerIndex extends Command {
  static description = 'QnA Maker'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Display QnA Maker CLI available commnads'}),
  }

  async run() {
    this._help()
  }
}
