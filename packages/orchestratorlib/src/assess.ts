/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {Label}  from '@microsoft/bf-dispatcher';
import {OrchestratorHelper} from './orchestratorhelper';

import {PredictionStructureWithPluralEvaluationLabelObject} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithPluralEvaluationLabelString} from '@microsoft/bf-dispatcher';

import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorAssess {
  public static readonly assessmentSetIntentSummaryHtmlOutputFilename: string = 'orchestrator_assessment_set_intent_summary.html';

  public static readonly assessmentSetIntentLabelsOutputFilename: string = 'orchestrator_assessment_set_intent_labels.txt';

  public static readonly assessmentSetEntitySummaryHtmlOutputFilename: string = 'orchestrator_assessment_set_entity_summary.html';

  public static readonly assessmentSetEntityLabelsOutputFilename: string = 'orchestrator_assessment_set_entity_labels.txt';

  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-params
  public static async runAsync(
    inputPathConfiguration: string, predictionPathConfiguration: string, outputPath: string,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments --------------------------------------
    if (Utility.isEmptyString(inputPathConfiguration)) {
      Utility.debuggingThrow(`Please provide one or more ground-truth files, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    if (Utility.isEmptyString(predictionPathConfiguration)) {
      Utility.debuggingThrow(`Please provide ane or more prediction files, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    if (Utility.isEmptyString(outputPath)) {
      Utility.debuggingThrow(`Please provide an output directory, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    Utility.debuggingLog(`inputPath=${inputPathConfiguration}`);
    Utility.debuggingLog(`predictionPath=${predictionPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.toObfuscateLabelTextInReportUtility = obfuscateEvaluationReport;
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = obfuscateEvaluationReport;
    // -----------------------------------------------------------------------
    // ---- NOTE ---- load the ground truth set ------------------------------
    const groundTruthFileConfiguration: string = inputPathConfiguration;
    if (Utility.isEmptyString(groundTruthFileConfiguration)) {
      Utility.debuggingThrow('ground-truth file configuration is empty');
    }
    const predictionFileConfiguration: string = predictionPathConfiguration;
    if (Utility.isEmptyString(predictionFileConfiguration)) {
      Utility.debuggingThrow('prediction file configuration is empty');
    }
    const assessmentSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentSummaryHtmlOutputFilename);
    const assessmentSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentLabelsOutputFilename);
    const assessmentSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntitySummaryHtmlOutputFilename);
    const assessmentSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntityLabelsOutputFilename);
    // ---- NOTE ---- process the ground-truth set and retrieve labels -------
    const groundTruthFileProcessedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(groundTruthFileConfiguration, false);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelsMap.keys()=${[...groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelsMap.keys()]}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()=${[...groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()]}`);
    const groundTruthSetUtteranceLabelsMap: Map<string, Set<string>> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelsMap;
    const groundTruthSetUtteranceLabelDuplicateMap: Map<string, Set<string>> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    const groundTruthSetUtteranceEntityLabelsMap: Map<string, Label[]> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap;
    const groundTruthSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelDuplicateMap;
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const groundTruthSetUtteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const groundTruthSetUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const groundTruthSetUtteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const groundTruthSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const groundTruthSetJsonObjectArray: any = fs.readJsonSync(groundTruthFileConfiguration);
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- OrchestratorHelper.getJsonIntentsEntitiesUtterances(
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   groundTruthSetJsonObjectArray,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   '',
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   groundTruthSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   groundTruthSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   groundTruthSetUtteranceEntityLabelsMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   groundTruthSetUtteranceEntityLabelDuplicateMap);
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap(
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   {
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----     utteranceLabelsMap: groundTruthSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----     utteranceLabelDuplicateMap: groundTruthSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   });
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling OrchestratorHelper.getUtteranceLabelsMap() for groundTruth set');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the ground-truth set intent labels -------------
    const groundTruthSetLabels: string[] =
      [...groundTruthSetUtteranceLabelsMap.values()].reduce(
        (accumulant: string[], entry: Set<string>) => accumulant.concat([...entry]), []);
    const groundTruthSetLabelSet: Set<string> =
      new Set<string>(groundTruthSetLabels);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthSetLabelSet=${Utility.jsonStringify(groundTruthSetLabelSet)}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthSetUtteranceLabelsMap=${Utility.jsonStringify(groundTruthSetUtteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth set unique utterances=${groundTruthSetUtteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth set duplicate utterance/label pairs=${groundTruthSetUtteranceLabelDuplicateMap.size}`);
    // ---- NOTE ---- process the ground-truth set entity labels -------------
    const groundTruthSetEntityLabels: string[] =
      [...groundTruthSetUtteranceEntityLabelsMap.values()].reduce(
        (accumulant: string[], entry: Label[]) => accumulant.concat(entry.map((x: Label) => x.name)), []);
    const groundTruthSetEntityLabelSet: Set<string> =
      new Set<string>(groundTruthSetEntityLabels);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthSetEntityLabelSet=${Utility.jsonStringify(groundTruthSetEntityLabelSet)}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), groundTruthSetUtteranceEntityLabelsMap=${Utility.jsonStringify(groundTruthSetUtteranceEntityLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceEntityLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceEntityLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth entity set unique utterances=${groundTruthSetUtteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth entity set duplicate utterance/label pairs=${groundTruthSetUtteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the prediction set and retrieve labels ---------
    const predictionFileProcessedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(predictionFileConfiguration, false);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), predictionFileProcessedUtteranceLabelsMap.utteranceLabelsMap.keys()=${[...predictionFileProcessedUtteranceLabelsMap.utteranceLabelsMap.keys()]}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()=${[...predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()]}`);
    const predictionSetUtteranceLabelsMap: Map<string, Set<string>> =
      predictionFileProcessedUtteranceLabelsMap.utteranceLabelsMap;
    const predictionSetUtteranceLabelDuplicateMap: Map<string, Set<string>> =
      predictionFileProcessedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    const predictionSetUtteranceEntityLabelsMap: Map<string, Label[]> =
      predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap;
    const predictionSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> =
      predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelDuplicateMap;
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const predictionSetUtteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const predictionSetUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const predictionSetUtteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const predictionSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- const predictionSetJsonObjectArray: any = fs.readJsonSync(predictionFileConfiguration);
    // ---- NOTE-REFACTORED-FOR-REFERENCE ---- OrchestratorHelper.getJsonIntentsEntitiesUtterances(
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   predictionSetJsonObjectArray,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   '',
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   predictionSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   predictionSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   predictionSetUtteranceEntityLabelsMap,
    // ---- NOTE-REFACTORED-FOR-REFERENCE ----   predictionSetUtteranceEntityLabelDuplicateMap);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling OrchestratorHelper.getUtteranceLabelsMap() for prediction set');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process unknown intent labels --------------------------
    // ---- NOTE-NOT-USED-YET ---- const unknownSpuriousLabelsProcessed: {
    // ---- NOTE-NOT-USED-YET ----   'utteranceUnknownLabelsMap': Map<string, Set<string>>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceUnknownLabelDuplicateMap': Map<string, Set<string>>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceSpuriousLabelsMap': Map<string, Set<string>>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceSpuriousLabelDuplicateMap': Map<string, Set<string>>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    // ---- NOTE-NOT-USED-YET ----   'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } =
    Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(
      {
        utteranceLabelsMap: predictionSetUtteranceLabelsMap,
        utteranceLabelDuplicateMap: predictionSetUtteranceLabelDuplicateMap},
      groundTruthSetLabelSet);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet() for prediction intent labels');
    // ---- NOTE ---- process unknown entity labels --------------------------
    // ---- NOTE-NOT-USED-YET ---- const unknownSpuriousEntityLabelsProcessed: {
    // ---- NOTE-NOT-USED-YET ----   'utteranceUnknownEntityLabelsMap': Map<string, Label[]>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceUnknownEntityLabelDuplicateMap': Map<string, Label[]>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceSpuriousEntityLabelsMap': Map<string, Label[]>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceSpuriousEntityLabelDuplicateMap': Map<string, Label[]>;
    // ---- NOTE-NOT-USED-YET ----   'utteranceLabelMapSetAddedWithUnknownLabel': boolean;
    // ---- NOTE-NOT-USED-YET ----   'utteranceLabelDuplicateMapSetAddedWithUnknownLabel': boolean; } =
    Utility.processUnknownSpuriousEntityLabelsInUtteranceEntityLabelsMapUsingLabelSet(
      {
        utteranceEntityLabelsMap: predictionSetUtteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap: predictionSetUtteranceEntityLabelDuplicateMap},
      groundTruthSetEntityLabelSet);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling Utility.processUnknownSpuriousLabelsInUtteranceEntityLabelsMapUsingLabelSet() for prediction entity labels');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the prediction set intent labels ---------------
    const predictionSetLabels: string[] =
      [...predictionSetUtteranceLabelsMap.values()].reduce(
        (accumulant: string[], entry: Set<string>) => accumulant.concat([...entry]), []);
    const predictionSetLabelSet: Set<string> =
      new Set<string>(predictionSetLabels);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), predictionSetUtteranceLabelsMap=${Utility.jsonStringify(predictionSetUtteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction-set duplicate utterance/label pairs=${predictionSetUtteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction set unique utterances=${predictionSetUtteranceLabelsMap.size}`);
    // if (predictionSetUtteranceLabelsMap.size <= 0) {
    //   Utility.debuggingThrow('There is no example, something wrong?');
    // }
    // ---- NOTE ---- process the prediction set entity labels ---------------
    const predictionSetEntityLabels: string[] =
      [...predictionSetUtteranceEntityLabelsMap.values()].reduce(
        (accumulant: string[], entry: Label[]) => accumulant.concat(entry.map((x: Label) => x.name)), []);
    const predictionSetEntityLabelSet: Set<string> =
      new Set<string>(predictionSetEntityLabels);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), predictionSetUtteranceEntityLabelsMap=${Utility.jsonStringify(predictionSetUtteranceEntityLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceEntityLabelDuplicateMap)=${Utility.jsonStringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceEntityLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction set entity unique utterances=${predictionSetUtteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction-set entity duplicate utterance/label pairs=${predictionSetUtteranceEntityLabelDuplicateMap.size}`);
    // if (predictionSetUtteranceEntityLabelsMap.size <= 0) {
    //   Utility.debuggingThrow('there is no entity example, something wrong?');
    // }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports ------------
    Utility.debuggingLog('OrchestratorAssess.runAsync(), ready to call Utility.generateAssessmentEvaluationReport()');
    const intentEvaluationOutput: {
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
    } =
    Utility.generateAssessmentEvaluationReport(
      groundTruthSetLabels,
      predictionSetLabelSet,
      groundTruthSetUtteranceLabelsMap,
      groundTruthSetUtteranceLabelDuplicateMap,
      predictionSetUtteranceLabelsMap,
      predictionSetUtteranceLabelDuplicateMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`intentEvaluationOutput=${Utility.jsonStringify(intentEvaluationOutput)}`);
    }
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReport()');
    // ---- NOTE ---- integrated step to produce analysis report output files.
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorAssess.runAsync(), intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    let intentEvaluationSummary: string =
      intentEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    // -----------------------------------------------------------------------
    intentEvaluationSummary = intentEvaluationSummary.replace(
      '{APP_NAME}',
      '');
    intentEvaluationSummary = intentEvaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateAssessmentEvaluationReportFiles(
      intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      intentEvaluationSummary,
      assessmentSetIntentLabelsOutputFilename,
      assessmentSetIntentSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`intentEvaluationOutput=${Utility.jsonStringify(intentEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports ------------
    Utility.debuggingLog('OrchestratorAssess.runAsync(), ready to call Utility.generateAssessmentEvaluationReport()');
    const entityEvaluationOutput: {
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
    } =
    Utility.generateAssessmentLabelObjectEvaluationReport(
      groundTruthSetEntityLabels,
      predictionSetEntityLabelSet,
      groundTruthSetUtteranceEntityLabelsMap,
      groundTruthSetUtteranceEntityLabelDuplicateMap,
      predictionSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelDuplicateMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`entityEvaluationOutput=${Utility.jsonStringify(entityEvaluationOutput)}`);
    }
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorAssess.runAsync(), entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    let entityEvaluationSummary: string =
      entityEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    // -----------------------------------------------------------------------
    entityEvaluationSummary = entityEvaluationSummary.replace(
      '{APP_NAME}',
      '');
    entityEvaluationSummary = entityEvaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateAssessmentEvaluationReportFiles(
      entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      entityEvaluationSummary,
      assessmentSetEntityLabelsOutputFilename,
      assessmentSetEntitySummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`entityEvaluationOutput=${Utility.jsonStringify(entityEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorAssess.runAsync(), THE END');
  }
}
