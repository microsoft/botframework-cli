@microsoft/bf-orchestrator
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

# Prerequisite
- [Node.js](https://nodejs.org/) version 10 or higher
- @microsoft/botframework-cli
```
$ npm install -g @microsoft/botframework-cli
```
- For installation on Linux Ubuntu LTS, run the following after package install:
```
sudo apt-get -y install libicu-dev
cd <install location>
ln -s libicudata.so /usr/lib/x86_64-linux-gnu/libicudata.so.60  
ln -s libicuuc.so /usr/lib/x86_64-linux-gnu/libicuuc.so.60
ln -s libicui18n.so /usr/lib/x86_64-linux-gnu/libicu18n.so.60
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd)
```
- For installation on Mac:
```
brew install icu4c
```

# Installation
To install:

```
bf plugins:install @microsoft/bf-orchestrator-cli@beta
```

# Commands

<!-- commands -->
* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:evaluate`](#bf-orchestratorevaluate)
* [`bf orchestrator:finetune COMMAND`](#bf-orchestratorfinetune-command)
* [`bf orchestrator:nlr`](#bf-orchestratornlr)
* [`bf orchestrator:predict`](#bf-orchestratorpredict)
* [`bf orchestrator:test`](#bf-orchestratortest)

## `bf orchestrator`

Display Orchestrator CLI available commands

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src\commands\orchestrator\index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\index.ts)_

## `bf orchestrator:assess`

Create an evaluation report on a prediction file against a ground-truth file.

```
USAGE
  $ bf orchestrator:assess

OPTIONS
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'assess' command help.
  -i, --in=in                     Path to a ground-truth .json file.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --prediction=prediction     Path to a prediction .json file.

DESCRIPTION

  The "assess" command compares a prediction file against a ground-truth file, then it
  generates two detailed evaluation reports, one for intent prediction, and the other entity.

  The two input JSON files each contains a JSON array following the schema and example shown below.
  In the array, each JSON entry has a "text" attribute for an utterance. The utterance can have an array pf
  "intents" labels. The utterance can also has an "entities" array of entity JSON objects.
  Each entity contains an "entity" attribute for its name, a "startPos" attribute indicating the offset
  of the entry in the utterance, and a "endPos" attribute for the final location of the entity
  in the utterance. The entity can have some optional fields, such as a "text" attribute
  for entity mentions, however this attribute is only for debugging purpose and not needed.

    [
    {
      "text": "I want to see Medal for the General",
      "intents": [
        "None"
      ],
      "entities": [
        {
          "entity": "movie_name",
          "startPos": 14,
          "endPos": 34,
          "text": "Medal for the General"
        }
      ]
    },
    ...
    ]

  The "assess" command reads the input ground-truth and prediction file and generates
  distributions of the utterances and their labels. It also groups each utterance's
  ground-truth and prediction labels together, compares them, determines if
  a prediction is in the ground-truth or vice versa. At then end the "assess" command
  will generate HTML reports.

  The reports have following sections:

  >  Ground-Truth Label/Utterancce Statistics - ground-truth label and utterance statistics and distributions.
  >  Ground-Truth Duplicates - tables of ground-truth utterances with multiple labels and exact utterance/label duplicates.
  >  Prediction Label/Utterancce Statistics - prediction label and utterance statistics and distributions.
  >  Prediction Duplicates - tables of prediction utterances with multiple labels and exact utterance/label duplicates.
  >  Misclassified - utterances with false-positive and false-negative predictions.
  >  Metrics - confisuon matrix metrics.

  In the Metrics section, Orchestrator "assess" command first generates a series of per-label
  binary confusion matrices.
  Each confusion matrix is comprised of 4 cells: true positive (TP), false positive (FP), true negative (TN),
  and false negative (FN). Using these 4 cells, Orchestrator can compute several other confusion
  matrix metrics, including precision, recall, F1, accuracy, and support, etc.
  Please reference https://en.wikipedia.org/wiki/Confusion_matrix for details.

  Notice that the logic constructing a per-label confusion matrix is a little diffenent between intent
  and entity labels. Here is the logic outline:

  Intent - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth intent array and prediction intent array. If a label is in
        both arrays, then the utterance is a TP for this label's confusion matrix. If a label only exists in
        the prediction array, then it's a FP for the predicted label confusion matrix. Similarly
        if a label only exists in the ground-truth array, then it's a FN for the ground-truth label confusion
        matrix. For any other labels, the utterance is a TN for their confusion matrices.

  Entity - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth entity array and prediction entity array.
        If an entity mention exists in both array, then it's a TP for the entity's confusion matrix.
        FP and FN logic is similar to those of Intent. However, there is no TN for evaluating entity mentions
        as there are too many possible entity candidates for an utterance, while there is only one or a small
        number of intent labels for an utterance.

  By the way, sometimes an erroneous prediction file may contain some labeled utterances not in the ground-truth
  file. These utterances are called spurious, and they will be listed under the "Prediction Duplicates" tab
  in an evaluation report. 

  Once the serial of per-label binary confusion matrices are built, there would be plenty of
  per-label metrics, which can be consolidated by several averaging approaches.
  An evaluation report's "Metrics" tab contains several of them:

  0) Micro-Average - Orchestrator is essentially a multi-class model, so evaluation can also be expressed
        as a multi-class confusion matrix, besides the series of binary per-label confusion matrices
        mentioned above. In such a multi-class confusion matrix, every prediction is a positive,
        there is no negative. The diagonal cells of this multi-class confusion matrix are
        the TPs. The micro-average metric is the ratio of the sum of TPs over total. Total is the sum
        of all the supports (positives) from the series of binary confusion matrices.
  1) Summation Micro-Average - the second way condensing the series of binary confusion matrices into one by
        summing up theie TP, FP, TN, FN numbers. These 4 summations are then used to calculate precision,
        recall, F1, and accuracy.
  2) Macro-Average - another way condensing the series of binary confusion matrices simply takes
        arithmetic average of their every metrics individually. The denominator for computing the averages
        is the number of labels in the ground-truth set.
  3) Summation Macro-Average - While micro-average takes a simple arithmetic average for every metrics.
        Summation macro-average only takes the average on the 4 confusion matrix cells. Precision, recall,
        F1, and accuracy are then calculated by the average 4 cells.
  4) Positive Support Macro-Average - some prediction file may not contain all the ground-truth utterances
        and may lack predictions for some labels completely. Therefore the denominator for this metric
        only use the number of prediction labels, i.e., labels with a greater-than-zero support.
  5) Positive Support Summation Macro-Average - this metric is similar to 3), but use 4)'s denominator.
  6) Weighted Macro-Average - this metric approach take an weighted average of the series of binary
        per-label confusion matrices. The weights are the per-label prevalences calculated in the
        first tab.
  7) Weighted Summation Macro-Average - similar to 6), but the weighted average only applies to
        the 4 cells. Weighted TP, FP, TN, FN are then used to calculate precision, recall, F1, and
        accuracy.
  8) Multi-Label Subset Aggregate - Orchestrator support multi-labels for each utterance. I.e., an utterance
        can have more than one meanings (intents). For such a multi-intent application, a model can
        actually generate spurious intent predictions that can still boost all the per-label metrics
        described thus far. Multi-Label Subset Aggreagate
        is a per-instance metric that it builds a binary confusion matrix directly.
        An utterance is only a TP if a prediction's intent array is an non-empty subset of the ground-truth array. If a prediction's intent array contains one label not the ground-truth array,
        then this utterance is a FP. If a prediction's intent array is empty while it's not
        for the ground-truth intent array, then the utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions.

EXAMPLE
```

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

Create Orchestrator leave-one-out cross validation (LOOCV) evaluation report on a previously generated .blu file

```
USAGE
  $ bf orchestrator:evaluate

OPTIONS
  -a, --ambiguous=threshold       Ambiguous analysis threshild. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'evaluate' command help.
  -i, --in=in                     Path to a previously created Orchestrator .blu file.
  -l, --low_confidence=threshold  Low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Directory or a config file hosting Orchestrator model files. Optional.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -u, --unknown=threshold         Unknow label threshold, default to 0.3.

DESCRIPTION

  The 'evaluate' command can execute a leave-one-out-cross-validation (LOOCV) analysis
  on a model and its example set. It also generates a detailed evaluation report with the following sections:

  >  Intent/utterancce Statistics - intent and utterance statistics and distributions.
  >  Duplicates - tables of utterance with multiple intents and exact utterance/intent duplicates.
  >  Ambiguous - ambiguous predictions that there are some other intent predictions whose
     scores are close to the correctly predicted intents. Ambiguity closeness is controlled by the "ambiguous" parameter, default to 0.2. I.e., if there is a prediction whose score is within 80% of
     the correctly predicted intent score, then the prediction itself is considered "ambiguous."
  >  Misclassified - utterance's intent labels were not scored the highest.
  >  Low Confidence - utterance intent labels are scored the highest, but they are lower than a threshold.
     This threshold can be configured through the "low_confidence" parameter, the default is 0.5.
  >  Metrics - test confisuon matrix metrics. Please reference the "assess" command description for details.

EXAMPLE
```

_See code: [src\commands\orchestrator\evaluate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\evaluate.ts)_

## `bf orchestrator:finetune COMMAND`

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


## `bf orchestrator:predict`

Returns score of given utterance using previously created orchestrator examples

```
USAGE
    $ bf orchestrator:predict --out=<analysis-and-output-folder> --model=<model-and-config-folder>[--in=<previous-generated-blu-training-set-file>]

OPTIONS
  -a, --ambiguous=threshold       Ambiguous analysis threshild. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'predict' command help.
  -i, --in=in                     Optional path to a previously created Orchestrator .blu file.
  -l, --low_confidence=threshold  Low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Directory or a config file hosting Orchestrator model files.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -u, --unknown=threshold         Unknow label threshold, default to 0.3.

DESCRIPTION

  The 'predict' command is an interactive session that a user can access an Orchestrator model in real-time
  doing following:
    1) Predict the intent of an input utterance using the 'p' commandlet.
    2) Analyze a model example set, by executing the 'v' (validation) commandlet and produce an evaluation
       report in real-time.
    3) Add, remove, or change the intents of an input utterace using the 'a', 'r', and 'c' commandlets,
       respectively. Users can reference a validation report and choose an ambiguous, misclassified, or
       low-confidence utterance and change their intent labels.
    4) Remove some labels completely from the model example set using the 'rl' commandlet.
    5) Create a new model example set snapshot using the 'n' commandlet.

  Below is a list of the commandlets that can be issued during a 'predict' session.

  Commandlets: h, q, d, s, u, cu, i, ci, ni, cni, q, p, v,
               vd, va, vm, vl, vat, vlt, vmt, vut, a, r, c, rl, n
    h   - print this help message
    q   - quit
    d   - display utterance, intent label array inputs, Orchestrator config,
          and the label-index map
    s   - show label-utterance statistics of the model examples
    u   - enter a new utterance and save it as the "current" utterance input
    cu  - clear the "current" utterance input
    i   - enter an intent and add it to the "current" intent label array input
          (can be an index for retrieving a label from the label-index map)
    ci  - clear the "current" intent label array input
    ni  - enter an intent and add it to the "new" intent label array input
          (can be an index for retrieving a label from the label-index map)
    cni - clear the "new" intent label array input
    f   - find the "current" utterance if it is already in the model example set
    p   - make a prediction on the "current" utterance input
    v   - validate the model and save analyses (validation report) to
          "experiment_predicting_va\orchestrator_predicting_set_summary.html"
    vd  - reference a validation Duplicates report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    va  - reference a validation Ambiguous report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vm  - reference a validation Misclassified report and enter an index
          (previously generated by the "v" command)
          for retrieving utterance/intents into "current"
    vl  - reference a validation LowConfidence report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vat - enter a new validation-report ambiguous closeness threshold
    vlt - enter a new validation-report low-confidence threshold
    vmt - enter a new multi-label threshold
    vut - enter a new unknown-label threshold
    a   - add the "current" utterance and intent labels to the model example set
    r   - remove the "current" utterance and intent labels from the model example set
    c   - remove the "current" utterance's intent labels and then
          add it with the "new" intent labels to the model example set
    rl  - remove the "current" intent labels from the model example set
    n   - create a new snapshot of model examples and save it to
          "experiment_predicting_va\orchestrator_predicting_training_set.blu"

EXAMPLE

      $ bf orchestrator:predict --out=resources\data\Columnar\PredictOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu

      Notice that inside the ".../ModelConfig" directory, there is a "config.json" that specifies downloaded model files
      among other hyper parameters. Here is an example: 
      {
        "LoadModel": true,
        "VocabFile": "vocab.json",
        "MergeFile": "merges.txt",
        "ModelFile": "traced_model.onnx",
        "Version": "1.0.0-pretrained.20200729.microsoft.dte.en.onnx"
      }


```

_See code: [src\commands\orchestrator\predict.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\predict.ts)_

## `bf orchestrator:test`

Test utterance/label samples from an input file and create an evaluation report

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -a, --ambiguous=threshold       Ambiguous analysis threshild. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'test' command help.
  -i, --in=in                     Path to a previously created Orchestrator .blu file.
  -l, --low_confidence=threshold  Low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Directory or a config file hosting Orchestrator model files.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -t, --test=test                 Path to a test file.
  -u, --unknown=threshold         Unknow label threshold, default to 0.3.

DESCRIPTION
  The 'test' command can test an Orchestrator model and example set on an input utterance/intent file.

EXAMPLE
```
_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\test.ts)_
<!-- commandsstop -->