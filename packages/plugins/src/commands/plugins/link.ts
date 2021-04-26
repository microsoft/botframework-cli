/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import Plugins from  '@oclif/plugin-plugins/lib/plugins'
import cli from 'cli-ux'
const fs = require('fs')

export default class PluginsLink extends Command {
  static description = `Links a plugin into the BF CLI for development
Installation of a linked plugin will override a user-installed or core plugin.
e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' command will override the user-installed or core plugin implementation. This is useful for development work.
`

  static usage = 'plugins:link PLUGIN'

  static args = [{name: 'path', description: 'path to plugin', required: true, default: '.'}]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    verbose: flags.boolean({char: 'v'}),
  }

  plugins = new Plugins(this.config)

  async run() {
    const {flags, args} = this.parse(PluginsLink)
    this.plugins.verbose = flags.verbose

    if (!fs.existsSync(args.path)) {
      throw new CLIError('Path to plugin does not exist')
    }

    cli.action.start(`Linking plugin ${args.path}`)
    await this.plugins.link(args.path)
    cli.action.stop()
  }
}
