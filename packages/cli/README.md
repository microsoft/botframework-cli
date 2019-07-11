botframework-cli
================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/botframework-cli.svg)](https://npmjs.org/package/botframework-cli)
[![Downloads/week](https://img.shields.io/npm/dw/botframework-cli.svg)](https://npmjs.org/package/botframework-cli)
[![License](https://img.shields.io/npm/l/botframework-cli.svg)](https://github.com/Microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g botframework-cli
$ bf COMMAND
running command...
$ bf (-v|--version|version)
botframework-cli/0.1.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf chatdown [CHAT]`](#bf-chatdown-chat)
* [`bf help [COMMAND]`](#bf-help-command)

## `bf chatdown [CHAT]`

Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file

```
USAGE
  $ bf chatdown [CHAT]

ARGUMENTS
  CHAT  The path of the chat file to be parsed. If omitted, stdin will be used.

OPTIONS
  -f, --folder=folder
  -h, --help                   show CLI help
  -o, --out_folder=out_folder
  -v, --version                Show version
  --prefix                     Use static timestamps when generating timestamps on activities.
  --static                     Use static timestamps when generating timestamps on activities.

EXAMPLE
  $ bf chatdown
```

_See code: [bf-chatdown](https://github.com/Microsoft/chatdown/blob/v0.1.0/src/commands/chatdown.ts)_

## `bf help [COMMAND]`

display help for bf

```
USAGE
  $ bf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
