@microsoft/bf-orchestrator-cli
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-orchestrator-cli.svg)](https://npmjs.org/package/@microsoft/bf-orchestrator-cli)

Orchestrator CLI is a replacement of the [Dispatch CLI](https://github.com/microsoft/botbuilder-tools/tree/master/packages/Dispatch). Create and evaluate Orchestrator model used to arbitrate across multiple bot modules such as LUIS models, QnA knowledge bases and others.

# Relevant docs
- [interactive command document][1]
- [test command document][2]

# Commands

<!-- commands -->

* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:add`](#bf-orchestratoradd)
* [`bf orchestrator:build`](#bf-orchestratorbuild)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:basemodel:get`](#bf-orchestratorbasemodelget)
* [`bf orchestrator:basemodel:list`](#bf-orchestratorbasemodellist)
* [`bf orchestrator:interactive`](#bf-orchestratorinteractive)
* [`bf orchestrator:query`](#bf-orchestratorquery)
* [`bf orchestrator:test`](#bf-orchestratortest)

## `bf orchestrator`

Display Orchestrator CLI available commands

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src\commands\orchestrator\index.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/index.ts)_


## `bf orchestrator:add`

Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file.

```
USAGE
  $ bf orchestrator:add

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator add command help.
  -i, --in=in                       Path to example file (.lu/.qna/.json/.blu).
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Path where generated orchestrator example file will be placed.
                                    Default to current working directory.
  -t, --type                        Type of input (luis/qna/file).

  --id                              LUIS app id or QnAMaker kb id if type = luis/qna.                        
  --key                             LUIS authoring key or QnAMaker service key if type = luis/qna.
  --endpoint                        LUIS/QnAMaker endpoint.
  --routingName                     Routing name, default to file name.
  --dialog                          Generate multi language or cross train Orchestrator recognizers.

EXAMPLE

    $ bf orchestrator:add 	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/	
    $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
    $ bf orchestrator:add -t luis --id LUIS_APP_ID --version LUIS_APP_VERSION --key LUIS_KEY --routingname l_Weather --endpoint 
    $ bf orchestrator:add -t qna --id QNA_KB  --key QNA_KB_SERVICE_KEY --routingname q_kb
```

_See code: [src\commands\orchestrator\add.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/add.ts)_

## `bf orchestrator:build`

Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in input folder.

```
USAGE
  $ bf orchestrator:build

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator build command help.
  -i, --in=in                       Path to lu file or folder with lu files.
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Path where Orchestrator snapshot/dialog file(s) will be placed. 
                                    Default to current working directory.
  --luConfig                        Path to luConfig file.
  --dialog                          Generate multi language or cross train Orchestrator recognizers.

EXAMPLE

    $ bf orchestrator:build	
    $ bf orchestrator:build --in ./path/to/files/ --out ./path/to/output/	--dialog
```

_See code: [src\commands\orchestrator\build.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/build.ts)_


## `bf orchestrator:create`

Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules.

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator create command help
  -i, --in=in                       The path to source label files from where orchestrator example file will
                                    be created from. Default to the current working directory.
                                    Valid file extensions are lu, .qna, .json and .tsv.
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Path where generated orchestrator example file will be placed.
                                    Default to current working directory.
  --hierarchical                    Add hierarchical labels based on lu/qna file name.

EXAMPLE

       $ bf orchestrator:create 
       $ bf orchestrator:create --in ./path/to/file/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/base/model/directory
```

_See code: [src\commands\orchestrator\create.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/create.ts)_

## `bf orchestrator:basemodel:get`

Gets Orchestrator base model

```
USAGE
  $ bf orchestrator:basemodel:get

OPTIONS
  -o, --out        Optional. Path to where Orchestrator base model will be saved to. Default to current working directory.
  --versionId      Optional. Base model version to download -- reference basemodel:list output for options.  If not specified, default model will be downloaded.
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\basemodel\get.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/basemodel/get.ts)_


## `bf orchestrator:basemodel:list`

Lists all Orchestrator base model versions

```
USAGE
  $ bf orchestrator:basemodel:list

OPTIONS
  -r, --raw        Optional. Raw output
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\basemodel\list.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/basemodel/list.ts)_

## `bf orchestrator:interactive`

```
USAGE
  $ bf orchestrator:interactive --out=<analysis-and-output-folder> --model=<base-model-and-config-folder>
    [--entityModel=<entity-base-model-and-config-folder>]
    [--in=<previous-generated-blu-training-set-file>]

OPTIONS
  -d, --debug                       Print detailed debugging information during execution.
  -h, --help                        Orchestrator 'interactive' command help.
  -i, --in=in                       Optional path to a previously created Orchestrator .blu file.
                                    This argument is optional users can use the 'interactive' command
                                    to start an Orchestrator snapshot from scratch. The 'n' commandlet
                                    can save the utterance labels into a snapshot (.blu) file.
  -m, --model=model                 Directory or a config file hosting Orchestrator base model files.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Directory where analysis and output files will be placed.

```

_See code: [src\commands\orchestrator\interactive.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/interactive.ts)_

## `bf orchestrator:query`

Query Orchestrator base model and a snapshot/train file.

```
USAGE
  $ bf orchestrator:query --model=<base-model-and-config-folder> --query=<query>
    [--entityModel=<entity-base-model-and-config-folder>]
    [--in=<previous-generated-blu-training-set-file>]
    [--limit=<limit-of-number-of-predictions>]

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator query command help
  -i, --in=in                       Path to previously created Orchestrator snapshot (.blu file).
  -q, --query=query                 Query string to predict.
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -l, --limit=#                     (optional) Limit of number of predictions.

EXAMPLE
       $ bf orchestrator:query --in ./path/to/blufile/ --query /query/string/to/predict 
       $ bf orchestrator:query --in ./path/to/blufile/ --query /query/string/to/predict --model ./path/to/base/model/directory
```

_See code: [src\commands\orchestrator\query.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/query.ts)_


## `bf orchestrator:test`

```
_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

```

_See code: [src\commands\orchestrator\test.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

<!-- commandsstop -->

# Orchestrator CLI settings file
Most of bf orchestrator commands create or update a settings file (orchestrator.json) with base model and snapshot file path so that those values could be optional for subsequent commands.  For example, after ```bf orchestrator:basemodel:get --out <BASE_MODEL_PATH>```, subsequent command (ie bf orchestrator:create) will no longer need to supply the "--model" parameter.

[1]:./docs/interactive-command.md
[2]:./docs/test-command.md
