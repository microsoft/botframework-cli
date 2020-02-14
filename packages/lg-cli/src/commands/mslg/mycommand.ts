/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class Mycommand extends Command {
  static description = 'LG'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'lg input'}),
    help: flags.help({char: 'h', description: 'lg help'}),
  }

  async run() {
    this.log('ddddd')
  }
}
