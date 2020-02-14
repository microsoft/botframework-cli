/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class ExpandCommand extends Command {
  static description = 'Expand one or all templates in a .lg file or an inline expression.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'lg input'}),
    help: flags.help({char: 'h', description: 'lg help'}),
  }

  async run() {
    this.log('expand')
  }
}
