/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerKbIndex extends Command {
  static description = 'Commands for manipulating your knowledge base'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:kb available commands'}),
  }

  async run() {
    this._help()
  }
}
