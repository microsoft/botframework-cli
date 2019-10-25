/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerOperationdetailsIndex extends Command {
  static description = 'Command to get operation details'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:operationdetails available commands'}),
  }

  async run() {
    this._help()
  }
}
