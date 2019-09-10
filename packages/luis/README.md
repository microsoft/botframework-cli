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
* [`bf luis:transform:tolu`](#bf-luistransformtolu)
* [`bf luis:transform:tomodel`](#bf-luistransformtomodel)
* [`bf luis:translate [FILE]`](#bf-luistranslate-file)
* [`bf luis:translate:tolu`](#bf-luistranslatetolu)
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
  --name=name                    Name of the LUIS application
  --out=out                      Output file or folder name. If not specified stdout will be used as output
  --recurse                      Indicates if sub-folders need to be considered to file .lu file(s)
  --schemaversion=schemaversion  Schema version of the LUIS application
  --versionid=versionid          Version ID of the LUIS application
```

_See code: [src/commands/luis/convert.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/convert.ts)_

## `bf luis:transform:tolu`

Transformation from a given LUIS application JSON model to a .lu file.

```
USAGE
  $ bf luis:transform:tolu

OPTIONS
  --LUIS_File=LUIS_File    (required) Source LUIS application JSON file
  --lu_File=lu_File        Output file name
  --out_folder=out_folder  Output folder name
```

_See code: [src/commands/luis/transform/tolu.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/transform/tolu.ts)_

## `bf luis:transform:tomodel`

Transformation from one or more source .lu file(s) to a LUIS application JSON model.

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

## `bf luis:translate [FILE]`

describe the command here

```
USAGE
  $ bf luis:translate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/luis/translate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/translate.ts)_

## `bf luis:translate:tolu`

Translate given input and write out .lu file(s)

```
USAGE
  $ bf luis:translate:tolu

OPTIONS
  --in=in                        Source LUIS application JSON file .OR. source .lu file
  --lu_folder=lu_folder          Source folder that contains .lu file(s)
  --out_folder=out_folder        Output folder name
  --src_lang=src_lang            Source lang code. Auto detect if missing.
  --subfolder                    Indicates if sub-folders need to be considered to file .lu file(s)
  --to_lang=to_lang              (required) Comma separated list of target languages.
  --translate_comments           When set, machine translate comments found in .lu or .qna file
  --translate_key=translate_key  (required) Machine translation endpoint key.
  --translate_link_text          When set, machine translate link description in .lu or .qna file
```

_See code: [src/commands/luis/translate/tolu.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/translate/tolu.ts)_

## `bf qnamker:convert`

describe the command here

```
USAGE
  $ bf qnamker:convert

OPTIONS
  --alterations  Indicates if files is QnA Alterations
  --in=in        (required) Source .qna file(s) or QnA KB JSON file
  --name=name    Name of the QnA KB
  --out=out      Output file or folder name. If not specified stdout will be used as output
  --recurse      Indicates if sub-folders need to be considered to file .qna file(s)
```

_See code: [src/commands/qnamker/convert.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamker/convert.ts)_
<!-- commandsstop -->
