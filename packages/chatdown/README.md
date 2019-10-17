@microsoft/bf-chatdown
========

Tool for parsing chat files and outputting replayable activities

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-chatdown)](https://www.npmjs.com/package/@microsoft/bf-chatdown)


# Commands
<!-- commands -->
* [`bf chatdown`](#bf-chatdown)

## `bf chatdown`

Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file

```
USAGE
  $ bf chatdown

OPTIONS
  -i, --in=in                  The path of the chat file or directory to be parsed. A glob expression may be passed containing 
                               chat files to be processed all at once, ex. ./**/*.chat. If flag is omitted, stdin will be used. 
                               If an output directory is not present (-o), it will default the output to the current working directory.

  -h, --help                   Chatdown command help

  -o, --out=out  Path to the directory where the output of the multiple chat file processing (-o) will be
                               placed.

  -p, --prefix                 Prefix stdout with package name.

  -s, --static                 Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --in=./path/to/file/sample.chat
     $ bf chatdown --in ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static
```

_See code: [src/commands/chatdown.ts](https://github.com/Microsoft/chatdown/blob/v0.0.0/src/commands/chatdown.ts)_
<!-- commandsstop -->
