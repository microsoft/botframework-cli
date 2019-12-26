@microsoft/bf-cli-plugins
=========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-cli-plugins.svg)](https://npmjs.org/package/@microsoft/bf-cli-plugins)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-cli-plugins.svg)](https://npmjs.org/package/@microsoft/bf-cli-plugins)
[![License](https://img.shields.io/npm/l/@microsoft/bf-cli-plugins.svg)](https://github.com/https://github.com/microsoft//botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-cli-plugins
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@microsoft/bf-cli-plugins/1.0.0 darwin-x64 node-v12.1.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example plugins`](#oclif-example-plugins)
* [`oclif-example bf plugins:install PLUGIN...`](#oclif-example-bf-pluginsinstall-plugin)
* [`oclif-example plugins:list [FILE]`](#oclif-example-pluginslist-file)
* [`oclif-example bf plugins:uninstall PLUGIN...`](#oclif-example-bf-pluginsuninstall-plugin)

## `oclif-example plugins`

List installed plugins

```
USAGE
  $ oclif-example plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ oclif-example plugins
```

_See code: [src/commands/plugins/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/blob/v1.0.0/src/commands/plugins/index.ts)_

## `oclif-example bf plugins:install PLUGIN...`

installs a plugin into the BF CLI

```
USAGE
  $ oclif-example bf plugins:install PLUGIN...

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
  $ oclif-example plugins:add
```

_See code: [src/commands/plugins/install.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/blob/v1.0.0/src/commands/plugins/install.ts)_

## `oclif-example plugins:list [FILE]`

describe the command here

```
USAGE
  $ oclif-example plugins:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/plugins/list.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/blob/v1.0.0/src/commands/plugins/list.ts)_

## `oclif-example bf plugins:uninstall PLUGIN...`

Removes a plugin from the BF CLI

```
USAGE
  $ oclif-example bf plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [src/commands/plugins/uninstall.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/blob/v1.0.0/src/commands/plugins/uninstall.ts)_
<!-- commandsstop -->
