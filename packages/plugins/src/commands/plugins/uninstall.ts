/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {Plugin} from '@oclif/config'
import Plugins from  '@oclif/plugin-plugins/lib/plugins'
import cli from 'cli-ux'

export default class PluginsUninstall extends Command {
  static description = 'Removes a plugin from the BF CLI'

  static variableArgs = true

  static args = [{name: 'plugin', description: 'plugin to uninstall'}]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    verbose: flags.boolean({char: 'v'}),
  }

  plugins = new Plugins(this.config)

  // In this case we want these operations to happen
  // sequentially so the `no-await-in-loop` rule is ugnored
  /* eslint-disable no-await-in-loop */
  async run() {
    const {flags, argv} = this.parse(PluginsUninstall)
    this.plugins = new Plugins(this.config)
    if (flags.verbose) this.plugins.verbose = true
    if (argv.length === 0) argv.push('.')
    for (const plugin of argv) {
      const friendly = this.plugins.friendlyName(plugin)
      cli.action.start(`Uninstalling ${friendly}`)
      const unfriendly = await this.plugins.hasPlugin(plugin)
      if (!unfriendly) {
        const p = this.config.plugins.find(p => p.name === plugin) as Plugin | undefined
        if (p) {
          if (p && p.parent) return this.error(`${friendly} is installed via plugin ${p.parent!.name}, uninstall ${p.parent!.name} instead`)
        }
        cli.action.stop()
        throw new CLIError(`${friendly} is not installed`)
      }
      await this.plugins.uninstall(unfriendly.name)
      cli.action.stop()
    }
  }
}
