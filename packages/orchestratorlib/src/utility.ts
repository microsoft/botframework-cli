/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs';
import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {BinaryConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrix} from '@microsoft/bf-dispatcher';
// import {MultiLabelConfusionMatrixExact} from '@microsoft/bf-dispatcher';
// import {MultiLabelConfusionMatrixSubset} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';
import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';
// ---- TO-REFACTOR ----
import {CryptoUtility} from '@microsoft/bf-dispatcher';

import {Example} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {PredictionStructure} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithPluralEvaluationLabelObject} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithPluralEvaluationLabelString} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScore} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelString} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';
import {PredictionType} from '@microsoft/bf-dispatcher';
import {PredictionTypeArrayOutputIndex} from '@microsoft/bf-dispatcher';
import {Result} from '@microsoft/bf-dispatcher';
// import {Span} from '@microsoft/bf-dispatcher';

import {OrchestratorHelper} from './orchestratorhelper';

import {AssessmentLabelSummaryTemplateHtml} from './resources/assessment-label-summary-template-html';
import {EvaluationSummaryTemplateHtml} from './resources/evaluation-summary-template-html';
import {UtilityLabelResolver} from './utilitylabelresolver';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export class Utility {
  public static toPrintDebuggingLogToConsole: boolean = false;

  public static toPrintDetailedDebuggingLogToConsole: boolean = false;

  // ---- TO-REFACTOR ----
  public static toObfuscateLabelTextInReportUtility: boolean = false;

  public static NumberOfInstancesPerProgressDisplayBatch: number = 1000; // 10000;

  public static NumberOfInstancesPerProgressDisplayBatchForIntent: number = 100; // 1000; // 10000;

  public static NumberOfInstancesPerProgressDisplayBatchForEntity: number = 100; // 1000; // 10000;

  public static readonly DefaultAmbiguousClosenessThresholdParameter: number = 0.2; // ---- Close to the correct top prediction within 20% of the score.

  public static readonly DefaultLowConfidenceScoreThresholdParameter: number = 0.5; // ---- Lower than the threshold for an ambiguous prediction.

  public static readonly DefaultMultiLabelPredictionThresholdParameter: number = 1.0; // ---- If greater than 0, then predict all labels with scores higher than the threshold. Predict only highest-score labels if not.

  public static readonly DefaultUnknownLabelPredictionThresholdParameter: number = 0; // ---- Unknown prediction if score is lower than the threshold.

  public static StringLabelConfusionMatrixToIncludeTrueNegatives: boolean = true;

  public static ObjectLabelConfusionMatrixToIncludeTrueNegatives: boolean = false;

  public static readonly UnknownLabel: string = 'UNKNOWN';

  public static readonly UnknownLabelSet: Set<string> = new Set<string>(['', 'NONE', 'NULL', Utility.UnknownLabel]);

  // ---- TO-REFACTOR ----
  public static readonly ColumnNameMicroAverageRaw: string = 'Micro-Average';

  public static readonly ColumnNameMicroAverage: string = Utility.getBolded(Utility.ColumnNameMicroAverageRaw);

  public static readonly DescriptionMicroAverage: string = `
  This metric follows the micro-average metric defined in
  <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
  The computing process iterates through the per-label binary confusion matrices and
  calculates the sums of per-label "#TruePositives" and per-label "Support", respectively.
  The "Support" sum is stored in this row's "Total" field and "#TruePositives" sum in the "#TruePositives" field.
  This metric is then the ratio of the "#TruePositives" sum over "Total."
  `;

  public static readonly ColumnNameMicroFirstQuartile: string = Utility.getBolded('Micro-First-Quartile');

  public static readonly DescriptionMicroFirstQuartile: string = `
  Average (or mean) is not a <a href="https://en.wikipedia.org/wiki/Robust_statistics">robust statistics</a> that
  average can be easily influenced by outliers. Therefore, we also compute robust quantile-based metrics in this report.
  For every metric in this row, e.g., precision, the computing process collects the per-label precision
  metrics from the per-label binary confusion matrices, sorts them, and then expands each per-label precision by the
  number of label supports. It then finds the first quartile of the metric from the series of metrics.
  These first-quartiles are the metrics' lower bound
  for the top 75% test instances.
  `;

  public static readonly ColumnNameMicroMedian: string = Utility.getBolded('Micro-Median');

  public static readonly DescriptionMicroMedian: string = `
  Similar to the previous row, but metrics in this row focuses on median, another robust statistic.
  These medians are the metrics' lower bound
  for the top 50% test instances.
  `;

  public static readonly ColumnNameMicroThirdQuartile: string = 'Micro-Third-Quartile';

  public static readonly DescriptionMicroThirdQuartile: string = `
  Similar to the previous row, but metrics in this row focuses on the third quartile.
  These third-quartiles are the metrics' lower bound
  for the top 25% test instances.
  `;

  public static readonly ColumnNameMacroFirstQuartile: string = Utility.getBolded('Macro-First-Quartile');

  public static readonly DescriptionMacroFirstQuartile: string = `
  Above three quantile metrics are micro, i.e., they are calcuated on the test instance level.
  Macro quantile metrics are calculated per label.
  The first quartiles are the metrics' lower bound
  for the top 75% test labels.
  `;

  public static readonly ColumnNameMacroMedian: string = Utility.getBolded('Macro-Median');

  public static readonly DescriptionMacroMedian: string = `
  Similar to the previous row, but metrics in this row focuses on median.
  These medians are the metrics' lower bound
  for the top 50% test labels.
  `;

  public static readonly ColumnNameMacroThirdQuartile: string = 'Macro-Third-Quartile';

  public static readonly DescriptionMacroThirdQuartile: string = `
  Similar to the previous row, but metrics in this row focuses on the third quartile.
  These third-quartiles are the metrics' lower bound
  for the top 25% test labels.
  `;

  public static readonly ColumnNameSummationMicroAverageRaw: string = `Summation ${Utility.ColumnNameMicroAverageRaw}`;

  public static readonly ColumnNameSummationMicroAverage: string = Utility.getBolded(Utility.ColumnNameSummationMicroAverageRaw);

  public static readonly DescriptionSummationMicroAverage: string = `
  The metrics in this row are a little bit different from those of ${Utility.ColumnNameMicroAverage}.
  The computng process first sums up per-label "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
  metrics, respectively, then constructs a binary confusion matrix, and calculates the other metrics, such as
  Precision, Recall, F1, Accuracy, etc.
  `;

  public static readonly ColumnNameMacroAverageRaw: string = 'Macro-Average';

  public static readonly ColumnNameMacroAverage: string = Utility.getBolded(Utility.ColumnNameMacroAverageRaw);

  public static readonly DescriptionMacroAverage: string = `
  This metric follows the macro-average metric defined in
  <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
  The computing process calcuates simple arithmetic means of the per-label Precision, Recall, F1, and Accuracy
  metrics, repectively.
  `;

  public static readonly ColumnNameSummationMacroAverage: string = `Summation ${Utility.ColumnNameMacroAverageRaw}`;

  public static readonly DescriptionSummationMacroAverage: string = `
  The calculating process for the metrics in this row is a little bit different from ${Utility.ColumnNameMacroAverage}.
  It first calculates the averages of per-label "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
  metrics, respectively, then constructs a binary confusion matrix, and calculates the other metrics, such as
  Precision, Recall, F1, Accuracy, etc.
  `;

  public static readonly ColumnNamePositiveSupportMacroAverage: string = `Positive-Support ${Utility.ColumnNameMacroAverageRaw}`;

  public static readonly DescriptionPositiveSupportMacroAverage: string = `
  The metrics in this row are similar to those of ${Utility.ColumnNameMacroAverage}.
  However, instead of averaging over all train-set labels, metrics in this rows are the averages of test-set labels,
  i.e., labels with a positive support in the test set.
  Even though one might expect every label (in the train set) should have some test instances, but
  sometimes a test set might not have test instances for some train set labels.
  "Positive-support" metrics put an focus on test-set labels.
  A test set might even contain instances whose labels are not in the train set. Those labels are renamed UNKNOWN for
  evaluation purpose.
  `;

  public static readonly ColumnNamePositiveSupportSummationMacroAverage: string = `Positive-Support ${Utility.ColumnNameSummationMacroAverage}`;

  public static readonly DescriptionPositiveSupportSummationMacroAverage: string = `
  The metrics in this row are similar to those of ${Utility.ColumnNameSummationMacroAverage}, but forcus on
  labels with test instances.
  `;

  public static readonly ColumnNameWeightedMacroAverage: string = `Weighted ${Utility.ColumnNameMacroAverageRaw}`;

  public static readonly DescriptionWeightedMacroAverage: string = `
  This metric follows the weighted-average metric defined in
  <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
  The computing process calcuates support/prevalency-weighted means of the per-label Precision, Recall, F1, and Accuracy
  metrics, repectively.
  `;

  public static readonly ColumnNameWeightedSummationMacroAverage: string = `Weighted ${Utility.ColumnNameSummationMacroAverage}`;

  public static readonly DescriptionWeightedSummationMacroAverage: string = `
  The calculating process for the metrics in this row is a little bit different from ${Utility.DescriptionWeightedMacroAverage}.
  It first calculates the weighted averages of per-label "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
  metrics, respectively, then constructs a binary confusion matrix, and calculates the other metrics, such as
  Precision, Recall, F1, Accuracy, etc.
  `;

  public static readonly ColumnNameMultiLabelExactAggregate: string = Utility.getBolded('Multi-Label Exact Aggregate');

  public static readonly DescriptionMultiLabelExactAggregate: string = `
  This evaluation package supports multi-label instances and predictions.
  In another word, a test instance can be labeled and predicted with more than
  one labels. The above metrics so far are calculated "per label," i.e., an instance can contribute to
  multiple positive predictions on different labels, thus the above metrics can encourage a model to predict more than one labels per test instances
  that may achieve better evaluation results.
  To counter such a behavior, metrics in this row are "per instance," i.e., an instance can only contribute to one positive prediction. 
  The calcuating process does not rely on the per-label binary confusion matrices, but
  build just one binary confusion matrix in which a true positive prediction is an exact match between the prediction
  and the ground-truth label sets, otherwise it's a false positive. By the way, there is no negative prediction, so false-nagative
  and true-negative are both 0.
  `;

  public static readonly ColumnNameMultiLabelSubsetAggregate: string = Utility.getBolded('Multi-Label Subset Aggregate');

  public static readonly DescriptionMultiLabelSubsetAggregate: string = `
  Similar to the previous row, but the metric computing process is less strict. A prediction can be a true positive
  as long as the predicted label set is a subset of the ground-truth set.
  This subset rule makes sense as an action taking on a prediction can respond to one of the
  correctly predicted labels and the action is still proper.
  Of course, this subset rule can discourage a model from predicting more than one labels (one is the safest strategy),
  even though a test instance might be labeled with a large ground-truth label set.
  `;
  // ---- TO-REFACTOR
  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility functions
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static processUtteranceMultiLabelTsv(
    lines: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utterancesLabelsPredictedMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceLabelDuplicatePredictedMap: Map<string, Set<string>>,
    utteranceIndex: number = 2,
    labelsIndex: number = 0,
    labelsPredictedIndex: number = 1): boolean {
    if (utteranceIndex < 0) {
      Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| < 0`);
    }
    lines.forEach((line: string) => {
      const items: string[] = line.split('\t');
      if (utteranceIndex >= items.length) {
        Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| >= items.length|${items.length}|`);
      }
      let utterance: string = items[utteranceIndex] ? items[utteranceIndex] : '';
      let labels: string = '';
      if ((labelsIndex >= 0) && (labelsIndex < items.length)) {
        labels = items[labelsIndex] ? items[labelsIndex] : '';
      }
      let labelsPredicted: string = '';
      if ((labelsPredictedIndex >= 0) && (labelsPredictedIndex < items.length)) {
        labelsPredicted = items[labelsPredictedIndex] ? items[labelsPredictedIndex] : '';
      }
      labels = labels.trim();
      utterance = utterance.trim();
      labelsPredicted = labelsPredicted.trim();
      const labelArray: string[] = labels.split(',');
      for (const label of labelArray) {
        Utility.addToMultiLabelUtteranceStructure(
          utterance,
          label.trim(),
          utteranceLabelsMap,
          utteranceLabelDuplicateMap);
      }
      const labelPredictedArray: string[] = labelsPredicted.split(',');
      for (const labelPredicted of labelPredictedArray) {
        Utility.addToMultiLabelUtteranceStructure(
          utterance,
          labelPredicted.trim(),
          utterancesLabelsPredictedMap,
          utteranceLabelDuplicatePredictedMap);
      }
    });
    return true;
  }

  public static addToMultiLabelUtteranceStructure(
    utterance: string,
    label: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const existingLabels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
    if (existingLabels) {
      if (!Utility.addIfNewLabel(label, existingLabels)) {
        Utility.insertStringPairToStringIdStringSetNativeMap(
          utterance,
          label,
          utteranceLabelDuplicateMap);
      }
    } else {
      utteranceLabelsMap.set(utterance, new Set<string>([label]));
    }
  }

  public static addIfNewLabel(newLabel: string, labels: Set<string>): boolean {
    if (labels.has(newLabel)) {
      return false;
    }
    labels.add(newLabel);
    return true;
  }

  public static parseInputLabelEntryIntoInputLabelContainerArray(
    modelLabels: string[],
    inputLabelEntry: string,
    inputLabelContainerArray: string[]): string {
    inputLabelEntry = inputLabelEntry.trim();
    if (!Utility.isEmptyString(inputLabelEntry)) {
      if (Number.isInteger(Number(inputLabelEntry))) {
        const inputLabelEntryIndex: number = Number(inputLabelEntry);
        const currentModelLabelArrayAndMap: {
          'stringArray': string[];
          'stringMap': Map<string, number>;} =
          Utility.buildStringIdNumberValueDictionaryFromStringArray(modelLabels);
        const modelLabelStringArray: string[] = currentModelLabelArrayAndMap.stringArray;
        // eslint-disable-next-line max-depth
        if ((inputLabelEntryIndex < 0) || (inputLabelEntryIndex >= modelLabelStringArray.length)) {
          const errorMessage: string =
            `The input label index "${inputLabelEntryIndex}" you entered is not in range, model label-index map is: ${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(currentModelLabelArrayAndMap.stringMap)}`;
          return errorMessage;
        }
        inputLabelContainerArray.push(modelLabelStringArray[inputLabelEntryIndex]);
      } else {
        inputLabelContainerArray.push(inputLabelEntry);
      }
    }
    return '';
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- assessment report with Label objects
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateAssessmentLabelObjectEvaluationReport(
    groundTruthSetLabels: string[],
    predictionSetEntityLabelSet: Set<string>,
    groundTruthSetUtteranceEntityLabelsMap: Map<string, Label[]>,
    groundTruthSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]>,
    predictionSetUtteranceEntityLabelsMap: Map<string, Label[]>,
    predictionSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]>): {
      'evaluationReportGroundTruthSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportPredictionSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportSpuriousPredictions': {
        'evaluationSummary': string;
        'spuriousPredictions': [string, Label[]][]; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'misclassifiedAnalysis': {
          'predictingMisclassifiedUtterancesArrays': string[][];
          'predictingMisclassifiedUtterancesArraysHtml': string;
          'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithPluralEvaluationLabelObjectArray': PredictionStructureWithPluralEvaluationLabelObject[];
    } {
    // ---- NOTE ---- load the assessment evaluation summary template.
    const evaluationSummary: string = AssessmentLabelSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report for the ground-truth set.
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportGroundTruthSetLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      groundTruthSetLabels,
      groundTruthSetUtteranceEntityLabelsMap,
      groundTruthSetUtteranceEntityLabelDuplicateMap,
      '{GROUND_TRUTH_SET_LABEL_TEXT_STATISTICS}',
      '{GROUND_TRUTH_SET_TEXT_DUPLICATES}',
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- '',
      predictionSetEntityLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- generate evaluation report for the prediction set.
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportPredictionSetLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(
      evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary,
      groundTruthSetLabels,
      predictionSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelDuplicateMap,
      '{PREDICTION_SET_LABEL_TEXT_STATISTICS}',
      '{PREDICTION_SET_TEXT_DUPLICATES}',
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- '',
      predictionSetEntityLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- produce prediction evaluation
    const predictionStructureWithPluralEvaluationLabelObjectArray: PredictionStructureWithPluralEvaluationLabelObject[] = Utility.assessLabelObjectPredictions(
      groundTruthSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelsMap,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    // ---- NOTE ---- find spurious predictions
    const evaluationReportSpuriousPredictions: {
      'evaluationSummary': string;
      'spuriousPredictions': [string, Label[]][];
    } = Utility.generateAssessmentLabelObjectEvaluationReportSpuriousPredictions(
      evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary,
      groundTruthSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelsMap);
    // ---- NOTE ---- generate evaluation report.
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.generateAssessmentLabelObjectEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateAssessmentLabelObjectEvaluationReportAnalyses(
      evaluationReportSpuriousPredictions.evaluationSummary,
      predictionStructureWithPluralEvaluationLabelObjectArray,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportAnalyses.evaluationSummary=\n${evaluationReportAnalyses.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.generateAssessmentLabelObjectEvaluationReportAnalyses()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), labelArrayAndMap.stringArray=${Utility.jsonStringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), labelArrayAndMap.stringMap=${Utility.jsonStringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), labels=${Utility.jsonStringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportGroundTruthSetLabelUtteranceStatistics,
      evaluationReportPredictionSetLabelUtteranceStatistics,
      evaluationReportSpuriousPredictions,
      evaluationReportAnalyses,
      predictionStructureWithPluralEvaluationLabelObjectArray};
  }

  public static generateAssessmentLabelObjectEvaluationReportSpuriousPredictions(
    evaluationSummary: string,
    groundTruthSetUtteranceEntityLabelsMap: Map<string, Label[]>,
    predictionSetUtteranceEntityLabelsMap: Map<string, Label[]>): {
      'evaluationSummary': string;
      'spuriousPredictions': [string, Label[]][];
    } {
    const spuriousPredictions: [string, Label[]][] = Utility.assessLabelObjectSpuriousPredictions(
      groundTruthSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelsMap);
    const spuriousPredictionArrays: [string, string][] = spuriousPredictions.map(
      (spuriousPrediction: [string, Label[]]) => [
        Utility.outputStringUtility(spuriousPrediction[0]),
        Utility.concatenateDataArrayToHtmlTable(
          'Label',
          spuriousPrediction[1].map((x: Label) => Utility.outputLabelStringUtility(x))),
      ]);
    // ---- NOTE ---- generate spurious report.
    const spuriousPredictionHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Spurious utterance and label pairs',
      spuriousPredictionArrays,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCES summary from template.
    evaluationSummary = evaluationSummary.replace(
      '{SPURIOUS_UTTERANCES}',
      spuriousPredictionHtml);
    return {
      evaluationSummary,
      spuriousPredictions};
  }

  // eslint-disable-next-line max-params
  public static generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(
    evaluationSummary: string,
    dataSetLabels: string[],
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>,
    evaluationSummaryTagEntityLabelUtteranceStatistics: string,
    evaluationSummaryTagUtteranceDuplicates: string,
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- evaluationSummaryTagSpuriousLabelUtteranceStatistics: string,
    ensureUnknownLabelInLabelArrayAndMap: boolean): {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } {
    // ---- NOTE ---- create a label-index map.
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(dataSetLabels);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- TODO ---- if (Utility.isEmptyStringArray(labelArrayAndMap.stringArray)) {
    // ---- TODO ----   Utility.debuggingThrow('there is no label, something wrong?');
    // ---- TODO ---- }
    // ---- NOTE ---- as the unknown threshold is greater than 0, the score function can make an UNKNOWN prediction.
    if (ensureUnknownLabelInLabelArrayAndMap) {
      if (!(labelArrayAndMap.stringMap.has(Utility.UnknownLabel))) {
        labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
        labelArrayAndMap.stringMap.set(Utility.UnknownLabel, labelArrayAndMap.stringArray.length - 1);
      }
    }
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string; } = Utility.generateLabelStringLabelStatisticsAndHtmlTable(
        Utility.convertUtteranceEntityLabelsMap(utteranceEntityLabelsMap),
        labelArrayAndMap);
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelStringLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateLabelStringUtteranceStatisticsAndHtmlTable(
        Utility.convertUtteranceEntityLabelsMap(utteranceEntityLabelsMap));
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelStringUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation LABEL_TEXT_STATISTICS summary from template.
    const labelsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagEntityLabelUtteranceStatistics,
      labelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagEntityLabelUtteranceStatistics} content`);
    // ---- NOTE ---- generate spurious label statistics.
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- const spuriousLabelStatisticsAndHtmlTable: {
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Label[]]>;
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; } = Utility.generateLabelObjectSpuriousLabelStatisticsAndHtmlTable(
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----     utteranceEntityLabelsMap,
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----     labelArrayAndMap);
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelObjectSpuriousLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCE_LABELS summary from template.
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- const spuriousLabelsUtterancesStatisticsHtml: string =
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   spuriousLabelStatisticsAndHtmlTable.spuriousLabelStatisticsHtml;
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   evaluationSummaryTagSpuriousLabelUtteranceStatistics,
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   spuriousLabelsUtterancesStatisticsHtml);
    // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagSpuriousLabelUtteranceStatistics} content`);
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = [...utteranceEntityLabelsMap.entries()].filter(
      (x: [string, Label[]]) => x[1].length > 1).map((x: [string, Label[]]) => [
      Utility.outputStringUtility(x[0]),
      Utility.concatenateDataArrayToHtmlTable(
        'Label',
        x[1].map((x: Label) => Utility.outputLabelStringUtility(x))),
    ]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their labels',
      utterancesMultiLabelArrays,
      ['Utterance', 'Labels']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapArrayToObfuscatableIndexedHtmlTable(
      'Duplicate utterance and label pairs',
      utteranceEntityLabelDuplicateMap,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation TEXT_DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagUtteranceDuplicates,
      duplicateStatisticsHtml);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagUtteranceDuplicates} content`);
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      labelArrayAndMap,
      labelStatisticsAndHtmlTable,
      utteranceStatisticsAndHtmlTable,
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- spuriousLabelStatisticsAndHtmlTable,
      utterancesMultiLabelArrays,
      utterancesMultiLabelArraysHtml,
      utteranceLabelDuplicateHtml};
  }

  public static convertUtteranceEntityLabelsMap(utteranceEntityLabelsMap: Map<string, Label[]>): Map<string, Set<string>> {
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (const utteranceEntityLabels of utteranceEntityLabelsMap.entries()) {
      utteranceLabelsMap.set(utteranceEntityLabels[0], new Set<string>(utteranceEntityLabels[1].map((x: Label) => x.name)));
    }
    return utteranceLabelsMap;
  }

  // eslint-disable-next-line max-params
  public static generateAssessmentLabelObjectEvaluationReportAnalyses(
    evaluationSummary: string,
    predictionStructureWithPluralEvaluationLabelObjectArray: PredictionStructureWithPluralEvaluationLabelObject[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } {
    // ---- NOTE ---- generate misclassified HTML.
    const misclassifiedAnalysis: {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } = Utility.generateAssessmentLabelObjectMisclassifiedStatisticsAndHtmlTable(
      predictionStructureWithPluralEvaluationLabelObjectArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}',
      misclassifiedAnalysis.predictingMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateAssessmentLabelObjectConfusionMatrixMetricsAndHtmlTable(
      predictionStructureWithPluralEvaluationLabelObjectArray,
      labelArrayAndMap);
    evaluationSummary = evaluationSummary.replace(
      '{MODEL_EVALUATION}',
      confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageDescriptionMetricsHtml);
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportAnalyses(), finished generating {MODEL_EVALUATION} content');
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      misclassifiedAnalysis,
      confusionMatrixAnalysis};
  }

  public static generateAssessmentLabelObjectMisclassifiedStatisticsAndHtmlTable(
    predictionStructureWithPluralEvaluationLabelObjectArray: PredictionStructureWithPluralEvaluationLabelObject[]): {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const predictingMisclassifiedUtterancesArrays: string[][] = [];
    const predictingMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionStructureWithPluralEvaluationLabelObject of predictionStructureWithPluralEvaluationLabelObjectArray.filter((x: PredictionStructureWithPluralEvaluationLabelObject) => x.hasMisclassified())) {
      if (predictionStructureWithPluralEvaluationLabelObject) {
        const labelsPredictionStructureWithPluralEvaluationLabelObjectHtmlTable: string =
          predictionStructureWithPluralEvaluationLabelObject.predictionStructureFoundationDisplay.labelsConcatenatedToHtmlTable; // ==== .labelsConcatenated; // ---- NOTE ---- simple concatenated or table output
        const predictedPredictionStructureWithPluralEvaluationLabelObjectHtmlTable: string =
          predictionStructureWithPluralEvaluationLabelObject.predictionStructureFoundationDisplay.labelsPredictedConcatenatedToHtmlTable; // ==== .labelsPredictedConcatenated; // ---- NOTE ---- simple concatenated or table output
        const predictingMisclassifiedUtterancesArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithPluralEvaluationLabelObject.text),
          labelsPredictionStructureWithPluralEvaluationLabelObjectHtmlTable,
          predictedPredictionStructureWithPluralEvaluationLabelObjectHtmlTable,
        ];
        predictingMisclassifiedUtterancesArrays.push(predictingMisclassifiedUtterancesArray);
        const labelsConcatenated: string =
          predictionStructureWithPluralEvaluationLabelObject.predictionStructureFoundationDisplay.labelsConcatenated;
        const labelsPredictedConcatenated: string =
          predictionStructureWithPluralEvaluationLabelObject.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
        const predictingMisclassifiedUtterancesSimpleArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithPluralEvaluationLabelObject.text),
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        predictingMisclassifiedUtterancesSimpleArrays.push(predictingMisclassifiedUtterancesSimpleArray);
      }
    }
    const predictingMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Misclassified utterances and their labels',
      predictingMisclassifiedUtterancesArrays,
      ['Utterance', 'Labels', 'Predictions']);
    return {predictingMisclassifiedUtterancesArrays, predictingMisclassifiedUtterancesArraysHtml, predictingMisclassifiedUtterancesSimpleArrays};
  }

  public static generateAssessmentLabelObjectConfusionMatrixMetricsAndHtmlTable(
    predictionStructureWithPluralEvaluationLabelObjectArray: PredictionStructureWithPluralEvaluationLabelObject[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    const confusionMatrix: MultiLabelObjectConfusionMatrix = new MultiLabelObjectConfusionMatrix(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.ObjectLabelConfusionMatrixToIncludeTrueNegatives);
    const multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact = new MultiLabelObjectConfusionMatrixExact(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.ObjectLabelConfusionMatrixToIncludeTrueNegatives);
    const multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset = new MultiLabelObjectConfusionMatrixSubset(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.ObjectLabelConfusionMatrixToIncludeTrueNegatives);
    for (const predictionStructureWithPluralEvaluationLabelObject of predictionStructureWithPluralEvaluationLabelObjectArray) {
      if (predictionStructureWithPluralEvaluationLabelObject) {
        confusionMatrix.addInstanceByLabelObjects(predictionStructureWithPluralEvaluationLabelObject.labels, predictionStructureWithPluralEvaluationLabelObject.labelsPredicted);
        multiLabelObjectConfusionMatrixExact.addInstanceByLabelObjects(predictionStructureWithPluralEvaluationLabelObject.labels, predictionStructureWithPluralEvaluationLabelObject.labelsPredicted);
        multiLabelObjectConfusionMatrixSubset.addInstanceByLabelObjects(predictionStructureWithPluralEvaluationLabelObject.labels, predictionStructureWithPluralEvaluationLabelObject.labelsPredicted);
      }
    }
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
      confusionMatrix,
      multiLabelObjectConfusionMatrixExact,
      multiLabelObjectConfusionMatrixSubset,
      labelArrayAndMap);
  }

  public static assessLabelObjectSpuriousPredictions(
    groundTruthSetUtteranceLabelsMap: Map<string, Label[]>,
    predictionSetUtteranceLabelsMap: Map<string, Label[]>): [string, Label[]][] {
    const spuriousPredictions: [string, Label[]][] = [];
    for (const predictionSetUtteranceLabels of predictionSetUtteranceLabelsMap.entries()) {
      const utterance: string = predictionSetUtteranceLabels[0];
      // eslint-disable-next-line no-prototype-builtins
      if (!groundTruthSetUtteranceLabelsMap.has(utterance)) {
        spuriousPredictions.push([utterance, predictionSetUtteranceLabels[1]]);
      }
    }
    return spuriousPredictions;
  }

  public static assessLabelObjectPredictions(
    groundTruthSetUtteranceLabelsMap: Map<string, Label[]>,
    predictionSetUtteranceLabelsMap: Map<string, Label[]>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): PredictionStructureWithPluralEvaluationLabelObject[] {
    const predictionStructureWithPluralEvaluationLabelObjectArray: PredictionStructureWithPluralEvaluationLabelObject[] = [];
    for (const groundTruthSetUtteranceLabels of groundTruthSetUtteranceLabelsMap.entries()) {
      const utterance: string = groundTruthSetUtteranceLabels[0];
      const groundTruthSetLabels: Label[] = groundTruthSetUtteranceLabels[1];
      let predictionSetLabels: Label[] = [];
      // eslint-disable-next-line no-prototype-builtins
      if (predictionSetUtteranceLabelsMap.has(utterance)) {
        predictionSetLabels = predictionSetUtteranceLabelsMap.get(utterance) as Label[];
      }
      const groundTruthSetLabelsIndexes: number[] = groundTruthSetLabels.map(
        (x: Label) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x.name));
      const groundTruthSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
        groundTruthSetLabels.map((x: Label) => Utility.outputLabelStringUtility(x)));
      const groundTruthSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        'Label',
        groundTruthSetLabels.map((x: Label) => Utility.outputLabelStringUtility(x)));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessLabelObjectPredictions(), finished processing groundTruthSetLabelsIndexes, utterance=${utterance}`);
      }
      const predictionSetLabelsIndexes: number[] = predictionSetLabels.map(
        (x: Label) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x.name));
      const predictionSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
        predictionSetLabels.map((x: Label) => Utility.outputLabelStringUtility(x)));
      const predictionSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        'Label',
        predictionSetLabels.map((x: Label) => Utility.outputLabelStringUtility(x)));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessLabelObjectPredictions(), finished processing predictionSetLabelsIndexes, utterance=${utterance}`);
      }
      const labelsPredictionEvaluation: number[] = Utility.evaluateLabelObjectPrediction(
        groundTruthSetLabels,
        predictionSetLabels);
      predictionStructureWithPluralEvaluationLabelObjectArray.push(new PredictionStructureWithPluralEvaluationLabelObject(
        utterance,
        labelsPredictionEvaluation,
        -1, // ---- NOTE-TO-REEXAMINE ----
        groundTruthSetLabels,
        groundTruthSetLabelsConcatenated,
        groundTruthSetLabelsConcatenatedToHtmlTable,
        groundTruthSetLabelsIndexes,
        predictionSetLabels,
        predictionSetLabelsConcatenated,
        predictionSetLabelsConcatenatedToHtmlTable,
        predictionSetLabelsIndexes));
    }
    return predictionStructureWithPluralEvaluationLabelObjectArray;
  }

  public static evaluateLabelObjectPrediction(groundTruths: Label[], predictions: Label[]): number[] {
    const microConfusionMatrix: number[] = [0, 0, 0];
    for (const prediction of predictions) {
      let predictionIsInGroundTruth: boolean = false;
      for (const groundTruth of groundTruths) {
        if (prediction.equals(groundTruth)) {
          predictionIsInGroundTruth = true;
          break;
        }
      }
      if (predictionIsInGroundTruth) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForTruePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForTruePositive for
        // ---- NOTE ---- true positive as the prediction is in the ground-truth set.
      } else {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalsePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalsePositive for
        // ---- NOTE ---- false positive as the prediction is not in the ground-truth set.
      }
    }
    for (const groundTruth of groundTruths) {
      let groundTruthInPrediction: boolean = false;
      for (const prediction of predictions) {
        if (groundTruth.equals(prediction)) {
          groundTruthInPrediction = true;
          break;
        }
      }
      if (!groundTruthInPrediction) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalseNegative]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalseNegative for
        // ---- NOTE ---- false negative as the ground-truth is not in the prediction set.
      }
    }
    return microConfusionMatrix;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- create
  // -------------------------------------------------------------------------

  public static createEmptyLabelStringUnknownSpuriousLabelsStructure(): {
    'utteranceUnknownLabelsMap': Map<string, Set<string>>;
    'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
    'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
    'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
    'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} {
    const unknownSpuriousLabelsProcessed: {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} = {
        utteranceUnknownLabelsMap: new Map<string, Set<string>>(),
        utteranceUnknownLabelDuplicateMap: new Map<string, Set<string>>(),
        utteranceSpuriousLabelsMap: new Map<string, Set<string>>(),
        utteranceSpuriousLabelDuplicateMap: new Map<string, Set<string>>(),
        utteranceLabelMapSetAddedWithUnknownLabel: false,
        utteranceLabelDuplicateMapSetAddedWithUnknownLabel: false};
    return unknownSpuriousLabelsProcessed;
  }

  public static EmptyLabelStringUnknownSpuriousLabelsStructure: {
    'utteranceUnknownLabelsMap': Map<string, Set<string>>;
    'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
    'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
    'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
    'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} =
    Utility.createEmptyLabelStringUnknownSpuriousLabelsStructure();

  public static createEmptyLabelObjectUnknownSpuriousLabelsStructure(): {
    'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
    'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
    'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
    'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
    'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} {
    const unknownSpuriousEntityLabelsProcessed: {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} = {
        utteranceUnknownEntityLabelsMap: new Map<string, Label[]>(),
        utteranceUnknownEntityLabelDuplicateMap: new Map<string, Label[]>(),
        utteranceSpuriousEntityLabelsMap: new Map<string, Label[]>(),
        utteranceSpuriousEntityLabelDuplicateMap: new Map<string, Label[]>(),
        utteranceLabelMapSetAddedWithUnknownLabel: false,
        utteranceLabelDuplicateMapSetAddedWithUnknownLabel: false};
    return unknownSpuriousEntityLabelsProcessed;
  }

  public static EmptyLabelObjectUnknownSpuriousLabelsStructure: {
    'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
    'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
    'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
    'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
    'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;} =
    Utility.createEmptyLabelObjectUnknownSpuriousLabelsStructure();

  // -------------------------------------------------------------------------
  // ---- NOTE ---- generate assessment report files
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateAssessmentEvaluationReportFiles(
    stringArray: string[],
    evaluationSummary: string,
    labelsOutputFilename: string,
    evaluationSetSummaryOutputFilename: string): void {
    // ---- NOTE ---- output the labels by their index order to a file.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), ready to call Utility.storeDataArraysToTsvFile()');
    Utility.storeDataArraysToTsvFile(
      labelsOutputFilename,
      stringArray.map((x: string) => [Utility.outputStringUtility(x)]));
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), finished calling Utility.storeDataArraysToTsvFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), ready to call Utility.dumpFile()');
    Utility.dumpFile(
      evaluationSetSummaryOutputFilename,
      evaluationSummary);
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), finished calling Utility.dumpFile()');
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- assessment report with string labels
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateAssessmentEvaluationReport(
    groundTruthSetLabels: string[],
    predictionSetLabelSet: Set<string>,
    groundTruthSetUtteranceLabelsMap: Map<string, Set<string>>,
    groundTruthSetUtteranceLabelDuplicateMap: Map<string, Set<string>>,
    predictionSetUtteranceLabelsMap: Map<string, Set<string>>,
    predictionSetUtteranceLabelDuplicateMap: Map<string, Set<string>>): {
      'evaluationReportGroundTruthSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportPredictionSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
        // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportSpuriousPredictions': {
        'evaluationSummary': string;
        'spuriousPredictions': [string, string[]][]; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'misclassifiedAnalysis': {
          'predictingMisclassifiedUtterancesArrays': string[][];
          'predictingMisclassifiedUtterancesArraysHtml': string;
          'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithPluralEvaluationLabelStringArray': PredictionStructureWithPluralEvaluationLabelString[];
    } {
    // ---- NOTE ---- load the assessment evaluation summary template.
    const evaluationSummary: string = AssessmentLabelSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report for the ground-truth set.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportGroundTruthSetLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ---- 'spuriousLabelStatisticsAndHtmlTable': {
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelUtterancesTotal': number;
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatistics': string[][];
      // ---- NOTE-SPURIOUS-PLACE-HOLDER ----   'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      groundTruthSetLabels,
      groundTruthSetUtteranceLabelsMap,
      groundTruthSetUtteranceLabelDuplicateMap,
      Utility.createEmptyLabelStringUnknownSpuriousLabelsStructure(),
      '{GROUND_TRUTH_SET_LABEL_TEXT_STATISTICS}',
      '{GROUND_TRUTH_SET_TEXT_DUPLICATES}',
      '',
      predictionSetLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- generate evaluation report for the prediction set.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportPredictionSetLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(
      evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary,
      groundTruthSetLabels,
      predictionSetUtteranceLabelsMap,
      predictionSetUtteranceLabelDuplicateMap,
      Utility.createEmptyLabelStringUnknownSpuriousLabelsStructure(),
      '{PREDICTION_SET_LABEL_TEXT_STATISTICS}',
      '{PREDICTION_SET_TEXT_DUPLICATES}',
      '',
      predictionSetLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- produce prediction evaluation
    const predictionStructureWithPluralEvaluationLabelStringArray: PredictionStructureWithPluralEvaluationLabelString[] = Utility.assessMultiLabelIntentPredictions(
      groundTruthSetUtteranceLabelsMap,
      predictionSetUtteranceLabelsMap,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    // ---- NOTE ---- find spurious predictions
    const evaluationReportSpuriousPredictions: {
      'evaluationSummary': string;
      'spuriousPredictions': [string, string[]][];
    } = Utility.generateAssessmentMultiLabelIntentEvaluationReportSpuriousPredictions(
      evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary,
      groundTruthSetUtteranceLabelsMap,
      predictionSetUtteranceLabelsMap);
    // ---- NOTE ---- generate evaluation report.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.generateAssessmentEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateAssessmentEvaluationReportAnalyses(
      evaluationReportSpuriousPredictions.evaluationSummary,
      predictionStructureWithPluralEvaluationLabelStringArray,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportAnalyses.evaluationSummary=\n${evaluationReportAnalyses.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.generateAssessmentEvaluationReportAnalyses()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), labelArrayAndMap.stringArray=${Utility.jsonStringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), labelArrayAndMap.stringMap=${Utility.jsonStringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), labels=${Utility.jsonStringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportGroundTruthSetLabelUtteranceStatistics,
      evaluationReportPredictionSetLabelUtteranceStatistics,
      evaluationReportSpuriousPredictions,
      evaluationReportAnalyses,
      predictionStructureWithPluralEvaluationLabelStringArray};
  }

  public static generateAssessmentMultiLabelIntentEvaluationReportSpuriousPredictions(
    evaluationSummary: string,
    groundTruthSetUtteranceLabelsMap: Map<string, Set<string>>,
    predictionSetUtteranceLabelsMap: Map<string, Set<string>>): {
      'evaluationSummary': string;
      'spuriousPredictions': [string, string[]][];
    } {
    const spuriousPredictions: [string, string[]][] = Utility.assessMultiLabelIntentSpuriousPredictions(
      groundTruthSetUtteranceLabelsMap,
      predictionSetUtteranceLabelsMap).map((x: [string, Set<string>]) => [x[0], [...x[1]]]);
    const spuriousPredictionArrays: [string, string][] = spuriousPredictions.map(
      (spuriousPrediction: [string, string[]]) => [spuriousPrediction[0], Utility.concatenateDataArrayToHtmlTable('Label', [...spuriousPrediction[1]])]);
    // ---- NOTE ---- generate spurious report.
    const spuriousPredictionHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Spurious utterance and label pairs',
      spuriousPredictionArrays,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCES summary from template.
    evaluationSummary = evaluationSummary.replace(
      '{SPURIOUS_UTTERANCES}',
      spuriousPredictionHtml);
    return {
      evaluationSummary,
      spuriousPredictions};
  }

  // eslint-disable-next-line max-params
  public static generateAssessmentEvaluationReportAnalyses(
    evaluationSummary: string,
    predictionStructureWithPluralEvaluationLabelStringArray: PredictionStructureWithPluralEvaluationLabelString[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } {
    // ---- NOTE ---- generate misclassified HTML.
    const misclassifiedAnalysis: {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } = Utility.generateAssessmentMisclassifiedStatisticsAndHtmlTable(
      predictionStructureWithPluralEvaluationLabelStringArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}',
      misclassifiedAnalysis.predictingMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable(
      predictionStructureWithPluralEvaluationLabelStringArray,
      labelArrayAndMap);
    evaluationSummary = evaluationSummary.replace(
      '{MODEL_EVALUATION}',
      confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageDescriptionMetricsHtml);
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportAnalyses(), finished generating {MODEL_EVALUATION} content');
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      misclassifiedAnalysis,
      confusionMatrixAnalysis};
  }

  public static generateAssessmentMisclassifiedStatisticsAndHtmlTable(
    predictionStructureWithPluralEvaluationLabelStringArray: PredictionStructureWithPluralEvaluationLabelString[]): {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const predictingMisclassifiedUtterancesArrays: string[][] = [];
    const predictingMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionStructureWithPluralEvaluationLabelString of predictionStructureWithPluralEvaluationLabelStringArray.filter((x: PredictionStructureWithPluralEvaluationLabelString) => (x.isMisclassified()))) {
      if (predictionStructureWithPluralEvaluationLabelString) {
        const labelsPredictionStructureWithPluralEvaluationLabelStringHtmlTable: string =
          predictionStructureWithPluralEvaluationLabelString.predictionStructureFoundationDisplay.labelsConcatenatedToHtmlTable; // ==== .labelsConcatenated; // ---- NOTE ---- simple concatenated or table output
        const predictedPredictionStructureWithPluralEvaluationLabelStringHtmlTable: string =
          predictionStructureWithPluralEvaluationLabelString.predictionStructureFoundationDisplay.labelsPredictedConcatenatedToHtmlTable; // ==== .labelsPredictedConcatenated; // ---- NOTE ---- simple concatenated or table output
        const predictingMisclassifiedUtterancesArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithPluralEvaluationLabelString.text),
          labelsPredictionStructureWithPluralEvaluationLabelStringHtmlTable,
          predictedPredictionStructureWithPluralEvaluationLabelStringHtmlTable,
        ];
        predictingMisclassifiedUtterancesArrays.push(predictingMisclassifiedUtterancesArray);
        const labelsConcatenated: string =
          predictionStructureWithPluralEvaluationLabelString.predictionStructureFoundationDisplay.labelsConcatenated;
        const labelsPredictedConcatenated: string =
          predictionStructureWithPluralEvaluationLabelString.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
        const predictingMisclassifiedUtterancesSimpleArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithPluralEvaluationLabelString.text),
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        predictingMisclassifiedUtterancesSimpleArrays.push(predictingMisclassifiedUtterancesSimpleArray);
      }
    }
    const predictingMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Misclassified utterances and their labels',
      predictingMisclassifiedUtterancesArrays,
      ['Utterance', 'Labels', 'Predictions']);
    return {predictingMisclassifiedUtterancesArrays, predictingMisclassifiedUtterancesArraysHtml, predictingMisclassifiedUtterancesSimpleArrays};
  }

  public static generateAssessmentConfusionMatrixMetricsAndHtmlTable<TL>(
    predictionStructureArray: PredictionStructure<TL>[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    const confusionMatrix: MultiLabelConfusionMatrix = new MultiLabelConfusionMatrix(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.StringLabelConfusionMatrixToIncludeTrueNegatives);
    const multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact = new MultiLabelObjectConfusionMatrixExact(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.StringLabelConfusionMatrixToIncludeTrueNegatives);
    const multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset = new MultiLabelObjectConfusionMatrixSubset(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap,
      Utility.StringLabelConfusionMatrixToIncludeTrueNegatives);
    for (const predictionStructure of predictionStructureArray) {
      if (predictionStructure) {
        confusionMatrix.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
        multiLabelObjectConfusionMatrixExact.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
        multiLabelObjectConfusionMatrixSubset.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
      }
    }
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
      confusionMatrix,
      multiLabelObjectConfusionMatrixExact,
      multiLabelObjectConfusionMatrixSubset,
      labelArrayAndMap);
  }

  // eslint-disable-next-line complexity
  public static generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
    confusionMatrix: IConfusionMatrix,
    multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact,
    multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    const predictingConfusionMatrixOutputLines: string[][] = [];
    const binaryConfusionMatrices: BinaryConfusionMatrix[] = confusionMatrix.getBinaryConfusionMatrices();
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices.length=${binaryConfusionMatrices.length}`);
    for (let i: number = 0; i < binaryConfusionMatrices.length; i++) {
      const label: string = Utility.carefullyAccessStringArray(labelArrayAndMap.stringArray, i);
      const precision: number = Utility.round(binaryConfusionMatrices[i].getPrecision());
      const recall: number = Utility.round(binaryConfusionMatrices[i].getRecall());
      const f1: number = Utility.round(binaryConfusionMatrices[i].getF1Measure());
      const accuracy: number = Utility.round(binaryConfusionMatrices[i].getAccuracy());
      const truePositives: number = binaryConfusionMatrices[i].getTruePositives();
      const falsePositives: number = binaryConfusionMatrices[i].getFalsePositives();
      const trueNegatives: number = binaryConfusionMatrices[i].getTrueNegatives();
      const falseNegatives: number = binaryConfusionMatrices[i].getFalseNegatives();
      const support: number = binaryConfusionMatrices[i].getSupport();
      const total: number = binaryConfusionMatrices[i].getTotal();
      const predictingConfusionMatrixOutputLine: any[] = [
        Utility.outputStringUtility(label),
        precision,
        recall,
        f1,
        accuracy,
        truePositives,
        falsePositives,
        trueNegatives,
        falseNegatives,
        support,
        total,
      ];
      predictingConfusionMatrixOutputLines.push(predictingConfusionMatrixOutputLine);
      Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices[${i}].getTotal()         =${binaryConfusionMatrices[i].getTotal()}`);
      Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices[${i}].getTruePositives() =${binaryConfusionMatrices[i].getTruePositives()}`);
      Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices[${i}].getFalsePositives()=${binaryConfusionMatrices[i].getFalsePositives()}`);
      Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices[${i}].getTrueNegatives() =${binaryConfusionMatrices[i].getTrueNegatives()}`);
      Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), binaryConfusionMatrices[${i}].getFalseNegatives()=${binaryConfusionMatrices[i].getFalseNegatives()}`);
    }
    const confusionMatrixMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Confusion matrix metrics',
      predictingConfusionMatrixOutputLines,
      ['Label', 'Precision', 'Recall', 'F1', 'Accuracy', '#TruePositives', '#FalsePositives', '#TrueNegatives', '#FalseNegatives', 'Support', 'Total']);
    // -----------------------------------------------------------------------
    const predictingConfusionMatrixAverageOutputLines: string[][] = [];
    const predictingConfusionMatrixAverageDescriptionOutputLines: string[][] = [];
    // -----------------------------------------------------------------------
    const microAverageMetrics: {
      'averagePrecisionRecallF1Accuracy': number;
      'truePositives': number;
      'falsePositives': number;
      'falseNegatives': number;
      'total': number;
    } = confusionMatrix.getMicroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineMicroAverage: any[] = [
      Utility.ColumnNameMicroAverage,
      'N/A', // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
      'N/A', // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
      'N/A', // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
      Utility.getBolded(Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy)), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
      microAverageMetrics.truePositives,
      'N/A', // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
      'N/A',
      microAverageMetrics.falseNegatives,
      'N/A',
      microAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMicroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMicroAverage,
      Utility.DescriptionMicroAverage,
    ]);
    // -----------------------------------------------------------------------
    const microQuantileMetrics: {
      'quantilesPrecisions': number[];
      'quantilesRecalls': number[];
      'quantilesF1Scores': number[];
      'quantilesTruePositives': number[];
      'quantilesFalsePositives': number[];
      'quantilesTrueNegatives': number[];
      'quantilesFalseNegatives': number[];
      'quantilesAccuracies': number[];
      'quantilesSupports': number[];
      'total': number;
    } = confusionMatrix.getMicroQuantileMetrics([], 4);
    const predictingConfusionMatrixOutputLineMicroQuantile1: any[] = [
      Utility.ColumnNameMicroFirstQuartile,
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 1) ?
        Utility.round(microQuantileMetrics.quantilesPrecisions[1]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 1) ?
        Utility.round(microQuantileMetrics.quantilesRecalls[1]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 1) ?
        Utility.getBolded(Utility.round(microQuantileMetrics.quantilesF1Scores[1])) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 1) ?
        Utility.getBolded(Utility.round(microQuantileMetrics.quantilesAccuracies[1])) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 1) ?
        microQuantileMetrics.quantilesTruePositives[1] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 1) ?
        microQuantileMetrics.quantilesFalsePositives[1] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 1) ?
        microQuantileMetrics.quantilesTrueNegatives[1] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 1) ?
        microQuantileMetrics.quantilesFalseNegatives[1] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 1) ?
        microQuantileMetrics.quantilesSupports[1] : 'N/A',
      microQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMicroQuantile1);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMicroFirstQuartile,
      Utility.DescriptionMicroFirstQuartile,
    ]);
    const predictingConfusionMatrixOutputLineMicroQuantile2: any[] = [
      Utility.ColumnNameMicroMedian,
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 2) ?
        Utility.round(microQuantileMetrics.quantilesPrecisions[2]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 2) ?
        Utility.round(microQuantileMetrics.quantilesRecalls[2]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 2) ?
        Utility.getBolded(Utility.round(microQuantileMetrics.quantilesF1Scores[2])) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 2) ?
        Utility.getBolded(Utility.round(microQuantileMetrics.quantilesAccuracies[2])) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 2) ?
        microQuantileMetrics.quantilesTruePositives[2] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 2) ?
        microQuantileMetrics.quantilesFalsePositives[2] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 2) ?
        microQuantileMetrics.quantilesTrueNegatives[2] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 2) ?
        microQuantileMetrics.quantilesFalseNegatives[2] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 2) ?
        microQuantileMetrics.quantilesSupports[2] : 'N/A',
      microQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMicroQuantile2);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMicroMedian,
      Utility.DescriptionMicroMedian,
    ]);
    const predictingConfusionMatrixOutputLineMicroQuantile3: any[] = [
      Utility.ColumnNameMicroThirdQuartile,
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 3) ?
        Utility.round(microQuantileMetrics.quantilesPrecisions[3]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 3) ?
        Utility.round(microQuantileMetrics.quantilesRecalls[3]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 3) ?
        Utility.round(microQuantileMetrics.quantilesF1Scores[3]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 3) ?
        Utility.round(microQuantileMetrics.quantilesAccuracies[3]) : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 3) ?
        microQuantileMetrics.quantilesTruePositives[3] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 3) ?
        microQuantileMetrics.quantilesFalsePositives[3] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 3) ?
        microQuantileMetrics.quantilesTrueNegatives[3] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 3) ?
        microQuantileMetrics.quantilesFalseNegatives[3] : 'N/A',
      Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 3) ?
        microQuantileMetrics.quantilesSupports[3] : 'N/A',
      microQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMicroQuantile3);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMicroThirdQuartile,
      Utility.DescriptionMicroThirdQuartile,
    ]);
    // -----------------------------------------------------------------------
    const macroQuantileMetrics: {
      'quantilesPrecisions': number[];
      'quantilesRecalls': number[];
      'quantilesF1Scores': number[];
      'quantilesTruePositives': number[];
      'quantilesFalsePositives': number[];
      'quantilesTrueNegatives': number[];
      'quantilesFalseNegatives': number[];
      'quantilesAccuracies': number[];
      'quantilesSupports': number[];
      'total': number;
    } = confusionMatrix.getMacroQuantileMetrics([], 4);
    const predictingConfusionMatrixOutputLineMacroQuantile1: any[] = [
      Utility.ColumnNameMacroFirstQuartile,
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 1) ?
        Utility.round(macroQuantileMetrics.quantilesPrecisions[1]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 1) ?
        Utility.round(macroQuantileMetrics.quantilesRecalls[1]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 1) ?
        Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesF1Scores[1])) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 1) ?
        Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesAccuracies[1])) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 1) ?
        macroQuantileMetrics.quantilesTruePositives[1] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 1) ?
        macroQuantileMetrics.quantilesFalsePositives[1] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 1) ?
        macroQuantileMetrics.quantilesTrueNegatives[1] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 1) ?
        macroQuantileMetrics.quantilesFalseNegatives[1] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 1) ?
        macroQuantileMetrics.quantilesSupports[1] : 'N/A',
      macroQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMacroQuantile1);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMacroFirstQuartile,
      Utility.DescriptionMacroFirstQuartile,
    ]);
    const predictingConfusionMatrixOutputLineMacroQuantile2: any[] = [
      Utility.ColumnNameMacroMedian,
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 2) ?
        Utility.round(macroQuantileMetrics.quantilesPrecisions[2]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 2) ?
        Utility.round(macroQuantileMetrics.quantilesRecalls[2]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 2) ?
        Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesF1Scores[2])) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 2) ?
        Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesAccuracies[2])) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 2) ?
        macroQuantileMetrics.quantilesTruePositives[2] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 2) ?
        macroQuantileMetrics.quantilesFalsePositives[2] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 2) ?
        macroQuantileMetrics.quantilesTrueNegatives[2] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 2) ?
        macroQuantileMetrics.quantilesFalseNegatives[2] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 2) ?
        macroQuantileMetrics.quantilesSupports[2] : 'N/A',
      macroQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMacroQuantile2);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMacroMedian,
      Utility.DescriptionMacroMedian,
    ]);
    const predictingConfusionMatrixOutputLineMacroQuantile3: any[] = [
      Utility.ColumnNameMacroThirdQuartile,
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 3) ?
        Utility.round(macroQuantileMetrics.quantilesPrecisions[3]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 3) ?
        Utility.round(macroQuantileMetrics.quantilesRecalls[3]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 3) ?
        Utility.round(macroQuantileMetrics.quantilesF1Scores[3]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 3) ?
        Utility.round(macroQuantileMetrics.quantilesAccuracies[3]) : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 3) ?
        macroQuantileMetrics.quantilesTruePositives[3] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 3) ?
        macroQuantileMetrics.quantilesFalsePositives[3] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 3) ?
        macroQuantileMetrics.quantilesTrueNegatives[3] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 3) ?
        macroQuantileMetrics.quantilesFalseNegatives[3] : 'N/A',
      Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 3) ?
        macroQuantileMetrics.quantilesSupports[3] : 'N/A',
      macroQuantileMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMacroQuantile3);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMacroThirdQuartile,
      Utility.DescriptionMacroThirdQuartile,
    ]);
    // -----------------------------------------------------------------------
    const summationMicroAverageMetrics: {
      'summationPrecision': number;
      'summationRecall': number;
      'summationF1Score': number;
      'summationAccuracy': number;
      'summationTruePositives': number;
      'summationFalsePositives': number;
      'summationTrueNegatives': number;
      'summationFalseNegatives': number;
      'summationSupport': number;
      'total': number;
    } = confusionMatrix.getSummationMicroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineSummationMicroAverage: any[] = [
      Utility.ColumnNameSummationMicroAverage,
      Utility.round(summationMicroAverageMetrics.summationPrecision),
      Utility.round(summationMicroAverageMetrics.summationRecall),
      Utility.getBolded(Utility.round(summationMicroAverageMetrics.summationF1Score)),
      Utility.getBolded(Utility.round(summationMicroAverageMetrics.summationAccuracy)),
      Utility.round(summationMicroAverageMetrics.summationTruePositives),
      Utility.round(summationMicroAverageMetrics.summationFalsePositives),
      Utility.round(summationMicroAverageMetrics.summationTrueNegatives),
      Utility.round(summationMicroAverageMetrics.summationFalseNegatives),
      Utility.round(summationMicroAverageMetrics.summationSupport),
      'N/A', // ---- summationMicroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineSummationMicroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameSummationMicroAverage,
      Utility.DescriptionSummationMicroAverage,
    ]);
    // -----------------------------------------------------------------------
    const macroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineMacroAverage: any[] = [
      Utility.ColumnNameMacroAverage,
      Utility.round(macroAverageMetrics.averagePrecision),
      Utility.round(macroAverageMetrics.averageRecall),
      Utility.getBolded(Utility.round(macroAverageMetrics.averageF1Score)),
      Utility.getBolded(Utility.round(macroAverageMetrics.averageAccuracy)),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageTruePositives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageFalsePositives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageTrueNegatives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageFalseNegatives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageSupport),
      'N/A', // ---- macroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameMacroAverage,
      Utility.DescriptionMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const summationMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getSummationMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineSummationMacroAverage: any[] = [
      Utility.ColumnNameSummationMacroAverage,
      Utility.round(summationMacroAverageMetrics.averagePrecision),
      Utility.round(summationMacroAverageMetrics.averageRecall),
      Utility.round(summationMacroAverageMetrics.averageF1Score),
      Utility.round(summationMacroAverageMetrics.averageAccuracy),
      Utility.round(summationMacroAverageMetrics.averageTruePositives),
      Utility.round(summationMacroAverageMetrics.averageFalsePositives),
      Utility.round(summationMacroAverageMetrics.averageTrueNegatives),
      Utility.round(summationMacroAverageMetrics.averageFalseNegatives),
      Utility.round(summationMacroAverageMetrics.averageSupport),
      'N/A', // ---- summationMacroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineSummationMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameSummationMacroAverage,
      Utility.DescriptionSummationMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const positiveSupportLabelMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getPositiveSupportLabelMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLinePositiveSupportLabelMacroAverage: any[] = [
      Utility.ColumnNamePositiveSupportMacroAverage,
      Utility.round(positiveSupportLabelMacroAverageMetrics.averagePrecision),
      Utility.round(positiveSupportLabelMacroAverageMetrics.averageRecall),
      Utility.round(positiveSupportLabelMacroAverageMetrics.averageF1Score),
      Utility.round(positiveSupportLabelMacroAverageMetrics.averageAccuracy),
      'N/A', // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageTruePositives),
      'N/A', // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageFalsePositives),
      'N/A', // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageTrueNegatives),
      'N/A', // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageFalseNegatives),
      'N/A', // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageSupport),
      'N/A', // ---- positiveSupportLabelMacroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLinePositiveSupportLabelMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNamePositiveSupportMacroAverage,
      Utility.DescriptionPositiveSupportMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const positiveSupportLabelSummationMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage: any[] = [
      Utility.ColumnNamePositiveSupportSummationMacroAverage,
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averagePrecision),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageRecall),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageF1Score),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageAccuracy),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageTruePositives),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageFalsePositives),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageTrueNegatives),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageFalseNegatives),
      Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageSupport),
      'N/A', // ---- positiveSupportLabelSummationMacroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNamePositiveSupportSummationMacroAverage,
      Utility.DescriptionPositiveSupportSummationMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const weightedMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getWeightedMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineWeightedMacroAverage: any[] = [
      Utility.ColumnNameWeightedMacroAverage,
      Utility.round(weightedMacroAverageMetrics.averagePrecision),
      Utility.round(weightedMacroAverageMetrics.averageRecall),
      Utility.round(weightedMacroAverageMetrics.averageF1Score),
      Utility.round(weightedMacroAverageMetrics.averageAccuracy),
      'N/A',
      'N/A',
      'N/A',
      'N/A',
      'N/A',
      'N/A', // ---- weightedMacroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineWeightedMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameWeightedMacroAverage,
      Utility.DescriptionWeightedMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const summationWeightedMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getSummationWeightedMacroAverageMetrics([]);
    const predictingConfusionMatrixOutputLineSummationWeightedMacroAverage: any[] = [
      Utility.ColumnNameWeightedSummationMacroAverage,
      Utility.round(summationWeightedMacroAverageMetrics.averagePrecision),
      Utility.round(summationWeightedMacroAverageMetrics.averageRecall),
      Utility.round(summationWeightedMacroAverageMetrics.averageF1Score),
      Utility.round(summationWeightedMacroAverageMetrics.averageAccuracy),
      Utility.round(summationWeightedMacroAverageMetrics.averageTruePositives),
      Utility.round(summationWeightedMacroAverageMetrics.averageFalsePositives),
      Utility.round(summationWeightedMacroAverageMetrics.averageTrueNegatives),
      Utility.round(summationWeightedMacroAverageMetrics.averageFalseNegatives),
      Utility.round(summationWeightedMacroAverageMetrics.averageSupport),
      'N/A', // ---- summationWeightedMacroAverageMetrics.total,
    ];
    predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineSummationWeightedMacroAverage);
    predictingConfusionMatrixAverageDescriptionOutputLines.push([
      Utility.ColumnNameWeightedSummationMacroAverage,
      Utility.DescriptionWeightedSummationMacroAverage,
    ]);
    // -----------------------------------------------------------------------
    const exactMacroAggregateMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics([]);
    if (exactMacroAggregateMetrics.total > 0) {
      const predictingConfusionMatrixOutputLineExactMacroAggregate: any[] = [
        Utility.ColumnNameMultiLabelExactAggregate,
        Utility.round(exactMacroAggregateMetrics.averagePrecision),
        Utility.round(exactMacroAggregateMetrics.averageRecall),
        Utility.getBolded(Utility.round(exactMacroAggregateMetrics.averageF1Score)),
        Utility.getBolded(Utility.round(exactMacroAggregateMetrics.averageAccuracy)),
        Utility.round(exactMacroAggregateMetrics.averageTruePositives),
        Utility.round(exactMacroAggregateMetrics.averageFalsePositives),
        Utility.round(exactMacroAggregateMetrics.averageTrueNegatives),
        Utility.round(exactMacroAggregateMetrics.averageFalseNegatives),
        Utility.round(exactMacroAggregateMetrics.averageSupport),
        exactMacroAggregateMetrics.total,
      ];
      predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineExactMacroAggregate);
      predictingConfusionMatrixAverageDescriptionOutputLines.push([
        Utility.ColumnNameMultiLabelExactAggregate,
        Utility.DescriptionMultiLabelExactAggregate,
      ]);
    }
    // -----------------------------------------------------------------------
    const subsetMacroAggregateMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageTruePositives': number;
      'averageFalsePositives': number;
      'averageTrueNegatives': number;
      'averageFalseNegatives': number;
      'averageSupport': number;
      'total': number;
    } = multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics([]);
    if (subsetMacroAggregateMetrics.total > 0) {
      const predictingConfusionMatrixOutputLineSubsetMacroAggregate: any[] = [
        Utility.ColumnNameMultiLabelSubsetAggregate,
        Utility.round(subsetMacroAggregateMetrics.averagePrecision),
        Utility.round(subsetMacroAggregateMetrics.averageRecall),
        Utility.getBolded(Utility.round(subsetMacroAggregateMetrics.averageF1Score)),
        Utility.getBolded(Utility.round(subsetMacroAggregateMetrics.averageAccuracy)),
        Utility.round(subsetMacroAggregateMetrics.averageTruePositives),
        Utility.round(subsetMacroAggregateMetrics.averageFalsePositives),
        Utility.round(subsetMacroAggregateMetrics.averageTrueNegatives),
        Utility.round(subsetMacroAggregateMetrics.averageFalseNegatives),
        Utility.round(subsetMacroAggregateMetrics.averageSupport),
        subsetMacroAggregateMetrics.total,
      ];
      predictingConfusionMatrixAverageOutputLines.push(predictingConfusionMatrixOutputLineSubsetMacroAggregate);
      predictingConfusionMatrixAverageDescriptionOutputLines.push([
        Utility.ColumnNameMultiLabelSubsetAggregate,
        Utility.DescriptionMultiLabelSubsetAggregate,
      ]);
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), confusionMatrix.getMicroAverageMetrics()=                                           ${Utility.jsonStringify(confusionMatrix.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), confusionMatrix.getMacroAverageMetrics()=                                           ${Utility.jsonStringify(confusionMatrix.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), confusionMatrix.getWeightedMacroAverageMetrics()=                                   ${Utility.jsonStringify(confusionMatrix.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getMicroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getWeightedMacroAverageMetrics()=              ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()=         ${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives() =${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()}`);
    Utility.debuggingLog('Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), finished generating {MODEL_EVALUATION} content');
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getMicroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getWeightedMacroAverageMetrics()=              ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()         =${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives() =${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()}`);
    Utility.debuggingLog('Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), finished generating {MODEL_EVALUATION} content');
    // -----------------------------------------------------------------------
    const confusionMatrixAverageMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Average confusion matrix metrics',
      predictingConfusionMatrixAverageOutputLines,
      ['Type', 'Precision', 'Recall', 'F1', 'Accuracy', '#TruePositives', '#FalsePositives', '#TrueNegatives', '#FalseNegatives', 'Support', 'Total']);
    const confusionMatrixAverageDescriptionMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Average confusion matrix metric descriptions',
      predictingConfusionMatrixAverageDescriptionOutputLines,
      ['Type', 'Description']);
    // -----------------------------------------------------------------------
    return {
      confusionMatrix,
      multiLabelObjectConfusionMatrixExact,
      multiLabelObjectConfusionMatrixSubset,
      predictingConfusionMatrixOutputLines,
      confusionMatrixMetricsHtml,
      confusionMatrixAverageMetricsHtml,
      confusionMatrixAverageDescriptionMetricsHtml};
    // -----------------------------------------------------------------------
  }

  public static assessMultiLabelIntentSpuriousPredictions(
    groundTruthSetUtteranceLabelsMap: Map<string, Set<string>>,
    predictionSetUtteranceLabelsMap: Map<string, Set<string>>): [string, Set<string>][] {
    const spuriousPredictions: [string, Set<string>][] = [];
    for (const predictionSetUtteranceLabels of predictionSetUtteranceLabelsMap.entries()) {
      const utterance: string = predictionSetUtteranceLabels[0];
      // eslint-disable-next-line no-prototype-builtins
      if (!groundTruthSetUtteranceLabelsMap.has(utterance)) {
        spuriousPredictions.push([utterance, predictionSetUtteranceLabels[1]]);
      }
    }
    return spuriousPredictions;
  }

  public static assessMultiLabelIntentPredictions(
    groundTruthSetUtteranceLabelsMap: Map<string, Set<string>>,
    predictionSetUtteranceLabelsMap: Map<string, Set<string>>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): PredictionStructureWithPluralEvaluationLabelString[] {
    const predictionStructureWithPluralEvaluationLabelStringArray: PredictionStructureWithPluralEvaluationLabelString[] = [];
    for (const groundTruthSetUtteranceLabels of groundTruthSetUtteranceLabelsMap.entries()) {
      const utterance: string = groundTruthSetUtteranceLabels[0];
      const groundTruthSetLabels: string[] = [...groundTruthSetUtteranceLabels[1]];
      let predictionSetLabels: string[] = [];
      // eslint-disable-next-line no-prototype-builtins
      if (predictionSetUtteranceLabelsMap.has(utterance)) {
        predictionSetLabels = [...(predictionSetUtteranceLabelsMap.get(utterance) as Set<string>)];
      }
      const groundTruthSetLabelsIndexes: number[] = groundTruthSetLabels.map(
        (x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x));
      const groundTruthSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
        groundTruthSetLabels.map((label: string) => Utility.outputStringUtility(label)));
      const groundTruthSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        'Label',
        groundTruthSetLabels.map((label: string) => Utility.outputStringUtility(label)));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessMultiLabelIntentPredictions(), finished processing groundTruthSetLabelsIndexes, utterance=${utterance}`);
      }
      const predictionSetLabelsIndexes: number[] = predictionSetLabels.map(
        (x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x));
      const predictionSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
        predictionSetLabels.map((label: string) => Utility.outputStringUtility(label)));
      const predictionSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        'Label',
        predictionSetLabels.map((label: string) => Utility.outputStringUtility(label)));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessMultiLabelIntentPredictions(), finished processing predictionSetLabelsIndexes, utterance=${utterance}`);
      }
      const labelsPredictionEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(
        groundTruthSetLabels,
        predictionSetLabels);
      predictionStructureWithPluralEvaluationLabelStringArray.push(new PredictionStructureWithPluralEvaluationLabelString(
        utterance,
        [], // ---- NOTE-TO-REEXAMINE ----
        labelsPredictionEvaluation, // ---- NOTE ---- misclassification cases are evaluated using the multi-label subset logic.
        groundTruthSetLabels,
        groundTruthSetLabelsConcatenated,
        groundTruthSetLabelsConcatenatedToHtmlTable,
        groundTruthSetLabelsIndexes,
        predictionSetLabels,
        predictionSetLabelsConcatenated,
        predictionSetLabelsConcatenatedToHtmlTable,
        predictionSetLabelsIndexes));
    }
    return predictionStructureWithPluralEvaluationLabelStringArray;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- generate intent empty evaluation report
  // -------------------------------------------------------------------------

  public static createEmptyLabelStringEvaluationReport(): {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string; };
    'evaluationReportAnalyses': {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};};
    'predictionStructureWithScoreLabelStringArray': PredictionStructureWithScoreLabelString[];
    'scoreOutputLines': string[][];
    'groundTruthJsonContent': string;
    'predictionJsonContent': string;
    } {
    const evaluationOutput: {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'spuriousLabelStatisticsAndHtmlTable': {
          'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
          'spuriousLabelUtterancesTotal': number;
          'spuriousLabelStatistics': string[][];
          'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'ambiguousAnalysis': {
          'scoringAmbiguousUtterancesArrays': string[][];
          'scoringAmbiguousUtterancesArraysHtml': string;
          'scoringAmbiguousUtteranceSimpleArrays': string[][];};
        'misclassifiedAnalysis': {
          'scoringMisclassifiedUtterancesArrays': string[][];
          'scoringMisclassifiedUtterancesArraysHtml': string;
          'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
        'lowConfidenceAnalysis': {
          'scoringLowConfidenceUtterancesArrays': string[][];
          'scoringLowConfidenceUtterancesArraysHtml': string;
          'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithScoreLabelStringArray': PredictionStructureWithScoreLabelString[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } = {
      evaluationReportLabelUtteranceStatistics: {
        evaluationSummary: '',
        labelArrayAndMap: {
          stringArray: [],
          stringMap: new Map<string, number>()},
        labelStatisticsAndHtmlTable: {
          labelUtterancesMap: new Map<string, Set<string>>(),
          labelUtterancesTotal: 0,
          labelStatistics: [],
          labelStatisticsHtml: ''},
        utteranceStatisticsAndHtmlTable: {
          utteranceStatisticsMap: new Map<number, number>(),
          utteranceStatistics: [],
          utteranceCount: 0,
          utteranceStatisticsHtml: ''},
        spuriousLabelStatisticsAndHtmlTable: {
          spuriousLabelUtterancesMap: new Array<[string, Set<string>]>(),
          spuriousLabelUtterancesTotal: 0,
          spuriousLabelStatistics: [],
          spuriousLabelStatisticsHtml: ''},
        utterancesMultiLabelArrays: [],
        utterancesMultiLabelArraysHtml: '',
        utteranceLabelDuplicateHtml: ''},
      evaluationReportAnalyses: {
        evaluationSummary: '',
        ambiguousAnalysis: {
          scoringAmbiguousUtterancesArrays: [],
          scoringAmbiguousUtterancesArraysHtml: '',
          scoringAmbiguousUtteranceSimpleArrays: []},
        misclassifiedAnalysis: {
          scoringMisclassifiedUtterancesArrays: [],
          scoringMisclassifiedUtterancesArraysHtml: '',
          scoringMisclassifiedUtterancesSimpleArrays: []},
        lowConfidenceAnalysis: {
          scoringLowConfidenceUtterancesArrays: [],
          scoringLowConfidenceUtterancesArraysHtml: '',
          scoringLowConfidenceUtterancesSimpleArrays: []},
        confusionMatrixAnalysis: {
          confusionMatrix: new MultiLabelConfusionMatrix([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          multiLabelObjectConfusionMatrixExact: new MultiLabelObjectConfusionMatrixExact([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          multiLabelObjectConfusionMatrixSubset: new MultiLabelObjectConfusionMatrixSubset([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          predictingConfusionMatrixOutputLines: [],
          confusionMatrixMetricsHtml: '',
          confusionMatrixAverageMetricsHtml: '',
          confusionMatrixAverageDescriptionMetricsHtml: ''}},
      predictionStructureWithScoreLabelStringArray: [],
      scoreOutputLines: [],
      groundTruthJsonContent: '',
      predictionJsonContent: '',
    };
    return evaluationOutput;
  }

  public static createEmptyLabelObjectEvaluationReport(): {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string; };
    'evaluationReportAnalyses': {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};};
    'predictionStructureWithScoreLabelObjectArray': PredictionStructureWithScoreLabelObject[];
    'scoreOutputLines': string[][];
    'groundTruthJsonContent': string;
    'predictionJsonContent': string;
    } {
    const evaluationOutput: {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'spuriousLabelStatisticsAndHtmlTable': {
          'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
          'spuriousLabelUtterancesTotal': number;
          'spuriousLabelStatistics': string[][];
          'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'ambiguousAnalysis': {
          'scoringAmbiguousUtterancesArrays': string[][];
          'scoringAmbiguousUtterancesArraysHtml': string;
          'scoringAmbiguousUtteranceSimpleArrays': string[][];};
        'misclassifiedAnalysis': {
          'scoringMisclassifiedUtterancesArrays': string[][];
          'scoringMisclassifiedUtterancesArraysHtml': string;
          'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
        'lowConfidenceAnalysis': {
          'scoringLowConfidenceUtterancesArrays': string[][];
          'scoringLowConfidenceUtterancesArraysHtml': string;
          'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithScoreLabelObjectArray': PredictionStructureWithScoreLabelObject[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } = {
      evaluationReportLabelUtteranceStatistics: {
        evaluationSummary: '',
        labelArrayAndMap: {
          stringArray: [],
          stringMap: new Map<string, number>()},
        labelStatisticsAndHtmlTable: {
          labelUtterancesMap: new Map<string, Set<string>>(),
          labelUtterancesTotal: 0,
          labelStatistics: [],
          labelStatisticsHtml: ''},
        utteranceStatisticsAndHtmlTable: {
          utteranceStatisticsMap: new Map<number, number>(),
          utteranceStatistics: [],
          utteranceCount: 0,
          utteranceStatisticsHtml: ''},
        spuriousLabelStatisticsAndHtmlTable: {
          spuriousLabelUtterancesMap: new Array<[string,  Set<string>]>(),
          spuriousLabelUtterancesTotal: 0,
          spuriousLabelStatistics: [],
          spuriousLabelStatisticsHtml: ''},
        utterancesMultiLabelArrays: [],
        utterancesMultiLabelArraysHtml: '',
        utteranceLabelDuplicateHtml: ''},
      evaluationReportAnalyses: {
        evaluationSummary: '',
        ambiguousAnalysis: {
          scoringAmbiguousUtterancesArrays: [],
          scoringAmbiguousUtterancesArraysHtml: '',
          scoringAmbiguousUtteranceSimpleArrays: []},
        misclassifiedAnalysis: {
          scoringMisclassifiedUtterancesArrays: [],
          scoringMisclassifiedUtterancesArraysHtml: '',
          scoringMisclassifiedUtterancesSimpleArrays: []},
        lowConfidenceAnalysis: {
          scoringLowConfidenceUtterancesArrays: [],
          scoringLowConfidenceUtterancesArraysHtml: '',
          scoringLowConfidenceUtterancesSimpleArrays: []},
        confusionMatrixAnalysis: {
          confusionMatrix: new MultiLabelConfusionMatrix([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          multiLabelObjectConfusionMatrixExact: new MultiLabelObjectConfusionMatrixExact([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          multiLabelObjectConfusionMatrixSubset: new MultiLabelObjectConfusionMatrixSubset([], new Map<string, number>(), Utility.StringLabelConfusionMatrixToIncludeTrueNegatives),
          predictingConfusionMatrixOutputLines: [],
          confusionMatrixMetricsHtml: '',
          confusionMatrixAverageMetricsHtml: '',
          confusionMatrixAverageDescriptionMetricsHtml: ''}},
      predictionStructureWithScoreLabelObjectArray: [],
      scoreOutputLines: [],
      groundTruthJsonContent: '',
      predictionJsonContent: '',
    };
    return evaluationOutput;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- generate evaluation report files
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateEvaluationReportFiles(
    stringArray: string[],
    scoreOutputLines: string[][],
    groundTruthJsonContent: string,
    predictionJsonContent: string,
    evaluationSummary: string,
    labelsOutputFilename: string,
    evaluationSetScoreOutputFilename: string,
    evaluationSetGroundTruthJsonContentFilename: string,
    evaluationSetPredictionJsonContentFilename: string,
    evaluationSetSummaryOutputFilename: string): void {
    // ---- NOTE ---- output the labels by their index order to a file.
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportFiles(), ready to call Utility.storeDataArraysToTsvFile(), filename=${labelsOutputFilename}`);
    Utility.storeDataArraysToTsvFile(
      labelsOutputFilename,
      stringArray.map((x: string) => [Utility.outputStringUtility(x)]));
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportFiles(), finished calling Utility.storeDataArraysToTsvFile()');
    // ---- NOTE ---- produce a score TSV file.
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportFiles(), ready to call Utility.storeDataArraysToTsvFile(), filename=${evaluationSetScoreOutputFilename}`);
    Utility.storeDataArraysToTsvFile(
      evaluationSetScoreOutputFilename,
      scoreOutputLines);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportFiles(), finishing calling Utility.storeDataArraysToTsvFile');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportFiles(), ready to call Utility.dumpFile(), filename=${evaluationSetGroundTruthJsonContentFilename}`);
    Utility.dumpFile(
      evaluationSetGroundTruthJsonContentFilename,
      groundTruthJsonContent);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportFiles(), finished calling Utility.dumpFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportFiles(), ready to call Utility.dumpFile(), filename=${evaluationSetPredictionJsonContentFilename}`);
    Utility.dumpFile(
      evaluationSetPredictionJsonContentFilename,
      predictionJsonContent);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportFiles(), finished calling Utility.dumpFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportFiles(), ready to call Utility.dumpFile(), filename=${evaluationSetSummaryOutputFilename}`);
    Utility.dumpFile(
      evaluationSetSummaryOutputFilename,
      evaluationSummary);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportFiles(), finished calling Utility.dumpFile()');
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- generate intent evaluation report
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateLabelStringEvaluationReport(
    scoringFunctionToPredictionStructureWithScoreLabelString: (
      utteranceLabelsPairArray: [string, string[]][],
      labelArrayAndMap: {
        'stringArray': string[];
        'stringMap': Map<string, number>;},
      multiLabelPredictionThreshold: number,
      unknownLabelPredictionThreshold: number) => PredictionStructureWithScoreLabelString[],
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    ambiguousClosenessThreshold: number,
    lowConfidenceScoreThreshold: number,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number,
    unknownSpuriousLabelsProcessed: {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;}): {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'spuriousLabelStatisticsAndHtmlTable': {
          'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
          'spuriousLabelUtterancesTotal': number;
          'spuriousLabelStatistics': string[][];
          'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'ambiguousAnalysis': {
          'scoringAmbiguousUtterancesArrays': string[][];
          'scoringAmbiguousUtterancesArraysHtml': string;
          'scoringAmbiguousUtteranceSimpleArrays': string[][];};
        'misclassifiedAnalysis': {
          'scoringMisclassifiedUtterancesArrays': string[][];
          'scoringMisclassifiedUtterancesArraysHtml': string;
          'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
        'lowConfidenceAnalysis': {
          'scoringLowConfidenceUtterancesArrays': string[][];
          'scoringLowConfidenceUtterancesArraysHtml': string;
          'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithScoreLabelStringArray': PredictionStructureWithScoreLabelString[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } {
    // ---- NOTE ---- load the evaluation summary template.
    const evaluationSummary: string = EvaluationSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report before calling the score() function.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      dataSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      unknownSpuriousLabelsProcessed,
      '{LABEL_TEXT_STATISTICS}',
      '{TEXT_DUPLICATES}',
      '{SPURIOUS_UTTERANCE_LABELS}',
      (unknownLabelPredictionThreshold > 0)); // ---- NOTE ---- there is no UNKNOWN prediction unless the threshold is higher than 0.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- collect utterance prediction and scores.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call scoringFunctionToPredictionStructureWithScoreLabelString()');
    const utteranceLabelsPairArray: [string, string[]][] = [...utteranceLabelsMap.entries()].map((x: [string, Set<string>]) => [x[0], [...x[1]]]);
    const predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[] =
      scoringFunctionToPredictionStructureWithScoreLabelString(
        utteranceLabelsPairArray,
        evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
        multiLabelPredictionThreshold,
        unknownLabelPredictionThreshold);
    // ---- NOTE-REFACTORED ---- const predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[] = UtilityLabelResolver.score(
    // ---- NOTE-REFACTORED ----   utteranceLabelsPairArray,
    // ---- NOTE-REFACTORED ----   evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
    // ---- NOTE-REFACTORED ----   multiLabelPredictionThreshold,
    // ---- NOTE-REFACTORED ----   unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling scoringFunctionToPredictionStructureWithScoreLabelString()');
    // ---- NOTE ---- generate evaluation report after calling the score() function.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call Utility.generateLabelStringEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateLabelStringEvaluationReportAnalyses(
      evaluationReportLabelUtteranceStatistics.evaluationSummary,
      evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
      predictionStructureWithScoreLabelStringArray,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling Utility.generateLabelStringEvaluationReportAnalyses()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call Utility.generateLabelStringScoreOutputLines()');
    const scoreOutputLines: string[][] = Utility.generateLabelStringScoreOutputLines(
      predictionStructureWithScoreLabelStringArray);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling Utility.generateLabelStringScoreOutputLines()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call Utility.generateLabelStringGroundTruthJsons()');
    const groundTruthJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = Utility.generateLabelStringGroundTruthJsons(
      predictionStructureWithScoreLabelStringArray);
    const groundTruthJsonContent: string = Utility.jsonStringify(groundTruthJsons);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling Utility.generateLabelStringGroundTruthJsons()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), ready to call Utility.generateLabelStringPredictionJsons()');
    const predictionJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> = Utility.generateLabelStringPredictionJsons(
      predictionStructureWithScoreLabelStringArray);
    const predictionJsonContent: string = Utility.jsonStringify(predictionJsons);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReport(), finished calling Utility.generateLabelStringPredictionJsons()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateLabelStringEvaluationReport(), labelArrayAndMap.stringArray=${Utility.jsonStringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateLabelStringEvaluationReport(), labelArrayAndMap.stringMap=${Utility.jsonStringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateLabelStringEvaluationReport(), labels=${Utility.jsonStringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportLabelUtteranceStatistics,
      evaluationReportAnalyses,
      predictionStructureWithScoreLabelStringArray,
      scoreOutputLines,
      groundTruthJsonContent,
      predictionJsonContent};
  }

  // eslint-disable-next-line max-params
  public static generateLabelStringEvaluationReportLabelUtteranceStatistics(
    evaluationSummary: string,
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    unknownSpuriousLabelsProcessed: {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;},
    evaluationSummaryTagIntentUtteranceStatistics: string,
    evaluationSummaryTagUtteranceDuplicates: string,
    evaluationSummaryTagSpuriousLabelUtteranceStatistics: string,
    ensureUnknownLabelInLabelArrayAndMap: boolean): {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } {
    // ---- NOTE ---- create a label-index map.
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(dataSetLabels);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- TODO ---- if (Utility.isEmptyStringArray(labelArrayAndMap.stringArray)) {
    // ---- TODO ----   Utility.debuggingThrow('there is no label, something wrong?');
    // ---- TODO ---- }
    // ---- NOTE ---- as the unknown threshold is greater than 0, the score function can make an UNKNOWN prediction.
    if (ensureUnknownLabelInLabelArrayAndMap ||
       (unknownSpuriousLabelsProcessed.utteranceUnknownLabelsMap.size > 0) ||
       (unknownSpuriousLabelsProcessed.utteranceSpuriousLabelsMap.size > 0)) {
      if (!labelArrayAndMap.stringMap.has(Utility.UnknownLabel)) {
        labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
        labelArrayAndMap.stringMap.set(Utility.UnknownLabel, labelArrayAndMap.stringArray.length - 1);
      }
    }
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string; } = Utility.generateLabelStringLabelStatisticsAndHtmlTable(
        utteranceLabelsMap,
        labelArrayAndMap);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelStringLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateLabelStringUtteranceStatisticsAndHtmlTable(
        utteranceLabelsMap);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelStringUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation LABEL_TEXT_STATISTICS summary from template.
    const labelsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagIntentUtteranceStatistics,
      labelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagIntentUtteranceStatistics} content`);
    // ---- NOTE ---- generate spurious label statistics.
    const spuriousLabelStatisticsAndHtmlTable: {
      'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
      'spuriousLabelUtterancesTotal': number;
      'spuriousLabelStatistics': string[][];
      'spuriousLabelStatisticsHtml': string; } = Utility.generateLabelStringSpuriousLabelStatisticsAndHtmlTable(
        unknownSpuriousLabelsProcessed);
    Utility.debuggingLog('Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelStringSpuriousLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCE_LABELS summary from template.
    const spuriousLabelsUtterancesStatisticsHtml: string =
      spuriousLabelStatisticsAndHtmlTable.spuriousLabelStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagSpuriousLabelUtteranceStatistics,
      spuriousLabelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagSpuriousLabelUtteranceStatistics} content`);
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = [...utteranceLabelsMap.entries()].filter(
      (x: [string, Set<string>]) => x[1].size > 1).map((x: [string, Set<string>]) => [
      Utility.outputStringUtility(x[0]),
      Utility.concatenateDataArrayToHtmlTable(
        'Label',
        [...x[1]].map((label: string) => Utility.outputStringUtility(label))),
    ]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their labels',
      utterancesMultiLabelArrays,
      ['Utterance', 'Labels']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapSetToObfuscatableIndexedHtmlTable(
      'Duplicate utterance and label pairs',
      utteranceLabelDuplicateMap,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation TEXT_DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagUtteranceDuplicates,
      duplicateStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelStringEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagUtteranceDuplicates} content`);
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      labelArrayAndMap,
      labelStatisticsAndHtmlTable,
      utteranceStatisticsAndHtmlTable,
      spuriousLabelStatisticsAndHtmlTable,
      utterancesMultiLabelArrays,
      utterancesMultiLabelArraysHtml,
      utteranceLabelDuplicateHtml};
  }

  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateLabelStringEvaluationReportAnalyses(
    evaluationSummary: string,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[],
    ambiguousClosenessThreshold: number,
    lowConfidenceScoreThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } {
    return Utility.generateEvaluationReportAnalyses<string>(
      evaluationSummary,
      labelArrayAndMap,
      predictionStructureWithScoreLabelStringArray,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate ambiguous HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const ambiguousAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtteranceSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelStringAmbiguousStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelStringArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousClosenessThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{AMBIGUOUS}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousAnalysis.scoringAmbiguousUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelStringEvaluationReportAnalyses(), finished generating {AMBIGUOUS} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate misclassified HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const misclassifiedAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelStringMisclassifiedStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelStringArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{MIS_CLASSIFICATION}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   misclassifiedAnalysis.scoringMisclassifiedUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelStringEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate low-confidence HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const lowConfidenceAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelStringLowConfidenceStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelStringArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceScoreThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{LOW_CONFIDENCE}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceAnalysis.scoringLowConfidenceUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelStringEvaluationReportAnalyses(), finished generating {LOW_CONFIDENCE} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- produce confusion matrix result.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const confusionMatrixAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrix': IConfusionMatrix;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'predictingConfusionMatrixOutputLines': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixAverageMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixAverageDescriptionMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelStringConfusionMatrixMetricsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelStringArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   labelArrayAndMap);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{MODEL_EVALUATION}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageDescriptionMetricsHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelStringEvaluationReportAnalyses(), finished generating {MODEL_EVALUATION} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- return
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   evaluationSummary,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   misclassifiedAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   confusionMatrixAnalysis};
  }

  // -------------------------------------------------------------------------

  public static generateLabelStringScoreOutputLines(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[]): string[][] {
    const scoreOutputLines: string[][] = [];
    for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray) {
      if (predictionStructureWithScoreLabelString) {
        const scoreArray: number[] =
          predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreResultArray.map(
            (x: Result) => x.score);
        const scoreLabelArray: string[] =
          predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreResultArray.map(
            (x: Result) => Utility.outputLabelStringUtility(x.label));
        const countLabels: number =
          predictionStructureWithScoreLabelString.labels.length;
        const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          predictionStructureWithScoreLabelString.labels.map((label: string) => Utility.outputStringUtility(label)));
        // ---- NOTE-NOT-USED ---- const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        // ---- NOTE-NOT-USED ----   'Label',
        // ---- NOTE-NOT-USED ----   predictionStructureWithScoreLabelString.labels.map((label: string) => Utility.outputStringUtility(label)));
        const countPredictedLabels: number =
          predictionStructureWithScoreLabelString.labelsPredicted.length;
        const labelPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          predictionStructureWithScoreLabelString.labelsPredicted.map((label: string) => Utility.outputStringUtility(label)));
        // ---- NOTE-NOT-USED ---- const labelPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        // ---- NOTE-NOT-USED ----   'Label',
        // ---- NOTE-NOT-USED ----    predictionStructureWithScoreLabelString.labelsPredicted.map((label: string) => Utility.outputStringUtility(label)));
        const scoreLabelArrayConcatenated: string = scoreLabelArray.join('\t');
        const scoreArrayConcatenated: string = scoreArray.join('\t');
        const scoreOutputLine: string[] = [
          Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
          countLabels.toString(),
          labelsConcatenated,
          countPredictedLabels.toString(),
          labelPredictedConcatenated,
          scoreLabelArrayConcatenated,
          scoreArrayConcatenated,
        ];
        scoreOutputLines.push(scoreOutputLine);
      }
    }
    return scoreOutputLines;
  }

  public static generateLabelStringGroundTruthJsons(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[]): Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> {
    const predictionStructureWithScoreLabelStringJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = [];
    for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray) {
      if (predictionStructureWithScoreLabelString) {
        const intentGroundTruthArray: Array<string> = predictionStructureWithScoreLabelString.labels.map((x: string) => {
          return Utility.outputStringUtility(x);
        });
        const groundTruthJson: {
          'text': string;
          'intents': string[];
          'entities': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'text': string;
          }>;
        } = {
          text: Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
          intents: intentGroundTruthArray,
          entities: [], // ---- NOTE ---- this function only deals with intent string label predictions as the label is string type.
        };
        predictionStructureWithScoreLabelStringJsons.push(groundTruthJson);
      }
    }
    return predictionStructureWithScoreLabelStringJsons;
  }

  public static generateLabelStringPredictionJsons(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[]): Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> {
    const predictionStructureWithScoreLabelStringJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> = [];
    for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray) {
      if (predictionStructureWithScoreLabelString) {
        const intentPredictedArray: Array<string> = predictionStructureWithScoreLabelString.labelsPredicted.map((x: string) => {
          return Utility.outputStringUtility(x);
        });
        // ---- NOTE-FOR-REFERENCE ---- const entityPredictedArray: Array<{
        // ---- NOTE-FOR-REFERENCE ----   'entity': string;
        // ---- NOTE-FOR-REFERENCE ----   'startPos': number;
        // ---- NOTE-FOR-REFERENCE ----   'endPos': number;
        // ---- NOTE-FOR-REFERENCE ----   'text': string;
        // ---- NOTE-FOR-REFERENCE ---- }> = predictionStructureWithScoreLabelObject.labelsPredicted.filter((x: Label) => x.labeltype === LabelType.Entity).map((x: Label) => {
        // ---- NOTE-FOR-REFERENCE ----   return x.toEntityObjectWithText(predictionStructureWithScoreLabelObject.text, Utility.toObfuscateLabelTextInReportUtility);
        // ---- NOTE-FOR-REFERENCE ---- });
        const intentResultScoreArray: Array<{
          'intent': string;
          'score': number;
        }> = predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Intent).map((x: Result) => {
          return x.toScoreIntentObjectFormatted(Utility.toObfuscateLabelTextInReportUtility);
          // ---- NOTE-FOR-REFERENCE ---- {
          // ---- NOTE-FOR-REFERENCE ----   intent: Utility.outputStringUtility(x.label.name),
          // ---- NOTE-FOR-REFERENCE ----   score: Utility.round(x.score),
          // ---- NOTE-FOR-REFERENCE ---- };
        });
        // ---- NOTE-FOR-REFERENCE ---- const entityResultScoreArray: Array<{
        // ---- NOTE-FOR-REFERENCE ----   'entity': string;
        // ---- NOTE-FOR-REFERENCE ----   'startPos': number;
        // ---- NOTE-FOR-REFERENCE ----   'endPos': number;
        // ---- NOTE-FOR-REFERENCE ----   'score': number;
        // ---- NOTE-FOR-REFERENCE ---- }> = predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Entity).map((x: Result) => {
        // ---- NOTE-FOR-REFERENCE ----   return x.toScoreEntityObjectByPositionFormatted(Utility.toObfuscateLabelTextInReportUtility);
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ---- {
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ----   entity: Utility.outputStringUtility(x.label.name),
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ----   startPos: Utility.outputNumberUtility(x.label.getStartPos()),
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ----   endPos: Utility.outputNumberUtility(x.label.getStartPos()),
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ----   score: Utility.round(x.score),
        // ---- NOTE-FOR-REFERENCE ----   // ---- NOTE-FOR-REFERENCE ---- };
        // ---- NOTE-FOR-REFERENCE ---- });
        const predictionJson: {
          'text': string;
          'intents': string[];
          'entities': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'text': string;
          }>;
          'intent_scores': Array<{
            'intent': string;
            'score': number;
          }>;
          'entity_scores': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'score': number;
          }>;
        } = {
          text: Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
          intents: intentPredictedArray,
          entities: [], // ---- NOTE ---- this function only deals with intent string label predictions as the label is string type.
          intent_scores: intentResultScoreArray,
          entity_scores: [], // ---- NOTE ---- this function only deals with intent string label predictions as the label is string type.
        };
        predictionStructureWithScoreLabelStringJsons.push(predictionJson);
      }
    }
    return predictionStructureWithScoreLabelStringJsons;
  }

  // -------------------------------------------------------------------------

  public static generateLabelStringConfusionMatrixMetricsAndHtmlTable(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    return Utility.generateConfusionMatrixMetricsAndHtmlTable<string>(
      predictionStructureWithScoreLabelStringArray,
      labelArrayAndMap);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable<string>(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelStringArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   labelArrayAndMap);
    // -----------------------------------------------------------------------
  }

  public static generateLabelStringLowConfidenceStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[],
    lowConfidenceScoreThreshold: number): {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } {
    return Utility.generateLowConfidenceStatisticsAndHtmlTable<string>(
      predictionStructureWithScoreLabelStringArray,
      lowConfidenceScoreThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray.filter((x: PredictionStructureWithScoreLabelString) => (x.isCorrectPrediction() && (x.predictionScoreStructureFoundation.labelsPredictedScore < lowConfidenceScoreThreshold)))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelString) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringLowConfidenceUtterancesArray: any[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringLowConfidenceUtterancesArrays.push(scoringLowConfidenceUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringLowConfidenceUtterancesSimpleArray: any[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringLowConfidenceUtterancesSimpleArrays.push(scoringLowConfidenceUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Low confidence utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringLowConfidenceUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringLowConfidenceUtterancesArrays, scoringLowConfidenceUtterancesArraysHtml, scoringLowConfidenceUtterancesSimpleArrays};
  }

  public static generateLabelStringMisclassifiedStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[]): {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    return Utility.generateMisclassifiedStatisticsAndHtmlTable<string>(
      predictionStructureWithScoreLabelStringArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray.filter((x: PredictionStructureWithScoreLabelString) => (x.isMisclassified()))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelString) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const predictedScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.predictedScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringMisclassifiedUtterancesArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictedScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringMisclassifiedUtterancesArrays.push(scoringMisclassifiedUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringMisclassifiedUtterancesSimpleArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringMisclassifiedUtterancesSimpleArrays.push(scoringMisclassifiedUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Misclassified utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringMisclassifiedUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringMisclassifiedUtterancesArrays, scoringMisclassifiedUtterancesArraysHtml, scoringMisclassifiedUtterancesSimpleArrays};
  }

  public static generateLabelStringAmbiguousStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[],
    ambiguousClosenessThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } {
    return Utility.generateAmbiguousStatisticsAndHtmlTable<string>(
      predictionStructureWithScoreLabelStringArray,
      ambiguousClosenessThreshold,
      unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtteranceSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelString of predictionStructureWithScoreLabelStringArray.filter((x: PredictionStructureWithScoreLabelString) => (x.isCorrectPrediction()))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelString) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const predictedScore: number =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.labelsPredictedScore;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoreArray: number[] =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreArray;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoreArrayAmbiguous: number[][] = scoreArray.map(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number, index: number) => [x, index, Math.abs((predictedScore - x) / predictedScore)]).filter(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number[]) => ((x[2] < ambiguousClosenessThreshold) && (x[2] > 0))).map(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number[]) => [x[1], x[0], x[2]]);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     if (scoreArrayAmbiguous.length > 0) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const ambiguousScoreStructureHtmlTable: string = Utility.selectedLabelStringScoreStructureToHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelString,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         unknownLabelPredictionThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.toObfuscateLabelTextInReportUtility,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         '',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ['Label', 'Score', 'Closest Example'],
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ['30%', '10%', '60%'],
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         scoreArrayAmbiguous.map((x: number[]) => x[0]));
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const scoringAmbiguousUtterancesArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ambiguousScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelString.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       scoringAmbiguousUtterancesArrays.push(scoringAmbiguousUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const scoringAmbiguousUtterancesSimpleArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.outputStringUtility(predictionStructureWithScoreLabelString.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       scoringAmbiguousUtteranceSimpleArrays.push(scoringAmbiguousUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Ambiguous utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringAmbiguousUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions', 'Close Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringAmbiguousUtterancesArrays, scoringAmbiguousUtterancesArraysHtml, scoringAmbiguousUtteranceSimpleArrays};
  }

  public static generateLabelStringUtteranceStatisticsAndHtmlTable(
    utteranceLabelsMap: Map<string, Set<string>>): {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } {
    const utteranceStatisticsMap: Map<number, number> = new Map<number, number>();
    utteranceLabelsMap.forEach((value: Set<string>, _: string) => {
      const labelsSize: number = value.size;
      if (utteranceStatisticsMap.has(labelsSize)) {
        utteranceStatisticsMap.set(labelsSize, (utteranceStatisticsMap.get(labelsSize) as number) + 1);
      } else {
        utteranceStatisticsMap.set(labelsSize, 1);
      }
    });
    return Utility.generateUtteranceStatisticsAndHtmlTable(
      utteranceStatisticsMap);
  }

  public static generateLabelStringLabelStatisticsAndHtmlTable(
    utteranceLabelsMap: Map<string, Set<string>>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;
      } {
    const labelUtterancesMap: Map<string, Set<string>> =
      Utility.reverseUniqueKeyedArray(utteranceLabelsMap);
    // ---- NOTE ---- generate label statistics.
    return Utility.generateLabelStatisticsAndHtmlTable(
      labelUtterancesMap,
      labelArrayAndMap);
  }

  public static generateLabelStringSpuriousLabelStatisticsAndHtmlTable(
    unknownSpuriousLabelsProcessed: {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;}): {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string;
      } {
    const spuriousLabelUtterancesMap: Array<[string, Set<string>]> =
      [...Utility.reverseUniqueKeyedArray(unknownSpuriousLabelsProcessed.utteranceSpuriousLabelsMap)];
    // ---- NOTE ---- generate spurious label statistics.
    return Utility.generateSpuriousLabelStatisticsAndHtmlTable(
      spuriousLabelUtterancesMap);
    // ---- NOTE-REFACTORED ---- const spuriousLabelUtterancesTotal: number = spuriousLabelUtterancesMap.reduce(
    // ---- NOTE-REFACTORED ----   (accumulant: number, x: [string, Set<string>]) => accumulant + x[1].size, 0);
    // ---- NOTE-REFACTORED ---- const spuriousLabelStatistics: string[][] = spuriousLabelUtterancesMap.sort(
    // ---- NOTE-REFACTORED ----   (n1: [string, Set<string>], n2: [string, Set<string>]) => {
    // ---- NOTE-REFACTORED ----     if (n1[0] > n2[0]) {
    // ---- NOTE-REFACTORED ----       return 1;
    // ---- NOTE-REFACTORED ----     }
    // ---- NOTE-REFACTORED ----     if (n1[0] < n2[0]) {
    // ---- NOTE-REFACTORED ----       return -1;
    // ---- NOTE-REFACTORED ----     }
    // ---- NOTE-REFACTORED ----     return 0;
    // ---- NOTE-REFACTORED ----   }).map(
    // ---- NOTE-REFACTORED ----   (x: [string, Set<string>], index: number) => [
    // ---- NOTE-REFACTORED ----     index.toString(),
    // ---- NOTE-REFACTORED ----     Utility.outputStringUtility(x[0]),
    // ---- NOTE-REFACTORED ----     x[1].size.toString(),
    // ---- NOTE-REFACTORED ----     Utility.round(x[1].size / spuriousLabelUtterancesTotal).toString(),
    // ---- NOTE-REFACTORED ----   ]);
    // ---- NOTE-REFACTORED ---- spuriousLabelStatistics.push(['Total', 'N/A', spuriousLabelUtterancesTotal.toString(), 'N/A']);
    // ---- NOTE-REFACTORED ---- const spuriousLabelStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
    // ---- NOTE-REFACTORED ----   'Label statistics',
    // ---- NOTE-REFACTORED ----   spuriousLabelStatistics,
    // ---- NOTE-REFACTORED ----   ['No', 'Label', 'Utterance Count', 'Utterance Prevalence']);
    // ---- NOTE-REFACTORED ---- return {
    // ---- NOTE-REFACTORED ----   spuriousLabelUtterancesMap,
    // ---- NOTE-REFACTORED ----   spuriousLabelUtterancesTotal,
    // ---- NOTE-REFACTORED ----   spuriousLabelStatistics,
    // ---- NOTE-REFACTORED ----   spuriousLabelStatisticsHtml};
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- generate Label object evaluation report
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateLabelObjectEvaluationReport(
    scoringFunctionToPredictionStructureWithScoreLabelObject: (
      utteranceLabelsPairArray: [string, Label[]][],
      labelArrayAndMap: {
        'stringArray': string[];
        'stringMap': Map<string, number>;},
      multiLabelPredictionThreshold: number,
      unknownLabelPredictionThreshold: number) => PredictionStructureWithScoreLabelObject[],
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Label[]>,
    utteranceLabelDuplicateMap: Map<string, Label[]>,
    ambiguousClosenessThreshold: number,
    lowConfidenceScoreThreshold: number,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number,
    unknownSpuriousEntityLabelsProcessed: {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;}): {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': Map<string, number>;};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': Map<string, Set<string>>;
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': Map<number, number>;
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'spuriousLabelStatisticsAndHtmlTable': {
          'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
          'spuriousLabelUtterancesTotal': number;
          'spuriousLabelStatistics': string[][];
          'spuriousLabelStatisticsHtml': string; };
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'ambiguousAnalysis': {
          'scoringAmbiguousUtterancesArrays': string[][];
          'scoringAmbiguousUtterancesArraysHtml': string;
          'scoringAmbiguousUtteranceSimpleArrays': string[][];};
        'misclassifiedAnalysis': {
          'scoringMisclassifiedUtterancesArrays': string[][];
          'scoringMisclassifiedUtterancesArraysHtml': string;
          'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
        'lowConfidenceAnalysis': {
          'scoringLowConfidenceUtterancesArrays': string[][];
          'scoringLowConfidenceUtterancesArraysHtml': string;
          'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureWithScoreLabelObjectArray': PredictionStructureWithScoreLabelObject[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } {
    // ---- NOTE ---- load the evaluation summary template.
    const evaluationSummary: string = EvaluationSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report before calling the score() function.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      dataSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      unknownSpuriousEntityLabelsProcessed,
      '{LABEL_TEXT_STATISTICS}',
      '{TEXT_DUPLICATES}',
      '{SPURIOUS_UTTERANCE_LABELS}',
      (unknownLabelPredictionThreshold > 0)); // ---- NOTE ---- there is no UNKNOWN prediction unless the threshold is higher than 0.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- collect utterance prediction and scores.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call scoringFunctionToPredictionStructureWithScoreLabelObject()');
    const utteranceLabelsPairArray: [string, Label[]][] = [...utteranceLabelsMap.entries()].map((x: [string, Label[]]) => [x[0], x[1]]);
    const predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[] =
      scoringFunctionToPredictionStructureWithScoreLabelObject(
        utteranceLabelsPairArray,
        evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
        multiLabelPredictionThreshold,
        unknownLabelPredictionThreshold);
    // ---- NOTE-REFACTORED ---- const predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[] = UtilityLabelResolver.score(
    // ---- NOTE-REFACTORED ----   utteranceLabelsPairArray,
    // ---- NOTE-REFACTORED ----   evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
    // ---- NOTE-REFACTORED ----   multiLabelPredictionThreshold,
    // ---- NOTE-REFACTORED ----   unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling scoringFunctionToPredictionStructureWithScoreLabelObject()');
    // ---- NOTE ---- generate evaluation report after calling the score() function.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call Utility.generateLabelObjectEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateLabelObjectEvaluationReportAnalyses(
      evaluationReportLabelUtteranceStatistics.evaluationSummary,
      evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
      predictionStructureWithScoreLabelObjectArray,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling Utility.generateLabelObjectEvaluationReportAnalyses()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call Utility.generateLabelObjectScoreOutputLines()');
    const scoreOutputLines: string[][] = Utility.generateLabelObjectScoreOutputLines(
      predictionStructureWithScoreLabelObjectArray);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling Utility.generateLabelObjectScoreOutputLines()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call Utility.generateLabelObjectGroundTruthJsons()');
    const groundTruthJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = Utility.generateLabelObjectGroundTruthJsons(
      predictionStructureWithScoreLabelObjectArray);
    const groundTruthJsonContent: string = Utility.jsonStringify(groundTruthJsons);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling Utility.generateLabelObjectGroundTruthJsons()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), ready to call Utility.generateLabelObjectPredictionJsons()');
    const predictionJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> = Utility.generateLabelObjectPredictionJsons(
      predictionStructureWithScoreLabelObjectArray);
    const predictionJsonContent: string = Utility.jsonStringify(predictionJsons);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReport(), finished calling Utility.generateLabelObjectPredictionJsons()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReport(), labelArrayAndMap.stringArray=${Utility.jsonStringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReport(), labelArrayAndMap.stringMap=${Utility.jsonStringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReport(), labels=${Utility.jsonStringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportLabelUtteranceStatistics,
      evaluationReportAnalyses,
      predictionStructureWithScoreLabelObjectArray,
      scoreOutputLines,
      groundTruthJsonContent,
      predictionJsonContent};
  }

  // eslint-disable-next-line max-params
  public static generateLabelObjectEvaluationReportLabelUtteranceStatistics(
    evaluationSummary: string,
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Label[]>,
    utteranceLabelDuplicateMap: Map<string, Label[]>,
    unknownSpuriousEntityLabelsProcessed: {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;},
    evaluationSummaryTagIntentUtteranceStatistics: string,
    evaluationSummaryTagUtteranceDuplicates: string,
    evaluationSummaryTagSpuriousLabelUtteranceStatistics: string,
    ensureUnknownLabelInLabelArrayAndMap: boolean): {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } {
    // ---- NOTE ---- create a label-index map.
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(dataSetLabels);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- TODO ---- if (Utility.isEmptyStringArray(labelArrayAndMap.stringArray)) {
    // ---- TODO ----   Utility.debuggingThrow('there is no label, something wrong?');
    // ---- TODO ---- }
    // ---- NOTE ---- as the unknown threshold is greater than 0, the score function can make an UNKNOWN prediction.
    if (ensureUnknownLabelInLabelArrayAndMap ||
       (unknownSpuriousEntityLabelsProcessed.utteranceUnknownEntityLabelsMap.size > 0) ||
       (unknownSpuriousEntityLabelsProcessed.utteranceSpuriousEntityLabelsMap.size > 0)) {
      if (!labelArrayAndMap.stringMap.has(Utility.UnknownLabel)) {
        labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
        labelArrayAndMap.stringMap.set(Utility.UnknownLabel, labelArrayAndMap.stringArray.length - 1);
      }
    }
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringArray=${Utility.jsonStringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), labelArrayAndMap.stringMap=${Utility.jsonStringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string; } = Utility.generateLabelObjectLabelStatisticsAndHtmlTable(
        utteranceLabelsMap,
        labelArrayAndMap);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelObjectLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateLabelObjectUtteranceStatisticsAndHtmlTable(
        utteranceLabelsMap);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelObjectUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation LABEL_TEXT_STATISTICS summary from template.
    const labelsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagIntentUtteranceStatistics,
      labelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagIntentUtteranceStatistics} content`);
    // ---- NOTE ---- generate spurious label statistics.
    const spuriousLabelStatisticsAndHtmlTable: {
      'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
      'spuriousLabelUtterancesTotal': number;
      'spuriousLabelStatistics': string[][];
      'spuriousLabelStatisticsHtml': string; } = Utility.generateLabelObjectSpuriousLabelStatisticsAndHtmlTable(
        unknownSpuriousEntityLabelsProcessed);
    Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished calling Utility.generateLabelObjectSpuriousLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCE_LABELS summary from template.
    const spuriousLabelsUtterancesStatisticsHtml: string =
      spuriousLabelStatisticsAndHtmlTable.spuriousLabelStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagSpuriousLabelUtteranceStatistics,
      spuriousLabelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagSpuriousLabelUtteranceStatistics} content`);
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = [...utteranceLabelsMap.entries()].filter(
      (x: [string, Label[]]) => x[1].length > 1).map((x: [string, Label[]]) => [
      Utility.outputStringUtility(x[0]),
      Utility.concatenateDataArrayToHtmlTable(
        'Label',
        [...x[1]].map((label: Label) => Utility.outputLabelStringUtility(label))),
    ]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their labels',
      utterancesMultiLabelArrays,
      ['Utterance', 'Labels']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapArrayToObfuscatableIndexedHtmlTable(
      'Duplicate utterance and label pairs',
      utteranceLabelDuplicateMap,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation TEXT_DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagUtteranceDuplicates,
      duplicateStatisticsHtml);
    Utility.debuggingLog(`Utility.generateLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagUtteranceDuplicates} content`);
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      labelArrayAndMap,
      labelStatisticsAndHtmlTable,
      utteranceStatisticsAndHtmlTable,
      spuriousLabelStatisticsAndHtmlTable,
      utterancesMultiLabelArrays,
      utterancesMultiLabelArraysHtml,
      utteranceLabelDuplicateHtml};
  }

  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateLabelObjectEvaluationReportAnalyses(
    evaluationSummary: string,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[],
    ambiguousClosenessThreshold: number,
    lowConfidenceScoreThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } {
    return Utility.generateEvaluationReportAnalyses<Label>(
      evaluationSummary,
      labelArrayAndMap,
      predictionStructureWithScoreLabelObjectArray,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate ambiguous HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const ambiguousAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringAmbiguousUtteranceSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelObjectAmbiguousStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObjectArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousClosenessThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{AMBIGUOUS}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousAnalysis.scoringAmbiguousUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportAnalyses(), finished generating {AMBIGUOUS} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate misclassified HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const misclassifiedAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelObjectMisclassifiedStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObjectArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{MIS_CLASSIFICATION}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   misclassifiedAnalysis.scoringMisclassifiedUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- generate low-confidence HTML.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const lowConfidenceAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesArraysHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelObjectLowConfidenceStatisticsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObjectArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceScoreThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{LOW_CONFIDENCE}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceAnalysis.scoringLowConfidenceUtterancesArraysHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportAnalyses(), finished generating {LOW_CONFIDENCE} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- produce confusion matrix result.
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const confusionMatrixAnalysis: {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrix': IConfusionMatrix;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'predictingConfusionMatrixOutputLines': string[][];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixAverageMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'confusionMatrixAverageDescriptionMetricsHtml': string;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- } = Utility.generateLabelObjectConfusionMatrixMetricsAndHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObjectArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   labelArrayAndMap);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- evaluationSummary = evaluationSummary.replace(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   '{MODEL_EVALUATION}',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageDescriptionMetricsHtml);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- Utility.debuggingLog('Utility.generateLabelObjectEvaluationReportAnalyses(), finished generating {MODEL_EVALUATION} content');
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- // ---- NOTE ---- return
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   evaluationSummary,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ambiguousAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   misclassifiedAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   lowConfidenceAnalysis,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   confusionMatrixAnalysis};
  }

  // -------------------------------------------------------------------------

  public static generateLabelObjectScoreOutputLines(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[]): string[][] {
    const scoreOutputLines: string[][] = [];
    for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray) {
      if (predictionStructureWithScoreLabelObject) {
        const scoreArray: number[] =
          predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreResultArray.map(
            (x: Result) => x.score);
        const scoreLabelArray: string[] =
          predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreResultArray.map(
            (x: Result) => Utility.outputLabelStringUtility(x.label));
        const countLabels: number =
          predictionStructureWithScoreLabelObject.labels.length;
        const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          predictionStructureWithScoreLabelObject.labels.map((label: Label) => Utility.outputLabelStringUtility(label)));
        // ---- NOTE-NOT-USED ---- const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        // ---- NOTE-NOT-USED ----   'Label',
        // ---- NOTE-NOT-USED ----   predictionStructureWithScoreLabelObject.labels.map((label: Label) => Utility.outputLabelStringUtility(label)));
        const countPredictedLabels: number =
          predictionStructureWithScoreLabelObject.labelsPredicted.length;
        const labelPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          predictionStructureWithScoreLabelObject.labelsPredicted.map((label: Label) => Utility.outputLabelStringUtility(label)));
        // ---- NOTE-NOT-USED ---- const labelPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
        // ---- NOTE-NOT-USED ----   'Label',
        // ---- NOTE-NOT-USED ----    predictionStructureWithScoreLabelObject.labelsPredicted.map((label: Label) => Utility.outputLabelStringUtility(label)));
        const scoreLabelArrayConcatenated: string = scoreLabelArray.join('\t');
        const scoreArrayConcatenated: string = scoreArray.join('\t');
        const scoreOutputLine: string[] = [
          Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
          countLabels.toString(),
          labelsConcatenated,
          countPredictedLabels.toString(),
          labelPredictedConcatenated,
          scoreLabelArrayConcatenated,
          scoreArrayConcatenated,
        ];
        scoreOutputLines.push(scoreOutputLine);
      }
    }
    return scoreOutputLines;
  }

  public static generateLabelObjectGroundTruthJsons(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[]): Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> {
    const predictionStructureWithScoreLabelObjectJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = [];
    for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray) {
      if (predictionStructureWithScoreLabelObject) {
        const intentGroundTruthArray: Array<string> = predictionStructureWithScoreLabelObject.labels.filter((x: Label) => x.labeltype === LabelType.Intent).map((x: Label) => {
          return x.toString(Utility.toObfuscateLabelTextInReportUtility);
        });
        const entityGroundTruthArray: Array<{
          'entity': string;
          'startPos': number;
          'endPos': number;
          'text': string;
        }> = predictionStructureWithScoreLabelObject.labels.filter((x: Label) => x.labeltype === LabelType.Entity).map((x: Label) => {
          return x.toEntityObjectWithText(predictionStructureWithScoreLabelObject.text, Utility.toObfuscateLabelTextInReportUtility);
        });
        const groundTruthJson: {
          'text': string;
          'intents': string[];
          'entities': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'text': string;
          }>;
        } = {
          text: Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
          intents: intentGroundTruthArray,
          entities: entityGroundTruthArray,
        };
        predictionStructureWithScoreLabelObjectJsons.push(groundTruthJson);
      }
    }
    return predictionStructureWithScoreLabelObjectJsons;
  }

  public static generateLabelObjectPredictionJsons(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[]): Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> {
    const predictionStructureWithScoreLabelObjectJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
      'intent_scores': Array<{
        'intent': string;
        'score': number;
      }>;
      'entity_scores': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
      }>;
    }> = [];
    for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray) {
      if (predictionStructureWithScoreLabelObject) {
        const intentPredictedArray: Array<string> = predictionStructureWithScoreLabelObject.labelsPredicted.filter((x: Label) => x.labeltype === LabelType.Intent).map((x: Label) => {
          return x.toString(Utility.toObfuscateLabelTextInReportUtility);
        });
        const entityPredictedArray: Array<{
          'entity': string;
          'startPos': number;
          'endPos': number;
          'text': string;
        }> = predictionStructureWithScoreLabelObject.labelsPredicted.filter((x: Label) => x.labeltype === LabelType.Entity).map((x: Label) => {
          return x.toEntityObjectWithText(predictionStructureWithScoreLabelObject.text, Utility.toObfuscateLabelTextInReportUtility);
        });
        const intentResultScoreArray: Array<{
          'intent': string;
          'score': number;
        }> = predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Intent).map((x: Result) => {
          return x.toScoreIntentObjectFormatted(Utility.toObfuscateLabelTextInReportUtility);
          // ---- NOTE-FOR-REFERENCE ---- {
          // ---- NOTE-FOR-REFERENCE ----   intent: Utility.outputStringUtility(x.label.name),
          // ---- NOTE-FOR-REFERENCE ----   score: Utility.round(x.score),
          // ---- NOTE-FOR-REFERENCE ---- };
        });
        const entityResultScoreArray: Array<{
          'entity': string;
          'startPos': number;
          'endPos': number;
          'score': number;
        }> = predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Entity).map((x: Result) => {
          return x.toScoreEntityObjectByPositionFormatted(Utility.toObfuscateLabelTextInReportUtility);
          // ---- NOTE-FOR-REFERENCE ---- {
          // ---- NOTE-FOR-REFERENCE ----   entity: Utility.outputStringUtility(x.label.name),
          // ---- NOTE-FOR-REFERENCE ----   startPos: Utility.outputNumberUtility(x.label.getStartPos()),
          // ---- NOTE-FOR-REFERENCE ----   endPos: Utility.outputNumberUtility(x.label.getStartPos()),
          // ---- NOTE-FOR-REFERENCE ----   score: Utility.round(x.score),
          // ---- NOTE-FOR-REFERENCE ---- };
        });
        const predictionJson: {
          'text': string;
          'intents': string[];
          'entities': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'text': string;
          }>;
          'intent_scores': Array<{
            'intent': string;
            'score': number;
          }>;
          'entity_scores': Array<{
            'entity': string;
            'startPos': number;
            'endPos': number;
            'score': number;
          }>;
        } = {
          text: Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
          intents: intentPredictedArray,
          entities: entityPredictedArray,
          intent_scores: intentResultScoreArray,
          entity_scores: entityResultScoreArray,
        };
        predictionStructureWithScoreLabelObjectJsons.push(predictionJson);
      }
    }
    return predictionStructureWithScoreLabelObjectJsons;
  }

  // -------------------------------------------------------------------------

  public static generateLabelObjectConfusionMatrixMetricsAndHtmlTable(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    return Utility.generateConfusionMatrixMetricsAndHtmlTable<Label>(
      predictionStructureWithScoreLabelObjectArray,
      labelArrayAndMap);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable<string>(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObjectArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   labelArrayAndMap);
    // -----------------------------------------------------------------------
  }

  public static generateLabelObjectLowConfidenceStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[],
    lowConfidenceScoreThreshold: number): {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } {
    return Utility.generateLowConfidenceStatisticsAndHtmlTable<Label>(
      predictionStructureWithScoreLabelObjectArray,
      lowConfidenceScoreThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray.filter((x: PredictionStructureWithScoreLabelObject) => (x.isCorrectPrediction() && (x.predictionScoreStructureFoundation.labelsPredictedScore < lowConfidenceScoreThreshold)))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelObject) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringLowConfidenceUtterancesArray: any[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringLowConfidenceUtterancesArrays.push(scoringLowConfidenceUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringLowConfidenceUtterancesSimpleArray: any[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringLowConfidenceUtterancesSimpleArrays.push(scoringLowConfidenceUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringLowConfidenceUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Low confidence utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringLowConfidenceUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringLowConfidenceUtterancesArrays, scoringLowConfidenceUtterancesArraysHtml, scoringLowConfidenceUtterancesSimpleArrays};
  }

  public static generateLabelObjectMisclassifiedStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[]): {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    return Utility.generateMisclassifiedStatisticsAndHtmlTable<Label>(
      predictionStructureWithScoreLabelObjectArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray.filter((x: PredictionStructureWithScoreLabelObject) => (x.isMisclassified()))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelObject) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const predictedScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.predictedScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringMisclassifiedUtterancesArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictedScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringMisclassifiedUtterancesArrays.push(scoringMisclassifiedUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoringMisclassifiedUtterancesSimpleArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     scoringMisclassifiedUtterancesSimpleArrays.push(scoringMisclassifiedUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Misclassified utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringMisclassifiedUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringMisclassifiedUtterancesArrays, scoringMisclassifiedUtterancesArraysHtml, scoringMisclassifiedUtterancesSimpleArrays};
  }

  public static generateLabelObjectAmbiguousStatisticsAndHtmlTable(
    predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[],
    ambiguousClosenessThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } {
    return Utility.generateAmbiguousStatisticsAndHtmlTable<Label>(
      predictionStructureWithScoreLabelObjectArray,
      ambiguousClosenessThreshold,
      unknownLabelPredictionThreshold);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtterancesArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtteranceSimpleArrays: string[][] = [];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- for (const predictionStructureWithScoreLabelObject of predictionStructureWithScoreLabelObjectArray.filter((x: PredictionStructureWithScoreLabelObject) => (x.isCorrectPrediction()))) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   if (predictionStructureWithScoreLabelObject) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const predictedScore: number =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.labelsPredictedScore;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoreArray: number[] =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreArray;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     const scoreArrayAmbiguous: number[][] = scoreArray.map(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number, index: number) => [x, index, Math.abs((predictedScore - x) / predictedScore)]).filter(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number[]) => ((x[2] < ambiguousClosenessThreshold) && (x[2] > 0))).map(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       (x: number[]) => [x[1], x[0], x[2]]);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     if (scoreArrayAmbiguous.length > 0) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsScoreStructureHtmlTable: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsPredictedConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const ambiguousScoreStructureHtmlTable: string = Utility.selectedLabelObjectScoreStructureToHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelObject,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         unknownLabelPredictionThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.toObfuscateLabelTextInReportUtility,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         '',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ['Label', 'Score', 'Closest Example'],
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ['30%', '10%', '60%'],
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         scoreArrayAmbiguous.map((x: number[]) => x[0]));
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const scoringAmbiguousUtterancesArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         ambiguousScoreStructureHtmlTable,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const labelsConcatenated: string =
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         predictionStructureWithScoreLabelObject.predictionStructureFoundationDisplay.labelsConcatenated;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       scoringAmbiguousUtterancesArrays.push(scoringAmbiguousUtterancesArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       const scoringAmbiguousUtterancesSimpleArray: string[] = [
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         Utility.outputStringUtility(predictionStructureWithScoreLabelObject.text),
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----         labelsPredictedConcatenated,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       ];
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----       scoringAmbiguousUtteranceSimpleArrays.push(scoringAmbiguousUtterancesSimpleArray);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----     }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- const scoringAmbiguousUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   'Ambiguous utterances and their labels',
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   scoringAmbiguousUtterancesArrays,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   ['Utterance', 'Labels', 'Predictions', 'Close Predictions']);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return {scoringAmbiguousUtterancesArrays, scoringAmbiguousUtterancesArraysHtml, scoringAmbiguousUtteranceSimpleArrays};
  }

  public static generateLabelObjectUtteranceStatisticsAndHtmlTable(
    utteranceLabelsMap: Map<string, Label[]>): {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } {
    const utteranceStatisticsMap: Map<number, number> = new Map<number, number>();
    utteranceLabelsMap.forEach((value: Label[], _: string) => {
      const labelsSize: number = value.length;
      if (utteranceStatisticsMap.has(labelsSize)) {
        utteranceStatisticsMap.set(labelsSize, (utteranceStatisticsMap.get(labelsSize) as number) + 1);
      } else {
        utteranceStatisticsMap.set(labelsSize, 1);
      }
    });
    return Utility.generateUtteranceStatisticsAndHtmlTable(
      utteranceStatisticsMap);
  }

  public static generateLabelObjectLabelStatisticsAndHtmlTable(
    utteranceLabelsMap: Map<string, Label[]>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;
      } {
    const labelUtterancesMap: Map<string, Set<string>> =
      Utility.reverseUniqueKeyedArrayLabelObject(utteranceLabelsMap);
    // ---- NOTE ---- generate label statistics.
    return Utility.generateLabelStatisticsAndHtmlTable(
      labelUtterancesMap,
      labelArrayAndMap);
  }

  public static generateLabelObjectSpuriousLabelStatisticsAndHtmlTable(
    unknownSpuriousEntityLabelsProcessed: {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean;}): {
        'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string;
      } {
    const spuriousLabelUtterancesMap: Array<[string, Set<string>]> =
      [...Utility.reverseUniqueKeyedArrayLabelObject(unknownSpuriousEntityLabelsProcessed.utteranceSpuriousEntityLabelsMap)];
    // ---- NOTE ---- generate spurious label statistics.
    return Utility.generateSpuriousLabelStatisticsAndHtmlTable(
      spuriousLabelUtterancesMap);
    // ---- NOTE-REFACTORED ---- const spuriousLabelUtterancesTotal: number = spuriousLabelUtterancesMap.reduce(
    // ---- NOTE-REFACTORED ----   (accumulant: number, x: [string, Set<string>]) => accumulant + x[1].size, 0);
    // ---- NOTE-REFACTORED ---- const spuriousLabelStatistics: string[][] = spuriousLabelUtterancesMap.sort(
    // ---- NOTE-REFACTORED ----   (n1: [string, Set<string>], n2: [string, Set<string>]) => {
    // ---- NOTE-REFACTORED ----     if (n1[0] > n2[0]) {
    // ---- NOTE-REFACTORED ----       return 1;
    // ---- NOTE-REFACTORED ----     }
    // ---- NOTE-REFACTORED ----     if (n1[0] < n2[0]) {
    // ---- NOTE-REFACTORED ----       return -1;
    // ---- NOTE-REFACTORED ----     }
    // ---- NOTE-REFACTORED ----     return 0;
    // ---- NOTE-REFACTORED ----   }).map(
    // ---- NOTE-REFACTORED ----   (x: [string, Set<string>], index: number) => [
    // ---- NOTE-REFACTORED ----     index.toString(),
    // ---- NOTE-REFACTORED ----     Utility.outputStringUtility(x[0]),
    // ---- NOTE-REFACTORED ----     x[1].size.toString(),
    // ---- NOTE-REFACTORED ----     Utility.round(x[1].size / spuriousLabelUtterancesTotal).toString(),
    // ---- NOTE-REFACTORED ----   ]);
    // ---- NOTE-REFACTORED ---- spuriousLabelStatistics.push(['Total', 'N/A', spuriousLabelUtterancesTotal.toString(), 'N/A']);
    // ---- NOTE-REFACTORED ---- const spuriousLabelStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
    // ---- NOTE-REFACTORED ----   'Label statistics',
    // ---- NOTE-REFACTORED ----   spuriousLabelStatistics,
    // ---- NOTE-REFACTORED ----   ['No', 'Label', 'Utterance Count', 'Utterance Prevalence']);
    // ---- NOTE-REFACTORED ---- return {
    // ---- NOTE-REFACTORED ----   spuriousLabelUtterancesMap,
    // ---- NOTE-REFACTORED ----   spuriousLabelUtterancesTotal,
    // ---- NOTE-REFACTORED ----   spuriousLabelStatistics,
    // ---- NOTE-REFACTORED ----   spuriousLabelStatisticsHtml};
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility functions for generating evaluation report
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static generateEvaluationReportAnalyses<TL>(
    evaluationSummary: string,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    predictionStructureWithScoreArray: PredictionStructureWithScore<TL>[],
    ambiguousClosenessThreshold: number,
    lowConfidenceScoreThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } {
    // ---- NOTE ---- generate ambiguous HTML.
    const ambiguousAnalysis: {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } = Utility.generateAmbiguousStatisticsAndHtmlTable<TL>(
      predictionStructureWithScoreArray,
      ambiguousClosenessThreshold,
      unknownLabelPredictionThreshold);
    evaluationSummary = evaluationSummary.replace(
      '{AMBIGUOUS}',
      ambiguousAnalysis.scoringAmbiguousUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {AMBIGUOUS} content');
    // ---- NOTE ---- generate misclassified HTML.
    const misclassifiedAnalysis: {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } = Utility.generateMisclassifiedStatisticsAndHtmlTable<TL>(
      predictionStructureWithScoreArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}',
      misclassifiedAnalysis.scoringMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- generate low-confidence HTML.
    const lowConfidenceAnalysis: {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } = Utility.generateLowConfidenceStatisticsAndHtmlTable<TL>(
      predictionStructureWithScoreArray,
      lowConfidenceScoreThreshold);
    evaluationSummary = evaluationSummary.replace(
      '{LOW_CONFIDENCE}',
      lowConfidenceAnalysis.scoringLowConfidenceUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {LOW_CONFIDENCE} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateConfusionMatrixMetricsAndHtmlTable<TL>(
      predictionStructureWithScoreArray,
      labelArrayAndMap);
    evaluationSummary = evaluationSummary.replace(
      '{MODEL_EVALUATION}',
      confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageDescriptionMetricsHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {MODEL_EVALUATION} content');
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      ambiguousAnalysis,
      misclassifiedAnalysis,
      lowConfidenceAnalysis,
      confusionMatrixAnalysis};
  }

  // -------------------------------------------------------------------------

  public static generateConfusionMatrixMetricsAndHtmlTable<TL>(
    predictionStructureWithScoreArray: PredictionStructureWithScore<TL>[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
      'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable<TL>(
      predictionStructureWithScoreArray,
      labelArrayAndMap);
    // -----------------------------------------------------------------------
  }

  public static generateLowConfidenceStatisticsAndHtmlTable<TL>(
    predictionStructureWithScoreArray: PredictionStructureWithScore<TL>[],
    lowConfidenceScoreThreshold: number): {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } {
    const scoringLowConfidenceUtterancesArrays: string[][] = [];
    const scoringLowConfidenceUtterancesSimpleArrays: string[][] = [];
    for (const predictionStructureWithScore of predictionStructureWithScoreArray.filter((x: PredictionStructureWithScore<TL>) => (x.isCorrectPrediction() && (x.predictionScoreStructureFoundation.labelsPredictedScore < lowConfidenceScoreThreshold)))) {
      if (predictionStructureWithScore) {
        const labelsScoreStructureHtmlTable: string =
          predictionStructureWithScore.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
        const predictedScoreStructureHtmlTable: string =
          predictionStructureWithScore.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.predictedScoreStructureHtmlTable;
        const labelsPredictedConcatenated: string =
          predictionStructureWithScore.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
        const scoringLowConfidenceUtterancesArray: any[] = [
          Utility.outputStringUtility(predictionStructureWithScore.text),
          labelsScoreStructureHtmlTable,
          predictedScoreStructureHtmlTable,
        ];
        scoringLowConfidenceUtterancesArrays.push(scoringLowConfidenceUtterancesArray);
        const labelsConcatenated: string =
          predictionStructureWithScore.predictionStructureFoundationDisplay.labelsConcatenated;
        const scoringLowConfidenceUtterancesSimpleArray: any[] = [
          Utility.outputStringUtility(predictionStructureWithScore.text),
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        scoringLowConfidenceUtterancesSimpleArrays.push(scoringLowConfidenceUtterancesSimpleArray);
      }
    }
    const scoringLowConfidenceUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Low confidence utterances and their labels',
      scoringLowConfidenceUtterancesArrays,
      ['Utterance', 'Labels', 'Predictions']);
    return {scoringLowConfidenceUtterancesArrays, scoringLowConfidenceUtterancesArraysHtml, scoringLowConfidenceUtterancesSimpleArrays};
  }

  public static generateMisclassifiedStatisticsAndHtmlTable<TL>(
    predictionStructureWithScoreArray: PredictionStructureWithScore<TL>[]): {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const scoringMisclassifiedUtterancesArrays: string[][] = [];
    const scoringMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionStructureWithScore of predictionStructureWithScoreArray.filter((x: PredictionStructureWithScore<TL>) => (x.isMisclassified()))) {
      if (predictionStructureWithScore) {
        const labelsScoreStructureHtmlTable: string =
          predictionStructureWithScore.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
        const predictedScoreStructureHtmlTable: string =
          predictionStructureWithScore.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.predictedScoreStructureHtmlTable;
        const scoringMisclassifiedUtterancesArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithScore.text),
          labelsScoreStructureHtmlTable,
          predictedScoreStructureHtmlTable,
        ];
        scoringMisclassifiedUtterancesArrays.push(scoringMisclassifiedUtterancesArray);
        const labelsConcatenated: string =
          predictionStructureWithScore.predictionStructureFoundationDisplay.labelsConcatenated;
        const labelsPredictedConcatenated: string =
          predictionStructureWithScore.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
        const scoringMisclassifiedUtterancesSimpleArray: string[] = [
          Utility.outputStringUtility(predictionStructureWithScore.text),
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        scoringMisclassifiedUtterancesSimpleArrays.push(scoringMisclassifiedUtterancesSimpleArray);
      }
    }
    const scoringMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Misclassified utterances and their labels',
      scoringMisclassifiedUtterancesArrays,
      ['Utterance', 'Labels', 'Predictions']);
    return {scoringMisclassifiedUtterancesArrays, scoringMisclassifiedUtterancesArraysHtml, scoringMisclassifiedUtterancesSimpleArrays};
  }

  public static generateAmbiguousStatisticsAndHtmlTable<TL>(
    predictionStructureWithScoreArray: PredictionStructureWithScore<TL>[],
    ambiguousClosenessThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } {
    const scoringAmbiguousUtterancesArrays: string[][] = [];
    const scoringAmbiguousUtteranceSimpleArrays: string[][] = [];
    for (const predictionStructureWithScore of predictionStructureWithScoreArray.filter((x: PredictionStructureWithScore<TL>) => (x.isCorrectPrediction()))) {
      if (predictionStructureWithScore) {
        const predictedScore: number =
          predictionStructureWithScore.predictionScoreStructureFoundation.labelsPredictedScore;
        const scoreArray: number[] =
          predictionStructureWithScore.predictionScoreStructureFoundation.scoreArray;
        const scoreArrayAmbiguous: number[][] = scoreArray.map(
          (x: number, index: number) => [x, index, Math.abs((predictedScore - x) / predictedScore)]).filter(
          (x: number[]) => ((x[2] < ambiguousClosenessThreshold) && (x[2] >= 0))).map( // ---- NOTE ---- >= for including the top-score one.
          (x: number[]) => [x[1], x[0], x[2]]);
        if (scoreArrayAmbiguous.length > 0) {
          const labelsScoreStructureHtmlTable: string =
            predictionStructureWithScore.predictionScoreStructureFoundation.predictionScoreStructureFoundationDisplay.labelsScoreStructureHtmlTable;
          const labelsPredictedConcatenated: string =
            predictionStructureWithScore.predictionStructureFoundationDisplay.labelsPredictedConcatenated;
          const labelsPredictedConcatenatedToHtmlTable: string =
            predictionStructureWithScore.predictionStructureFoundationDisplay.labelsPredictedConcatenatedToHtmlTable;
          const ambiguousScoreStructureHtmlTable: string = Utility.selectedScoreStructureToHtmlTable<TL>(
            predictionStructureWithScore,
            unknownLabelPredictionThreshold,
            Utility.toObfuscateLabelTextInReportUtility,
            '',
            ['Label', 'Score', 'Closest Example'],
            ['30%', '10%', '60%'],
            scoreArrayAmbiguous.map((x: number[]) => x[0]));
          const scoringAmbiguousUtterancesArray: string[] = [
            Utility.outputStringUtility(predictionStructureWithScore.text),
            labelsScoreStructureHtmlTable,
            labelsPredictedConcatenatedToHtmlTable,
            ambiguousScoreStructureHtmlTable,
          ];
          const labelsConcatenated: string =
            predictionStructureWithScore.predictionStructureFoundationDisplay.labelsConcatenated;
          scoringAmbiguousUtterancesArrays.push(scoringAmbiguousUtterancesArray);
          const scoringAmbiguousUtterancesSimpleArray: string[] = [
            Utility.outputStringUtility(predictionStructureWithScore.text),
            labelsConcatenated,
            labelsPredictedConcatenated,
          ];
          scoringAmbiguousUtteranceSimpleArrays.push(scoringAmbiguousUtterancesSimpleArray);
        }
      }
    }
    const scoringAmbiguousUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Ambiguous utterances and their labels',
      scoringAmbiguousUtterancesArrays,
      ['Utterance', 'Labels', 'Predictions', 'Close Predictions']);
    return {scoringAmbiguousUtterancesArrays, scoringAmbiguousUtterancesArraysHtml, scoringAmbiguousUtteranceSimpleArrays};
  }

  public static generateUtteranceStatisticsAndHtmlTable(
    utteranceStatisticsMap: Map<number, number>): {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } {
    const utteranceStatistics: [string, number][] = [...utteranceStatisticsMap.entries()].map(
      (entry: [number, number]) => [`${entry[0]}`, entry[1]]);
    utteranceStatistics.sort(
      (n1: [string, number], n2: [string, number]) => {
        if (n1[1] > n2[1]) {
          return -1;
        }
        if (n1[1] < n2[1]) {
          return 1;
        }
        return 0;
      });
    const utteranceCount: number = utteranceStatistics.reduce(
      (accumulant: number, entry: [string, number]) => accumulant + entry[1], 0);
    utteranceStatistics.push(['Total', utteranceCount]);
    const utteranceStatisticsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Utterance statistics',
      utteranceStatistics,
      ['# Multi-Labels', 'Utterance Count']);
    return {utteranceStatisticsMap, utteranceStatistics, utteranceCount, utteranceStatisticsHtml};
  }

  public static generateLabelStatisticsAndHtmlTable(
    labelUtterancesMap: Map<string, Set<string>>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;
      } {
    // ---- NOTE ---- generate label statistics.
    const labelUtterancesTotal: number = [...labelUtterancesMap.entries()].reduce(
      (accumulant: number, x: [string, Set<string>]) => accumulant + x[1].size, 0);
    const labelStatistics: string[][] = [...labelUtterancesMap.entries()].sort(
      (n1: [string, Set<string>], n2: [string, Set<string>]) => {
        if (n1[0] > n2[0]) {
          return 1;
        }
        if (n1[0] < n2[0]) {
          return -1;
        }
        return 0;
      }).map(
      (x: [string, Set<string>], index: number) => [
        index.toString(),
        Utility.outputStringUtility(x[0]),
        Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x[0]).toString(),
        x[1].size.toString(),
        Utility.round(x[1].size / labelUtterancesTotal).toString(),
      ]);
    labelStatistics.push(['Total', 'N/A', 'N/A', labelUtterancesTotal.toString(), 'N/A']);
    const labelStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
      'Label statistics',
      labelStatistics,
      ['No', 'Label', 'Label Index', 'Utterance Count', 'Utterance Prevalence']);
    return {labelUtterancesMap, labelUtterancesTotal, labelStatistics, labelStatisticsHtml};
  }

  public static generateSpuriousLabelStatisticsAndHtmlTable(
    spuriousLabelUtterancesMap: Array<[string, Set<string>]>): {
      'spuriousLabelUtterancesMap': Array<[string, Set<string>]>;
      'spuriousLabelUtterancesTotal': number;
      'spuriousLabelStatistics': string[][];
      'spuriousLabelStatisticsHtml': string;
    } {
    // ---- NOTE ---- generate spurious label statistics.
    const spuriousLabelUtterancesTotal: number = spuriousLabelUtterancesMap.reduce(
      (accumulant: number, x: [string, Set<string>]) => accumulant + x[1].size, 0);
    const spuriousLabelStatistics: string[][] = spuriousLabelUtterancesMap.sort(
      (n1: [string, Set<string>], n2: [string, Set<string>]) => {
        if (n1[0] > n2[0]) {
          return 1;
        }
        if (n1[0] < n2[0]) {
          return -1;
        }
        return 0;
      }).map(
      (x: [string, Set<string>], index: number) => [
        index.toString(),
        Utility.outputStringUtility(x[0]),
        x[1].size.toString(),
        Utility.round(x[1].size / spuriousLabelUtterancesTotal).toString(),
      ]);
    spuriousLabelStatistics.push(['Total', 'N/A', spuriousLabelUtterancesTotal.toString(), 'N/A']);
    const spuriousLabelStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
      'Label statistics',
      spuriousLabelStatistics,
      ['No', 'Label', 'Utterance Count', 'Utterance Prevalence']);
    return {
      spuriousLabelUtterancesMap,
      spuriousLabelUtterancesTotal,
      spuriousLabelStatistics,
      spuriousLabelStatisticsHtml};
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility functions for generating evaluation report
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static selectedScoreStructureToHtmlTable<TL>(
    predictionStructureWithScore: PredictionStructureWithScore<TL>,
    unknownLabelPredictionThreshold: number,
    toObfuscateLabelTextInReport: boolean,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indexes: number[] = []): string {
    if (Utility.isEmptyNumberArray(indexes)) {
      indexes = predictionStructureWithScore.labelsPredictedIndexes;
    }
    return Utility.selectedScoreResultsToHtmlTable(
      predictionStructureWithScore.predictionScoreStructureFoundation.scoreResultArray,
      indexes,
      unknownLabelPredictionThreshold,
      toObfuscateLabelTextInReport,
      tableDescription,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
  }

  // eslint-disable-next-line max-params
  public static selectedLabelStringScoreStructureToHtmlTable(
    predictionStructureWithScoreLabelString: PredictionStructureWithScoreLabelString,
    unknownLabelPredictionThreshold: number,
    toObfuscateLabelTextInReport: boolean,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indexes: number[] = []): string {
    return Utility.selectedScoreStructureToHtmlTable(
      predictionStructureWithScoreLabelString,
      unknownLabelPredictionThreshold,
      toObfuscateLabelTextInReport,
      tableDescription,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings,
      indexes);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- if (Utility.isEmptyNumberArray(indexes)) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   indexes = predictionStructureWithScoreLabelString.labelsPredictedIndexes;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return Utility.selectedScoreResultsToHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelString.predictionScoreStructureFoundation.scoreResultArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   indexes,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   unknownLabelPredictionThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   toObfuscateLabelTextInReport,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   tableDescription,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   selectedOutputDataArraryHeaders,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   outputDataColumnWidthSettings);
  }

  // eslint-disable-next-line max-params
  public static selectedLabelObjectScoreStructureToHtmlTable(
    predictionStructureWithScoreLabelObject: PredictionStructureWithScoreLabelObject,
    unknownLabelPredictionThreshold: number,
    toObfuscateLabelTextInReport: boolean,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indexes: number[] = []): string {
    return Utility.selectedScoreStructureToHtmlTable(
      predictionStructureWithScoreLabelObject,
      unknownLabelPredictionThreshold,
      toObfuscateLabelTextInReport,
      tableDescription,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings,
      indexes);
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- if (Utility.isEmptyNumberArray(indexes)) {
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   indexes = predictionStructureWithScoreLabelObject.labelsPredictedIndexes;
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED ---- return Utility.selectedScoreResultsToHtmlTable(
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   predictionStructureWithScoreLabelObject.predictionScoreStructureFoundation.scoreResultArray,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   indexes,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   unknownLabelPredictionThreshold,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   toObfuscateLabelTextInReport,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   tableDescription,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   selectedOutputDataArraryHeaders,
    // ---- NOTE-FOR-REFERENCE-REFACTORED ----   outputDataColumnWidthSettings);
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility functions for generating evaluation report
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static selectedScoreResultsToHtmlTable(
    scoreResultArray: Result[],
    indexes: number[],
    unknownLabelPredictionThreshold: number,
    toObfuscateLabelTextInReport: boolean,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = []): string {
    const labelsSelectedArrays: any[][] = indexes.map(
      (x: number) => {
        if ((x >= 0) && (x < scoreResultArray.length)) {
          return [
            Utility.outputLabelStringUtility(scoreResultArray[x].label),
            scoreResultArray[x].score,
            Utility.outputStringUtility(scoreResultArray[x].closesttext),
          ];
        }
        return [
          Utility.UnknownLabel, // ---- NOTE ---- do we need to obfuscate UNKNOWN prediction?
          unknownLabelPredictionThreshold,
          '',
        ];
      });
    const selectedScoreStructureHtmlTable: string = Utility.convertDataArraysToHtmlTable(
      tableDescription,
      labelsSelectedArrays,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
    return selectedScoreStructureHtmlTable;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility functions for generating evaluation report
  // -------------------------------------------------------------------------

  public static evaluateMultiLabelSubsetPrediction(groundTruths: any[], predictions: any[]): number {
    if (predictions.length <= 0) {
      if (groundTruths.length <= 0) {
        return PredictionType.TrueNegative;
        // ---- NOTE ---- PredictionType.TrueNegative for
        // ---- NOTE ---- true negative as there is no prediction on an empty ground-truth set.
      }
      return PredictionType.FalseNegative;
      // ---- NOTE ---- PredictionType.FalseNegative for
      // ---- NOTE ---- false negative as there is no prediction on a non-empty ground-truth set.
    }
    for (const prediction of predictions) {
      if (!groundTruths.includes(prediction)) {
        return PredictionType.FalsePositive;
        // ---- NOTE ---- PredictionType.FalsePositive for
        // ---- NOTE ---- false positive as there is a prediction not in the ground-truth set.
      }
    }
    return PredictionType.TruePositive;
    // ---- NOTE ---- PredictionType.TruePositive for
    // ---- NOTE ---- true positive as every prediction is in the ground-trueh set.
  }

  public static evaluateMultiLabelExactPrediction(groundTruths: any[], predictions: any[]): number {
    if (predictions.length <= 0) {
      if (groundTruths.length <= 0) {
        return PredictionType.TrueNegative;
        // ---- NOTE ---- PredictionType.TrueNegative for
        // ---- NOTE ---- true negative as there is no prediction on an empty ground-truth set.
      }
      return PredictionType.FalseNegative;
      // ---- NOTE ---- PredictionType.FalseNegative for
      // ---- NOTE ---- false negative as there is no prediction on a non-empty ground-truth set.
    }
    for (const prediction of predictions) {
      if (!groundTruths.includes(prediction)) {
        return PredictionType.FalsePositive;
        // ---- NOTE ---- PredictionType.FalsePositive for
        // ---- NOTE ---- false positive as there is a prediction not in the ground-truth set.
      }
    }
    for (const groundTruth of groundTruths) {
      if (!predictions.includes(groundTruth)) {
        return PredictionType.FalseNegative;
        // ---- NOTE ---- PredictionType.FalseNegative for
        // ---- NOTE ---- false negative as there is a ground-truth not in the prediction set.
      }
    }
    return PredictionType.TruePositive;
    // ---- NOTE ---- PredictionType.TruePositive for
    // ---- NOTE ---- true positive as every prediction is in the ground-trueh set.
  }

  public static evaluateMultiLabelPrediction(groundTruths: any[], predictions: any[]): number[] {
    const microConfusionMatrix: number[] = [0, 0, 0];
    for (const prediction of predictions) {
      if (groundTruths.includes(prediction)) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForTruePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForTruePositive for
        // ---- NOTE ---- true positive as the prediction is in the ground-truth set.
      } else {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalsePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalsePositive for
        // ---- NOTE ---- false positive as the prediction is not in the ground-truth set.
      }
    }
    for (const groundTruth of groundTruths) {
      if (!predictions.includes(groundTruth)) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalseNegative]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalseNegative for
        // ---- NOTE ---- false negative as the ground-truth is not in the prediction set.
      }
    }
    return microConfusionMatrix;
  }

  public static evaluateMultiLabelObjectSubsetPrediction(groundTruths: Label[], predictions: Label[]): number {
    if (predictions.length <= 0) {
      if (groundTruths.length <= 0) {
        return PredictionType.TrueNegative;
        // ---- NOTE ---- PredictionType.TrueNegative for
        // ---- NOTE ---- true negative as there is no prediction on an empty ground-truth set.
      }
      return PredictionType.FalseNegative;
      // ---- NOTE ---- PredictionType.FalseNegative for
      // ---- NOTE ---- false negative as there is no prediction on a non-empty ground-truth set.
    }
    for (const prediction of predictions) {
      let predicionIsInGroundTruths: boolean = false;
      for (const groundTruth of groundTruths) {
        if (groundTruth.equals(prediction)) {
          predicionIsInGroundTruths = true;
          break;
        }
      }
      if (!predicionIsInGroundTruths) {
        return PredictionType.FalsePositive;
        // ---- NOTE ---- PredictionType.FalsePositive for
        // ---- NOTE ---- false positive as there is a prediction not in the ground-truth set.
      }
    }
    return PredictionType.TruePositive;
    // ---- NOTE ---- PredictionType.TruePositive for
    // ---- NOTE ---- true positive as every prediction is in the ground-trueh set.
  }

  public static evaluateMultiLabelObjectExactPrediction(groundTruths: Label[], predictions: Label[]): number {
    if (predictions.length <= 0) {
      if (groundTruths.length <= 0) {
        return PredictionType.TrueNegative;
        // ---- NOTE ---- PredictionType.TrueNegative for
        // ---- NOTE ---- true negative as there is no prediction on an empty ground-truth set.
      }
      return PredictionType.FalseNegative;
      // ---- NOTE ---- PredictionType.FalseNegative for
      // ---- NOTE ---- false negative as there is no prediction on a non-empty ground-truth set.
    }
    for (const prediction of predictions) {
      let predicionIsInGroundTruths: boolean = false;
      for (const groundTruth of groundTruths) {
        if (groundTruth.equals(prediction)) {
          predicionIsInGroundTruths = true;
          break;
        }
      }
      if (!predicionIsInGroundTruths) {
        return PredictionType.FalsePositive;
        // ---- NOTE ---- PredictionType.FalsePositive for
        // ---- NOTE ---- false positive as there is a prediction not in the ground-truth set.
      }
    }
    for (const groundTruth of groundTruths) {
      let groundTruthIsInPredicions: boolean = false;
      for (const prediction of predictions) {
        if (prediction.equals(groundTruth)) {
          groundTruthIsInPredicions = true;
          break;
        }
      }
      if (!groundTruthIsInPredicions) {
        return PredictionType.FalseNegative;
        // ---- NOTE ---- PredictionType.FalseNegative for
        // ---- NOTE ---- false negative as there is a ground-truth not in the prediction set.
      }
    }
    return PredictionType.TruePositive;
    // ---- NOTE ---- PredictionType.TruePositive for
    // ---- NOTE ---- true positive as every prediction is in the ground-trueh set.
  }

  public static evaluateMultiLabelObjectPrediction(groundTruths: Label[], predictions: Label[]): number[] {
    const microConfusionMatrix: number[] = [0, 0, 0];
    for (const prediction of predictions) {
      let predicionIsInGroundTruths: boolean = false;
      for (const groundTruth of groundTruths) {
        if (groundTruth.equals(prediction)) {
          predicionIsInGroundTruths = true;
          break;
        }
      }
      if (predicionIsInGroundTruths) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForTruePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForTruePositive for
        // ---- NOTE ---- true positive as the prediction is in the ground-truth set.
      } else {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalsePositive]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalsePositive for
        // ---- NOTE ---- false positive as the prediction is not in the ground-truth set.
      }
    }
    for (const groundTruth of groundTruths) {
      let groundTruthIsInPredictons: boolean = false;
      for (const prediction of predictions) {
        if (prediction.equals(groundTruth)) {
          groundTruthIsInPredictons = true;
          break;
        }
      }
      if (!groundTruthIsInPredictons) {
        microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalseNegative]++;
        // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalseNegative for
        // ---- NOTE ---- false negative as the ground-truth is not in the prediction set.
      }
    }
    return microConfusionMatrix;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- data structure manipulation
  // -------------------------------------------------------------------------

  public static reverseUniqueKeyedArray(input: Map<string, Set<string>>): Map<string, Set<string>> {
    const reversed: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (const key of input.keys()) {
      if (key) {
        const keyedSet: Set<string> = input.get(key) as Set<string>;
        for (const keyedSetElement of keyedSet) {
          if (reversed.has(keyedSetElement)) {
            (reversed.get(keyedSetElement) as Set<string>).add(key);
          } else {
            reversed.set(keyedSetElement, new Set<string>([key]));
          }
        }
      }
    }
    return reversed;
  }

  public static reverseUniqueKeyedArrayLabelObject(input: Map<string, Label[]>): Map<string, Set<string>> {
    const reversed: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (const key of input.keys()) {
      if (key) {
        const keyedSet: Label[] = input.get(key) as Label[];
        for (const keyedSetElement of keyedSet) {
          const keyedSetElementName: string = keyedSetElement.name;
          if (reversed.has(keyedSetElementName)) {
            (reversed.get(keyedSetElementName) as Set<string>).add(key);
          } else {
            reversed.set(keyedSetElementName, new Set<string>([key]));
          }
        }
      }
    }
    return reversed;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- UNKNOWN label processing
  // -------------------------------------------------------------------------

  public static processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(
    utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; },
    labelSet: Set<string>): {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } {
    const utteranceUnknownLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceUnknownLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceSpuriousLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceSpuriousLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    let utteranceLabelMapSetAddedWithUnknownLabel: boolean = false;
    let utteranceLabelDuplicateMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey of utteranceLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceLabelSet: Set<string> = utteranceLabelsMap.get(utteranceKey) as Set<string>;
            // eslint-disable-next-line max-depth
            if (!utteranceLabelSet) {
              Utility.debuggingThrow(`Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            }
            const utteranceLabelArray: string[] = [...utteranceLabelSet];
            {
              const concreteLabels: string[] = utteranceLabelArray.filter(
                (label: string) =>
                  !Utility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
              const hasConcreteLabel: boolean = concreteLabels.length > 0;
              // eslint-disable-next-line max-depth
              utteranceLabelSet.clear(); // ---- NOTE ---- clear the set!
              // eslint-disable-next-line max-depth
              if (hasConcreteLabel) {
                // eslint-disable-next-line max-depth
                for (const label of concreteLabels) {
                  utteranceLabelSet.add(label);
                }
              } else {
                utteranceLabelSet.add(Utility.UnknownLabel);
                utteranceLabelMapSetAddedWithUnknownLabel = true;
              }
            }
            {
              const unknownLabels: string[] = utteranceLabelArray.filter(
                (label: string) =>
                  Utility.UnknownLabelSet.has(label.toUpperCase()));
              const hasUnknownLabel: boolean = unknownLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasUnknownLabel) {
                let unknownLabelsSet: Set<string>;
                // eslint-disable-next-line max-depth
                if (utteranceUnknownLabelsMap.has(utteranceKey)) {
                  unknownLabelsSet = utteranceUnknownLabelsMap.get(utteranceKey) as Set<string>;
                } else {
                  unknownLabelsSet = new Set<string>();
                  utteranceUnknownLabelsMap.set(utteranceKey, unknownLabelsSet);
                }
                // eslint-disable-next-line max-depth
                for (const label of unknownLabels) {
                  unknownLabelsSet.add(label);
                }
              }
            }
            {
              const spuriousLabels: string[] = utteranceLabelArray.filter(
                (label: string) =>
                  !labelSet.has(label));
              const hasSpuriousLabel: boolean = spuriousLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasSpuriousLabel) {
                let spuriousLabelsSet: Set<string>;
                // eslint-disable-next-line max-depth
                if (utteranceSpuriousLabelsMap.has(utteranceKey)) {
                  spuriousLabelsSet = utteranceSpuriousLabelsMap.get(utteranceKey) as Set<string>;
                } else {
                  spuriousLabelsSet = new Set<string>();
                  utteranceSpuriousLabelsMap.set(utteranceKey, spuriousLabelsSet);
                }
                // eslint-disable-next-line max-depth
                for (const label of spuriousLabels) {
                  spuriousLabelsSet.add(label);
                }
              }
            }
          } catch (error) {
            Utility.debuggingLog(`Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((utteranceLabelSet: Set<string>, utteranceKey: string) => {
        const utteranceLabelArray: string[] = [...utteranceLabelSet];
        {
          const concreteLabels: string[] = utteranceLabelArray.filter(
            (label: string) =>
              !Utility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          // eslint-disable-next-line max-depth
          utteranceLabelSet.clear(); // ---- NOTE ---- clear the set!
          // eslint-disable-next-line max-depth
          if (hasConcreteLabel) {
            // eslint-disable-next-line max-depth
            for (const label of concreteLabels) {
              utteranceLabelSet.add(label);
            }
          } else {
            utteranceLabelSet.add(Utility.UnknownLabel);
            utteranceLabelDuplicateMapSetAddedWithUnknownLabel = true;
          }
        }
        {
          const unknownLabels: string[] = utteranceLabelArray.filter(
            (label: string) =>
              Utility.UnknownLabelSet.has(label.toUpperCase()));
          const hasUnknownLabel: boolean = unknownLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasUnknownLabel) {
            let unknownLabelsSet: Set<string>;
            // eslint-disable-next-line max-depth
            if (utteranceUnknownLabelDuplicateMap.has(utteranceKey)) {
              unknownLabelsSet = utteranceUnknownLabelDuplicateMap.get(utteranceKey) as Set<string>;
            } else {
              unknownLabelsSet = new Set<string>();
              utteranceUnknownLabelDuplicateMap.set(utteranceKey, unknownLabelsSet);
            }
            // eslint-disable-next-line max-depth
            for (const label of unknownLabels) {
              unknownLabelsSet.add(label);
            }
          }
        }
        {
          const spuriousLabels: string[] = utteranceLabelArray.filter(
            (label: string) =>
              !labelSet.has(label));
          const hasSpuriousLabel: boolean = spuriousLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasSpuriousLabel) {
            let spuriousLabelsSet: Set<string>;
            // eslint-disable-next-line max-depth
            if (utteranceSpuriousLabelDuplicateMap.has(utteranceKey)) {
              spuriousLabelsSet = utteranceSpuriousLabelDuplicateMap.get(utteranceKey) as Set<string>;
            } else {
              spuriousLabelsSet = new Set<string>();
              utteranceSpuriousLabelDuplicateMap.set(utteranceKey, spuriousLabelsSet);
            }
            // eslint-disable-next-line max-depth
            for (const label of spuriousLabels) {
              spuriousLabelsSet.add(label);
            }
          }
        }
      });
    }
    return {
      utteranceUnknownLabelsMap,
      utteranceUnknownLabelDuplicateMap,
      utteranceSpuriousLabelsMap,
      utteranceSpuriousLabelDuplicateMap,
      utteranceLabelMapSetAddedWithUnknownLabel,
      utteranceLabelDuplicateMapSetAddedWithUnknownLabel};
  }

  public static processUnknownSpuriousLabelsInUtteranceLabelsMap(
    utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; }): {
        'utteranceUnknownLabelsMap': Map<string, Set<string>>;
        'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
        'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
        'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } {
    const utteranceUnknownLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceUnknownLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    let utteranceLabelMapSetAddedWithUnknownLabel: boolean = false;
    let utteranceLabelDuplicateMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey of utteranceLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceLabelSet: Set<string> = utteranceLabelsMap.get(utteranceKey) as Set<string>;
            // eslint-disable-next-line max-depth
            if (!utteranceLabelSet) {
              Utility.debuggingThrow(`Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            }
            const utteranceLabelArray: string[] = [...utteranceLabelSet];
            {
              const concreteLabels: string[] = utteranceLabelArray.filter(
                (label: string) =>
                  !Utility.UnknownLabelSet.has(label.toUpperCase()));
              const hasConcreteLabel: boolean = concreteLabels.length > 0;
              // eslint-disable-next-line max-depth
              utteranceLabelSet.clear(); // ---- NOTE ---- clear the set!
              // eslint-disable-next-line max-depth
              if (hasConcreteLabel) {
                // eslint-disable-next-line max-depth
                for (const label of concreteLabels) {
                  utteranceLabelSet.add(label);
                }
              } else {
                utteranceLabelSet.add(Utility.UnknownLabel);
                utteranceLabelMapSetAddedWithUnknownLabel = true;
              }
            }
            {
              const unknownLabels: string[] = utteranceLabelArray.filter(
                (label: string) =>
                  Utility.UnknownLabelSet.has(label.toUpperCase()));
              const hasUnknownLabel: boolean = unknownLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasUnknownLabel) {
                let unknownLabelsSet: Set<string>;
                // eslint-disable-next-line max-depth
                if (utteranceUnknownLabelsMap.has(utteranceKey)) {
                  unknownLabelsSet = utteranceUnknownLabelsMap.get(utteranceKey) as Set<string>;
                } else {
                  unknownLabelsSet = new Set<string>();
                  utteranceUnknownLabelsMap.set(utteranceKey, unknownLabelsSet);
                }
                // eslint-disable-next-line max-depth
                for (const label of unknownLabels) {
                  unknownLabelsSet.add(label);
                }
              }
            }
          } catch (error) {
            Utility.debuggingLog(`Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((utteranceLabelSet: Set<string>, utteranceKey: string) => {
        const utteranceLabelArray: string[] = [...utteranceLabelSet];
        {
          const concreteLabels: string[] = utteranceLabelArray.filter(
            (label: string) =>
              !Utility.UnknownLabelSet.has(label.toUpperCase()));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          utteranceLabelSet.clear(); // ---- NOTE ---- clear the set!
          // eslint-disable-next-line max-depth
          if (hasConcreteLabel) {
            // eslint-disable-next-line max-depth
            for (const label of concreteLabels) {
              utteranceLabelSet.add(label);
            }
          } else {
            utteranceLabelSet.add(Utility.UnknownLabel);
            utteranceLabelDuplicateMapSetAddedWithUnknownLabel = true;
          }
        }
        {
          const unknownLabels: string[] = utteranceLabelArray.filter(
            (label: string) =>
              Utility.UnknownLabelSet.has(label.toUpperCase()));
          const hasUnknownLabel: boolean = unknownLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasUnknownLabel) {
            let unknownLabelsSet: Set<string>;
            // eslint-disable-next-line max-depth
            if (utteranceUnknownLabelDuplicateMap.has(utteranceKey)) {
              unknownLabelsSet = utteranceUnknownLabelDuplicateMap.get(utteranceKey) as Set<string>;
            } else {
              unknownLabelsSet = new Set<string>();
              utteranceUnknownLabelDuplicateMap.set(utteranceKey, unknownLabelsSet);
            }
            // eslint-disable-next-line max-depth
            for (const label of unknownLabels) {
              unknownLabelsSet.add(label);
            }
          }
        }
      });
    }
    return {
      utteranceUnknownLabelsMap,
      utteranceUnknownLabelDuplicateMap,
      utteranceLabelMapSetAddedWithUnknownLabel,
      utteranceLabelDuplicateMapSetAddedWithUnknownLabel};
  }

  public static processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMapUsingLabelSet(
    utteranceEntityLabels: {
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; },
    labelSet: Set<string>): {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } {
    const utteranceUnknownEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceUnknownEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceSpuriousEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceSpuriousEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceLabelMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceLabelDuplicateMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceEntityLabels.utteranceEntityLabelsMap;
    const utteranceEntityLabelDuplicateMap:  Map<string, Label[]> = utteranceEntityLabels.utteranceEntityLabelDuplicateMap;
    if (utteranceEntityLabelsMap) {
      for (const utteranceKey of utteranceEntityLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceEntityLabelSet: Label[] = utteranceEntityLabelsMap.get(utteranceKey) as Label[];
            // eslint-disable-next-line max-depth
            // ---- NOTE-PLACEHOLDER ---- if (!utteranceEntityLabelSet) {
            // ---- NOTE-PLACEHOLDER ----   Utility.debuggingThrow(`Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceEntityLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceEntityLabelsMap)}`);
            // ---- NOTE-PLACEHOLDER ---- }
            const utteranceEntityLabelArray: Label[] = [...utteranceEntityLabelSet];
            {
              const concreteLabels: Label[] = utteranceEntityLabelArray.filter(
                (label: Label) =>
                  !Utility.UnknownLabelSet.has(label.name.toUpperCase()) && labelSet.has(label.name));
              const hasConcreteLabel: boolean = concreteLabels.length > 0;
              // eslint-disable-next-line max-depth
              utteranceEntityLabelSet.length = 0; // ---- NOTE ---- clear the set!
              // eslint-disable-next-line max-depth
              if (hasConcreteLabel) {
                // eslint-disable-next-line max-depth
                for (const label of concreteLabels) {
                  utteranceEntityLabelSet.push(label);
                }
              }
            }
            {
              const unknownLabels: Label[] = utteranceEntityLabelArray.filter(
                (label: Label) =>
                  Utility.UnknownLabelSet.has(label.name.toUpperCase()));
              const hasUnknownLabel: boolean = unknownLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasUnknownLabel) {
                let unknownEntityLabels: Label[] = [];
                // eslint-disable-next-line max-depth
                if (utteranceUnknownEntityLabelsMap.has(utteranceKey)) {
                  unknownEntityLabels = utteranceUnknownEntityLabelsMap.get(utteranceKey) as Label[];
                } else {
                  unknownEntityLabels = [];
                  utteranceUnknownEntityLabelsMap.set(utteranceKey, unknownEntityLabels);
                }
                // eslint-disable-next-line max-depth
                for (const label of unknownLabels) {
                  // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== label.name = Utility.UnknownLabel;
                  // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== utteranceEntityLabelSet.push(label);
                  unknownEntityLabels.push(label);
                }
              }
            }
            {
              const spuriousLabels: Label[] = utteranceEntityLabelArray.filter(
                (label: Label) =>
                  !labelSet.has(label.name));
              const hasSpuriousLabel: boolean = spuriousLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasSpuriousLabel) {
                let spuriousEntityLabels: Label[] = [];
                // eslint-disable-next-line max-depth
                if (utteranceSpuriousEntityLabelsMap.has(utteranceKey)) {
                  spuriousEntityLabels = utteranceSpuriousEntityLabelsMap.get(utteranceKey) as Label[];
                } else {
                  spuriousEntityLabels = [];
                  utteranceSpuriousEntityLabelsMap.set(utteranceKey, spuriousEntityLabels);
                }
                // eslint-disable-next-line max-depth
                for (const label of spuriousLabels) {
                  // ==== NOTE-IGNORE-SPURIOUS-LABELS ==== label.name = Utility.UnknownLabel;
                  // ==== NOTE-IGNORE-SPURIOUS-LABELS ==== utteranceEntityLabelSet.push(label);
                  spuriousEntityLabels.push(label);
                }
              }
            }
          } catch (error) {
            // ---- NOTE-PLACEHOLDER ---- Utility.debuggingLog(`Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceEntityLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceEntityLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceEntityLabelDuplicateMap) {
      utteranceEntityLabelDuplicateMap.forEach((utteranceEntityLabelSet: Label[], utteranceKey: string) => {
        const utteranceEntityLabelArray: Label[] = [...utteranceEntityLabelSet];
        {
          const concreteLabels: Label[] = utteranceEntityLabelArray.filter(
            (label: Label) =>
              !Utility.UnknownLabelSet.has(label.name.toUpperCase()) && labelSet.has(label.name));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          // eslint-disable-next-line max-depth
          utteranceEntityLabelSet.length = 0; // ---- NOTE ---- clear the set!
          // eslint-disable-next-line max-depth
          if (hasConcreteLabel) {
            // eslint-disable-next-line max-depth
            for (const label of concreteLabels) {
              utteranceEntityLabelSet.push(label);
            }
          }
        }
        {
          const unknownLabels: Label[] = utteranceEntityLabelArray.filter(
            (label: Label) =>
              Utility.UnknownLabelSet.has(label.name.toUpperCase()));
          const hasUnknownLabel: boolean = unknownLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasUnknownLabel) {
            let unknownEntityLabels: Label[] = [];
            // eslint-disable-next-line max-depth
            if (utteranceUnknownEntityLabelDuplicateMap.has(utteranceKey)) {
              unknownEntityLabels = utteranceUnknownEntityLabelDuplicateMap.get(utteranceKey) as Label[];
            } else {
              unknownEntityLabels = [];
              utteranceUnknownEntityLabelDuplicateMap.set(utteranceKey, unknownEntityLabels);
            }
            // eslint-disable-next-line max-depth
            for (const label of unknownLabels) {
              // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== label.name = Utility.UnknownLabel;
              // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== labelsSet.push(label);
              unknownEntityLabels.push(label);
            }
          }
        }
        {
          const spuriousLabels: Label[] = utteranceEntityLabelArray.filter(
            (label: Label) =>
              !labelSet.has(label.name));
          const hasSpuriousLabel: boolean = spuriousLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasSpuriousLabel) {
            let spuriousEntityLabels: Label[] = [];
            // eslint-disable-next-line max-depth
            if (utteranceSpuriousEntityLabelDuplicateMap.has(utteranceKey)) {
              spuriousEntityLabels = utteranceSpuriousEntityLabelDuplicateMap.get(utteranceKey) as Label[];
            } else {
              spuriousEntityLabels = [];
              utteranceSpuriousEntityLabelDuplicateMap.set(utteranceKey, spuriousEntityLabels);
            }
            // eslint-disable-next-line max-depth
            for (const label of spuriousLabels) {
              // ==== NOTE-IGNORE-SPURIOUS-LABELS ==== label.name = Utility.UnknownLabel;
              // ==== NOTE-IGNORE-SPURIOUS-LABELS ==== labelsSet.push(label);
              spuriousEntityLabels.push(label);
            }
          }
        }
      });
    }
    return {
      utteranceUnknownEntityLabelsMap,
      utteranceUnknownEntityLabelDuplicateMap,
      utteranceSpuriousEntityLabelsMap,
      utteranceSpuriousEntityLabelDuplicateMap,
      utteranceLabelMapSetAddedWithUnknownLabel,
      utteranceLabelDuplicateMapSetAddedWithUnknownLabel};
  }

  public static processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMap(
    utteranceEntityLabels: {
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; }): {
        'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
        'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
        'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
        'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } {
    const utteranceUnknownEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceUnknownEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceLabelMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceLabelDuplicateMapSetAddedWithUnknownLabel: boolean = false;
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceEntityLabels.utteranceEntityLabelsMap;
    const utteranceEntityLabelDuplicateMap:  Map<string, Label[]> = utteranceEntityLabels.utteranceEntityLabelDuplicateMap;
    if (utteranceEntityLabelsMap) {
      for (const utteranceKey of utteranceEntityLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceEntityLabelSet: Label[] = utteranceEntityLabelsMap.get(utteranceKey) as Label[];
            // eslint-disable-next-line max-depth
            // ---- NOTE-PLACEHOLDER ---- if (!utteranceEntityLabelSet) {
            // ---- NOTE-PLACEHOLDER ----   Utility.debuggingThrow(`Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMap(), utteranceKey=${utteranceKey}, utteranceEntityLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceEntityLabelsMap)}`);
            // ---- NOTE-PLACEHOLDER ---- }
            const utteranceEntityLabelArray: Label[] = [...utteranceEntityLabelSet];
            {
              const concreteLabels: Label[] = utteranceEntityLabelArray.filter(
                (label: Label) =>
                  !Utility.UnknownLabelSet.has(label.name.toUpperCase()));
              const hasConcreteLabel: boolean = concreteLabels.length > 0;
              // eslint-disable-next-line max-depth
              utteranceEntityLabelSet.length = 0; // ---- NOTE ---- clear the set!
              // eslint-disable-next-line max-depth
              if (hasConcreteLabel) {
                // eslint-disable-next-line max-depth
                for (const label of concreteLabels) {
                  utteranceEntityLabelSet.push(label);
                }
              }
            }
            {
              const unknownLabels: Label[] = utteranceEntityLabelArray.filter(
                (label: Label) =>
                  Utility.UnknownLabelSet.has(label.name.toUpperCase()));
              const hasUnknownLabel: boolean = unknownLabels.length > 0;
              // eslint-disable-next-line max-depth
              if (hasUnknownLabel) {
                let unknownEntityLabels: Label[] = [];
                // eslint-disable-next-line max-depth
                if (utteranceUnknownEntityLabelsMap.has(utteranceKey)) {
                  unknownEntityLabels = utteranceUnknownEntityLabelsMap.get(utteranceKey) as Label[];
                } else {
                  unknownEntityLabels = [];
                  utteranceUnknownEntityLabelsMap.set(utteranceKey, unknownEntityLabels);
                }
                // eslint-disable-next-line max-depth
                for (const label of unknownLabels) {
                  // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== label.name = Utility.UnknownLabel;
                  // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== utteranceEntityLabelSet.push(label);
                  unknownEntityLabels.push(label);
                }
              }
            }
          } catch (error) {
            // ---- NOTE-PLACEHOLDER ---- Utility.debuggingLog(`Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMap(), utteranceKey=${utteranceKey}, utteranceEntityLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceEntityLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceEntityLabelDuplicateMap) {
      utteranceEntityLabelDuplicateMap.forEach((utteranceEntityLabelSet: Label[], utteranceKey: string) => {
        const utteranceEntityLabelArray: Label[] = [...utteranceEntityLabelSet];
        {
          const concreteLabels: Label[] = utteranceEntityLabelArray.filter(
            (label: Label) =>
              !Utility.UnknownLabelSet.has(label.name.toUpperCase()));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          utteranceEntityLabelSet.length = 0; // ---- NOTE ---- clear the set!
          // eslint-disable-next-line max-depth
          if (hasConcreteLabel) {
            // eslint-disable-next-line max-depth
            for (const label of concreteLabels) {
              utteranceEntityLabelSet.push(label);
            }
          }
        }
        {
          const unknownLabels: Label[] = utteranceEntityLabelArray.filter(
            (label: Label) =>
              Utility.UnknownLabelSet.has(label.name.toUpperCase()));
          const hasUnknownLabel: boolean = unknownLabels.length > 0;
          // eslint-disable-next-line max-depth
          if (hasUnknownLabel) {
            let unknownEntityLabels: Label[] = [];
            // eslint-disable-next-line max-depth
            if (utteranceUnknownEntityLabelDuplicateMap.has(utteranceKey)) {
              unknownEntityLabels = utteranceUnknownEntityLabelDuplicateMap.get(utteranceKey) as Label[];
            } else {
              unknownEntityLabels = [];
              utteranceUnknownEntityLabelDuplicateMap.set(utteranceKey, unknownEntityLabels);
            }
            // eslint-disable-next-line max-depth
            for (const label of unknownLabels) {
              // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== label.name = Utility.UnknownLabel;
              // ==== NOTE-IGNORE-UNKNOWN-LABELS ==== labelsSet.push(label);
              unknownEntityLabels.push(label);
            }
          }
        }
      });
    }
    return {
      utteranceUnknownEntityLabelsMap,
      utteranceUnknownEntityLabelDuplicateMap,
      utteranceLabelMapSetAddedWithUnknownLabel,
      utteranceLabelDuplicateMapSetAddedWithUnknownLabel};
  }

  // ---- NOTE-FOR-REFERENCE-ONLY-WILL-BE-DEPRECATED ----
  public static processUnknownSpuriousLabelsInTsvBluFileContent(bluFileContents: string): string {
    const lines: string[] = bluFileContents.split('\n');
    for (let lineIndex: number = 1; lineIndex < lines.length; lineIndex++) {
      const lineComponents: string[] = lines[lineIndex].split('\t');
      const labels: string[] = lineComponents[0].split(',');
      const concreteLabels: string[] = labels.filter(
        (label: string) => !Utility.UnknownLabelSet.has(label.toUpperCase()));
      const hasConcreteLabel: boolean = concreteLabels.length > 0;
      if (hasConcreteLabel) {
        lineComponents[0] = concreteLabels.join(',');
      } else {
        lineComponents[0] = Utility.UnknownLabel;
      }
      lines[lineIndex] = lineComponents.join('\t');
    }
    return lines.join('\n');
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- utility function to dump data arrays to a TSV file
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static storeDataArraysToTsvFile(
    outputFilename: string,
    outputEvaluationReportDataArrays: string[][],
    outputDataArraryHeaders: string[] = [],
    columnDelimiter: string = '\t',
    recordDelimiter: string = '\n',
    encoding: string = 'utf8'): string {
    if (Utility.isEmptyString(outputFilename)) {
      Utility.debuggingThrow(
        'outputFilename is empty');
    }
    if (Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
      return '';
      // ---- Utility.debuggingThrow(
      // ----   'outputEvaluationReportDataArrays is empty');
    }
    const outputLines: string[] = [];
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      const outputLine: string = outputDataArraryHeaders.join(columnDelimiter);
      outputLines.push(outputLine);
    }
    for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
      const outputLine: string = outputEvaluationReportDataArray.join(columnDelimiter);
      outputLines.push(outputLine);
    }
    const outputContent: string = outputLines.join(recordDelimiter);
    try {
      return Utility.dumpFile(outputFilename, `${outputContent}${recordDelimiter}`, encoding);
    } catch (error) {
      Utility.debuggingThrow(
        `storeTsvFile() cannout create an output file: ${outputFilename}, EXCEPTION=${error}`);
      return '';
    }
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- data structure to string/html output
  // -------------------------------------------------------------------------

  // eslint-disable-next-line max-params
  public static concatenateDataArrayToDelimitedString(
    outputEvaluationReportDataArray: any[],
    delimiter: string = ','): string {
    return outputEvaluationReportDataArray.join(delimiter);
  }

  // eslint-disable-next-line max-params
  public static concatenateDataArrayToHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArray: any[],
    outputDataArraryHeader: string = '',
    outputDataColumnWidthSetting: string = '',
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyString(outputDataArraryHeader)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      {
        const headerEntry: string = outputDataArraryHeader;
        let widthSetting: string = '';
        if (!Utility.isEmptyString(outputDataColumnWidthSetting)) {
          widthSetting = ` width=${outputDataColumnWidthSetting}`;
        }
        outputLines.push(indentCumulativeIdentIdent + '<th' + widthSetting + '>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArray(outputEvaluationReportDataArray)) {
      for (const dataEntry of outputEvaluationReportDataArray) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        outputLines.push(indentCumulativeIdentIdent + '<td>');
        outputLines.push(indentCumulativeIdentIdent + dataEntry);
        outputLines.push(indentCumulativeIdentIdent + '</td>');
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertDataArraysToHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArrays: any[][],
    outputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      for (let i: number = 0; i < outputDataArraryHeaders.length; i++) {
        const headerEntry: string = outputDataArraryHeaders[i];
        let widthSetting: string = '';
        if (!Utility.isEmptyStringArray(outputDataColumnWidthSettings) && (outputDataColumnWidthSettings.length > i)) {
          widthSetting = ` width=${outputDataColumnWidthSettings[i]}`;
        }
        outputLines.push(indentCumulativeIdentIdent + '<th' + widthSetting + '>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArrays(outputEvaluationReportDataArrays)) {
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + dataEntry);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
        }
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertDataArraysToIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArrays: any[][],
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArrays(outputEvaluationReportDataArrays)) {
      let index: number = 0;
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        outputLines.push(indentCumulativeIdentIdent + '<td>');
        outputLines.push(indentCumulativeIdentIdent + index++);
        outputLines.push(indentCumulativeIdentIdent + '</td>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + dataEntry);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
        }
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static concatenateDataArrayToObfuscatableHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArray: any[],
    outputDataArraryHeader: string = '',
    outputDataColumnWidthSetting: string = '',
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyString(outputDataArraryHeader)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      {
        const headerEntry: string = outputDataArraryHeader;
        let widthSetting: string = '';
        if (!Utility.isEmptyString(outputDataColumnWidthSetting)) {
          widthSetting = ` width=${outputDataColumnWidthSetting}`;
        }
        outputLines.push(indentCumulativeIdentIdent + '<th' + widthSetting + '>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArray(outputEvaluationReportDataArray)) {
      for (const dataEntry of outputEvaluationReportDataArray) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        outputLines.push(indentCumulativeIdentIdent + '<td>');
        outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(dataEntry));
        outputLines.push(indentCumulativeIdentIdent + '</td>');
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertDataArraysToObfuscatableHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArrays: any[][],
    outputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      for (let i: number = 0; i < outputDataArraryHeaders.length; i++) {
        const headerEntry: string = outputDataArraryHeaders[i];
        let widthSetting: string = '';
        if (!Utility.isEmptyStringArray(outputDataColumnWidthSettings) && (outputDataColumnWidthSettings.length > i)) {
          widthSetting = ` width=${outputDataColumnWidthSettings[i]}`;
        }
        outputLines.push(indentCumulativeIdentIdent + '<th' + widthSetting + '>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArrays(outputEvaluationReportDataArrays)) {
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(dataEntry));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
        }
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertDataArraysToObfuscatableIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationReportDataArrays: any[][],
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (!Utility.isEmptyGenericArrays(outputEvaluationReportDataArrays)) {
      let index: number = 0;
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulativeIdent + '<tr>');
        outputLines.push(indentCumulativeIdentIdent + '<td>');
        outputLines.push(indentCumulativeIdentIdent + index++);
        outputLines.push(indentCumulativeIdentIdent + '</td>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(dataEntry));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
        }
        outputLines.push(indentCumulativeIdent + '</tr>');
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertMapArrayToIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationMapArray: Map<any, any[]>,
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (Utility.isEmptyAnyKeyGenericArrayMap(outputEvaluationMapArray)) {
      let index: number = 0;
      for (const outputEvaluationMapArrayEntry of outputEvaluationMapArray) {
        const key: any = outputEvaluationMapArrayEntry[0];
        for (const valueSetEntry of outputEvaluationMapArrayEntry[1]) {
          outputLines.push(indentCumulativeIdent + '<tr>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + index++);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + key);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + valueSetEntry);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdent + '</tr>');
        }
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertMapSetToIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationMapSet: Map<any, Set<any>>,
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (Utility.isEmptyAnyKeyGenericSetMap(outputEvaluationMapSet)) {
      let index: number = 0;
      for (const outputEvaluationMapSetEntry of outputEvaluationMapSet) {
        const key: any = outputEvaluationMapSetEntry[0];
        for (const valueSetEntry of outputEvaluationMapSetEntry[1]) {
          outputLines.push(indentCumulativeIdent + '<tr>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + index++);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + key);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + valueSetEntry);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdent + '</tr>');
        }
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertMapArrayToObfuscatableIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationMapArray: Map<any, any[]>,
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (Utility.isEmptyAnyKeyGenericArrayMap(outputEvaluationMapArray)) {
      let index: number = 0;
      for (const outputEvaluationMapArrayEntry of outputEvaluationMapArray) {
        const key: any = outputEvaluationMapArrayEntry[0];
        for (const valueSetEntry of outputEvaluationMapArrayEntry[1]) {
          outputLines.push(indentCumulativeIdent + '<tr>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + index++);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(key));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(valueSetEntry));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdent + '</tr>');
        }
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // eslint-disable-next-line max-params
  public static convertMapSetToObfuscatableIndexedHtmlTable(
    tableDescription: string,
    outputEvaluationMapSet: Map<any, Set<any>>,
    outputDataArraryHeaders: string[] = [],
    indentCumulative: string = '  ',
    indent: string = '  '): string {
    const outputLines: string[] = [];
    if (!Utility.isEmptyString(tableDescription)) {
      outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
    }
    outputLines.push(indentCumulative + '<table class="table">');
    const indentCumulativeIdent: string = indentCumulative + indent;
    const indentCumulativeIdentIdent: string = indentCumulativeIdent + indent;
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulativeIdent + '<tr>');
      outputLines.push(indentCumulativeIdentIdent + '<th>');
      outputLines.push(indentCumulativeIdentIdent + 'No');
      outputLines.push(indentCumulativeIdentIdent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulativeIdentIdent + '<th>');
        outputLines.push(indentCumulativeIdentIdent + headerEntry);
        outputLines.push(indentCumulativeIdentIdent + '</th>');
      }
      outputLines.push(indentCumulativeIdent + '<tr>');
    }
    if (Utility.isEmptyAnyKeyGenericSetMap(outputEvaluationMapSet)) {
      let index: number = 0;
      for (const outputEvaluationMapSetEntry of outputEvaluationMapSet) {
        const key: any = outputEvaluationMapSetEntry[0];
        for (const valueSetEntry of outputEvaluationMapSetEntry[1]) {
          outputLines.push(indentCumulativeIdent + '<tr>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + index++);
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(key));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdentIdent + '<td>');
          outputLines.push(indentCumulativeIdentIdent + Utility.outputStringUtility(valueSetEntry));
          outputLines.push(indentCumulativeIdentIdent + '</td>');
          outputLines.push(indentCumulativeIdent + '</tr>');
        }
      }
    }
    outputLines.push(indentCumulative + '</table>');
    const outputContent: string = outputLines.join('\n');
    return outputContent;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- argment max
  // -------------------------------------------------------------------------

  public static getIndexesOnMaxOrEntriesOverThreshold(
    inputArray: number[],
    threshold: number):
    { 'indexesMax': number[]; 'max': number } {
    if (Utility.isEmptyNumberArray(inputArray)) {
      Utility.debuggingThrow('inputArray is empty');
    }
    const indexesOverTheThreshold: number[] = [];
    let indexesMax: number[] = [0];
    let max: number = inputArray[0];
    for (let i: number = 1; i < inputArray.length; i++) {
      const inputCurrent: number = inputArray[i];
      if (inputCurrent > threshold) {
        indexesOverTheThreshold.push(i);
      }
      if (inputCurrent > max) {
        max = inputCurrent;
        indexesMax = [i];
        continue;
      }
      if (inputCurrent === max) {
        indexesMax.push(i);
      }
    }
    if (indexesOverTheThreshold.length > 0) {
      indexesMax = indexesOverTheThreshold;
    }
    return {indexesMax, max};
  }

  public static getIndexesOnMaxEntries(
    inputArray: number[]):
    { 'indexesMax': number[]; 'max': number } {
    if (Utility.isEmptyNumberArray(inputArray)) {
      Utility.debuggingThrow('inputArray is empty');
    }
    let indexesMax: number[] = [0];
    let max: number = inputArray[0];
    for (let i: number = 1; i < inputArray.length; i++) {
      const inputCurrent: number = inputArray[i];
      if (inputCurrent > max) {
        max = inputCurrent;
        indexesMax = [i];
        continue;
      }
      if (inputCurrent === max) {
        indexesMax.push(i);
      }
    }
    return {indexesMax, max};
  }

  public static getIndexOnFirstMaxEntry(
    inputArray: number[]):
    { 'indexMax': number; 'max': number } {
    if (Utility.isEmptyNumberArray(inputArray)) {
      Utility.debuggingThrow('inputArray is empty');
    }
    let indexMax: number = 0;
    let max: number = inputArray[0];
    for (let i: number = 1; i < inputArray.length; i++) {
      const inputCurrent: number = inputArray[i];
      if (inputCurrent > max) {
        max = inputCurrent;
        indexMax = i;
      }
    }
    return {indexMax, max};
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- is a data structure empty
  // -------------------------------------------------------------------------

  public static isEmptyAnyKeyGenericArrayMap(
    anyKeyGenericSetMap: Map<any, any[]>): boolean {
    return !(anyKeyGenericSetMap &&
      [...anyKeyGenericSetMap].length > 0);
  }

  public static isEmptyAnyKeyGenericSetMap(
    anyKeyGenericSetMap: Map<any, Set<any>>): boolean {
    return !(anyKeyGenericSetMap &&
      [...anyKeyGenericSetMap].length > 0);
  }

  public static isEmptyGenericArrays<T>(inputArrays: boolean[][]): boolean {
    return !(inputArrays && inputArrays.length > 0);
  }

  public static isEmptyNumberArrays(inputArrays: number[][]): boolean {
    return !(inputArrays && inputArrays.length > 0);
  }

  public static isEmptyStringArrays(inputArrays: string[][]): boolean {
    return !(inputArrays && inputArrays.length > 0);
  }

  public static isEmptyGenericArray<T>(inputArray: T[]): boolean {
    return !(inputArray && inputArray.length > 0);
  }

  public static isEmptyNumberArray(inputArray: number[]): boolean {
    return !(inputArray && inputArray.length > 0);
  }

  public static isEmptyStringArray(inputArray: string[]): boolean {
    return !(inputArray && inputArray.length > 0);
  }

  public static isEmptyArray(inputArray: object[]): boolean {
    return !(inputArray && inputArray.length > 0);
  }

  public static isEmptyString(input: string): boolean {
    return !(input && input.length > 0);
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- example management
  // -------------------------------------------------------------------------

  public static examplesToUtteranceLabelMaps(
    exampleStructureArray: Example[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): [number, number] {
    let numberLabelsAdded: number = 0;
    let numberUtteancesAdded: number = 0;
    for (const example of exampleStructureArray) {
      const utterance: string = example.text;
      const labels: Label[] = example.labels;
      let added: boolean = false;
      for (const label of labels) {
        // Utility.debuggingLog(
        //   'Utility.examplesToUtteranceLabelMaps(): ' +
        //   `label.labeltype=${label.labeltype}` +
        //   `, label=${label.name}` +
        //   `, label.span.offset=${label.span.offset}` +
        //   `, label.span.length=${label.span.length}` +
        //   `, utterance=${utterance}`);
        const labeltype: LabelType = label.labeltype;
        if (labeltype === LabelType.Intent) {
          OrchestratorHelper.addNewLabelUtterance(
            utterance,
            label.name,
            '',
            utteranceLabelsMap,
            utteranceLabelDuplicateMap);
          numberLabelsAdded++;
          added = true;
        }
      }
      if (added) {
        numberUtteancesAdded++;
      }
    }
    return [numberUtteancesAdded, numberLabelsAdded];
  }

  public static examplesToUtteranceEntityLabelMaps(
    exampleStructureArray: Example[],
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): [number, number] {
    let numberLabelsAdded: number = 0;
    let numberUtteancesAdded: number = 0;
    for (const example of exampleStructureArray) {
      const utterance: string = example.text;
      const labels: Label[] = example.labels;
      let added: boolean = false;
      for (const label of labels) {
        // Utility.debuggingLog('Utility.examplesToUtteranceEntityLabelMaps(): ' +
        //   `label.labeltype=${label.labeltype}` +
        //   `, label=${label.name}` +
        //   `, label.span.offset=${label.span.offset}` +
        //   `, label.span.length=${label.span.length}` +
        //   `, utterance=${utterance}`);
        const labeltype: LabelType = label.labeltype;
        if (labeltype === LabelType.Entity) {
          OrchestratorHelper.addNewEntityLabelObjectUtterance(
            utterance,
            label,
            utteranceEntityLabelsMap,
            utteranceEntityLabelDuplicateMap);
          numberLabelsAdded++;
          added = true;
        }
      }
      if (added) {
        numberUtteancesAdded++;
      }
    }
    return [numberUtteancesAdded, numberLabelsAdded];
  }

  public static examplesToArray(examples: any): Example[] {
    const exampleStructureArray: Example[] = [];
    for (const example of examples) {
      const labels: Label[] = [];
      for (const examplelabel of example.labels) {
        const label: string = examplelabel.name;
        const labeltype: LabelType = examplelabel.label_type;
        const labelspan: any = examplelabel.span;
        const labelspanoffset: number = labelspan.offset;
        const labelspanlength: number = labelspan.length;
        const labelStructure: Label = Label.newLabel(labeltype, label, labelspanoffset, labelspanlength);
        labels.push(labelStructure);
      }
      const exampleStructure: Example = new Example(example.text, labels);
      exampleStructureArray.push(exampleStructure);
    }
    return exampleStructureArray;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- score array processing
  // -------------------------------------------------------------------------

  public static scoreResultsToArray(
    results: any,
    labelIndexMapCanBeUndefined: Map<string, number>|undefined = undefined): Result[] {
    const hasLabelIndexMap: boolean = (labelIndexMapCanBeUndefined !== undefined);
    const labelIndexMap: Map<string, number> = labelIndexMapCanBeUndefined as Map<string, number>;
    const scoreResultArray: Result[] = [];
    for (const result of results) {
      if (result) {
        const score: number = result.score;
        const resultlabel: any = result.label;
        const label: string = resultlabel.name;
        const labeltype: LabelType = resultlabel.label_type;
        const labelspan: any = resultlabel.span;
        const labelspanoffset: number = labelspan.offset;
        const labelspanlength: number = labelspan.length;
        const closesttext: string = result.closest_text;
        const scoreResult: Result = new Result(
          Label.newLabel(labeltype, label, labelspanoffset, labelspanlength),
          score,
          closesttext);
        if (hasLabelIndexMap) {
          const labelIndex: number = labelIndexMap.get(label) as number;
          if (labelIndex >= 0) {
            scoreResultArray[labelIndex] = scoreResult;
          }
        } else {
          scoreResultArray.push(scoreResult);
        }
      }
    }
    return scoreResultArray;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- data structure processing
  // -------------------------------------------------------------------------

  public static buildStringIdNumberValueDictionaryFromUniqueStringArray(
    inputStringArray: string[]): Map<string, number> {
    const stringMap: Map<string, number> = new Map<string, number>();
    for (let index: number = 0; index < inputStringArray.length; index++) {
      stringMap.set(inputStringArray[index], index);
    }
    return stringMap;
  }

  public static buildStringIdNumberValueDictionaryFromStringArray(
    inputStringArray: string[]): {
      'stringArray': string[];
      'stringMap': Map<string, number>;} {
    const stringSet: Set<string> = new Set(inputStringArray);
    let stringArray: string[] = [...stringSet];
    stringArray = Utility.sortStringArray(stringArray);
    const stringMap: Map<string, number> =
      Utility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
    return {stringArray, stringMap};
  }

  public static buildStringIdNumberValueDictionaryFromStringArrays(
    inputStringArrays: string[][]): {
      'stringArray': string[];
      'stringMap': Map<string, number>; } {
    const stringSet: Set<string> = new Set();
    for (const elementStringArray of inputStringArrays) {
      for (const elementString of elementStringArray) {
        stringSet.add(elementString);
      }
    }
    let stringArray: string[] = [...stringSet];
    stringArray = Utility.sortStringArray(stringArray);
    const stringMap: Map<string, number> =
      Utility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
    return {stringArray, stringMap};
  }

  public static sortStringArray(inputStringArray: string[]): string[] {
    return inputStringArray.sort(
      (n1: string, n2: string) => {
        if (n1 > n2) {
          return 1;
        }
        if (n1 < n2) {
          return -1;
        }
        return 0;
      });
  }

  public static convertStringKeyGenericSetNativeMapToDictionary<T>(
    stringKeyGenericSetMap: Map<string, Set<T>>): { [id: string]: Set<T> } {
    const stringIdGenericSetDictionary: { [id: string]: Set<T> } = {};
    for (const key of stringKeyGenericSetMap.keys()) {
      if (key) {
        const value: Set<T> = stringKeyGenericSetMap.get(key) as Set<T>;
        stringIdGenericSetDictionary[key] = value;
      }
    }
    return stringIdGenericSetDictionary;
  }

  public static convertStringKeyGenericValueValueNativeMapToDictionary<T>(
    stringKeyGenericValueMap: Map<string, T>): { [id: string]: T } {
    const stringIdGenericValueDictionary: { [id: string]: T } = {};
    for (const key of stringKeyGenericValueMap.keys()) {
      if (key) {
        const value: T = stringKeyGenericValueMap.get(key) as T;
        stringIdGenericValueDictionary[key] = value;
      }
    }
    return stringIdGenericValueDictionary;
  }

  public static insertStringPairToStringIdStringSetNativeMap(
    key: string,
    value: string,
    stringKeyStringSetMap: Map<string, Set<string>>): Map<string, Set<string>> {
    if (!stringKeyStringSetMap) {
      stringKeyStringSetMap = new Map<string, Set<string>>();
    }
    if (stringKeyStringSetMap.has(key)) {
      let stringSet: Set<string> | undefined = stringKeyStringSetMap.get(key);
      if (!stringSet) {
        stringSet = new Set<string>();
        stringKeyStringSetMap.set(key, stringSet);
      }
      stringSet.add(value);
    } else {
      const stringSet: Set<string> = new Set<string>();
      stringKeyStringSetMap.set(key, stringSet);
      stringSet.add(value);
    }
    return stringKeyStringSetMap;
  }

  public static insertStringLabelPairToStringIdLabelSetNativeMap(
    key: string,
    value: Label,
    stringKeyLabelSetMap: Map<string, Label[]>): Map<string, Label[]> {
    if (!stringKeyLabelSetMap) {
      stringKeyLabelSetMap = new Map<string, Label[]>();
    }
    if (stringKeyLabelSetMap.has(key)) {
      let labelSet: Label[] | undefined = stringKeyLabelSetMap.get(key);
      if (!labelSet) {
        labelSet = [];
        stringKeyLabelSetMap.set(key, labelSet);
      }
      Utility.addUniqueEntityLabelArray(value, labelSet);
    } else {
      const labelSet: Label[] = [];
      stringKeyLabelSetMap.set(key, labelSet);
      labelSet.push(value);
    }
    return stringKeyLabelSetMap;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- label management
  // -------------------------------------------------------------------------

  public static copyNonExistentUtteranceLabelsFromStringToObjectStructure(
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>): number {
    let numberUtterancesCopied: number = 0;
    for (const utteranceKey of utteranceLabelsMap.keys()) {
      if (utteranceEntityLabelsMap.has(utteranceKey)) {
        continue;
      }
      if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
        UtilityDispatcher.debuggingNamedLog1('Utility.copyNonExistentUtteranceLabelsFromStringToObjectStructure()', utteranceKey, 'utteranceKey');
      }
      utteranceEntityLabelsMap.set(utteranceKey, []);
      numberUtterancesCopied++;
    }
    return numberUtterancesCopied;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- label management
  // -------------------------------------------------------------------------

  public static addUniqueLabel(newLabel: string, labels: Set<string>): boolean {
    try {
      if (labels.has(newLabel)) {
        return false;
      }
      labels.add(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueLabel(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
      throw error;
    }
    return false;
  }

  public static addUniqueLabelToArray(newLabel: string, labels: string[]): boolean {
    try {
      for (const label of labels) {
        if (label === newLabel) {
          return false;
        }
      }
      labels.push(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueLabelToArray(), error='${error}', newLabel=${newLabel}, labels=${labels}`);
      throw error;
    }
    return false;
  }

  public static addUniqueEntityLabelArray(newLabel: Label, labels: Label[]): boolean {
    try {
      for (const label of labels) {
        if (label.equals(newLabel)) {
          return false;
        }
      }
      labels.push(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueEntityLabelArray(), error=${error}, newLabel=${newLabel}, labels=${labels}`);
      throw error;
    }
    return false;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- Obfuscation
  // -------------------------------------------------------------------------
  // ---- TO-REFACTOR ----
  public static outputLabelStringUtility(input: Label): string {
    return input.toString(Utility.toObfuscateLabelTextInReportUtility);
  }

  public static outputLabelString(input: Label, toObfuscate: boolean = false): string {
    if (toObfuscate) {
      return input.toObfuscatedString();
    }
    return input.toSimpleString();
  }

  public static obfuscateLabel(input: Label): string {
    const inputObfuscated: string = input.toObfuscatedString();
    return inputObfuscated;
  }

  public static outputNumberUtility(input: number): number {
    return Utility.outputNumber(input, Utility.toObfuscateLabelTextInReportUtility);
  }

  public static outputNumber(input: number, toObfuscate: boolean = false): number {
    if (toObfuscate) {
      return Utility.obfuscateNumber(input);
    }
    return input;
  }

  public static obfuscateNumber(input: number): number {
    const inputObfuscated: number = CryptoUtility.getNumberObfuscated(input);
    return inputObfuscated;
  }

  public static outputStringUtility(input: string): string {
    return Utility.outputString(input, Utility.toObfuscateLabelTextInReportUtility);
  }

  public static outputString(input: string, toObfuscate: boolean = false): string {
    if (toObfuscate) {
      return Utility.obfuscateString(input);
    }
    return input;
  }

  public static obfuscateString(input: string): string {
    const inputObfuscated: string = CryptoUtility.getStringObfuscated(input);
    return inputObfuscated;
  }
  // ---- TO-REFACTOR

  // -------------------------------------------------------------------------
  // ---- NOTE ---- JSON functions
  // -------------------------------------------------------------------------

  public static jsonStringifyInLine(
    value: any): string {
    return Utility.jsonStringify(value, null, '');
  }

  public static jsonStringify(
    value: any,
    replacer: Array<number | string> | null = null,
    space: string | number = 4): string {
    return JSON.stringify(value, replacer, space);
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- file system IO
  // -------------------------------------------------------------------------

  public static loadFile(
    filename: string,
    encoding: string = 'utf8'): string {
    Utility.debuggingLog(
      `Utility.loadFile(): filename=${filename}`);
    Utility.debuggingLog(
      `Utility.loadFile(): process.cmd()=${process.cwd()}`);
    try {
      const fileContent: string = fs.readFileSync(filename, encoding);
      return fileContent;
    } catch (error) {
      Utility.debuggingThrow(
        `Utility.loadFile(): filename=${filename}, exception=${error}`);
    }
    return '';
  }

  public static dumpFile(
    filename: string,
    content: any,
    options: any = {encoding: 'utf8', flag: 'w'}): string {
    // Utility.debuggingLog(
    //     `Utility.dumpFile(): filename=${filename}`);
    const resolvedFilename: string = path.resolve(filename);
    try {
      fs.mkdirSync(path.dirname(resolvedFilename), {recursive: true});
      fs.writeFileSync(resolvedFilename, content, options);
    } catch (error) {
      // ---- NOTE ---- An error occurred
      Utility.debuggingThrow(`FAILED to dump a file: filename=${filename}, resolvedFilename=${resolvedFilename}, exception=${error}`);
      return '';
    }
    return resolvedFilename;
  }

  public static exists(pathToFileSystemEntry: string): boolean {
    return fs.existsSync(pathToFileSystemEntry);
  }

  public static deleteFile(
    filename: string,
    ignoreEmptyFilename: boolean = true): string {
    // Utility.debuggingLog(
    //     `Utility.deleteFile(): filename=${filename}`);
    return Utility.unlink(filename, ignoreEmptyFilename);
  }

  public static moveFile(
    filename: string, targetDir: string): string {
    // Utility.debuggingLog(
    //     `Utility.moveFile(): filename=${filename}`);
    // Utility.debuggingLog(
    //     `Utility.moveFile(): targetDir=${targetDir}`);
    const filebasename: string = path.basename(filename);
    const destination: string = path.resolve(targetDir, filebasename);
    return Utility.rename(filename, destination);
  }

  public static unlink(
    entryname: string,
    ignoreEmptyEntryName: boolean = true): string {
    // Utility.debuggingLog(
    //     `Utility.unlink(): entryname=${entryname}`);
    try {
      if (Utility.isEmptyString(entryname)) {
        if (ignoreEmptyEntryName) {
          return '';
        }
      }
      fs.unlinkSync(entryname);
    } catch (error) {
      // ---- NOTE ---- An error occurred
      Utility.debuggingThrow(`FAILED to unlink a entry: entryname=${entryname}, error=${error}`);
      return '';
    }
    return entryname;
  }

  public static rename(
    entryname: string, entrynameNew: string): string {
    // Utility.debuggingLog(
    //     `Utility.rename(): entryname=${entryname}`);
    // Utility.debuggingLog(
    //     `Utility.rename(): entrynameNew=${entrynameNew}`);
    try {
      fs.renameSync(entryname, entrynameNew);
    } catch (error) {
      // ---- NOTE ---- An error occurred
      Utility.debuggingThrow(`FAILED to rename a entry system entry: entryname=${entrynameNew}, entryname=${entrynameNew}, error=${error}`);
      return '';
    }
    return entryname;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- data structure functions
  // -------------------------------------------------------------------------

  public static countMapValues(inputStringToStringArrayMap: Map<string, Set<string>>): number {
    return [...inputStringToStringArrayMap.entries()].reduce(
      (accumulant: number,  value: [string, Set<string>]) => accumulant + value[1].size, 0);
  }

  public static carefullyAccessStringMap(stringMap: Map<string, number>, key: string): number {
    if (stringMap === undefined) {
      Utility.debuggingThrow(
        'stringMap === undefined');
    }
    if (!stringMap.has(key)) {
      Utility.debuggingThrow(
        `FAIL to use a key '${key}' to access a stringMap ${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(stringMap)}`);
    }
    const value: number = stringMap.get(key) as number;
    return value;
  }

  public static carefullyAccessStringDictionary(stringDictionary: {[id: string]: number}, key: string): number {
    if (stringDictionary === undefined) {
      Utility.debuggingThrow(
        'stringDictionary === undefined');
    }
    const value: number = stringDictionary[key];
    if (value === undefined) {
      Utility.debuggingThrow(
        `FAIL to use a key '${key}' to access a stringDictionary ${Utility.jsonStringify(stringDictionary)}`);
    }
    return value;
  }

  public static carefullyAccessStringArray(stringArray: string[], index: number): string {
    if (stringArray === undefined) {
      Utility.debuggingThrow(
        'stringArray === undefined');
    }
    if (index < 0) {
      Utility.debuggingThrow(
        `index ${index} not in range, stringArray.length=${stringArray.length}`);
    }
    if (index >= stringArray.length) {
      Utility.debuggingThrow(
        `index ${index} not in range, stringArray.length=${stringArray.length}`);
    }
    const value: string = stringArray[index];
    if (value === undefined) {
      Utility.debuggingThrow(
        `FAIL to use a index ${index} to access a stringArray ${Utility.jsonStringify(stringArray)}`);
    }
    return value;
  }

  public static canAccessNumberArray(numberArray: number[], index: number): boolean {
    if (numberArray === undefined) {
      return false;
    }
    if (index < 0) {
      return false;
    }
    if (index >= numberArray.length) {
      return false;
    }
    const value: number = numberArray[index];
    if (value === undefined) {
      return false;
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- string processing functions
  // -------------------------------------------------------------------------

  public static cleanStringOnTabs(input: string, replacement: string = ' '): string {
    return input.replace(/[\t]+/gm, replacement);
  }

  public static cleanStringOnSpaces(input: string, replacement: string = ' '): string {
    return input.replace(/[\r\n\t]+/gm, replacement);
  }

  public static cleanStringOnSpaceCommas(input: string, replacement: string = ' '): string {
    return input.replace(/[\r\n\t,]+/gm, replacement);
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- number processing
  // -------------------------------------------------------------------------

  // ---- NOTE-TO-REFACTOR ----
  public static round(input: number, digits: number = 10000): number {
    if (digits > 0) {
      input = Math.round(input * digits) / digits;
    }
    return input;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- output processing
  // -------------------------------------------------------------------------

  // ---- NOTE-TO-REFACTOR ----
  public static getBolded(input: any): string {
    return `<b>${input}</b>`;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- console IO
  // -------------------------------------------------------------------------
  // ---- NOTE-TO-REFACTOR ----

  public static writeAnyJsonifiedToConsoleStdout(outputContents: any) {
    const output: string = Utility.jsonStringify(outputContents, null, 2);
    Utility.writeAnyLineToConsoleStdout(output);
  }

  public static writeAnyJsonifiedToConsoleStderr(outputContents: any) {
    const output: string = Utility.jsonStringify(outputContents, null, 2);
    Utility.writeAnyLineToConsoleStderr(output);
  }

  public static writeAnyLineToConsoleStdout(outputContents: any) {
    Utility.writeAnyToConsoleStdout(outputContents);
    Utility.writeStringToConsoleStdout('\n');
  }

  public static writeAnyLineToConsoleStderr(outputContents: any) {
    Utility.writeAnyToConsoleStderr(outputContents);
    Utility.writeStringToConsoleStderr('\n');
  }

  public static writeAnyToConsoleStdout(outputContents: any) {
    process.stdout.write(outputContents);
  }

  public static writeAnyToConsoleStderr(outputContents: any) {
    process.stderr.write(outputContents);
  }

  public static writeStringLineToConsoleStdout(outputContents: string) {
    Utility.writeStringToConsoleStdout(outputContents);
    Utility.writeStringToConsoleStdout('\n');
  }

  public static writeStringLineToConsoleStderr(outputContents: string) {
    Utility.writeStringToConsoleStderr(outputContents);
    Utility.writeStringToConsoleStderr('\n');
  }

  public static writeStringToConsoleStdout(outputContents: string) {
    process.stdout.write(outputContents);
  }

  public static writeStringToConsoleStderr(outputContents: string) {
    process.stderr.write(outputContents);
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- debugging
  // -------------------------------------------------------------------------

  public static resetFlagToPrintDebuggingLogToConsole(flag: boolean) {
    Utility.toPrintDebuggingLogToConsole = flag;
    UtilityDispatcher.resetFlagToPrintDebuggingLogToConsole(flag);
  }

  public static resetFlagToPrintDetailedDebuggingLogToConsole(flag: boolean) {
    Utility.toPrintDetailedDebuggingLogToConsole = flag;
    UtilityDispatcher.resetFlagToPrintDetailedDebuggingLogToConsole(flag);
  }

  public static resetFlagToObfuscateLabelTextInReportUtility(flag: boolean) {
    Utility.toObfuscateLabelTextInReportUtility = flag;
    UtilityDispatcher.resetFlagToObfuscateLabelTextInReportUtility(flag);
    UtilityLabelResolver.resetFlagToObfuscateLabelTextInReportUtilityLabelResolver(flag);
  }

  public static debuggingLog(
    message: any): string {
    const dateTimeString: string = (new Date()).toISOString();
    const logMessage: string =
      `[${dateTimeString}] LOG-MESSAGE: ${Utility.jsonStringify(message)}`;
    if (Utility.toPrintDebuggingLogToConsole) {
      // tslint:disable: no-console
      // eslint-disable-next-line no-console
      console.log(logMessage);
    }
    return logMessage;
  }

  public static debuggingThrow(
    message: any): void {
    const dateTimeString: string = (new Date()).toISOString();
    const logMessage: string =
      `[${dateTimeString}] ERROR-MESSAGE: ${Utility.jsonStringify(message)}`;
    const error: Error = new Error(logMessage);
    const stackTrace: string = error.stack as string;
    Utility.debuggingLog(stackTrace);
    throw error;
  }

  // -------------------------------------------------------------------------
  // ---- NOTE ---- folder utility functions
  // -------------------------------------------------------------------------

  public static emptyFolder(inputPath: string) {
    if (fs.existsSync(inputPath)) {
      fs.readdirSync(inputPath).forEach(function (file: string) {
        const curPath: string = path.join(inputPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          Utility.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
    }
  }

  public static deleteFolderRecursive(inputPath: string) {
    if (fs.existsSync(inputPath)) {
      fs.readdirSync(inputPath).forEach(function (file: string) {
        const curPath: string = path.join(inputPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          Utility.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(inputPath);
    }
  }
}
