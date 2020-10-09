/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs';
import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {BinaryConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixSubset} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrix} from '@microsoft/bf-dispatcher';
import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';

import {Example} from './example';
import {Label} from './label';
import {LabelType} from './labeltype';
import {OrchestratorHelper} from './orchestratorhelper';
import {PredictionLabelStructure} from './predictionlabelstructure';
import {PredictionStructure} from './predictionstructure';
import {PredictionScoreStructure} from './predictionscorestructure';
import {PredictionType} from './predictiontype';
import {PredictionTypeArrayOutputIndex} from './predictiontype';
import {Result} from './result';
import {Span} from './span';

import {AssessmentLabelSummaryTemplateHtml} from './resources/assessment-label-summary-template-html';
import {EvaluationSummaryTemplateHtml} from './resources/evaluation-summary-template-html';

export class Utility {
  public static toPrintDebuggingLogToConsole: boolean = true;

  public static toPrintDetailedDebuggingLogToConsole: boolean = false;

  public static NumberOfInstancesPerProgressDisplayBatch: number = 1000; // 10000;

  public static readonly DefaultAmbiguousClosenessParameter: number = 0.2;

  public static readonly DefaultLowConfidenceScoreThresholdParameter: number = 0.5;

  public static readonly DefaultMultiLabelPredictionThresholdParameter: number = 1.0;

  public static readonly DefaultUnknownLabelPredictionThresholdParameter: number = 0.3;

  public static readonly UnknownLabel: string = 'UNKNOWN';

  public static readonly UnknownLabelSet: Set<string> = new Set<string>(['', 'NONE', 'NULL', Utility.UnknownLabel]);

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

  public static readonly ColumnNameSummationMicroAverage: string = `Summation ${Utility.ColumnNameMicroAverageRaw}`;

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
  one labels. The above metrics so far are calculated "per instance label," i.e., an instance can contribute to
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
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionLabelStructureArray': PredictionLabelStructure[];
    } {
    // ---- NOTE ---- load the assessment evaluation summary template.
    const evaluationSummary: string = AssessmentLabelSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report for the ground-truth set.
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.generateEvaluationReportLabelUtteranceStatistics()');
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
      predictionSetEntityLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.evaluationReportGroundTruthSetLabelUtteranceStatistics()');
    // ---- NOTE ---- generate evaluation report for the prediction set.
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.evaluationReportGroundTruthSetLabelUtteranceStatistics()');
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
      predictionSetEntityLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.generateEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- produce prediction evaluation
    const predictionLabelStructureArray: PredictionLabelStructure[] = Utility.assessLabelObjectPredictions(
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
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), ready to call Utility.generateEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateAssessmentLabelObjectEvaluationReportAnalyses(
      evaluationReportSpuriousPredictions.evaluationSummary,
      predictionLabelStructureArray,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), evaluationReportAnalyses.evaluationSummary=\n${evaluationReportAnalyses.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReport(), finished calling Utility.generateEvaluationReportAnalyses()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReport(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportGroundTruthSetLabelUtteranceStatistics,
      evaluationReportPredictionSetLabelUtteranceStatistics,
      evaluationReportSpuriousPredictions,
      evaluationReportAnalyses,
      predictionLabelStructureArray};
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
      (spuriousPrediction: [string, Label[]]) => [spuriousPrediction[0], Utility.concatenateDataArrayToHtmlTable('Label', spuriousPrediction[1].map((x: Label) => x.toSimpleString()))]);
    // ---- NOTE ---- generate spurious report.
    const spuriousPredictionHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Spurious utterance and label pairs',
      spuriousPredictionArrays,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation SPURIOUS_UTTERANCES summary from template.
    evaluationSummary = evaluationSummary.replace(
      '{SPURIOUS_UTTERANCES}', spuriousPredictionHtml);
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
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } {
    // ---- NOTE ---- create a label-index map.
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(dataSetLabels);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
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
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string; } = Utility.generateLabelStatisticsAndHtmlTable(
        Utility.convertUtteranceEntityLabelsMap(utteranceEntityLabelsMap),
        labelArrayAndMap);
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateUtteranceStatisticsAndHtmlTable(
        Utility.convertUtteranceEntityLabelsMap(utteranceEntityLabelsMap));
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation LABEL_TEXT_STATISTICS summary from template.
    const labelsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagEntityLabelUtteranceStatistics, labelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagEntityLabelUtteranceStatistics} content`);
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = [...utteranceEntityLabelsMap.entries()].filter(
      (x: [string, Label[]]) => x[1].length > 1).map((x: [string, Label[]]) => [x[0], Utility.concatenateDataArrayToHtmlTable('Label', x[1].map((x: Label) => x.toSimpleString()))]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their labels',
      utterancesMultiLabelArrays,
      ['Utterance', 'Labels']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapArrayToIndexedHtmlTable(
      'Duplicate utterance and label pairs',
      utteranceEntityLabelDuplicateMap,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation TEXT_DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagUtteranceDuplicates, duplicateStatisticsHtml);
    Utility.debuggingLog(`Utility.generateAssessmentLabelObjectEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagUtteranceDuplicates} content`);
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      labelArrayAndMap,
      labelStatisticsAndHtmlTable,
      utteranceStatisticsAndHtmlTable,
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
    predictionLabelStructureArray: PredictionLabelStructure[],
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
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
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
      predictionLabelStructureArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}', misclassifiedAnalysis.predictingMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateAssessmentLabelObjectEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateAssessmentLabelObjectConfusionMatrixMetricsAndHtmlTable(
      predictionLabelStructureArray,
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
    predictionLabelStructureArray: PredictionLabelStructure[]): {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const predictingMisclassifiedUtterancesArrays: string[][] = [];
    const predictingMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionLabelStructure of predictionLabelStructureArray.filter((x: PredictionLabelStructure) => x.hasMisclassified())) {
      if (predictionLabelStructure) {
        const labelsPredictionStructureHtmlTable: string = predictionLabelStructure.labelsConcatenated; // ---- NOTE-PLACE-HOLDER ---- may need more elaborate output
        const predictedPredictionStructureHtmlTable: string = predictionLabelStructure.labelsPredictedConcatenated; // ---- NOTE-PLACE-HOLDER ---- may need more elaborate output
        const predictingMisclassifiedUtterancesArray: string[] = [
          predictionLabelStructure.utterance,
          labelsPredictionStructureHtmlTable,
          predictedPredictionStructureHtmlTable,
        ];
        predictingMisclassifiedUtterancesArrays.push(predictingMisclassifiedUtterancesArray);
        const labelsConcatenated: string = predictionLabelStructure.labelsConcatenated;
        const labelsPredictedConcatenated: string = predictionLabelStructure.labelsPredictedConcatenated;
        const predictingMisclassifiedUtterancesSimpleArray: string[] = [
          predictionLabelStructure.utterance,
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
    predictionLabelStructureArray: PredictionLabelStructure[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    const confusionMatrix: MultiLabelObjectConfusionMatrix = new MultiLabelObjectConfusionMatrix(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    const multiLabelConfusionMatrixExact: MultiLabelConfusionMatrixExact = new MultiLabelConfusionMatrixExact(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    const multiLabelConfusionMatrixSubset: MultiLabelConfusionMatrixSubset = new MultiLabelConfusionMatrixSubset(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    for (const predictionLabelStructure of predictionLabelStructureArray) {
      if (predictionLabelStructure) {
        confusionMatrix.addInstanceByLabelObjects(predictionLabelStructure.labels, predictionLabelStructure.labelsPredicted);
      }
    }
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
      confusionMatrix,
      multiLabelConfusionMatrixExact, // ---- NOTE ---- not calculated for entity labels.
      multiLabelConfusionMatrixSubset, // ---- NOTE ---- not calculated for entity labels.
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
      'stringMap': Map<string, number>;}): PredictionLabelStructure[] {
    const predictionLabelStructureArray: PredictionLabelStructure[] = [];
    for (const groundTruthSetUtteranceLabels of groundTruthSetUtteranceLabelsMap.entries()) {
      const utterance: string = groundTruthSetUtteranceLabels[0];
      const groundTruthSetLabels: Label[] = groundTruthSetUtteranceLabels[1];
      let predictionSetLabels: Label[] = [];
      // eslint-disable-next-line no-prototype-builtins
      if (predictionSetUtteranceLabelsMap.has(utterance)) {
        predictionSetLabels = predictionSetUtteranceLabelsMap.get(utterance) as Label[];
      }
      const groundTruthSetLabelsIndexes: number[] = groundTruthSetLabels.map((x: Label) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x.name));
      const groundTruthSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(groundTruthSetLabels.map((x: Label) => x.toSimpleString()));
      const groundTruthSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', groundTruthSetLabels.map((x: Label) => x.toSimpleString()));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessLabelObjectPredictions(), finished processing groundTruthSetLabelsIndexes, utterance=${utterance}`);
      }
      const predictionSetLabelsIndexes: number[] = predictionSetLabels.map((x: Label) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x.name));
      const predictionSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(predictionSetLabels.map((x: Label) => x.toSimpleString()));
      const predictionSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', predictionSetLabels.map((x: Label) => x.toSimpleString()));
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessLabelObjectPredictions(), finished processing predictionSetLabelsIndexes, utterance=${utterance}`);
      }
      const labelsPredictionEvaluation: number[] = Utility.evaluateLabelObjectPrediction(groundTruthSetLabels, predictionSetLabels);
      predictionLabelStructureArray.push(new PredictionLabelStructure(
        utterance,
        labelsPredictionEvaluation,
        groundTruthSetLabels,
        groundTruthSetLabelsConcatenated,
        groundTruthSetLabelsConcatenatedToHtmlTable,
        groundTruthSetLabelsIndexes,
        predictionSetLabels,
        predictionSetLabelsConcatenated,
        predictionSetLabelsConcatenatedToHtmlTable,
        predictionSetLabelsIndexes));
    }
    return predictionLabelStructureArray;
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
      stringArray.map((x: string) => [x]));
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), finished calling Utility.storeDataArraysToTsvFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), ready to call Utility.dumpFile()');
    Utility.dumpFile(
      evaluationSetSummaryOutputFilename,
      evaluationSummary);
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportFiles(), finished calling Utility.dumpFile()');
  }

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
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionStructureArray': PredictionStructure[];
    } {
    // ---- NOTE ---- load the assessment evaluation summary template.
    const evaluationSummary: string = AssessmentLabelSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report for the ground-truth set.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.generateEvaluationReportLabelUtteranceStatistics()');
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
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      groundTruthSetLabels,
      groundTruthSetUtteranceLabelsMap,
      groundTruthSetUtteranceLabelDuplicateMap,
      '{GROUND_TRUTH_SET_LABEL_TEXT_STATISTICS}',
      '{GROUND_TRUTH_SET_TEXT_DUPLICATES}',
      predictionSetLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.evaluationReportGroundTruthSetLabelUtteranceStatistics()');
    // ---- NOTE ---- generate evaluation report for the prediction set.
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.evaluationReportGroundTruthSetLabelUtteranceStatistics()');
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
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateEvaluationReportLabelUtteranceStatistics(
      evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary,
      groundTruthSetLabels,
      predictionSetUtteranceLabelsMap,
      predictionSetUtteranceLabelDuplicateMap,
      '{PREDICTION_SET_LABEL_TEXT_STATISTICS}',
      '{PREDICTION_SET_TEXT_DUPLICATES}',
      predictionSetLabelSet.has(Utility.UnknownLabel));
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary=\n${evaluationReportPredictionSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.generateEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- produce prediction evaluation
    const predictionStructureArray: PredictionStructure[] = Utility.assessMultiLabelIntentPredictions(
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
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), ready to call Utility.generateEvaluationReportAnalyses()');
    const evaluationReportAnalyses: {
      'evaluationSummary': string;
      'misclassifiedAnalysis': {
        'predictingMisclassifiedUtterancesArrays': string[][];
        'predictingMisclassifiedUtterancesArraysHtml': string;
        'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateAssessmentEvaluationReportAnalyses(
      evaluationReportSpuriousPredictions.evaluationSummary,
      predictionStructureArray,
      evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), evaluationReportAnalyses.evaluationSummary=\n${evaluationReportAnalyses.evaluationSummary}`);
    }
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReport(), finished calling Utility.generateEvaluationReportAnalyses()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateAssessmentEvaluationReport(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportGroundTruthSetLabelUtteranceStatistics,
      evaluationReportPredictionSetLabelUtteranceStatistics,
      evaluationReportSpuriousPredictions,
      evaluationReportAnalyses,
      predictionStructureArray};
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
      '{SPURIOUS_UTTERANCES}', spuriousPredictionHtml);
    return {
      evaluationSummary,
      spuriousPredictions};
  }

  // eslint-disable-next-line max-params
  public static generateAssessmentEvaluationReportAnalyses(
    evaluationSummary: string,
    predictionStructureArray: PredictionStructure[],
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
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
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
      predictionStructureArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}', misclassifiedAnalysis.predictingMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateAssessmentEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable(
      predictionStructureArray,
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
    predictionStructureArray: PredictionStructure[]): {
      'predictingMisclassifiedUtterancesArrays': string[][];
      'predictingMisclassifiedUtterancesArraysHtml': string;
      'predictingMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const predictingMisclassifiedUtterancesArrays: string[][] = [];
    const predictingMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionStructure of predictionStructureArray.filter((x: PredictionStructure) => (x.isMisclassified()))) {
      if (predictionStructure) {
        const labelsPredictionStructureHtmlTable: string = predictionStructure.labelsConcatenated; // ---- NOTE-PLACE-HOLDER ---- may need more elaborate output
        const predictedPredictionStructureHtmlTable: string = predictionStructure.labelsPredictedConcatenated; // ---- NOTE-PLACE-HOLDER ---- may need more elaborate output
        const predictingMisclassifiedUtterancesArray: string[] = [
          predictionStructure.utterance,
          labelsPredictionStructureHtmlTable,
          predictedPredictionStructureHtmlTable,
        ];
        predictingMisclassifiedUtterancesArrays.push(predictingMisclassifiedUtterancesArray);
        const labelsConcatenated: string = predictionStructure.labelsConcatenated;
        const labelsPredictedConcatenated: string = predictionStructure.labelsPredictedConcatenated;
        const predictingMisclassifiedUtterancesSimpleArray: string[] = [
          predictionStructure.utterance,
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

  public static generateAssessmentConfusionMatrixMetricsAndHtmlTable(
    predictionStructureArray: PredictionStructure[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    const confusionMatrix: MultiLabelConfusionMatrix = new MultiLabelConfusionMatrix(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    const multiLabelConfusionMatrixExact: MultiLabelConfusionMatrixExact = new MultiLabelConfusionMatrixExact(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    const multiLabelConfusionMatrixSubset: MultiLabelConfusionMatrixSubset = new MultiLabelConfusionMatrixSubset(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    for (const predictionStructure of predictionStructureArray) {
      if (predictionStructure) {
        confusionMatrix.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
        multiLabelConfusionMatrixExact.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
        multiLabelConfusionMatrixSubset.addInstanceByLabelIndexes(predictionStructure.labelsIndexes, predictionStructure.labelsPredictedIndexes);
      }
    }
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
      confusionMatrix,
      multiLabelConfusionMatrixExact,
      multiLabelConfusionMatrixSubset,
      labelArrayAndMap);
  }

  // eslint-disable-next-line complexity
  public static generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(
    confusionMatrix: IConfusionMatrix,
    multiLabelConfusionMatrixExact: MultiLabelConfusionMatrixExact,
    multiLabelConfusionMatrixSubset: MultiLabelConfusionMatrixSubset,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
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
        label,
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
      Utility.round(summationMicroAverageMetrics.summationF1Score),
      Utility.round(summationMicroAverageMetrics.summationAccuracy),
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
    } = multiLabelConfusionMatrixExact.getMacroAverageMetrics([]);
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
    } = multiLabelConfusionMatrixSubset.getMacroAverageMetrics([]);
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
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(confusionMatrix.getMicroAverageMetrics())=${JSON.stringify(confusionMatrix.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(confusionMatrix.getMacroAverageMetrics())=${JSON.stringify(confusionMatrix.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(confusionMatrix.getWeightedMacroAverageMetrics())=${JSON.stringify(confusionMatrix.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixExact.getMicroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixExact.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixExact.getMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixExact.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixExact.getWeightedMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixExact.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()         =${multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives() =${multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()}`);
    Utility.debuggingLog('Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), finished generating {MODEL_EVALUATION} content');
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixSubset.getMicroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getMicroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixSubset.getMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), JSON.stringify(multiLabelConfusionMatrixSubset.getWeightedMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getWeightedMacroAverageMetrics([]))}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()         =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives() =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives()}`);
    Utility.debuggingLog(`Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTableWithConfusionMatrices(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()}`);
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
      multiLabelConfusionMatrixExact,
      multiLabelConfusionMatrixSubset,
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
      'stringMap': Map<string, number>;}): PredictionStructure[] {
    const predictionStructureArray: PredictionStructure[] = [];
    for (const groundTruthSetUtteranceLabels of groundTruthSetUtteranceLabelsMap.entries()) {
      const utterance: string = groundTruthSetUtteranceLabels[0];
      const groundTruthSetLabels: string[] = [...groundTruthSetUtteranceLabels[1]];
      let predictionSetLabels: string[] = [];
      // eslint-disable-next-line no-prototype-builtins
      if (predictionSetUtteranceLabelsMap.has(utterance)) {
        predictionSetLabels = [...(predictionSetUtteranceLabelsMap.get(utterance) as Set<string>)];
      }
      const groundTruthSetLabelsIndexes: number[] = groundTruthSetLabels.map((x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x));
      const groundTruthSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(groundTruthSetLabels);
      const groundTruthSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', groundTruthSetLabels);
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessMultiLabelIntentPredictions(), finished processing groundTruthSetLabelsIndexes, utterance=${utterance}`);
      }
      const predictionSetLabelsIndexes: number[] = predictionSetLabels.map((x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x));
      const predictionSetLabelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(predictionSetLabels);
      const predictionSetLabelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', predictionSetLabels);
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`Utility.assessMultiLabelIntentPredictions(), finished processing predictionSetLabelsIndexes, utterance=${utterance}`);
      }
      const labelsPredictionEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(groundTruthSetLabels, predictionSetLabels);
      predictionStructureArray.push(new PredictionStructure(
        utterance,
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
    return predictionStructureArray;
  }

  public static generateEmptyEvaluationReport(): {
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
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};};
    'predictionScoreStructureArray': PredictionScoreStructure[];
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
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionScoreStructureArray': PredictionScoreStructure[];
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
          confusionMatrix: new MultiLabelConfusionMatrix([], new Map<string, number>()),
          multiLabelConfusionMatrixExact: new MultiLabelConfusionMatrixExact([], new Map<string, number>()),
          multiLabelConfusionMatrixSubset: new MultiLabelConfusionMatrixSubset([], new Map<string, number>()),
          predictingConfusionMatrixOutputLines: [],
          confusionMatrixMetricsHtml: '',
          confusionMatrixAverageMetricsHtml: '',
          confusionMatrixAverageDescriptionMetricsHtml: ''}},
      predictionScoreStructureArray: [],
      scoreOutputLines: [],
      groundTruthJsonContent: '',
      predictionJsonContent: '',
    };
    return evaluationOutput;
  }

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
    Utility.debuggingLog(`Utility.generateEvaluationReport(), ready to call Utility.storeDataArraysToTsvFile(), filename=${labelsOutputFilename}`);
    Utility.storeDataArraysToTsvFile(
      labelsOutputFilename,
      stringArray.map((x: string) => [x]));
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.storeDataArraysToTsvFile()');
    // ---- NOTE ---- produce a score TSV file.
    Utility.debuggingLog(`Utility.generateEvaluationReport(), ready to call Utility.storeDataArraysToTsvFile(), filename=${evaluationSetScoreOutputFilename}`);
    Utility.storeDataArraysToTsvFile(
      evaluationSetScoreOutputFilename,
      scoreOutputLines);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finishing calling Utility.storeDataArraysToTsvFile');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateEvaluationReport(), ready to call Utility.dumpFile(), filename=${evaluationSetGroundTruthJsonContentFilename}`);
    Utility.dumpFile(
      evaluationSetGroundTruthJsonContentFilename,
      groundTruthJsonContent);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.dumpFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateEvaluationReport(), ready to call Utility.dumpFile(), filename=${evaluationSetPredictionJsonContentFilename}`);
    Utility.dumpFile(
      evaluationSetPredictionJsonContentFilename,
      predictionJsonContent);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.dumpFile()');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog(`Utility.generateEvaluationReport(), ready to call Utility.dumpFile(), filename=${evaluationSetSummaryOutputFilename}`);
    Utility.dumpFile(
      evaluationSetSummaryOutputFilename,
      evaluationSummary);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.dumpFile()');
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReport(
    scoringFunctionToPredictionScoreStructure: (
      utteranceLabelsPairArray: [string, string[]][],
      labelArrayAndMap: {
        'stringArray': string[];
        'stringMap': Map<string, number>;},
      multiLabelPredictionThreshold: number,
      unknownLabelPredictionThreshold: number) => PredictionScoreStructure[],
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    ambiguousCloseness: number,
    lowConfidenceScoreThreshold: number,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): {
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
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionScoreStructureArray': PredictionScoreStructure[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } {
    // ---- NOTE ---- load the evaluation summary template.
    const evaluationSummary: string = EvaluationSummaryTemplateHtml.html;
    // ---- NOTE ---- generate evaluation report before calling the score() function.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateEvaluationReportLabelUtteranceStatistics()');
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
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateEvaluationReportLabelUtteranceStatistics(
      evaluationSummary,
      dataSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      '{LABEL_TEXT_STATISTICS}',
      '{TEXT_DUPLICATES}',
      unknownLabelPredictionThreshold > 0); // ---- NOTE ---- there is no UNKNOWN prediction unless the threshold is higher than 0.
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- collect utterance prediction and scores.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call scoringFunctionToPredictionScoreStructure()');
    const utteranceLabelsPairArray: [string, string[]][] = [...utteranceLabelsMap.entries()].map((x: [string, Set<string>]) => [x[0], [...x[1]]]);
    const predictionScoreStructureArray: PredictionScoreStructure[] =
      scoringFunctionToPredictionScoreStructure(
        utteranceLabelsPairArray,
        evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
        multiLabelPredictionThreshold,
        unknownLabelPredictionThreshold);
    // ---- NOTE-REFACTORED ---- const predictionScoreStructureArray: PredictionScoreStructure[] = UtilityLabelResolver.score(
    // ---- NOTE-REFACTORED ----   utteranceLabelsPairArray,
    // ---- NOTE-REFACTORED ----   evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
    // ---- NOTE-REFACTORED ----   multiLabelPredictionThreshold,
    // ---- NOTE-REFACTORED ----   unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling scoringFunctionToPredictionScoreStructure()');
    // ---- NOTE ---- generate evaluation report after calling the score() function.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateEvaluationReportAnalyses()');
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
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};
    } = Utility.generateEvaluationReportAnalyses(
      evaluationReportLabelUtteranceStatistics.evaluationSummary,
      evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
      predictionScoreStructureArray,
      ambiguousCloseness,
      lowConfidenceScoreThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateEvaluationReportAnalyses()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateScoreOutputLines()');
    const scoreOutputLines: string[][] = Utility.generateScoreOutputLines(
      predictionScoreStructureArray);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateScoreOutputLines()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateGroundTruthJsons()');
    const groundTruthJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = Utility.generateGroundTruthJsons(
      predictionScoreStructureArray);
    const groundTruthJsonContent: string = Utility.jsonStringify(groundTruthJsons);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateGroundTruthJsons()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generatePredictionJsons()');
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
    }> = Utility.generatePredictionJsons(
      predictionScoreStructureArray);
    const predictionJsonContent: string = Utility.jsonStringify(predictionJsons);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generatePredictionJsons()');
    // ---- NOTE ---- debugging ouput.
    // if (Utility.toPrintDetailedDebuggingLogToConsole) {
    //   Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
    //   Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
    //   const labels: any = LabelResolver.getLabels(LabelType.Intent);
    //   Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    // }
    // ---- NOTE ---- return
    return {
      evaluationReportLabelUtteranceStatistics,
      evaluationReportAnalyses,
      predictionScoreStructureArray,
      scoreOutputLines,
      groundTruthJsonContent,
      predictionJsonContent};
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReportLabelUtteranceStatistics(
    evaluationSummary: string,
    dataSetLabels: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    evaluationSummaryTagIntentUtteranceStatistics: string,
    evaluationSummaryTagUtteranceDuplicates: string,
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
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } {
    // ---- NOTE ---- create a label-index map.
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(dataSetLabels);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
    // ---- TODO ---- if (Utility.isEmptyStringArray(labelArrayAndMap.stringArray)) {
    // ---- TODO ----   Utility.debuggingThrow('there is no label, something wrong?');
    // ---- TODO ---- }
    // ---- NOTE ---- as the unknown threshold is greater than 0, the score function can make an UNKNOWN prediction.
    if (ensureUnknownLabelInLabelArrayAndMap) {
      if (!labelArrayAndMap.stringMap.has(Utility.UnknownLabel)) {
        labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
        labelArrayAndMap.stringMap.set(Utility.UnknownLabel, labelArrayAndMap.stringArray.length - 1);
      }
    }
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string; } = Utility.generateLabelStatisticsAndHtmlTable(
        utteranceLabelsMap,
        labelArrayAndMap);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': Map<number, number>;
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateUtteranceStatisticsAndHtmlTable(
        utteranceLabelsMap);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation LABEL_TEXT_STATISTICS summary from template.
    const labelsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagIntentUtteranceStatistics, labelsUtterancesStatisticsHtml);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagIntentUtteranceStatistics} content`);
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = [...utteranceLabelsMap.entries()].filter(
      (x: [string, Set<string>]) => x[1].size > 1).map((x: [string, Set<string>]) => [x[0], Utility.concatenateDataArrayToHtmlTable('Label', [...x[1]])]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their labels',
      utterancesMultiLabelArrays,
      ['Utterance', 'Labels']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapSetToIndexedHtmlTable(
      'Duplicate utterance and label pairs',
      utteranceLabelDuplicateMap,
      ['Utterance', 'Label']);
    // ---- NOTE ---- create the evaluation TEXT_DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace(
      evaluationSummaryTagUtteranceDuplicates, duplicateStatisticsHtml);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), finished generating ${evaluationSummaryTagUtteranceDuplicates} content`);
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      labelArrayAndMap,
      labelStatisticsAndHtmlTable,
      utteranceStatisticsAndHtmlTable,
      utterancesMultiLabelArrays,
      utterancesMultiLabelArraysHtml,
      utteranceLabelDuplicateHtml};
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReportAnalyses(
    evaluationSummary: string,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    predictionScoreStructureArray: PredictionScoreStructure[],
    ambiguousCloseness: number,
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
        'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
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
    } = Utility.generateAmbiguousStatisticsAndHtmlTable(
      predictionScoreStructureArray,
      ambiguousCloseness,
      unknownLabelPredictionThreshold);
    evaluationSummary = evaluationSummary.replace(
      '{AMBIGUOUS}', ambiguousAnalysis.scoringAmbiguousUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {AMBIGUOUS} content');
    // ---- NOTE ---- generate misclassified HTML.
    const misclassifiedAnalysis: {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } = Utility.generateMisclassifiedStatisticsAndHtmlTable(
      predictionScoreStructureArray);
    evaluationSummary = evaluationSummary.replace(
      '{MIS_CLASSIFICATION}', misclassifiedAnalysis.scoringMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {MIS_CLASSIFICATION} content');
    // ---- NOTE ---- generate low-confidence HTML.
    const lowConfidenceAnalysis: {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } = Utility.generateLowConfidenceStatisticsAndHtmlTable(
      predictionScoreStructureArray,
      lowConfidenceScoreThreshold);
    evaluationSummary = evaluationSummary.replace(
      '{LOW_CONFIDENCE}', lowConfidenceAnalysis.scoringLowConfidenceUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {LOW_CONFIDENCE} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } = Utility.generateConfusionMatrixMetricsAndHtmlTable(
      predictionScoreStructureArray,
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

  public static generateScoreOutputLines(
    predictionScoreStructureArray: PredictionScoreStructure[]): string[][] {
    const scoreOutputLines: string[][] = [];
    for (const predictionScoreStructure of predictionScoreStructureArray) {
      if (predictionScoreStructure) {
        const scoreArray: number[] = predictionScoreStructure.scoreResultArray.map((x: Result) => x.score);
        const labelConcatenated: string = Utility.concatenateDataArrayToDelimitedString(predictionScoreStructure.labels);
        // ---- NOTE-NOT-USED ---- const labelConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', predictionScoreStructure.labels);
        const labelPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(predictionScoreStructure.labelsPredicted);
        // ---- NOTE-NOT-USED ---- const labelPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable('Label', predictionScoreStructure.labelsPredicted);
        const scoreArrayConcatenated: string = scoreArray.join('\t');
        const scoreOutputLine: string[] = [
          predictionScoreStructure.utterance,
          labelConcatenated,
          labelPredictedConcatenated,
          scoreArrayConcatenated,
        ];
        scoreOutputLines.push(scoreOutputLine);
      }
    }
    return scoreOutputLines;
  }

  public static generateGroundTruthJsons(
    predictionScoreStructureArray: PredictionScoreStructure[]): Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> {
    const predictionScoreStructureJsons: Array<{
      'text': string;
      'intents': string[];
      'entities': Array<{
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }>;
    }> = [];
    for (const predictionScoreStructure of predictionScoreStructureArray) {
      if (predictionScoreStructure) {
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
          text: predictionScoreStructure.utterance,
          intents: predictionScoreStructure.labels,
          entities: [], // ---- NOTE-TODO-FOR-FUTURE-ENTITY-LABEL-AND-PREDICTION ----
        };
        predictionScoreStructureJsons.push(groundTruthJson);
      }
    }
    return predictionScoreStructureJsons;
  }

  public static generatePredictionJsons(
    predictionScoreStructureArray: PredictionScoreStructure[]): Array<{
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
    const predictionScoreStructureJsons: Array<{
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
    for (const predictionScoreStructure of predictionScoreStructureArray) {
      if (predictionScoreStructure) {
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ---- const intentResultScoreArray: Array<{
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----   'intent': string;
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----   'score': number;
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ---- }> = predictionScoreStructure.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Intent).map((x: Result) => {
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----   return {
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----     intent: x.label.name,
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----     score: x.score,
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ----   };
        // ---- NOTE-A-BUG-THAT-LabelType-is-not-set ---- });
        const intentResultScoreArray: Array<{
          'intent': string;
          'score': number;
        }> = predictionScoreStructure.scoreResultArray.map((x: Result) => {
          return {
            intent: x.label.name,
            score: x.score,
          };
        });
        const entityResultScoreArray: Array<{
          'entity': string;
          'startPos': number;
          'endPos': number;
          'score': number;
        }> = predictionScoreStructure.scoreResultArray.filter((x: Result) => x.label.labeltype === LabelType.Entity).map((x: Result) => {
          return {
            entity: x.label.name,
            startPos: x.label.getStartPos(),
            endPos: x.label.getStartPos(),
            score: x.score,
          };
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
          text: predictionScoreStructure.utterance,
          intents: predictionScoreStructure.labelsPredicted,
          entities: [], // ---- NOTE-TODO-FOR-FUTURE-ENTITY-LABEL-AND-PREDICTION ----
          intent_scores: intentResultScoreArray,
          entity_scores: entityResultScoreArray, // ---- NOTE-TODO-FOR-FUTURE-ENTITY-LABEL-AND-PREDICTION ----
        };
        predictionScoreStructureJsons.push(predictionJson);
      }
    }
    return predictionScoreStructureJsons;
  }

  public static generateConfusionMatrixMetricsAndHtmlTable(
    predictionScoreStructureArray: PredictionScoreStructure[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
      'confusionMatrix': IConfusionMatrix;
      'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'predictingConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
      'confusionMatrixAverageDescriptionMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    return Utility.generateAssessmentConfusionMatrixMetricsAndHtmlTable(
      predictionScoreStructureArray,
      labelArrayAndMap);
    // -----------------------------------------------------------------------
  }

  public static generateLowConfidenceStatisticsAndHtmlTable(
    predictionScoreStructureArray: PredictionScoreStructure[],
    lowConfidenceScoreThreshold: number): {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } {
    const scoringLowConfidenceUtterancesArrays: string[][] = [];
    const scoringLowConfidenceUtterancesSimpleArrays: string[][] = [];
    for (const predictionScoreStructure of predictionScoreStructureArray.filter((x: PredictionScoreStructure) => (x.isCorrectPrediction() && (x.labelsPredictedScore < lowConfidenceScoreThreshold)))) {
      if (predictionScoreStructure) {
        const labelsScoreStructureHtmlTable: string = predictionScoreStructure.labelsScoreStructureHtmlTable;
        const labelsPredictedConcatenated: string = predictionScoreStructure.labelsPredictedConcatenated;
        const scoringLowConfidenceUtterancesArray: any[] = [
          predictionScoreStructure.utterance,
          labelsScoreStructureHtmlTable,
          labelsPredictedConcatenated,
        ];
        scoringLowConfidenceUtterancesArrays.push(scoringLowConfidenceUtterancesArray);
        const labelsConcatenated: string = predictionScoreStructure.labelsConcatenated;
        const scoringLowConfidenceUtterancesSimpleArray: any[] = [
          predictionScoreStructure.utterance,
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

  public static generateMisclassifiedStatisticsAndHtmlTable(
    predictionScoreStructureArray: PredictionScoreStructure[]): {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const scoringMisclassifiedUtterancesArrays: string[][] = [];
    const scoringMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const predictionScoreStructure of predictionScoreStructureArray.filter((x: PredictionScoreStructure) => (x.isMisclassified()))) {
      if (predictionScoreStructure) {
        const labelsScoreStructureHtmlTable: string = predictionScoreStructure.labelsScoreStructureHtmlTable;
        const predictedScoreStructureHtmlTable: string = predictionScoreStructure.predictedScoreStructureHtmlTable;
        const scoringMisclassifiedUtterancesArray: string[] = [
          predictionScoreStructure.utterance,
          labelsScoreStructureHtmlTable,
          predictedScoreStructureHtmlTable,
        ];
        scoringMisclassifiedUtterancesArrays.push(scoringMisclassifiedUtterancesArray);
        const labelsConcatenated: string = predictionScoreStructure.labelsConcatenated;
        const labelsPredictedConcatenated: string = predictionScoreStructure.labelsPredictedConcatenated;
        const scoringMisclassifiedUtterancesSimpleArray: string[] = [
          predictionScoreStructure.utterance,
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

  public static generateAmbiguousStatisticsAndHtmlTable(
    predictionScoreStructureArray: PredictionScoreStructure[],
    ambiguousCloseness: number,
    unknownLabelPredictionThreshold: number): {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } {
    const scoringAmbiguousUtterancesArrays: string[][] = [];
    const scoringAmbiguousUtteranceSimpleArrays: string[][] = [];
    for (const predictionScoreStructure of predictionScoreStructureArray.filter((x: PredictionScoreStructure) => (x.isCorrectPrediction()))) {
      if (predictionScoreStructure) {
        const predictedScore: number = predictionScoreStructure.labelsPredictedScore;
        const scoreArray: number[] = predictionScoreStructure.scoreArray;
        const scoreArrayAmbiguous: number[][] = scoreArray.map(
          (x: number, index: number) => [x, index, Math.abs((predictedScore - x) / predictedScore)]).filter(
          (x: number[]) => ((x[2] < ambiguousCloseness) && (x[2] > 0))).map(
          (x: number[]) => [x[1], x[0], x[2]]);
        if (scoreArrayAmbiguous.length > 0) {
          const labelsScoreStructureHtmlTable: string = predictionScoreStructure.labelsScoreStructureHtmlTable;
          const labelsPredictedConcatenated: string = predictionScoreStructure.labelsPredictedConcatenated;
          const ambiguousScoreStructureHtmlTable: string = Utility.selectedScoreStructureToHtmlTable(
            predictionScoreStructure,
            unknownLabelPredictionThreshold,
            '',
            ['Label', 'Score', 'Closest Example'],
            ['30%', '10%', '60%'],
            scoreArrayAmbiguous.map((x: number[]) => x[0]));
          const scoringAmbiguousUtterancesArray: string[] = [
            predictionScoreStructure.utterance,
            labelsScoreStructureHtmlTable,
            labelsPredictedConcatenated,
            ambiguousScoreStructureHtmlTable,
          ];
          const labelsConcatenated: string = predictionScoreStructure.labelsConcatenated;
          scoringAmbiguousUtterancesArrays.push(scoringAmbiguousUtterancesArray);
          const scoringAmbiguousUtterancesSimpleArray: string[] = [
            predictionScoreStructure.utterance,
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
    utteranceLabelsMap: Map<string, Set<string>>,
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;}): {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;
      } {
    // ---- NOTE ---- generate label statistics.
    const labelUtterancesMap: Map<string, Set<string>> = Utility.reverseUniqueKeyedArray(utteranceLabelsMap);
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
        x[0],
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

  // eslint-disable-next-line max-params
  public static selectedScoreStructureToHtmlTable(
    predictionScoreStructure: PredictionScoreStructure,
    unknownLabelPredictionThreshold: number,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indexes: number[] = []): string {
    if (Utility.isEmptyNumberArray(indexes)) {
      indexes = predictionScoreStructure.labelsPredictedIndexes;
    }
    return Utility.selectedScoreResultsToHtmlTable(
      predictionScoreStructure.scoreResultArray,
      indexes,
      unknownLabelPredictionThreshold,
      tableDescription,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
  }

  // eslint-disable-next-line max-params
  public static selectedScoreResultsToHtmlTable(
    scoreResultArray: Result[],
    indexes: number[],
    unknownLabelPredictionThreshold: number,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = []): string {
    const labelsSelectedArrays: any[][] = indexes.map(
      (x: number) => {
        if ((x >= 0) && (x < scoreResultArray.length)) {
          return [scoreResultArray[x].label.name, scoreResultArray[x].score, scoreResultArray[x].closesttext];
        }
        return [Utility.UnknownLabel, unknownLabelPredictionThreshold, ''];
      });
    const selectedScoreStructureHtmlTable: string = Utility.convertDataArraysToHtmlTable(
      tableDescription,
      labelsSelectedArrays,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
    return selectedScoreStructureHtmlTable;
  }

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

  public static processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(
    utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; },
    labelSet: Set<string>): {
        'utteranceLabelsMap': Map<string, Set<string>>;
        'utteranceLabelDuplicateMap': Map<string, Set<string>>; } {
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey of utteranceLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceLabelSet: Set<string> = utteranceLabelsMap.get(utteranceKey) as Set<string>;
            // eslint-disable-next-line max-depth
            if (!utteranceLabelSet) {
              Utility.debuggingThrow(`Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            }
            const concreteLabels: string[] = [...utteranceLabelSet].filter(
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
            }
          } catch (error) {
            Utility.debuggingLog(`Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
        const labelsArray: string[] = [...labelsSet];
        const concreteLabels: string[] = labelsArray.filter(
          (label: string) =>
            !Utility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
        const hasConcreteLabel: boolean = concreteLabels.length > 0;
        // eslint-disable-next-line max-depth
        labelsSet.clear(); // ---- NOTE ---- clear the set!
        // eslint-disable-next-line max-depth
        if (hasConcreteLabel) {
          // eslint-disable-next-line max-depth
          for (const label of concreteLabels) {
            labelsSet.add(label);
          }
        } else {
          labelsSet.add(Utility.UnknownLabel);
        }
      });
    }
    return utteranceLabels;
  }

  public static processUnknownLabelsInUtteranceLabelsMap(
    utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; }): {
        'utteranceLabelsMap': Map<string, Set<string>>;
        'utteranceLabelDuplicateMap': Map<string, Set<string>>; } {
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey of utteranceLabelsMap.keys()) {
        if (utteranceKey) {
          try {
            const utteranceLabelSet: Set<string> = utteranceLabelsMap.get(utteranceKey) as Set<string>;
            // eslint-disable-next-line max-depth
            if (!utteranceLabelSet) {
              Utility.debuggingThrow(`Utility.processUnknownLabelsInUtteranceLabelsMap(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            }
            const concreteLabels: string[] = [...utteranceLabelSet].filter(
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
            }
          } catch (error) {
            Utility.debuggingLog(`Utility.processUnknownLabelsInUtteranceLabelsMap(), utteranceKey=${utteranceKey}, utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
            throw error;
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
        const labelsArray: string[] = [...labelsSet];
        const concreteLabels: string[] = labelsArray.filter(
          (label: string) =>
            !Utility.UnknownLabelSet.has(label.toUpperCase()));
        const hasConcreteLabel: boolean = concreteLabels.length > 0;
        labelsSet.clear(); // ---- NOTE ---- clear the set!
        // eslint-disable-next-line max-depth
        if (hasConcreteLabel) {
          // eslint-disable-next-line max-depth
          for (const label of concreteLabels) {
            labelsSet.add(label);
          }
        } else {
          labelsSet.add(Utility.UnknownLabel);
        }
      });
    }
    return utteranceLabels;
  }

  public static processUnknownLabelsInTsvBluFileContent(bluFileContents: string): string {
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
    if (!Utility.isEmptyStringArray(outputEvaluationReportDataArray)) {
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
    if (!Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
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
    if (!Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
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

  public static round(input: number, digits: number = 10000): number {
    if (digits > 0) {
      input = Math.round(input * digits) / digits;
    }
    return input;
  }

  public static examplesToUtteranceLabelMaps(
    examples: any,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
    const exampleStructureArray: Example[] = Utility.examplesToArray(examples);
    for (const example of exampleStructureArray) {
      const utterance: string = example.text;
      const labels: Label[] = example.labels;
      for (const label of labels) {
        OrchestratorHelper.addNewLabelUtterance(
          utterance,
          label.name,
          '',
          utteranceLabelsMap,
          utteranceLabelDuplicateMap);
      }
    }
  }

  public static examplesToArray(examples: any): Example[] {
    const exampleStructureArray: Example[] = [];
    for (const example of examples) {
      const labels: Label[] = [];
      for (const examplelabel of example.labels) {
        const label: string = examplelabel.name;
        const labeltype: LabelType = examplelabel.labeltype;
        const labelspan: any = examplelabel.span;
        const labelspanoffset: number = labelspan.offset;
        const labelspanlength: number = labelspan.length;
        const labelStructure: Label = new Label(labeltype, label, new Span(labelspanoffset, labelspanlength));
        labels.push(labelStructure);
      }
      const exampleStructure: Example = new Example(example.text, labels);
      exampleStructureArray.push(exampleStructure);
    }
    return exampleStructureArray;
  }

  public static scoreResultsToArray(
    results: any,
    labelIndexMap: Map<string, number>,
    digits: number = 10000): Result[] {
    const scoreResultArray: Result[] = [];
    for (const result of results) {
      if (result) {
        const score: number = Utility.round(result.score, digits);
        const resultlabel: any = result.label;
        const label: string = resultlabel.name;
        const labeltype: LabelType = resultlabel.labeltype;
        const labelspan: any = resultlabel.span;
        const labelspanoffset: number = labelspan.offset;
        const labelspanlength: number = labelspan.length;
        const closesttext: string = result.closest_text;
        const scoreResult: Result = new Result(
          new Label(labeltype, label, new Span(labelspanoffset, labelspanlength)),
          score,
          closesttext);
        const labelIndex: number = labelIndexMap.get(label) as number;
        if (labelIndex >= 0) {
          scoreResultArray[labelIndex] = scoreResult;
        }
      }
    }
    return scoreResultArray;
  }

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

  public static countMapValues(inputStringToStringArrayMap: Map<string, Set<string>>): number {
    return [...inputStringToStringArrayMap.entries()].reduce(
      (accumulant: number,  value: [string, Set<string>]) => accumulant + value[1].size, 0);
  }

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
    encoding: string = 'utf8'): string {
    // Utility.debuggingLog(
    //     `Utility.dumpFile(): filename=${filename}`);
    try {
      fs.mkdirSync(path.dirname(filename), {recursive: true});
      fs.writeFileSync(filename, content, encoding);
    } catch (error) {
      // ---- NOTE ---- An error occurred
      Utility.debuggingThrow(`FAILED to dump a file: filename=${filename}, exception=${error}`);
      return '';
    }
    return filename;
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

  public static carefullyAccessStringMap(stringMap: Map<string, number>, key: string): number {
    if (stringMap === undefined) {
      Utility.debuggingThrow(
        'stringMap === undefined');
    }
    if (!stringMap.has(key)) {
      Utility.debuggingThrow(
        `FAIL to use a key ${key} to access a stringMap ${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(stringMap)}`);
    }
    const value: number = stringMap.get(key) as number;
    return value;
  }

  public static carefullyAccessStringDictionary(stringMap: {[id: string]: number}, key: string): number {
    if (stringMap === undefined) {
      Utility.debuggingThrow(
        'stringMap === undefined');
    }
    const value: number = stringMap[key];
    if (value === undefined) {
      Utility.debuggingThrow(
        `FAIL to use a key ${key} to access a stringMap ${Utility.jsonStringify(stringMap)}`);
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

  public static cleanStringOnTabs(input: string, replacement: string = ' '): string {
    return input.replace(/[\t]+/gm, replacement);
  }

  public static cleanStringOnSpaces(input: string, replacement: string = ' '): string {
    return input.replace(/[\r\n\t]+/gm, replacement);
  }

  public static cleanStringOnSpaceCommas(input: string, replacement: string = ' '): string {
    return input.replace(/[\r\n\t,]+/gm, replacement);
  }

  public static getBolded(input: any): string {
    return `<b>${input}</b>`;
  }

  public static writeToConsole(outputContents: string) {
    const output: string = JSON.stringify(outputContents, null, 2);
    process.stdout.write(`${output}\n`);
  }

  public static writeToConsoleStderr(outputContents: string) {
    const output: string = JSON.stringify(outputContents, null, 2);
    process.stderr.write(`${output}\n`);
  }

  public static writeLineToConsole(outputContents: string) {
    process.stdout.write(`${outputContents}\n`);
  }

  public static writeLineToConsoleStderr(outputContents: string) {
    process.stderr.write(`${outputContents}\n`);
  }

  public static debuggingLog(
    message: any): string {
    const dateTimeString: string = (new Date()).toISOString();
    const logMessage: string = `[${dateTimeString}] LOG-MESSAGE: ${Utility.jsonStringify(message)}`;
    if (Utility.toPrintDebuggingLogToConsole) {
      // eslint-disable-next-line no-console
      console.log(logMessage);
    }
    return logMessage;
  }

  public static debuggingThrow(
    message: any): void {
    const dateTimeString: string = (new Date()).toISOString();
    const logMessage: string = `[${dateTimeString}] ERROR-MESSAGE: ${Utility.jsonStringify(message)}`;
    const error: Error = new Error(logMessage);
    const stackTrace: string = error.stack as string;
    Utility.debuggingLog(stackTrace);
    throw error;
  }
}
