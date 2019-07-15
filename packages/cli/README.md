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
* [`bf chatdown`](#bf-chatdown)
* [`bf config`](#bf-config)
* [`bf config:telemetry`](#bf-configtelemetry)
* [`bf config:telemetry:disable`](#bf-configtelemetrydisable)
* [`bf config:telemetry:enable`](#bf-configtelemetryenable)
* [`bf help [COMMAND]`](#bf-help-command)

## `bf chatdown`

Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file

```
USAGE
  $ bf chatdown

OPTIONS
  -c, --chat=chat              The path of the chat file to be parsed. If omitted, stdin will be used.

  -f, --folder=folder          Path to directory and/or all subdirectories containing chat files to be processed all at
                               once, ex. ./**/*.chat. If an output directory is not present (-o), it will default the
                               output to the current working directory.

  -h, --help                   Chatdown command help

  -o, --out_folder=out_folder  Path to the directory where the output of the multiple chat file processing (-f) will be
                               placed.

  -p, --prefix                 Prefix stdout with package name.

  -s, --static                 Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --chat=./path/to/file/sample.chat
     $ bf chatdown -f ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static
```

_See code: [bf-chatdown](https://github.com/Microsoft/chatdown/blob/v0.1.0/src/commands/chatdown.ts)_

## `bf config`

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ bf config

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-config](https://github.com/packages/bf-config/blob/v0.0.0/src/commands/config/index.ts)_

## `bf config:telemetry`

The telemetry commands allow the user to enable and disable telemetry.

```
USAGE
  $ bf config:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-config](https://github.com/packages/bf-config/blob/v0.0.0/src/commands/config/telemetry/index.ts)_

## `bf config:telemetry:disable`

Disable telemetry

```
USAGE
  $ bf config:telemetry:disable
```

_See code: [@microsoft/bf-config](https://github.com/packages/bf-config/blob/v0.0.0/src/commands/config/telemetry/disable.ts)_

## `bf config:telemetry:enable`

enable telemetry

```
USAGE
  $ bf config:telemetry:enable
```

_See code: [@microsoft/bf-config](https://github.com/packages/bf-config/blob/v0.0.0/src/commands/config/telemetry/enable.ts)_

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
