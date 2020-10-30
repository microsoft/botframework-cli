/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {LabelType} from '@microsoft/bf-dispatcher';

import {PredictionScoreLabelStringStructure} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorEvaluate {
  public static readonly snapshotSetScoresOutputFilename: string = 'orchestrator_snapshot_set_scores.txt';

  public static readonly snapshotSetGroundTruthJsonContentOutputFilename: string = 'orchestrator_snapshot_set_ground_truth_instances.json';

  public static readonly snapshotSetPredictionJsonContentOutputFilename: string = 'orchestrator_snapshot_set_prediction_instances.json';

  public static readonly snapshotSetSummaryHtmlOutputFilename: string = 'orchestrator_snapshot_set_summary.html';

  public static readonly snapshotSetLabelsOutputFilename: string = 'orchestrator_snapshot_set_labels.txt';

  // eslint-disable-next-line max-params
  public static async runAsync(
    inputPath: string, outputPath: string, baseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbeddings: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments
    if (Utility.isEmptyString(inputPath)) {
      Utility.debuggingThrow(`Please provide path to an input .blu file, CWD=${process.cwd()}, from OrchestratorEvaluate.runAsync()`);
    }
    if (Utility.isEmptyString(outputPath)) {
      Utility.debuggingThrow(`Please provide an output directory, CWD=${process.cwd()}, called from OrchestratorEvaluate.runAsync()`);
    }
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    } else {
      baseModelPath = '';
    }
    const ambiguousClosenessThreshold: number = ambiguousClosenessThresholdParameter;
    const lowConfidenceScoreThreshold: number = lowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThreshold: number = multiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThreshold: number = unknownLabelPredictionThresholdParameter;
    Utility.debuggingLog(`inputPath=${inputPath}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`ambiguousClosenessThreshold=${ambiguousClosenessThreshold}`);
    Utility.debuggingLog(`lowConfidenceScoreThreshold=${lowConfidenceScoreThreshold}`);
    Utility.debuggingLog(`multiLabelPredictionThreshold=${multiLabelPredictionThreshold}`);
    Utility.debuggingLog(`unknownLabelPredictionThreshold=${unknownLabelPredictionThreshold}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    Utility.debuggingLog(`obfuscateEvaluationReport=${obfuscateEvaluationReport}`);
    Utility.toObfuscateLabelTextInReportUtility = obfuscateEvaluationReport;
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = obfuscateEvaluationReport;
    // -----------------------------------------------------------------------
    // ---- NOTE ---- load the snapshot set
    const snapshotFile: string = inputPath;
    if (!Utility.exists(snapshotFile)) {
      Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${snapshotFile}`);
    }
    const snapshotSetScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetScoresOutputFilename);
    const snapshotSetGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetGroundTruthJsonContentOutputFilename);
    const snapshotSetPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetPredictionJsonContentOutputFilename);
    const snapshotSetSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetSummaryHtmlOutputFilename);
    const snapshotSetLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetLabelsOutputFilename);
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), after calling LabelResolver.createAsync()');
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call OrchestratorHelper.getSnapshotFromFile()');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotFile);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), after calling OrchestratorHelper.getSnapshotFromFile()');
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call LabelResolver.addSnapshot()');
    await LabelResolver.addSnapshot(snapshot);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), after calling LabelResolver.addSnapshot()');
    // ---- NOTE ---- retrieve labels
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
      // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- retrieve examples, process the snapshot set, retrieve labels, and create a label-index map.
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      Utility.debuggingThrow('There is no example, something wrong?');
    }
    Utility.examplesToUtteranceLabelMaps(examples, utteranceLabelsMap, utteranceLabelDuplicateMap);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), examples.length=${examples.length}`);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      const example: any = examples[0];
      const example_text: string = example.text;
      const labels: any = example.labels;
      const label: any = labels[0];
      const label_name: string = label.name;
      const labeltype: any = label.labeltype;
      const span: any = label.span;
      const offset: number = span.offset;
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), examples.length=${examples.length}`);
      const length: number = span.length;
      // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(examples)=${JSON.stringify(examples)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(example)=${JSON.stringify(example)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(example)=${Object.keys(example)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), example_text=${example_text}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(labels)=${Object.keys(labels)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(label)=${JSON.stringify(label)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(label)=${Object.keys(label)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.name=${label_name}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.labeltype=${labeltype}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), JSON.stringify(span)=${JSON.stringify(span)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(span)=${Object.keys(span)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.span.offset=${offset}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.span.length=${length}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("true")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(true);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call UtilityLabelResolver.generateEvaluationReport()');
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
          'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
          'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;
          'confusionMatrixAverageDescriptionMetricsHtml': string;};};
      'predictionScoreLabelStringStructureArray': PredictionScoreLabelStringStructure[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } =
    Utility.generateEvaluationReport(
      UtilityLabelResolver.score,
      labels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling Utility.generateEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummary: string =
      evaluationOutput.evaluationReportAnalyses.evaluationSummary;
    evaluationSummary = evaluationSummary.replace(
      '{APP_NAME}',
      '');
    evaluationSummary = evaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      evaluationOutput.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      evaluationOutput.scoreOutputLines,
      evaluationOutput.groundTruthJsonContent,
      evaluationOutput.predictionJsonContent,
      evaluationSummary,
      snapshotSetLabelsOutputFilename,
      snapshotSetScoresOutputFilename,
      snapshotSetGroundTruthJsonContentOutputFilename,
      snapshotSetPredictionJsonContentOutputFilename,
      snapshotSetSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutput=${Utility.jsonStringify(evaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), THE END');
  }
}
