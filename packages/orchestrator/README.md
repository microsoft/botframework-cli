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
* [`bf orchestrator:basemodel:get`](#bf-orchestratorbasemodelget)
* [`bf orchestrator:basemodel:list`](#bf-orchestratorbasemodellist)
* [`bf orchestrator:build`](#bf-orchestratorbuild)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
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

_See code: [src/commands/orchestrator/index.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/index.ts)_

## `bf orchestrator:add`

Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file.

```
USAGE
  $ bf orchestrator:add

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -f, --force                    If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help                     Orchestrator add command help
  -i, --in=in                    Path to example file (.lu/.qna/.json/.blu).
  -k, --key=key                  LUIS authoring key or QnAMaker service key if type = luis/qna.
  -m, --model=model              Path to Orchestrator model directory.

  -o, --out=out                  Path where generated Orchestrator example file will be placed. Default to current
                                 working directory.

  -t, --type=type                Type of input (luis/qna/file).

  -v, --version=version          Applies only for type=luis, LUIS app version

  --dialog                       Generate multi language or cross train Orchestrator recognizers.

  --endpoint=endpoint            LUIS/QnAMaker endpoint.

  --id=id                        LUIS app id or QnAMaker kb id if type = luis/qna.

  --routingName=routingName      Routing name, default to file name.

EXAMPLE
	
       $ bf orchestrator:add 	
       $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/	
       $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/	
       $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
       $ bf orchestrator:add -t luis --id LUIS_APP_ID --version LUIS_APP_VERSION --key LUIS_KEY --routingname l_Weather 
  --endpoint 
       $ bf orchestrator:add -t qna --id QNA_KB  --key QNA_KB_SERVICE_KEY --routingname q_kb
```

_See code: [src/commands/orchestrator/add.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/add.ts)_

## `bf orchestrator:basemodel:get`

Gets Orchestrator base model

```
USAGE
  $ bf orchestrator:basemodel:get

OPTIONS
  -d, --debug
  -h, --help             Orchestrator basemodel:get command help

  -o, --out=out          Optional. Path to where Orchestrator base model will be saved to. Default to current working
                         directory.

  -v, --verbose          Enable verbose logging

  --getEntity            Optional. Download default entity model at the same time, which will be placed in the entity
                         subfolder of the output path.

  --versionId=versionId  Optional. Base model version to download -- reference basemodel:list output for options.  If
                         not specified, default model will be downloaded.
```

_See code: [src/commands/orchestrator/basemodel/get.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/basemodel/get.ts)_

## `bf orchestrator:basemodel:list`

Lists all Orchestrator base model versions

```
USAGE
  $ bf orchestrator:basemodel:list

OPTIONS
  -h, --help  Orchestrator basemodel:list command help
  -r, --raw   Optional. Raw output
  --all       Optional. Display all models
```

_See code: [src/commands/orchestrator/basemodel/list.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/basemodel/list.ts)_

## `bf orchestrator:build`

Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in input folder.

```
USAGE
  $ bf orchestrator:build

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -h, --help                     Orchestrator build command help
  -i, --in=in                    Path to lu file or folder with lu files.
  -m, --model=model              Path to Orchestrator model.

  -o, --out=out                  Path where Orchestrator snapshot/dialog file(s) will be placed. Default to current
                                 working directory.

  --dialog                       Generate multi language or cross train Orchestrator recognizers.

  --luconfig=luconfig            Path to luconfig.json.
```

_See code: [src/commands/orchestrator/build.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/build.ts)_

## `bf orchestrator:create`

Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -h, --help                     Orchestrator create command help

  -i, --in=in                    The path to source label files from where orchestrator example file will be created
                                 from. Default to current working directory.

  -m, --model=model              Path to Orchestrator base model directory.

  -o, --out=out                  Path where generated Orchestrator snapshot file will be placed. Default to current
                                 working directory.

  --hierarchical                 Add hierarchical labels based on .lu/.qna file name.  Resulting snapshot file will
                                 contain.lu/.qna file name as labels instead of the intents defined in the .lu file(s).

  --refresh                      Refetch LUIS app(s)/QnAMaker kb(s) previously added and recreate Orchestrator snapshot.
```

_See code: [src/commands/orchestrator/create.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/create.ts)_

## `bf orchestrator:interactive`

Real-time interaction with Orchestrator model and analysis. Can return score of given utterance using previously created orchestrator examples

```
USAGE
  $ bf orchestrator:interactive

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -h, --help                     show CLI help
  -l, --in=in                    Optional path to a previously created Orchestrator .blu file.
  -m, --model=model              (required) Directory or hosting Orchestrator config and base model files.
  -o, --out=out                  Optional Directory where analysis and output files will be placed.

EXAMPLE

       $ bf orchestrator:interactive --in=./path/to/snapshot/file --out=./path/to/output/folder/ 
  --model=./path/to/model/directory
```

_See code: [src/commands/orchestrator/interactive.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/interactive.ts)_

## `bf orchestrator:query`

Query Orchestrator base model and a snapshot/train file

```
USAGE
  $ bf orchestrator:query

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -h, --help                     show CLI help
  -i, --in=in                    (required) Path to a previously created Orchestrator snapshot (.blu file).

  -l, --limit=limit              (optional) Limit of number of predictions. Default to 3. Less or equal to 0 for listing
                                 all predictions.

  -m, --model=model              (required) Path to Orchestrator base model directory.

  -q, --query=query              (required) Query string to predict.

EXAMPLE

       $ bf orchestrator:query --in=./path/to/snapshot/file --query=hi --model=./path/to/base/model/directory
```

_See code: [src/commands/orchestrator/query.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/query.ts)_

## `bf orchestrator:test`

The "test" command can operate in three modes: test, evaluation, assessment.

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -d, --debug
  -e, --entityModel=entityModel  Path to Orchestrator entity base model directory.
  -h, --help                     show CLI help
  -i, --in=in                    (required) Path to a previously created Orchestrator .blu file.

  -m, --model=model              Optional directory for hosting Orchestrator config and base model files, not needed for
                                 the "assessment" mode.

  -o, --out=out                  (required) Directory where analysis and output files will be placed.

  -p, --prediction=prediction    Optional path to a prediction label file, or comma-separated paths to a collection of
                                 (e.g., crosss-valiaton) files.

  -t, --test=test                Optional path to a test file. This option enable the "test" mode.

DESCRIPTION
  1) Test mode: test a collection of utterance/label samples loaded from a test file against
         a previously generated Orchestrator .blu snapshot/train file,
         and create a detailed train/test evaluation report.
     2) Evaluation mode: create an leave-one-out cross validation (LOOCV) evaluation report
         on a previously generated Orchestrator .blu snapshot/train file.
     3) Assessment mode: assess a collection of utterance/label predictions against their ground-truth labels and
         create an evaluation report. This mode can evaluate predictions produced by
         other NLP or machine learning systems. There is no need for an Orchestrator base model.
         Notice that, this mode is generic and can apply to evaluate any ML systems, learners, models,
         and scenarios if a user can carefully construct the prediction and grounf-truth files by
         the specification detailed below.
         Essentially the key to a NLP data instance is a text (utterance, sentence, query, document, etc.), which
         is the basis of all the features feeding to a ML model. For other ML systems, the key to
         a data instance can be built directly from the features and put in place of text
         in a prediction and ground-truth file.

     The 'test' mode is activated if there is a '--test' argument set for a test file.
     The 'assessment' mode is activated if there is a '--prediction' argument set for a prediction file.
     If there is no '--test' or '--prediction' arguments, then "test" command runs on the 'evaluation' mode.

EXAMPLE

       $ bf orchestrator:test --in=./path/to/snapshot/file --test=./path/to/test/file/ --out=./path/to/output/ 
  --model=./path/to/model/directory
       $ bf orchestrator:test --in=./path/to/ground-truth/file --prediction=./path/to/prediction/file 
  --out=./path/to/output/folder/
       $ bf orchestrator:test --in=./path/to/snapshot/file --out=./path/to/output/folder/ 
  [--model=./path/to/model/directory]
```

_See code: [src/commands/orchestrator/test.ts](https://github.com/microsoft/botframework-cli/src/commands/orchestrator/test.ts)_
<!-- commandsstop -->

# Orchestrator CLI settings file
Most of bf orchestrator commands create or update a settings file (orchestrator.json) with base model and snapshot file path so that those values could be optional for subsequent commands.  For example, after ```bf orchestrator:basemodel:get --out <BASE_MODEL_PATH>```, subsequent command (ie bf orchestrator:create) will no longer need to supply the "--model" parameter.

[1]:./docs/interactive-command.md
[2]:./docs/test-command.md
