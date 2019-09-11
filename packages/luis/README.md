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
* [`bf luis:convert`](#bf-luisconvert)
* [`bf luis:translate`](#bf-luistranslate)
* [`bf qnamaker:convert [FILE]`](#bf-qnamakerconvert-file)
* [`bf qnamker:convert`](#bf-qnamkerconvert)

## `bf luis:convert`

Convert .lu file(s) to a LUIS application JSON model or vice versa

```
USAGE
  $ bf luis:convert

OPTIONS
  --culture=culture              Lang code for the LUIS application
  --description=description      Text describing the LUIS applicaion
  --in=in                        (required) Source .lu file(s) or LUIS application JSON model
  --log                          Enables log messages
  --name=name                    Name of the LUIS application
  --out=out                      Output file or folder name. If not specified stdout will be used as output
  --recurse                      Indicates if sub-folders need to be considered to file .lu file(s)
  --schemaversion=schemaversion  Schema version of the LUIS application
  --sort                         When set, intent, utterances, entities are alphabetically sorted in .lu files
  --versionid=versionid          Version ID of the LUIS application
```

_See code: [src/commands/luis/convert.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/convert.ts)_

## `bf luis:translate`

Translate given LUIS application JSON model or lu file(s)

```
USAGE
  $ bf luis:translate

OPTIONS
  --in=in                                    (required) Source .lu file(s) or LUIS application JSON model
  --out=out                                  Output file or folder name. If not specified stdout will be used as output
  --recurse                                  Indicates if sub-folders need to be considered to file .lu file(s)
  --srclang=srclang                          Source lang code. Auto detect if missing.
  --tgtlang=tgtlang                          (required) Comma separated list of target languages.
  --translate_comments=translate_comments    When set, machine translate comments found in .lu or .qna file
  --translate_link_text=translate_link_text  When set, machine translate link description in .lu or .qna file
  --translatekey=translatekey                (required) Machine translation endpoint key.
```

_See code: [src/commands/luis/translate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/translate.ts)_

## `bf qnamaker:convert [FILE]`

describe the command here

```
USAGE
  $ bf qnamaker:convert [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/qnamaker/convert.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/convert.ts)_

## `bf qnamker:convert`

describe the command here

```
USAGE
  $ bf qnamker:convert

OPTIONS
  --alterations  Indicates if files is QnA Alterations
  --in=in        (required) Source .qna file(s) or QnA KB JSON file
  --log          Enables log messages
  --name=name    Name of the QnA KB
  --out=out      Output file or folder name. If not specified stdout will be used as output
  --recurse      Indicates if sub-folders need to be considered to file .qna file(s)
  --sort         When set, questions collections are alphabetically sorted are alphabetically sorted in .lu files
```

_See code: [src/commands/qnamker/convert.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamker/convert.ts)_
<!-- commandsstop -->
