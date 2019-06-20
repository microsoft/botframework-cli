bf-chatdown
========

Tool for parsing chat files and outputting replayable activities

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/chatdown.svg)](https://npmjs.org/package/bf-chatdown)
[![Downloads/week](https://img.shields.io/npm/dw/chatdown.svg)](https://npmjs.org/package/bf-chatdown)
[![License](https://img.shields.io/npm/l/chatdown.svg)](https://github.com/Microsoft/chatdown/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bf-chatdown
$ bf COMMAND
running command...
$ bf (-v|--version|version)
bf-chatdown/0.1.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf chatdown [CHAT]`](#bf-chatdown-chat)

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

_See code: [src/commands/chatdown.ts](https://github.com/Microsoft/chatdown/blob/v0.1.0/src/commands/chatdown.ts)_
<!-- commandsstop -->
