/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';

import {PredictionStructureWithScoreLabelString} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {Utility} from './utility';
import {UtilityLabelResolver} from './utilitylabelresolver';

export class OrchestratorTest {
  public static readonly testingSetIntentScoresOutputFilename: string = 'orchestrator_testing_set_intent_scores.txt';

  public static readonly testingSetIntentGroundTruthJsonContentOutputFilename: string = 'orchestrator_testing_set_intent_ground_truth_instances.json';

  public static readonly testingSetIntentPredictionJsonContentOutputFilename: string = 'orchestrator_testing_set_intent_prediction_instances.json';

  public static readonly testingSetIntentSummaryHtmlOutputFilename: string = 'orchestrator_testing_set_intent_summary.html';

  public static readonly testingSetIntentLabelsOutputFilename: string = 'orchestrator_testing_set_intent_labels.txt';

  public static readonly testingSetEntityScoresOutputFilename: string = 'orchestrator_testing_set_entity_scores.txt';

  public static readonly testingSetEntityGroundTruthJsonContentOutputFilename: string = 'orchestrator_testing_set_entity_ground_truth_instances.json';

  public static readonly testingSetEntityPredictionJsonContentOutputFilename: string = 'orchestrator_testing_set_entity_prediction_instances.json';

  public static readonly testingSetEntitySummaryHtmlOutputFilename: string = 'orchestrator_testing_set_entity_summary.html';

  public static readonly testingSetEntityLabelsOutputFilename: string = 'orchestrator_testing_set_entity_labels.txt';

  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputPathConfiguration: string,
    testPathConfiguration: string,
    outputPath: string,
    ambiguousClosenessThresholdParameter: number,
    lowConfidenceScoreThresholdParameter: number,
    multiLabelPredictionThresholdParameter: number,
    unknownLabelPredictionThresholdParameter: number,
    fullEmbeddings: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
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
    if (Utility.isEmptyString(baseModelPath)) {
      Utility.debuggingThrow(`The baseModelPath argument is empty, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    }
    // ---- NOTE-PLACEHOLDER-entity-model-is-optional ---- if (Utility.isEmptyString(entityBaseModelPath)) {
    // ---- NOTE-PLACEHOLDER-entity-model-is-optional ----   Utility.debuggingThrow(`The entityBaseModelPath argument is empty, CWD=${process.cwd()}, called from OrchestratorTest.runAsync()`);
    // ---- NOTE-PLACEHOLDER-entity-model-is-optional ---- }
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    } else {
      baseModelPath = '';
    }
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    } else {
      entityBaseModelPath = '';
    }
    const ambiguousClosenessThreshold: number = ambiguousClosenessThresholdParameter;
    const lowConfidenceScoreThreshold: number = lowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThreshold: number = multiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThreshold: number = unknownLabelPredictionThresholdParameter;
    Utility.debuggingLog(`inputPath=${inputPathConfiguration}`);
    Utility.debuggingLog(`testPath=${testPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`ambiguousClosenessThreshold=${ambiguousClosenessThreshold}`);
    Utility.debuggingLog(`lowConfidenceScoreThreshold=${lowConfidenceScoreThreshold}`);
    Utility.debuggingLog(`multiLabelPredictionThreshold=${multiLabelPredictionThreshold}`);
    Utility.debuggingLog(`unknownLabelPredictionThreshold=${unknownLabelPredictionThreshold}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    Utility.debuggingLog(`obfuscateEvaluationReport=${obfuscateEvaluationReport}`);
    Utility.toObfuscateLabelTextInReportUtility = obfuscateEvaluationReport;
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = obfuscateEvaluationReport;
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments
    const snapshotFile: string = inputPathConfiguration;
    if (!Utility.exists(snapshotFile)) {
      Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${snapshotFile}`);
    }
    const testingSetIntentScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentScoresOutputFilename);
    const testingSetIntentGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentGroundTruthJsonContentOutputFilename);
    const testingSetIntentPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentPredictionJsonContentOutputFilename);
    const testingSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentSummaryHtmlOutputFilename);
    const testingSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentLabelsOutputFilename);
    const testingSetEntityScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityScoresOutputFilename);
    const testingSetEntityGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityGroundTruthJsonContentOutputFilename);
    const testingSetEntityPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityPredictionJsonContentOutputFilename);
    const testingSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntitySummaryHtmlOutputFilename);
    const testingSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityLabelsOutputFilename);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, entityBaseModelPath);
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling LabelResolver.createAsync()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call OrchestratorHelper.getSnapshotFromFile()');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotFile);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling OrchestratorHelper.getSnapshotFromFile()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call LabelResolver.addSnapshot()');
    await LabelResolver.addSnapshot(snapshot);
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling LabelResolver.addSnapshot()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- retrieve intent labels
    const snapshotSetLabels: string[] =
      LabelResolver.getLabels(LabelType.Intent);
    const snapshotSetLabelSet: Set<string> =
      new Set<string>(snapshotSetLabels);
    // ---- NOTE ---- retrieve entity labels
    const snapshotSetEntityLabels: string[] =
      LabelResolver.getLabels(LabelType.Entity);
    const snapshotSetEntityLabelSet: Set<string> =
      new Set<string>(snapshotSetEntityLabels);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- load the testing set.
    const processedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(testPathConfiguration, false);
    // Utility.debuggingLog(`OrchestratorTest.runAsync(), processedUtteranceLabelsMap.utteranceLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceLabelsMap.keys()]}`);
    // Utility.debuggingLog(`OrchestratorTest.runAsync(), processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()]}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process testing set intent labels.
    const unknownSpuriousLabelsProcessed: {
      'utteranceUnknownLabelsMap': Map<string, Set<string>>;
      'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
      'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } =
      Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(
        processedUtteranceLabelsMap,
        snapshotSetLabelSet);
    const utteranceLabelsMap: Map<string, Set<string>> =
      processedUtteranceLabelsMap.utteranceLabelsMap;
    const utteranceLabelDuplicateMap: Map<string, Set<string>> =
      processedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling OrchestratorHelper.getUtteranceLabelsMap() for testing set');
    // Utility.debuggingLog(`OrchestratorTest.runAsync(), utteranceLabelsMap=${Utility.jsonStringify(utteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorTest.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of unique utterances=${utteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of duplicate utterance/label pairs=${utteranceLabelDuplicateMap.size}`);
    if (utteranceLabelsMap.size <= 0) {
      Utility.debuggingThrow('There is no example, something wrong?');
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process testing set entity labels.
    const unknownSpuriousEntityLabelsProcessed: {
      'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
      'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
      'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
      'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
      'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } =
      Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMapUsingLabelSet(
        processedUtteranceLabelsMap,
        snapshotSetEntityLabelSet);
    const utteranceEntityLabelsMap: Map<string, Label[]> =
      processedUtteranceLabelsMap.utteranceEntityLabelsMap;
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> =
      processedUtteranceLabelsMap.utteranceEntityLabelDuplicateMap;
    Utility.debuggingLog('OrchestratorTest.runAsync(), after calling OrchestratorHelper.getUtteranceEntityLabelsMap() for testing set');
    // Utility.debuggingLog(`OrchestratorTest.runAsync(), utteranceEntityLabelsMap=${Utility.jsonStringify(utteranceEntityLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorTest.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceEntityLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(utteranceEntityLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of unique utterances=${utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorTest.runAsync(), number of duplicate utterance/label pairs=${utteranceEntityLabelDuplicateMap.size}`);
    // ---- NOTE-entity-model-is-optional ---- if (utteranceEntityLabelsMap.size <= 0) {
    // ---- NOTE-entity-model-is-optional ----   Utility.debuggingThrow('There is no example, something wrong?');
    // ---- NOTE-entity-model-is-optional ---- }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce intent analysis reports.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("false")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(false);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.generateLabelStringEvaluationReport()');
    const evaluationOutputLabelString: {
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
    } =
    Utility.generateLabelStringEvaluationReport(
      UtilityLabelResolver.scoreBatchStringLabels, // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- UtilityLabelResolver.scoreStringLabels,
      snapshotSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold,
      unknownSpuriousLabelsProcessed);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelString=${Utility.jsonStringify(evaluationOutputLabelString)}`);
    }
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateLabelStringEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummaryLabelString: string =
      evaluationOutputLabelString.evaluationReportAnalyses.evaluationSummary;
    evaluationSummaryLabelString = evaluationSummaryLabelString.replace(
      '{APP_NAME}',
      '');
    evaluationSummaryLabelString = evaluationSummaryLabelString.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      evaluationOutputLabelString.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      evaluationOutputLabelString.scoreOutputLines,
      evaluationOutputLabelString.groundTruthJsonContent,
      evaluationOutputLabelString.predictionJsonContent,
      evaluationSummaryLabelString,
      testingSetIntentLabelsOutputFilename,
      testingSetIntentScoresOutputFilename,
      testingSetIntentGroundTruthJsonContentOutputFilename,
      testingSetIntentPredictionJsonContentOutputFilename,
      testingSetIntentSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelString=${Utility.jsonStringify(evaluationOutputLabelString)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce entity analysis reports.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("false")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(false);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call UtilityLabelResolver.generateLabelObjectEvaluationReport()');
    const evaluationOutputLabelObject: {
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
    } =
    Utility.generateLabelObjectEvaluationReport(
      UtilityLabelResolver.scoreBatchObjectLabels, // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- UtilityLabelResolver.scoreObjectLabels,
      snapshotSetEntityLabels,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold,
      unknownSpuriousEntityLabelsProcessed);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelObject=${Utility.jsonStringify(evaluationOutputLabelObject)}`);
    }
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateLabelObjectEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummaryLabelObject: string =
      evaluationOutputLabelObject.evaluationReportAnalyses.evaluationSummary;
    evaluationSummaryLabelObject = evaluationSummaryLabelObject.replace(
      '{APP_NAME}',
      '');
    evaluationSummaryLabelObject = evaluationSummaryLabelObject.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      evaluationOutputLabelObject.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      evaluationOutputLabelObject.scoreOutputLines,
      evaluationOutputLabelObject.groundTruthJsonContent,
      evaluationOutputLabelObject.predictionJsonContent,
      evaluationSummaryLabelObject,
      testingSetEntityLabelsOutputFilename,
      testingSetEntityScoresOutputFilename,
      testingSetEntityGroundTruthJsonContentOutputFilename,
      testingSetEntityPredictionJsonContentOutputFilename,
      testingSetEntitySummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelObject=${Utility.jsonStringify(evaluationOutputLabelObject)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorTest.runAsync(), THE END');
  }
}
