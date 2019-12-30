/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class PluginsIndex extends Command {
  static flags: flags.Input<any> = {
    help: flags.help({description: 'Display plugins commands help.'}),
  }

  static description = 'Install, uninstall and show installed plugins'

  async run() {
    this._help()
  }
}
