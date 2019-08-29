@microsoft/bf-luis
==================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis.svg)](https://npmjs.org/package/@microsoft/bf-luis)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-luis.svg)](https://npmjs.org/package/@microsoft/bf-luis)
[![License](https://img.shields.io/npm/l/@microsoft/bf-luis.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-luis
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-luis/1.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf luis:transform:tolu [FILE]`](#bf-luistransformtolu-file)
* [`bf luis:transform:tomodel`](#bf-luistransformtomodel)

## `bf luis:transform:tolu [FILE]`

describe the command here

```
USAGE
  $ bf luis:transform:tolu [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/luis/transform/tolu.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/transform/tolu.ts)_

## `bf luis:transform:tomodel`

describe the command here

```
USAGE
  $ bf luis:transform:tomodel

OPTIONS
  --in=in                          Source .lu file
  --lu_folder=lu_folder            Source folder that contains .lu file(s)
  --luis_culture=luis_culture      Lang code for the LUIS application
  --luis_desc=luis_desc            Text describing the LUIS applicaion
  --luis_name=luis_name            Name of the LUIS application
  --luis_versionId=luis_versionId  Version ID of the LUIS application
  --out=out                        Output file name
  --out_folder=out_folder          Output folder name
  --subfolder                      Indicates if sub-folders need to be considered to file .lu file(s)
```

_See code: [src/commands/luis/transform/tomodel.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/transform/tomodel.ts)_
<!-- commandsstop -->
