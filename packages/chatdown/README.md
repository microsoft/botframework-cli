@microsoft/bf-chatdown
========

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-chatdown)](https://www.npmjs.com/package/@microsoft/bf-chatdown)

Tool for parsing chat files and outputting replayable activities.

# Relevant docs
- [.chat file format][1]
- [Example .chat files][2]

# Commands
<!-- commands -->
* [`bf chatdown`](#bf-chatdown)
* [`bf chatdown:convert`](#bf-chatdownconvert)

## `bf chatdown`

Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.

```
USAGE
  $ bf chatdown

OPTIONS
  -h, --help  Chatdown command help
```

_See code: [src/commands/chatdown/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/chatdown/src/commands/chatdown/index.ts)_

## `bf chatdown:convert`

Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.

```
USAGE
  $ bf chatdown:convert

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     Chatdown command help

  -i, --in=in    The path of the chat file or directory to be parsed. A glob expression may be passed containing chat
                 files to be processed all at once, ex. ./**/*.chat. If flag is omitted, stdin will be used. If an
                 output directory is not present (-o), it will default the output to the current working directory.

  -o, --out=out  Path to the directory where the output of the multiple chat file processing (-o) will be placed.

  -p, --prefix   Prefix stdout with package name.

  -s, --stamp    Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --in=./path/to/file/sample.chat
     $ bf chatdown --in ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static
```

_See code: [src/commands/chatdown/convert.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/chatdown/src/commands/chatdown/convert.ts)_
<!-- commandsstop -->

[1]:./docs/chatdown-format.md
[2]:./docs/examples
