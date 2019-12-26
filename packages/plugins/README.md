@microsoft/bf-cli-plugins
=========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-cli-plugins.svg)](https://npmjs.org/package/@microsoft/bf-cli-plugins)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-cli-plugins.svg)](https://npmjs.org/package/@microsoft/bf-cli-plugins)
[![License](https://img.shields.io/npm/l/@microsoft/bf-cli-plugins.svg)](https://github.com/https://github.com/microsoft//botframework-cli/blob/master/package.json)

<!-- toc -->
* [Commands](#commands)
<!-- tocstop -->
# Commands
<!-- commands -->
* [`bf plugins`](#bf-plugins)
* [`bf plugins:install PLUGIN`](#bf-pluginsinstall-plugin)
* [`bf plugins:list`](#bf-pluginslist)
* [`bf plugins:uninstall [PLUGIN]`](#bf-pluginsuninstall-plugin)

## `bf plugins`

Install, uninstall and show installed plugins

```
USAGE
  $ bf plugins

OPTIONS
  --help  Display plugins commands help.
```

_See code: [src/commands/plugins/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/index.ts)_

## `bf plugins:install PLUGIN`

installs a plugin into the BF CLI

```
USAGE
  $ bf plugins:install PLUGIN

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.
     Installation of a user-installed plugin will override a core plugin.
     e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' 
  command will override the core plugin implementation. This is useful if a user needs to update core plugin 
  functionality in the CLI without the need to patch and update the whole CLI.

ALIASES
  $ bf plugins:add
```

_See code: [src/commands/plugins/install.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/install.ts)_

## `bf plugins:list`

List installed plugins

```
USAGE
  $ bf plugins:list

OPTIONS
  --core  show core plugins
```

_See code: [src/commands/plugins/list.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/list.ts)_

## `bf plugins:uninstall [PLUGIN]`

Removes a plugin from the BF CLI

```
USAGE
  $ bf plugins:uninstall [PLUGIN]

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [src/commands/plugins/uninstall.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/uninstall.ts)_
<!-- commandsstop -->
