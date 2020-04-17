/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import Plugins from  '@oclif/plugin-plugins/lib/plugins'
import cli from 'cli-ux'

export default class PluginsInstall extends Command {
  static description = `Installs a plugin into the BF CLI
  Installation of a user-installed plugin will override a core plugin.
e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command will override the core plugin implementation. 
This is useful if a user needs to update core plugin functionality in the CLI without the need to patch and update the whole CLI.`

  static strict = false

  static args = [{name: 'plugin', description: 'plugin to install', required: true}]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    verbose: flags.boolean({char: 'v'}),
    force: flags.boolean({char: 'f', description: 'yarn install with force flag'}),
  }

  static aliases = ['plugins:add']

  config: any
  plugins = new Plugins(this.config)
  
  // In this case we want these operations to happen
  // sequentially so the `no-await-in-loop` rule is ugnored
  /* eslint-disable no-await-in-loop */
  async run() {
    const {flags, argv} = this.parse(PluginsInstall)
    if (flags.verbose) this.plugins.verbose = true
    const aliases = this.config.pjson.oclif.aliases || {}
    for (let name of argv) {
      if (aliases[name] === null || !name.startsWith('@microsoft')) {
        throw new CLIError(`${name} is blacklisted`)
      }

      name = aliases[name] || name
      const p = await this.parsePlugin(name)
      let plugin
      await this.config.runHook('plugins:preinstall', {
        plugin: p,
      })
      if (p.type === 'npm') {
        cli.action.start(`Installing plugin ${this.plugins.friendlyName(p.name)}`)
        plugin = await this.plugins.install(p.name, {tag: p.tag, force: flags.force})
      } else {
        cli.action.start(`Installing plugin ${p.url}`)
        plugin = await this.plugins.install(p.url, {force: flags.force})
      }
      cli.action.stop(`installed v${plugin.version}`)
    }
  }

  async parsePlugin(input: string): Promise<{name: string; tag: string; type: 'npm'} | {url: string; type: 'repo'}> {
    if (input.includes('@') && input.includes('/')) {
      input = input.slice(1)
      const [name, tag = 'latest'] = input.split('@')
      return {name: '@' + name, tag, type: 'npm'}
    }
    if (input.includes('/')) {
      if (input.includes(':')) return {url: input, type: 'repo'}
      return {url: `https://github.com/${input}`, type: 'repo'}
    }
    const [splitName, tag = 'latest'] = input.split('@')
    const name = await this.plugins.maybeUnfriendlyName(splitName)
    return {name, tag, type: 'npm'}
  }
}
