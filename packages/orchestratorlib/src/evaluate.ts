/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {LabelType} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {Example} from '@microsoft/bf-dispatcher';

import {PredictionStructureWithScoreLabelString} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorEvaluate {
  public static readonly snapshotSetIntentScoresOutputFilename: string = 'orchestrator_snapshot_set_intent_scores.txt';

  public static readonly snapshotSetIntentGroundTruthJsonContentOutputFilename: string = 'orchestrator_snapshot_set_intent_ground_truth_instances.json';

  public static readonly snapshotSetIntentPredictionJsonContentOutputFilename: string = 'orchestrator_snapshot_set_intent_prediction_instances.json';

  public static readonly snapshotSetIntentSummaryHtmlOutputFilename: string = 'orchestrator_snapshot_set_intent_summary.html';

  public static readonly snapshotSetIntentLabelsOutputFilename: string = 'orchestrator_snapshot_set_intent_labels.txt';

  public static readonly snapshotSetEntityScoresOutputFilename: string = 'orchestrator_snapshot_set_entity_scores.txt';

  public static readonly snapshotSetEntityGroundTruthJsonContentOutputFilename: string = 'orchestrator_snapshot_set_entity_ground_truth_instances.json';

  public static readonly snapshotSetEntityPredictionJsonContentOutputFilename: string = 'orchestrator_snapshot_set_entity_prediction_instances.json';

  public static readonly snapshotSetEntitySummaryHtmlOutputFilename: string = 'orchestrator_snapshot_set_entity_summary.html';

  public static readonly snapshotSetEntityLabelsOutputFilename: string = 'orchestrator_snapshot_set_entity_labels.txt';

  // eslint-disable-next-line max-params
  public static async runAsync(
    inputPath: string,
    outputPath: string,
    baseModelPath: string = '',
    entityBaseModelPath: string = '',
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
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    } else {
      entityBaseModelPath = '';
    }
    const ambiguousClosenessThreshold: number = ambiguousClosenessThresholdParameter;
    const lowConfidenceScoreThreshold: number = lowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThreshold: number = multiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThreshold: number = unknownLabelPredictionThresholdParameter;
    Utility.debuggingLog(`inputPath=${inputPath}`);
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
    // ---- NOTE ---- load the snapshot set
    const snapshotFile: string = inputPath;
    if (!Utility.exists(snapshotFile)) {
      Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${snapshotFile}`);
    }
    const snapshotSetIntentScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentScoresOutputFilename);
    const snapshotSetIntentGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentGroundTruthJsonContentOutputFilename);
    const snapshotSetIntentPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentPredictionJsonContentOutputFilename);
    const snapshotSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentSummaryHtmlOutputFilename);
    const snapshotSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentLabelsOutputFilename);
    const snapshotSetEntityScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityScoresOutputFilename);
    const snapshotSetEntityGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityGroundTruthJsonContentOutputFilename);
    const snapshotSetEntityPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityPredictionJsonContentOutputFilename);
    const snapshotSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntitySummaryHtmlOutputFilename);
    const snapshotSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityLabelsOutputFilename);
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, entityBaseModelPath);
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
    // ---- NOTE ---- retrieve intent labels
    const labels: string[] =
      LabelResolver.getLabels(LabelType.Intent);
    // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), labels=${Utility.jsonStringify(labels)}`);
    if (Utility.toPrintDebuggingLogToConsole) {
      let index: number = 0;
      for (const label of labels) {
        Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), no=${index}, label=${label}`);
        index++;
      }
    }
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), labels.length=${labels.length}`);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), labels=${Utility.jsonStringify(labels)}`);
    }
    // ---- NOTE ---- retrieve entity labels
    const entityLabels: string[] =
      LabelResolver.getLabels(LabelType.Entity);
    // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), entityLabels=${Utility.jsonStringify(entityLabels)}`);
    if (Utility.toPrintDebuggingLogToConsole) {
      let index: number = 0;
      for (const entityLabel of entityLabels) {
        Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), no=${index}, entityLabel=${entityLabel}`);
        index++;
      }
    }
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), entityLabels.length=${entityLabels.length}`);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), entityLabels=${Utility.jsonStringify(entityLabels)}`);
    }
    // -----------------------------------------------------------------------
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      Utility.debuggingThrow('There is no example, something wrong?');
    }
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), examples.length=${examples.length}`);
    const exampleStructureArray: Example[] = Utility.examplesToArray(examples);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), exampleStructureArray.length=${exampleStructureArray.length}`);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      const example: any = exampleStructureArray[0];
      const example_text: string = example.text;
      const labels: any = example.labels;
      const label: any = labels[0];
      const label_name: string = label.name;
      const labeltype: any = label.labeltype;
      const span: any = label.span;
      const offset: number = span.offset;
      const length: number = span.length;
      // Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), exampleStructureArray=${Utility.jsonStringify(exampleStructureArray)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), example=${Utility.jsonStringify(example)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(example)=${Object.keys(example)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), example_text=${example_text}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), labels=${Utility.jsonStringify(labels)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(labels)=${Object.keys(labels)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label=${Utility.jsonStringify(label)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(label)=${Object.keys(label)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.name=${label_name}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.labeltype=${labeltype}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), span=${Utility.jsonStringify(span)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), Object.keys(span)=${Object.keys(span)}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.span.offset=${offset}`);
      Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), label.span.length=${length}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- retrieve examples, process the snapshot set, retrieve labels, and create a label-index map for intent.
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const numberAddedIntentLabels: [number, number] = Utility.examplesToUtteranceLabelMaps(
      exampleStructureArray,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    const numberIntentUtteancesAdded: number = numberAddedIntentLabels[0];
    const numberIntentLabelsAdded: number = numberAddedIntentLabels[1];
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberAddedIntentLabels=${numberAddedIntentLabels}`);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberIntentUtteancesAdded=${numberIntentUtteancesAdded}`);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberIntentLabelsAdded=${numberIntentLabelsAdded}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- retrieve examples, process the snapshot set, retrieve labels, and create a label-index map for entity.
    const utteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const numberAddedEntityLabels: [number, number] = Utility.examplesToUtteranceEntityLabelMaps(
      exampleStructureArray,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    const numberEntityUtteancesAdded: number = numberAddedEntityLabels[0];
    const numberEntityLabelsAdded: number = numberAddedEntityLabels[1];
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberAddedEntityLabels=${numberAddedEntityLabels}`);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberEntityUtteancesAdded=${numberEntityUtteancesAdded}`);
    Utility.debuggingLog(`OrchestratorEvaluate.runAsync(), numberEntityLabelsAdded=${numberEntityLabelsAdded}`);
    // -----------------------------------------------------------------------
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("true")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(true);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce intent analysis reports.
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
      'predictionStructureWithScoreLabelStringArray': PredictionStructureWithScoreLabelString[];
      'scoreOutputLines': string[][];
      'groundTruthJsonContent': string;
      'predictionJsonContent': string;
    } =
    Utility.generateLabelStringEvaluationReport(
      UtilityLabelResolver.scoreStringLabels,
      labels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold,
      false);
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
      snapshotSetIntentLabelsOutputFilename,
      snapshotSetIntentScoresOutputFilename,
      snapshotSetIntentGroundTruthJsonContentOutputFilename,
      snapshotSetIntentPredictionJsonContentOutputFilename,
      snapshotSetIntentSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutput=${Utility.jsonStringify(evaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce entity analysis reports.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call UtilityLabelResolver.generateLabelObjectEvaluationReport()');
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
      UtilityLabelResolver.scoreObjectLabels,
      entityLabels,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap,
      ambiguousClosenessThreshold,
      lowConfidenceScoreThreshold,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold,
      false);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelObject=${Utility.jsonStringify(evaluationOutputLabelObject)}`);
    }
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling Utility.generateLabelObjectEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
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
      snapshotSetEntityLabelsOutputFilename,
      snapshotSetEntityScoresOutputFilename,
      snapshotSetEntityGroundTruthJsonContentOutputFilename,
      snapshotSetEntityPredictionJsonContentOutputFilename,
      snapshotSetEntitySummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`evaluationOutputLabelObject=${Utility.jsonStringify(evaluationOutputLabelObject)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorEvaluate.runAsync(), THE END');
  }
}

/* ---- NOTE-FOR-REFERENCE ---- performance reference for "test" LOOCV
*/
