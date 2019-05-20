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
botframework-cli/0.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf hello [FILE]`](#bf-hello-file)
* [`bf help [COMMAND]`](#bf-help-command)

## `bf hello [FILE]`

describe the command here

```
USAGE
  $ bf hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ bf hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Microsoft/botframework-cli/blob/v0.0.0/src/commands/hello.ts)_

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
