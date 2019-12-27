/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {Plugin} from '@oclif/config'
import Plugins from  '@oclif/plugin-plugins/lib/plugins'
import cli from 'cli-ux'

export default class PluginsList extends Command {
  static flags: flags.Input<any> = {
    core: flags.boolean({description: 'show core plugins'}),
  }

  static description = 'List installed plugins'

  plugins = new Plugins(this.config)

  async run() {
    const {flags} = this.parse(PluginsList)
    let plugins = this.config.plugins

    if (!flags.core) {
      plugins = plugins.filter(p => p.type !== 'core' && p.type !== 'dev')
    }
    if (plugins.length === 0) {
      throw new CLIError('no plugins installed')
    }
    this.display(plugins as Plugin[])
  }

  private display(plugins: Plugin[]) {
    for (const plugin of plugins.filter((p: Plugin) => !p.parent)) {
      this.log(this.formatPlugin(plugin))
      if (plugin.children && plugin.children.length > 0) {
        const tree = this.createTree(plugin)
        tree.display(this.log)
      }
    }
  }

  private createTree(plugin: Plugin) {
    const tree = cli.tree()
    for (const p of plugin.children) {
      const name = this.formatPlugin(p)
      tree.insert(name, this.createTree(p))
    }
    return tree
  }

  private formatPlugin(plugin: any): string {
    let output = `${this.plugins.friendlyName(plugin.name)} ${plugin.version}`
    if (plugin.type !== 'user')
      output += ` (${plugin.type})`
    if (plugin.type === 'link')
      output += ` ${plugin.root}`
    else if (plugin.tag && plugin.tag !== 'latest')
      output += ` (${String(plugin.tag)})`
    return output
  }
}
