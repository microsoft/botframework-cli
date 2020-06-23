@microsoft/bf-orchestrator
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

# Commands
<!-- commands -->
* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:nlr`](#bf-orchestratornlr)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:evaluate`](#bf-orchestratorevaluate)
* [`bf orchestrator:finetune`](#bf-orchestratorfinetune)
* [`bf orchestrator:predict`](#bf-orchestratorpredict)
* [`bf orchestrator:test`](#bf-orchestratortest)
* [`bf orchestrator:build`](#bf-orchestratorbuild)

## `bf orchestrator`

Display Orchestrator CLI available commands

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src\commands\orchestrator\index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\index.ts)_

## `bf orchestrator:nlr`

describe the command here

```
USAGE
  $ bf orchestrator:nlr

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\orchestrator\nlr.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\nlr.ts)_


## `bf orchestrator:create`

Create orchestrator example file from .lu/.qna files, which represent bot modules

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -d, --debug
  -f, --force        If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help         Orchestrator create command help

  -i, --in=in        The path to source label files from where orchestrator example file will be created from. Default
                     to current working directory.

  -m, --model=model  Path to Orchestrator model.

  -o, --out=out      Path where generated orchestrator example file will be placed. Default to current working
                     directory.

  --hierarchical     Add hierarchical labels based on lu/qna file name.

EXAMPLE

       $ bf orchestrator:create 
       $ bf orchestrator:create --in ./path/to/file/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model
```

_See code: [src\commands\orchestrator\create.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\create.ts)_

## `bf orchestrator:evaluate`

Create orchestrator evaluation report from .lu/.qna files

```
USAGE
  $ bf orchestrator:evaluate

OPTIONS
  -d, --debug
  -h, --help         show CLI help

  -i, --in=in        The path to source label files from where orchestrator example file will be created from. Default
                     to current working directory.

  -m, --model=model  Path to Orchestrator model.

  -o, --out=out      Path where generated orchestrator example file will be placed. Default to current working
                     directory.
```

_See code: [src\commands\orchestrator\evaluate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\evaluate.ts)_

## `bf orchestrator:finetune`

Manage Orchestrator fine tuning.

```
USAGE
  $ bf orchestrator:finetune COMMAND

ARGUMENTS
  COMMAND  The "command" is the first mandatory argument.  This can be "status", "put" or "get".
           status - Status of the last finetune training job.
           put    - Put finetune training example data to improve orchestrator.
           get    - Get the model for completed finetune job.

OPTIONS
  -d, --debug
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help                   Orchestrator finetune command help

  -i, --in=in                  If --input is provided, the path to .lu/.qna files from where orchestrator finetune
                               example file will be created from. Default to current working directory.

  -l, --logformat=logformat    (Optional) If --logformat is provided, overrides the log file formats (Supported:
                               labelText, dteData).

  -m, --model=model            Path to Orchestrator model.

  -n, --nlrversion=nlrversion  (Optional) If --nlrversion is provided, overrides the nlr version (Supported: 4.8.0,
                               4.8.0-multilingual).

  -o, --out=out                If --get flag is provided, the path where the new orchestrator finetune job will be
                               created. Default to current working directory.

EXAMPLE

       $ bf orchestrator:finetune status
       $ bf orchestrator:finetune put --in ./path/to/file/ [--nlrversion <model version> | --logformat <logformat>]
       $ bf orchestrator:finetune get [--out ./path/to/output/]
```

_See code: [src\commands\orchestrator\finetune.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\finetune.ts)_

## `bf orchestrator:predict`

Returns score of given utterance using previously created orchestrator examples

```
USAGE
  $ bf orchestrator:predict

OPTIONS
  -d, --debug
  -h, --help         show CLI help

  -i, --in=in        The path to source label files from where orchestrator example file will be created from. Default
                     to current working directory.

  -m, --model=model  Path to Orchestrator model.

  -o, --out=out      Path where generated orchestrator example file will be placed. Default to current working
                     directory.
```

_See code: [src\commands\orchestrator\predict.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\predict.ts)_

## `bf orchestrator:test`

Run orchestrator test evaluation using given test file

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -d, --debug
  -h, --help         show CLI help
  -i, --in=in        The path to source label file from where orchestrator example file will be created from.
  -m, --model=model  Path to Orchestrator model.

  -o, --out=out      Path where generated orchestrator example file will be placed. Default to current working
                     directory.

  -t, --test=test    The path to test label file from where orchestrator example file will be created from.
```

_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\test.ts)_


## `bf orchestrator:build`

describe the command here

```
USAGE
  $ bf orchestrator:build

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\orchestrator\build.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\build.ts)_
<!-- commandsstop -->

