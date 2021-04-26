# `bf orchestrator:test`

The "test" command can operate in three modes: test, evaluation, assessment.
- Test mode: test a collection of utterance/label samples loaded from a test file against
  a previously generated Orchestrator .blu snapshot/train file,
  and create a detailed train/test evaluation report.
  The 'test' mode is activated if there is a '--test' argument set for a test file.
- Evaluation mode: create an leave-one-out cross validation (LOOCV) evaluation report
  on a previously generated Orchestrator .blu snapshot/train file.
  If there is no '--test' or '--prediction' arguments, then "test" command runs on the 'evaluation' mode.
- Assessment mode: assess a collection of utterance/label predictions against their ground-truth labels and
  create an evaluation report. This mode can evaluate predictions produced by
  other NLP or machine learning systems. There is no need for an Orchestrator base model.
  Notice that, this mode is generic and can apply to evaluate any ML systems, learners, models,
  and scenarios if a user can carefully construct the prediction and grounf-truth files by
  the specification detailed below.
  Essentially the key to a NLP data instance is a text (utterance, sentence, query, document, etc.), which
  is the basis of all the features feeding to a ML model. For other ML systems, the key to
  a data instance can be built directly from the features and put in place of text
  in a prediction and ground-truth file.
  The 'assessment' mode is activated if there is a '--prediction' argument set for a prediction file.

  Please see below for detailed help messages on arguments and requirements for the three modes.
  Notice that the input specified by the '--in' parameter may be different from mode to mode.

## Test mode

  Test utterance/label samples from an input file against a snapshot training set and create an evaluation report.

### Introduction

  The 'test' mode can test an Orchestrator model and example snapshot set against a test utterance/intent file.
  It will generate evaluation reports and auxiliary files.
  This mode is activated if a "--test" argument is provided to the "test" command.
  Please refer to the 'evaluation' mode for details of the evaluation report.

### Example

      $ bf orchestrator:test --out=resources\data\Columnar\TestOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu --test=resources\data\Columnar\EmailTest.txt

      Notice that the ModelConfig folder is created by the 'bf orchestrator:basemodel:get' command.
      Inside the ".../ModelConfig" directory, there is a "config.json" that specifies a downloaded base model files
      among other hyper parameters. Here is an example: 
      {
        "VocabFile": "vocab.txt",
        "ModelFile": "model.onnx",
        "Name": "pretrained.20200924.microsoft.dte.00.03.en.onnx",
        "Framework": "onnx",
        "Publisher": "Microsoft",
        "ModelType": "dte_bert",
        "Layers": 3,
        "EmbedderVersion": 1,
        "MinRequiredCoreVersion": "1.0.0"
      }

## Evaluation mode

  Create leave-one-out cross validation (LOOCV) evaluation reports and axuiliary files on
  a previously generated Orchestrator .blu snapshot file.
  This mode is activated if there is no "--test" or "--prediction" arguments provided to the "test" commands.

### Introduction

  The 'evaluation' mode executes a leave-one-out-cross-validation (LOOCV) analysis
  on a model and its example snapshot set. It also generates a detailed evaluation report
  with the following sections:

- Intent/utterance Statistics - label and utterance statistics and distributions.
- Duplicates - tables of utterance with multiple labels and exact utterance/label duplicates.
- Ambiguous - ambiguous predictions that there are some other label predictions whose scores
  are close to the correctly predicted labels. Ambiguity closeness is controlled by the "ambiguous" parameter,
  default to 0.2. I.e., if there is a prediction whose score is within 80% of the correctly predicted label score,
  then the prediction itself is considered "ambiguous."
- Misclassified - utterance's label labels were not scored the highest.
- Low Confidence - utterance label labels are scored the highest, but they are lower than a threshold.
  This threshold can be configured through the "lowConfidenceScoreThreshold" parameter, the default is 0.5.
- Metrics - test confisuon matrix metrics. Please reference the test assessment mode description for details.

### Example

      $ bf orchestrator:test --out=resources\data\Columnar\EvaluationOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu

      Notice that it is not required to load a model file if the input is already a snapshop .blu file.
      Nevertheless the ModelConfig folder is created by the 'bf orchestrator:basemodel:get' command.
      Inside the ".../ModelConfig" directory, there is a "config.json" that specifies downloaded base model files
      among other hyper parameters. Here is an example: 
      {
        "VocabFile": "vocab.txt",
        "ModelFile": "model.onnx",
        "Name": "pretrained.20200924.microsoft.dte.00.03.en.onnx",
        "Framework": "onnx",
        "Publisher": "Microsoft",
        "ModelType": "dte_bert",
        "Layers": 3,
        "EmbedderVersion": 1,
        "MinRequiredCoreVersion": "1.0.0"
      }

## Assessment mode

  Create an evaluation report on assessing prediction against ground-truth instances.
  This command can execute an independent assessment of a prediction set against a ground-truth set,
  it does not require a base model that other Orchestrator commands may need.
  This mode is activated if a "--prediction" argument is provided to the "test" command.

### Introduction

  The "assessment" mode compares a prediction file against a ground-truth file, then
  generates two detailed evaluation reports, one for intent prediction and the other entity, along with some
  auxiliary files.
  The input files can be in LU, LUIS, QnA Maker, TSV, or a special JSON label array format (described below).

  This command intends to provide a comprehensive and consistent multi-class model evaluation tool in
  order to avoid teams reporting their own inconsistent evaluation metrics, especially in a contest
  evaluating competitive technology or models. Below are some sources of evaluation inconsistencies if
  evaluation were conducted and metrics reported by the teams themselves:

-   Metric - one team may report Micro-Average, Macro Average, or else. As shown below,
      there can be many ways in computing a metric average, and
      the discrepancy can be huge using different averaging formulations.
      Sometimes the definition of a metric, say macro average, can even vary among different teams.
-   Datasets – even though every party tests on the same dataset source, the dataset might diverge
      after a while after some data massaging, sometimes due to processing errors or filtering logic.
      Some teams may prefer some datasets, but not others, for their particular technology or models.
-   Data processing – some test dataset can contain duplicate utterances and labels.
      De-duplicate or not can affect final metric calculation. 
-   Confusion matrix formulation – what is a TP, FP, TN, or FN? 
      Even though their textbook definition is clear, they can still be up to interpretation
      in real world scenarios. For example, TN may not make sense in evaluating entity extracting.
-   Label interpretation – Sometimes people might ignore some test results if their prediction
      scores are too low. We should have a consistent way to include those predictions. On entity, some
      people may choose to evaluate based on per-token tags, instead of per-entuty-mention. 
-   Label processing – what is an UNKNOWN label? Different teams may have their unique strategies
      in processing empty, UNKNOWN, or never-seen-before labels in the ground-truth and prediction files.
-   Evaluation Tool – every team has their own tools that might not be consistent in metric computation.

  The "assessment" mode aims to address these issues:

-   Metric -- the test assessment mode calculates many average/aggregate metrics to satisfy a variety of evaluation
    needs and metric definitions.
    Which metric to focus on for decision-making is up to an evaluation committee or stakeholders.
    The tool has no bias, even though each party might have its favorites for its own agenda.
-   Datasets -- it's necessary to create a dataset repo for the community to share
    ground-truth datasets and predictions. Again it’s up to an evaluation committee or individual party to choose the
    evaluation datasets (and performance metrics) compatible with their projects and scenarios.
-   Data processing – this BF-orchestrator evaluation package provides consistent logic in processing datasets.
    For example, it does de-duplication, so an utterance and its label won’t contribute more than once
    in metric calculation.
-   Confusion matrix formulation – again, this BF evaluation package provides consistent formulation logic in
    intepreting the 4 confusion matrix cells.
    For example, entity evaluation does not have TN as the combinations of entity offset and length not in
    the ground-truth or predicted set can be limitless.
-   Label interpretation – again, consistent is key and this test assessment mode does not silently
    ignore some test results for whatever reasons. Every test instance should contribute to
    metric calculation unless they are spurious (test intent/entity name not in the training set)
    – due to processing mistakes by whoever prepared it. 
-   Label processing – this BF-Orchestrator package pre-processes labels and treats
    an utterance’s empty, None, and never-seen-before labels as UNKNOWN. Since BF-Orchestrator allows
    multi-label intents for utterances, UNKNOWN is stripped if it con-exists with known labels
    for an utterance.
-   Evaluation Tool – BF-Orchestrator has been released to the world (through NPM), everyone
    in the world can run it, file a bug or PR to improve it.
    It’s not a script hidden in someone's laptop or some team repo.

  Besides addressing these evaluation inconsistency issues, the test assessment mode also produces a
  comprehensive metric report as well as label and utterance distributions.

### Input format

  The input ground-truth and predictions files can be in LU, LUIS, QnA Maker, TXT, TSV or a special JSON array format.
  The TXT file format only supports intent labels and it must have 2 columns, 'labels' and 'utterance',
  sepatated by a TAB. The 'labels' column can contains multiple labels delimited by camma.

  For entitiy labels, a user can choose LU, LUIS, or a JSON array format
  that each entry contains a labeled utterance following the schema and example shown below.
  In the array, each JSON entry has a "text" attribute for an utterance. The utterance can have an array pf
  "intents." The utterance can also has an array of "entities."
  Each entity entry contains an "entity" attribute for its name, a "startPos" attribute indicating the offset
  of the entry in the utterance, and a "endPos" attribute for the final location of the entity
  in the utterance. The entity can have some optional fields, such as a "text" attribute
  for a entity mention within the utterance, however this attribute is only for debugging purpose and not consumed
  for the test assessment mode.

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

### Report

  The test assessment mode reads the input ground-truth and prediction JSON files and generates
  distributions of the utterances and their labels. It also groups each utterance's
  ground-truth and prediction intent and entity labels together, compares them, and determines if
  a prediction is in the ground-truth or vice versa. Using these analyese, the test assessment mode
  generates HTML reports and some auxiliary files at the end.
  One report is for intent evaluation and the other for entity.

  Each report has the following sections:

-   Ground-Truth Label/Utterance Statistics - ground-truth label and utterance statistics and distributions.
-   Ground-Truth Duplicates - tables of ground-truth utterances with multiple labels and exact utterance/label duplicates.
-   Prediction Label/Utterance Statistics - prediction label and utterance statistics and distributions.
-   Prediction Duplicates - tables of prediction utterances with multiple labels and exact utterance/label duplicates.
-   Misclassified - utterances with false-positive and false-negative predictions.
-   Metrics - confisuon matrix metrics.

  In the Metrics section, the Orchestrator test assessment mode first generates a series of per-label
  binary confusion matrices.
  Each binary confusion matrix is comprised of 4 cells: true positive (TP), false positive (FP), true negative (TN),
  and false negative (FN). Using these 4 cells, Orchestrator can compute several other confusion
  matrix metrics, including precision, recall, F1, accuracy, and support, etc.
  Please reference https://en.wikipedia.org/wiki/Confusion_matrix for details.

  Notice that the logic constructing a per-label confusion matrix is a little diffenent between intent
  and entity labels. Here are the logic outlines:

- Intent - the test assessment mode iterates through one ground-truth utterance at a time
        and compare its ground-truth intent array and prediction intent array. If a label is in
        both arrays, then this utterance is a TP for the label's confusion matrix. If a label only exists in
        the prediction array, then it's a FP for the predicted label's confusion matrix. Similarly
        if a label only exists in the ground-truth array, then it's a FN for the ground-truth label's confusion
        matrix. For any other labels, the utterance is a TN for their confusion matrices.

- Entity - the test assessment mode iterates through one ground-truth utterance at a time
        and compare its ground-truth entity array and prediction entity array.
        If an entity mention exists in both array, then it's a TP for the entity label's confusion matrix.
        An entity mention is comprised of the entity name (label), start position in the utterance, and the length
        of the entity mention. An entity mention is considered a match to another only if these three components
        are exactly the same.
        FP and FN logic is similar to those for intent. However, there is no TN for evaluating entity mentions
        as there can be too many possible entity mention candidates for an utterance when consider the start-position
        and entity length.
        On the other hand, number of intent labels for an utterance is usually one or a small number.
        It is still possible to define a custom TN logic, such as
        an entity label is a TN if it does not exist in an utterance's ground-truth or prediction label arrays at all.
        However as some important metrics such as precision, recall, and their combination (F1) do not rely on TN,
        so that it's really not necessary to collect TN for evaluating entity predictions.

  By the way, sometimes an erroneous prediction file can contain some labeled utterances not in the ground-truth
  file. These utterances are called spurious, and they will be listed under the "Prediction Duplicates" tab
  in an evaluation report called "Spurious utterance and label pairs."

  Once the serial of per-label binary confusion matrices are built, there are plenty of
  per-label metrics, which can then be aggregated using several diverse averaging schemes.
  An evaluation report's "Metrics" tab contains several of them:

-    Micro-Average - Orchestrator is essentially a multi-class ML learner and model, so evaluation can also be expressed
        as a multi-class confusion matrix, besides the series of binary per-label confusion matrices
        mentioned above. In such a multi-class confusion matrix, every prediction is a positive and
        there is no negative. The diagonal cells of this multi-class confusion matrix are
        the TPs. The micro-average metric is the ratio of the sum of TPs over total. Total is the sum
        of all the supports (#positives) aggregated from the series of binary confusion matrices.
-    Micro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate an bucket array that each bucket contain the per-label binary confusion matrix metric value as well
        as the per-label support. From this metric-support array, the micro-first-quartile metric is
        the metric value from the entry at the first quartile position in the bucket array.
-    Micro-Median - similar to Micro-First-Quartile, but at the second-quartile position, i.e., median.
-    Micro-Third-Quartile - similar to Micro-First-Quartile, but at the third-quartile position.
-    Macro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate a simple array of the per-label binary confusion matrix metrics. From this metric array, the
        macro-first-quartile metric is the metric value at the first quartile position.
-    Macro-Median - similar to Macro-First-Quartile, but at the second-quartile position, i.e., median.
-    Macro-Third-Quartile - similar to Macro-First-Quartile, but at the third-quartile position.
-    Summation Micro-Average - the second way coalescing the series of binary confusion matrices into one is by
        summing up their TP, FP, TN, FN numbers. These 4 summations are then formed as one binary confusion
        matrix and can be used to calculate overall precision, recall, F1, and accuracy.
-    Macro-Average - another way coalescing the series of binary confusion matrices simply takes
        arithmetic average of every metrics individually. The denominator for computing the averages
        is the number of labels existed in the ground-truth set.
-    Summation Macro-Average - While macro-average takes a simple arithmetic average on every metrics.
        Summation macro-average only takes the average on the 4 confusion matrix cells, TP, FP, TN, and FN.
        Precision, recall, F1, and accuracy are then calculated by the 4 averaged cells.
-    Positive Support Macro-Average - some prediction file may not contain all the ground-truth utterances
        and may lack predictions for some ground-truth labels completely. The averaging denominator for this metric
        uses the number of prediction labels, i.e., number of the labels with a greater-than-zero support.
-    Positive Support Summation Macro-Average - this metric is similar to 3), but use 4)'s denominator.
-    Weighted Macro-Average - this metric averaging approach takes an weighted average of the series of binary
        per-label confusion matrices. The weights are the per-label prevalences, which are listed in the
        "Ground-Truth Label/Utterance Statistics" tab.
-    Weighted Summation Macro-Average - similar to 6), but the weighted average only applies to
        the 4 confusion matrix cells. Weighted TP, FP, TN, FN are then used to calculate precision, recall, F1, and
        accuracy.
-    Multi-Label Exact Aggregate - Orchestrator supports evaluating multi-label intents for each utterance.
        I.e., an utterance can belong to more than one categories (intents). For a multi-intent application, a model can
        actually generate spurious (too many) intent predictions that can still boost the "per-label" metrics
        described thus far. In a "per-label" metric, every label (an instance can have more than one label)
        can contribute to metric computation, therefore some instances may contribute more to metric
        calculation more then others.
        To counter this problem, Multi-Label Exact Aggreagate is a "per-instance" metric that it builds
        a binary confusion matrix directly and an instance can only contribute to metric computation once
        disregard the number of labels it has.
        An utterance is only a TP if a non-empty prediction's intent array is exactly equal to the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. Then, if an utterance's ground-truth intent array contains at least
        one label not in the prediction intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.
-    Multi-Label Subset Aggregate - Similar to Multi-Label Exact Aggregate, but this metric's TP logic is less
        restrictive.
        An utterance is only a TP if a prediction's intent array is a non-empty subset of the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. If an utterance's prediction intent array is empty while it's not
        for the ground-truth intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.

### Example

      $ bf orchestrator:test --out=resources\data\EvaluationJsonFormat\AssessmentOutput \
      --in=resources\data\EvaluationJsonFormat\orchestrator_testing_set_ground_truth_instances.json \
      --prediction=resources\data\EvaluationJsonFormat\orchestrator_testing_set_prediction_instances.json
