@microsoft/bf-orchestrator
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

# Commands
<!-- commands -->
* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:evaluate`](#bf-orchestratorevaluate)
* [`bf orchestrator:test`](#bf-orchestratortest)
* [`bf orchestrator:predict`](#bf-orchestratorpredict)
* [`bf orchestrator:finetune`](#bf-orchestratorfinetune)

## `bf orchestrator`

CLI to create encoded representation of utterances in lu files, evaluate and test training and test data and finetune an orchestrator model.

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src/commands/orchestrator/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/index.ts)_

## `bf orchestrator:create`

Creates a file with labels, utterances and embeddings (encoded representation of the utterances) given lu/qna files.  This file could then be used as Orchestrator model examples for bot runtime.

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -h, --help                           Show CLI help
  --in                                 Input file or folder
  --out                                Output folder
  --hierarchical                       Add hierarchical labels, true by default
 
EXAMPLE

       $ bf orchestrator:create --in {input folder} --out {output folder}
       $ bf orchestrator:create --in {input folder} --out {output folder} --hierarchical false
```

_See code: [src/commands/orchestrator/create.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/create.ts)_

## `bf orchestrator:evaluate`

Create orchestrator evaluation report from .lu/.qna files

```
USAGE
  $ bf orchestrator:evaluate

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Input folder
  -o, --out                          Output folder
 
EXAMPLE

       $ bf orchestrator:evaluate --in {input folder} --out {output folder}
```

_See code: [src/commands/orchestrator/evaluate.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/evaluate.ts)_

## `bf orchestrator:test`

Run orchestrator test evaluation using given test file

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Input folder
  -o, --out                          Output folder
 
EXAMPLE

       $ bf orchestrator:test --in {input folder} --out {output folder}
```

_See code: [src/commands/orchestrator/test.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/test.ts)_

## `bf orchestrator:finetune`

Manage Orchestrator fine tuning

```
USAGE
  $ bf orchestrator:finetune

OPTIONS
  -h, --help                         Show CLI help
  --command			     This can be "status", "put" or "get"
  -i, --in                           Input folder
  -o, --out                          Output folder
 
EXAMPLE

        $ bf orchestrator:finetune status
        $ bf orchestrator:finetune put --in {input folder}
        $ bf orchestrator:finetune get --out {output folder}
```

_See code: [src/commands/orchestrator/finetune.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/finetune.ts)_

## `bf orchestrator:predict`

Returns score of given utterance using previously created orchestrator examples

```
USAGE
  $ bf orchestrator:predict

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Path to source label files
  -o, --out                          Output folder


EXAMPLE

       $ bf orchestrator:predict --in {input folder} --out {output folder}
```

_See code: [src/commands/orchestrator/predict.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/predict.ts)_
