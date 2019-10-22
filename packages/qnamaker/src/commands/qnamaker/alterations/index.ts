/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerAlterationsIndex extends Command {
  static description = 'Commands for replacing and listing your alterations'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:alterations available commands'}),
  }

  async run() {
    this._help()
  }
}
