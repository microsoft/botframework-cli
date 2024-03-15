/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags, Args} from '@microsoft/bf-cli-command'
import {Plugin, ux} from '@oclif/core'
import Plugins from  '@oclif/plugin-plugins/lib/plugins'

export default class PluginsUninstall extends Command {
  static description = 'Removes a plugin from the BF CLI'

  static variableArgs = true

  static args = {
    name: Args.string({description: 'plugin to uninstall'})
  }

  static flags = {
    help: Flags.help({char: 'h'}),
    verbose: Flags.boolean({char: 'v'}),
  }

  plugins = new Plugins(this.config)

  // In this case we want these operations to happen
  // sequentially so the `no-await-in-loop` rule is ugnored
  /* eslint-disable no-await-in-loop */
  async run() {
    const {flags, argv} = await this.parse(PluginsUninstall)
    this.plugins = new Plugins(this.config)
    if (flags.verbose) this.plugins.verbose = true
    if (argv.length === 0) argv.push('.')
    for (const plugin of argv) {
      const friendly = this.plugins.friendlyName(plugin as string)
      ux.action.start(`Uninstalling ${friendly}`)
      const unfriendly = await this.plugins.hasPlugin(plugin as string)
      if (!unfriendly) {
        const p = this.config.plugins.get(plugin as string) as Plugin | undefined
        if (p) {
          if (p && p.parent) return this.error(`${friendly} is installed via plugin ${p.parent!.name}, uninstall ${p.parent!.name} instead`)
        }
        ux.action.stop()
        throw new CLIError(`${friendly} is not installed`)
      }
      await this.plugins.uninstall(unfriendly.name)
      ux.action.stop()
    }
  }
}
