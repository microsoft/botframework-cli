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

CLI to create encoded representation of utterances in lu or tsv files, evaluate and test training and test data and finetune an orchestrator model.

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src/commands/orchestrator/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/index.ts)_

## `bf orchestrator:create`

Creates a file with labels, utterances and embeddings (encoded representation of the utterances) given lu/qna/tsv files.  This file could then be used as Orchestrator model examples for bot runtime.

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

Create orchestrator evaluation report files from a .txt/.tsv input file.

```
USAGE
  $ bf orchestrator:evaluate

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Input file
  -o, --out                          Output folder for evaluation result files
 
EXAMPLE

       $ bf orchestrator:evaluate --in {input file} --out {output folder}

NOTES:

  An input .txt/.tsv file should have at least 2 TAB-delimited columns, where the first column
  is for intents and second utterances.
  The input file is loaded into Orchestrator, where utterances are processed and featurized
  each into an embedding vector. The evaluation process is LOOCV (leave-one-out cross validation, see https://en.wikipedia.org/wiki/Cross-validation_(statistics)). I.e., the evaluation process
  iterates through every input utterance, find the closest examples for it in terms of
  semantic embedding, and compare their intent labels whether they match or not.

  After a successful run, the output folder will have 3 files:
    > orchestrator_loocv_evaluation.txt: evaluation report for each intent label and overall.
    > orchestrator_loocv_scores.txt: score output in TSV format, where the columns are:
      Labeled Intent
      Weight
      Utterance
      Predicted Intent
      Prediction Score
      Number of prediction scores
      Sesies of scores for every intent label
    > orchestrator_loocv_score_labels.txt: a single TAB-delimited line listing intent labels.
      The labels are listed as the same order of their scores in 'orchestrator_loocv_scores.txt'

```

_See code: [src/commands/orchestrator/evaluate.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/evaluate.ts)_

## `bf orchestrator:test`

Run orchestrator test evaluation using a given source .lu/.txt/.tsv/.blu file against a test .lu/.txt/.tsv file.

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Input file
  -t, --test                         Test file
  -o, --out                          Output folder
 
EXAMPLE

       $ bf orchestrator:test --in {input file} --test {test file} --out {output folder}
```

NOTES:

  The 'test' command is similar to 'evaluate', but against an independent test fie of intent and
  utterances instead.
  The 'test' process and output files are also simialr to those produced by the 'evaluate' command:
    > orchestrator_test_evaluation.txt: evaluation report for each intent label and overall.
    > orchestrator_test_scores.txt: score output in TSV format, where the columns are:
      Labeled Intent
      Weight
      Utterance
      Predicted Intent
      Prediction Score
      Number of prediction scores
      Sesies of scores for every intent label
    > orchestrator_test_score_labels.txt: a single TAB-delimited line listing intent labels.
      The labels are listed as the same order of their scores in 'orchestrator_test_scores.txt'

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

User can interactively test an input utterance given a source .lu/.txt/.tsv/.blu file

```
USAGE
  $ bf orchestrator:predict

OPTIONS
  -h, --help                         Show CLI help
  -i, --in                           Path to source label files


EXAMPLE

       $ bf orchestrator:predict --in {input file}
```

_See code: [src/commands/orchestrator/predict.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/orchestrator/src/commands/orchestrator/predict.ts)_
