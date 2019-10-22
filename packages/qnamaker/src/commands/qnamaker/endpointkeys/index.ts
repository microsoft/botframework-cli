/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class QnamakerEndpointkeysIndex extends Command {
  static description = 'Commands to refresh and list keys'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'display qnamaker:endpointkeys available commands'}),
  }

  async run() {
    this._help()
  }
}
