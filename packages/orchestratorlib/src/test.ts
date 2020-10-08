/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {PredictionScoreStructure}  from './predictionscorestructure';

import {Label} from './label';
import {LabelType} from './labeltype';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorTest {
  public static readonly testingSetScoresOutputFilename: string = 'orchestrator_testing_set_scores.txt';

  public static readonly testingSetGroundTruthJsonContentOutputFilename: string = 'orchestrator_testing_set_ground_truth_instances.json';

  public static readonly testingSetPredictionJsonContentOutputFilename: string = 'orchestrator_testing_set_prediction_instances.json';

  public static readonly testingSetSummaryHtmlOutputFilename: string = 'orchestrator_testing_set_summary.html';

  public static readonly testingSetLabelsOutputFilename: string = 'orchestrator_testing_set_labels.txt';

  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-params
  public static async runAsync(
    nlrPath: string, inputPathConfiguration: string, testPathConfiguration: string, outputPath: string,
    ambiguousClosenessParameter: number,
    lowConfidenceScoreThresholdParameter: number,
    multiLabelPredictionThresholdParameter: number,
    unknownLabelPredictionThresholdParameter: number): Promise<void> {
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments
    if (Utility.isEmptyString(inputPathConfiguration)) {
      Utility.debuggingThrow(`Please provide path to an input .blu file, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    }
    if (Utility.isEmptyString(testPathConfiguration)) {
      Utility.debuggingThrow(`Please provide a test file, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    }
    if (Utility.isEmptyString(outputPath)) {
      Utility.debuggingThrow(`Please provide an output directory, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    }
    if (Utility.isEmptyString(nlrPath)) {
      Utility.debuggingThrow(`The nlrPath argument is empty, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    }
    nlrPath = path.resolve(nlrPath);
    const ambiguousCloseness: number = ambiguousClosenessParameter;
    const lowConfidenceScoreThreshold: number = lowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThreshold: number = multiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThreshold: number = unknownLabelPredictionThresholdParameter;
    Utility.debuggingLog(`inputPath=${inputPathConfiguration}`);
    Utility.debuggingLog(`testPath=${testPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`nlrPath=${nlrPath}`);
    Utility.debuggingLog(`ambiguousCloseness=${ambiguousCloseness}`);
    Utility.debuggingLog(`lowConfidenceScoreThreshold=${lowConfidenceScoreThreshold}`);
    Utility.debuggingLog(`multiLabelPredictionThreshold=${multiLabelPredictionThreshold}`);
    Utility.debuggingLog(`unknownLabelPredictionThreshold=${unknownLabelPredictionThreshold}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- load the snapshot set
    const snapshotFile: string = inputPathConfiguration;
    if (!Utility.exists(snapshotFile)) {
      Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${snapshotFile}`);
    }
    const testingSetScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetScoresOutputFilename);
    const testingSetGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetGroundTruthJsonContentOutputFilename);
    const testingSetPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetPredictionJsonContentOutputFilename);
    const testingSetSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetSummaryHtmlOutputFilename);
    const testingSetLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetLabelsOutputFilename);
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call LabelResolver.createWithSnapshotAsync()');
    await LabelResolver.createWithSnapshotAsync(nlrPath, snapshotFile);
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling LabelResolver.createWithSnapshotAsync()');
    // ---- NOTE-TO-REMOVE ---- // ---- NOTE ---- process the snapshot set, retrieve labels
    // ---- NOTE-TO-REMOVE ---- let processedUtteranceLabelsMap: {
    // ---- NOTE-TO-REMOVE ----   'utteranceLabelsMap': Map<string, Set<string>>;
    // ---- NOTE-TO-REMOVE ----   'utteranceLabelDuplicateMap': Map<string, Set<string>>;
    // ---- NOTE-TO-REMOVE ----   'utteranceEntityLabelsMap': Map<string, Label[]>;
    // ---- NOTE-TO-REMOVE ----   'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = await OrchestratorHelper.getUtteranceLabelsMap(snapshotFile, false);
    // ---- NOTE-TO-REMOVE ---- const snapshotSetUtterancesLabelsMap: Map<string, Set<string>> = processedUtteranceLabelsMap.utteranceLabelsMap;
    // ---- NOTE-TO-REMOVE ---- // ---- NOTE-NO-NEED ---- const snapshotSetUtterancesDuplicateLabelsMap: Map<string, Set<string>> = processedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    // ---- NOTE-TO-REMOVE ---- Utility.debuggingLog('OrchestratorTest.runAsync(), after calling OrchestratorHelper.getUtteranceLabelsMap() for snapshot set');
    // ---- NOTE-TO-REMOVE ---- const snapshotSetLabels: string[] =
    // ---- NOTE-TO-REMOVE ----   [...snapshotSetUtterancesLabelsMap.values()].reduce(
    // ---- NOTE-TO-REMOVE ----     (accumulant: string[], entry: Set<string>) => accumulant.concat([...entry]), []);
    // ---- NOTE ---- process the snapshot set, retrieve labels
    const snapshotSetLabels: string[] =
      LabelResolver.getLabels(LabelType.Intent);
    const snapshotSetLabelSet: Set<string> =
      new Set<string>(snapshotSetLabels);
    // ---- NOTE ---- process the testing set.
    const processedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = await OrchestratorHelper.getUtteranceLabelsMap(testPathConfiguration, false);
    Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(processedUtteranceLabelsMap, snapshotSetLabelSet);
    const utteranceLabelsMap: Map<string, Set<string>> = processedUtteranceLabelsMap.utteranceLabelsMap;
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = processedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling OrchestratorHelper.getUtteranceLabelsMap() for testing set');
    // Utility.debuggingLog(`OrchestratorTest.runAsync(), JSON.stringify(utteranceLabelsMap)=${JSON.stringify(utteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorTest.runAsync(), JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceLabelDuplicateMap))=${JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of unique utterances=${utteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of duplicate utterance/label pairs=${utteranceLabelDuplicateMap.size}`);
    if (utteranceLabelsMap.size <= 0) {
      Utility.debuggingThrow('there is no example, something wrong?');
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("false")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(false);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.generateEvaluationReport()');
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
    } =
    Utility.generateEvaluationReport(
      UtilityLabelResolver.score,
      snapshotSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      ambiguousCloseness,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutput=${Utility.jsonStringify(evaluationOutput)}`);
    }
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
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
      testingSetLabelsOutputFilename,
      testingSetScoresOutputFilename,
      testingSetGroundTruthJsonContentOutputFilename,
      testingSetPredictionJsonContentOutputFilename,
      testingSetSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutput=${Utility.jsonStringify(evaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorTest.runAsync(), THE END');
  }
}
