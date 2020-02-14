/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {Command, flags} from '@microsoft/bf-cli-command'

export default class ParseCommand extends Command {
  static description = 'Parse any provided .lg file and collate them into a single file.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'lg input'}),
    help: flags.help({char: 'h', description: 'lg help'}),
  }

  async run() {
    this.log('parser')
  }
}
