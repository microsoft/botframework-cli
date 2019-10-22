/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerEndpointsettingsIndex extends Command {
  static description = 'Commands to get and update endpoint settings'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:update available commands'}),
  }

  async run() {
    this._help()
  }
}
