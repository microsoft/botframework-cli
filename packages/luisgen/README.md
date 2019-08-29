@microsoft/bf-luisgen
=====================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luisgen.svg)](https://npmjs.org/package/@microsoft/bf-luisgen)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-luisgen.svg)](https://npmjs.org/package/@microsoft/bf-luisgen)
[![License](https://img.shields.io/npm/l/@microsoft/bf-luisgen.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-luisgen
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-luisgen/1.0.0 darwin-x64 node-v12.3.1
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf luis:transform:tocs FILE CLASSNAME`](#bf-luistransformtocs-file-classname)
* [`bf luis:transform:tots [FILE]`](#bf-luistransformtots-file)

## `bf luis:transform:tocs FILE CLASSNAME`

describe the command here

```
USAGE
  $ bf luis:transform:tocs FILE CLASSNAME

OPTIONS
  -d, --outFolder=outFolder  Output file name
  -i, --in=in                Source LUIS application JSON file .OR. source .lu file
  -l, --folder=folder        Source folder that contains .lu file(s)
  -o, --out=out              Output file name
  -s, --subFolder            Indicates if sub-folders need to be considered to file .lu file(s)
```

_See code: [src/commands/luis/transform/tocs.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/transform/tocs.ts)_

## `bf luis:transform:tots [FILE]`

describe the command here

```
USAGE
  $ bf luis:transform:tots [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/luis/transform/tots.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/transform/tots.ts)_
<!-- commandsstop -->
