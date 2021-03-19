/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {PredictionStructureWithScoreLabelString, PredictionType} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {Result} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';

import {Utility} from './utility';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export class UtilityLabelResolver {
  public static toObfuscateLabelTextInReportUtilityLabelResolver: boolean = true;

  public static resetLabelResolverSettingIgnoreSameExample(
    ignoreSameExample: boolean = true,
    resetAll: boolean = false): any {
    const ignoreSameExampleObject: {
      ignore_same_example: boolean;
    } = {
      ignore_same_example: ignoreSameExample,
    };
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), ignoreSameExample=${ignoreSameExample}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), resetAll=${resetAll}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), ignoreSameExampleObject=${ignoreSameExampleObject}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), ignoreSameExampleObject.ignore_same_example=${ignoreSameExampleObject.ignore_same_example}`);
    const ignoreSameExampleObjectJson: string = Utility.jsonStringify(ignoreSameExampleObject);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), ignoreSameExampleObjectJson=${ignoreSameExampleObjectJson}`);
    LabelResolver.setRuntimeParams(ignoreSameExampleObjectJson, resetAll);
    Utility.debuggingLog(`read to call Utility.getConfigJson(), LabelResolver.LabelResolver=${LabelResolver.LabelResolver}`);
    return LabelResolver.getConfigJson();
  }

  public static resetLabelResolverSettingUseCompactEmbeddings(
    fullEmbeddings: boolean = false,
    resetAll: boolean = false): any {
    const useCompactEmbeddingsObject: {
      use_compact_embeddings: boolean;
    } = {
      use_compact_embeddings: !fullEmbeddings,
    };
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), fullEmbeddings=${fullEmbeddings}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), resetAll=${resetAll}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject=${useCompactEmbeddingsObject}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject.use_compact_embeddings=${useCompactEmbeddingsObject.use_compact_embeddings}`);
    const useCompactEmbeddingsObjectJson: string = Utility.jsonStringify(useCompactEmbeddingsObject);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObjectJson=${useCompactEmbeddingsObjectJson}`);
    LabelResolver.setRuntimeParams(useCompactEmbeddingsObjectJson, resetAll);
    Utility.debuggingLog(`read to call Utility.getConfigJson(), LabelResolver.LabelResolver=${LabelResolver.LabelResolver}`);
    return LabelResolver.getConfigJson();
  }

  public static resetLabelResolverSettingKnnK(
    knnK: number = 1,
    resetAll: boolean = false): any {
    const knnKObject: {
      knn_k: number;
    } = {
      knn_k: knnK,
    };
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), knnK=${knnK}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), resetAll=${resetAll}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), knnKObject=${knnKObject}`);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), knnKObject.knn_k=${knnKObject.knn_k}`);
    const knnKObjectJson: string = Utility.jsonStringify(knnKObject);
    Utility.debuggingLog(`read to call LabelResolver.setRuntimeParams(), knnKObjectJson=${knnKObjectJson}`);
    LabelResolver.setRuntimeParams(knnKObjectJson, resetAll);
    Utility.debuggingLog(`read to call Utility.getConfigJson(), LabelResolver.LabelResolver=${LabelResolver.LabelResolver}`);
    return LabelResolver.getConfigJson();
  }

  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- // eslint-disable-next-line max-params
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- // eslint-disable-next-line complexity
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- public static scoreBatchStringLabels(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   utteranceLabelsPairArray: [string, string[]][],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   labelArrayAndMap: {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     'stringArray': string[];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     'stringMap': Map<string, number>;},
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   multiLabelPredictionThreshold: number,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelString[] {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog('UtilityLabelResolver.scoreBatchStringLabels(), entering');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), multiLabelPredictionThreshold="${multiLabelPredictionThreshold}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), unknownLabelPredictionThreshold="${unknownLabelPredictionThreshold}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.resetToPrintDetailedDebuggingLogToConsole(true);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const utterances: string[] = utteranceLabelsPairArray.map((x: [string, string[]]) => x[0]);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[] = [];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.isEmptyStringArray(utterances)) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     return predictionStructureWithScoreLabelStringArray;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const scoreResultsBatch: any = LabelResolver.scoreBatch(utterances, LabelType.Intent);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (utterances.length !== scoreResultsBatch.length) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedThrow2(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'utterances.length !== scoreResultsBatch.length',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       utterances.length,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       scoreResultsBatch.length,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'utterances.length',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'scoreResultsBatch.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utterances.length, 'utterances.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResultsBatch.length, 'scoreResultsBatch.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utterances, 'utterances');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResultsBatch, 'scoreResultsBatch');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   for (let index: number = 0; index < scoreResultsBatch.length; index++) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const utteranceLabels: [string, string[]] = utteranceLabelsPairArray[index];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const scoreResults: any = scoreResultsBatch[index];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', index, 'index');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utteranceLabels, 'utteranceLabels');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResults.length, 'scoreResults.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResults, 'scoreResults');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     if (utteranceLabels) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const utterance: string = utteranceLabels[0];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.isEmptyString(utterance)) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingThrow('UtilityLabelResolver.scoreBatchStringLabels() failed to produce a prediction for an empty utterance');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labels: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         utteranceLabels[1];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsIndexes: number[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels.map((x: string) => Utility.carefullyAccessStringMap(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           labelArrayAndMap.stringMap,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           x));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsStringArray: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels.map((label: string) => Utility.outputString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           label,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '', // ---- 'Label',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (!scoreResults) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingThrow(`UtilityLabelResolver.scoreBatchStringLabels() failed to produce a prediction for utterance "${utterance}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResults.length=${scoreResults.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResultArray=${Utility.jsonStringify(scoreResultArray)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResultArray.length=${scoreResultArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const scoreArray: number[] = scoreResultArray.map(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         (x: Result) => x.score);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const argMax: { 'indexesMax': number[]; 'max': number } =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ((multiLabelPredictionThreshold > 0) ?
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArray, multiLabelPredictionThreshold) :
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           Utility.getIndexesOnMaxEntries(scoreArray));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedScore: number =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         argMax.max;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       let labelsPredictedIndexes: number[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         argMax.indexesMax;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       let labelsPredicted: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes.map((x: number) => scoreResultArray[x].label.name);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedStringArray: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted.map((label: string) => Utility.outputString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           label,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       let labelsPredictedClosestText: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes.map((x: number) => scoreResultArray[x].closesttext);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const unknownPrediction: boolean = labelsPredictedScore < unknownLabelPredictionThreshold;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (unknownPrediction) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes = [Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted = [Utility.UnknownLabel];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedClosestText = [];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '', // ---- 'Label',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(labels, labelsPredicted);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArray,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         unknownLabelPredictionThreshold,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['Label', 'Score', 'Closest Example'],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['30%', '10%', '60%']);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArray,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         unknownLabelPredictionThreshold,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['Label', 'Score', 'Closest Example'],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['30%', '10%', '60%']);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       predictionStructureWithScoreLabelStringArray.push(new PredictionStructureWithScoreLabelString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         utterance,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedEvaluation,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsConcatenated,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsConcatenatedToHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedConcatenated,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedConcatenatedToHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedScore,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedClosestText,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArray,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreArray,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         predictedScoreStructureHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsScoreStructureHtmlTable));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), finished scoring for utterance "${utterance}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE ---- debugging ouput.
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         for (const result of scoreResults) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           // eslint-disable-next-line max-depth
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           if (result) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), result=${Utility.jsonStringify(result)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const closesttext: string = result.closesttext;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const score: number = result.score;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const label: any = result.label;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const labelname: string = label.name;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const labeltype: LabelType = label.labeltype;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const span: any = label.span;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const offset: number = span.offset;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const length: number = span.length;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), closesttext=${closesttext}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), score=${score}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label=${Utility.jsonStringify(label)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), Object.keys(label)=${Object.keys(label)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.name=${labelname}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.labeltype=${labeltype}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), span=${Utility.jsonStringify(span)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), Object.keys(span)=${Object.keys(span)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.span.offset=${offset}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.span.length=${length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if ((predictionStructureWithScoreLabelStringArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(): Added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(): Total added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // Utility.debuggingLog('UtilityLabelResolver.scoreBatchStringLabels(), leaving');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   return predictionStructureWithScoreLabelStringArray;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- }

  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- // eslint-disable-next-line max-params
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- // eslint-disable-next-line complexity
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- public static scoreBatchObjectLabels(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   utteranceLabelsPairArray: [string, Label[]][],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   labelArrayAndMap: {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     'stringArray': string[];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     'stringMap': Map<string, number>;},
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   multiLabelPredictionThreshold: number,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelObject[] {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), multiLabelPredictionThreshold="${multiLabelPredictionThreshold}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), unknownLabelPredictionThreshold="${unknownLabelPredictionThreshold}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog('UtilityLabelResolver.scoreBatchObjectLabels(), entering');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.resetToPrintDetailedDebuggingLogToConsole(true);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const utterances: string[] = utteranceLabelsPairArray.map((x: [string, Label[]]) => x[0]);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[] = [];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.isEmptyStringArray(utterances)) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     return predictionStructureWithScoreLabelObjectArray;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const scoreResultsBatch: any = LabelResolver.scoreBatch(utterances, LabelType.Entity);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (utterances.length !== scoreResultsBatch.length) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedThrow2(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'utterances.length !== scoreResultsBatch.length',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       utterances.length,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       scoreResultsBatch.length,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'utterances.length',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'scoreResultsBatch.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utterances.length, 'utterances.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResultsBatch.length, 'scoreResultsBatch.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utterances, 'utterances');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResultsBatch, 'scoreResultsBatch');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   for (let index: number = 0; index < scoreResultsBatch.length; index++) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const utteranceLabels: [string, Label[]] = utteranceLabelsPairArray[index];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const scoreResults: any = scoreResultsBatch[index];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', index, 'index');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utteranceLabels, 'utteranceLabels');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResults.length, 'scoreResults.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResults, 'scoreResults');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     if (utteranceLabels) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const utterance: string = utteranceLabels[0];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.isEmptyString(utterance)) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingThrow('UtilityLabelResolver.scoreBatchObjectLabels() failed to produce a prediction for an empty utterance');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labels: Label[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         utteranceLabels[1];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsIndexes: number[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels.map((x: Label) => Utility.carefullyAccessStringMap(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           labelArrayAndMap.stringMap,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           x.name));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsStringArray: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels.map((label: Label) => Utility.outputLabelString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           label,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsConcatenated=${labelsConcatenated}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '', // ---- 'Label',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsConcatenatedToHtmlTable=${labelsConcatenatedToHtmlTable}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- const scoreResults: any = LabelResolver.score(utterance, LabelType.Entity);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (!scoreResults) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingThrow(`UtilityLabelResolver.scoreBatchObjectLabels() failed to produce a prediction for utterance "${utterance}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResults.length=${scoreResults.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling Utility.scoreResultsToArray(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), after calling Utility.scoreResultsToArray(), utterance=${utterance}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray)=${Utility.jsonStringify(scoreResultArray)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const scoreResultArrayFiltered: Result[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArray.filter((x: Result) => (x !== undefined));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const scoreArrayFiltered: number[] = scoreResultArrayFiltered.map(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         (x: Result) => ((x === undefined) ? 0 : x.score));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       let argMax: { 'indexesMax': number[]; 'max': number } =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         {indexesMax: [], max: 0};
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (!Utility.isEmptyNumberArray(scoreArrayFiltered)) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         argMax =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           ((multiLabelPredictionThreshold > 0) ?
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArrayFiltered, multiLabelPredictionThreshold) :
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.getIndexesOnMaxEntries(scoreArrayFiltered));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedScoreMax: number =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         argMax.max;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedIndexesMax: number[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         argMax.indexesMax;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- let labelsPredictedMax: Label[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedIndexesMax.map((x: number) => scoreResultArray[x].label);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredicted: Label[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArrayFiltered.map((x: Result) => x.label);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedIndexes: number[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted.map((x: Label) => Utility.carefullyAccessStringMap(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           labelArrayAndMap.stringMap,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           x.name));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedStringArray: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted.map((label: Label) => Utility.outputLabelString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           label,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedClosestText: string[] =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexesMax.map((x: number) => scoreResultArrayFiltered[x].closesttext);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- const unknownPrediction: boolean = labelsPredictedScoreMax < unknownLabelPredictionThreshold;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- if (unknownPrediction) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedIndexesMax = [Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedMax = [Label.newLabel(LabelType.Entity, Utility.UnknownLabel, 0, 0)];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedClosestText = [];
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenated=${labelsPredictedConcatenated}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '', // ---- 'Label',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedStringArray);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenatedToHtmlTable=${labelsPredictedConcatenatedToHtmlTable}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       let labelsPredictedEvaluation: number = Utility.evaluateMultiLabelObjectExactPrediction(labels, labelsPredicted);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (labelsPredictedEvaluation === PredictionType.TrueNegative) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedEvaluation = PredictionType.FalseNegative; // ---- NOTE ----override the default logic, for entity, true negative does not exist.
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- const predictedScoreStructureHtmlTable: string =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   labelsPredictedConcatenatedToHtmlTable;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArrayFiltered,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         [...(new Array(scoreResultArrayFiltered.length)).keys()], // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- labelsPredictedIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         unknownLabelPredictionThreshold,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         '',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['Label', 'Score', 'Closest Example'],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         ['30%', '10%', '60%']);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       const labelsScoreStructureHtmlTable: string =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsConcatenatedToHtmlTable;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   scoreResultArrayFiltered,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   [...(new Array(scoreResultArrayFiltered.length)).keys()], // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- labelsIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   unknownLabelPredictionThreshold,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   '',
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   ['Label', 'Score', 'Closest Example'],
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   ['30%', '10%', '60%']);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       predictionStructureWithScoreLabelObjectArray.push(new PredictionStructureWithScoreLabelObject(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         utterance,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedEvaluation,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labels,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsConcatenated,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsConcatenatedToHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredicted,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedConcatenated,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedConcatenatedToHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedIndexes,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedScoreMax,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsPredictedClosestText,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreResultArrayFiltered,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         scoreArrayFiltered,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         predictedScoreStructureHtmlTable,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         labelsScoreStructureHtmlTable));
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), finished scoring for utterance "${utterance}"`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // ---- NOTE ---- debugging ouput.
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if (Utility.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         for (const result of scoreResults) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           // eslint-disable-next-line max-depth
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           if (result) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), result=${Utility.jsonStringify(result)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const closesttext: string = result.closesttext;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const score: number = result.score;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const label: any = result.label;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const labelname: string = label.name;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const labeltype: LabelType = label.labeltype;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const span: any = label.span;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const offset: number = span.offset;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             const length: number = span.length;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), closesttext=${closesttext}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), score=${score}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label=${Utility.jsonStringify(label)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), Object.keys(label)=${Object.keys(label)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.name=${labelname}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.labeltype=${labeltype}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), span=${Utility.jsonStringify(span)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), Object.keys(span)=${Object.keys(span)}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.span.offset=${offset}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----             Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.span.length=${length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----           }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       if ((predictionStructureWithScoreLabelObjectArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----         Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(): Added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       // -------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(): Total added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // Utility.debuggingLog('UtilityLabelResolver.scoreBatchObjectLabels(), leaving');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   return predictionStructureWithScoreLabelObjectArray;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- }

  // eslint-disable-next-line max-params
  // eslint-disable-next-line complexity
  public static scoreStringLabels(
    utteranceLabelsPairArray: [string, string[]][],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelString[] {
    // -----------------------------------------------------------------------
    // Utility.debuggingLog('UtilityLabelResolver.scoreStringLabels(), entering');
    // -----------------------------------------------------------------------
    // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.toPrintDetailedDebuggingLogToConsole = true;
    // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
    // -----------------------------------------------------------------------
    const predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[] = [];
    for (const utteranceLabels of utteranceLabelsPairArray) {
      // ---------------------------------------------------------------------
      if (utteranceLabels) {
        const utterance: string = utteranceLabels[0];
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreStringLabels() failed to produce a prediction for an empty utterance');
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), utterance=${utterance}`);
        // -------------------------------------------------------------------
        const labels: string[] =
          utteranceLabels[1];
        const labelsIndexes: number[] =
          labels.map((x: string) => Utility.carefullyAccessStringMap(
            labelArrayAndMap.stringMap,
            x));
        const labelsStringArray: string[] =
          labels.map((label: string) => Utility.outputString(
            label,
            UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
        // -------------------------------------------------------------------
        const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsStringArray);
        const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
        // Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
        if (!scoreResults) {
          Utility.debuggingThrow(`UtilityLabelResolver.scoreStringLabels() failed to produce a prediction for utterance "${utterance}"`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), scoreResults.length=${scoreResults.length}`);
        }
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), scoreResultArray=${Utility.jsonStringify(scoreResultArray)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        // -------------------------------------------------------------------
        const scoreArray: number[] = scoreResultArray.map(
          (x: Result) => x.score);
        const argMax: { 'indexesMax': number[]; 'max': number } =
          ((multiLabelPredictionThreshold > 0) ?
            Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArray, multiLabelPredictionThreshold) :
            Utility.getIndexesOnMaxEntries(scoreArray));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
        }
        const labelsPredictedScore: number =
          argMax.max;
        let labelsPredictedIndexes: number[] =
          argMax.indexesMax;
        let labelsPredicted: string[] =
          labelsPredictedIndexes.map((x: number) => scoreResultArray[x].label.name);
        const labelsPredictedStringArray: string[] =
          labelsPredicted.map((label: string) => Utility.outputString(
            label,
            UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
        let labelsPredictedClosestText: string[] =
          labelsPredictedIndexes.map((x: number) => scoreResultArray[x].closesttext);
        const unknownPrediction: boolean = labelsPredictedScore < unknownLabelPredictionThreshold;
        if (unknownPrediction) {
          labelsPredictedIndexes = [Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
          labelsPredicted = [Utility.UnknownLabel];
          labelsPredictedClosestText = [];
        }
        // -------------------------------------------------------------------
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
        }
        // -------------------------------------------------------------------
        const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsPredictedStringArray);
        const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
        }
        const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(labels, labelsPredicted);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
        }
        const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labelsPredictedIndexes,
          unknownLabelPredictionThreshold,
          UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
        }
        const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labelsIndexes,
          unknownLabelPredictionThreshold,
          UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
        }
        predictionStructureWithScoreLabelStringArray.push(new PredictionStructureWithScoreLabelString(
          utterance,
          labelsPredictedEvaluation,
          labels,
          labelsConcatenated,
          labelsConcatenatedToHtmlTable,
          labelsIndexes,
          labelsPredicted,
          labelsPredictedConcatenated,
          labelsPredictedConcatenatedToHtmlTable,
          labelsPredictedIndexes,
          labelsPredictedScore,
          labelsPredictedClosestText,
          scoreResultArray,
          scoreArray,
          predictedScoreStructureHtmlTable,
          labelsScoreStructureHtmlTable));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), finished scoring for utterance "${utterance}"`);
        }
        // ---- NOTE ---- debugging ouput.
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          for (const result of scoreResults) {
            // eslint-disable-next-line max-depth
            if (result) {
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), result=${Utility.jsonStringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), closesttext=${closesttext}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), score=${score}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), label=${Utility.jsonStringify(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), label.name=${labelname}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), span=${Utility.jsonStringify(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), label.span.offset=${offset}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), label.span.length=${length}`);
            }
          }
        }
        if ((predictionStructureWithScoreLabelStringArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(): Added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
        }
      }
      // ---------------------------------------------------------------------
    }
    Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(): Total added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
    // Utility.debuggingLog('UtilityLabelResolver.scoreStringLabels(), leaving');
    // -----------------------------------------------------------------------
    return predictionStructureWithScoreLabelStringArray;
  }

  // eslint-disable-next-line max-params
  // eslint-disable-next-line complexity
  public static scoreObjectLabels(
    utteranceLabelsPairArray: [string, Label[]][],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelObject[] {
    // -----------------------------------------------------------------------
    // Utility.debuggingLog('UtilityLabelResolver.scoreObjectLabels(), entering');
    // -----------------------------------------------------------------------
    // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.toPrintDetailedDebuggingLogToConsole = true;
    // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
    const predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[] = [];
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), unknownLabelPredictionThreshold="${unknownLabelPredictionThreshold}"`);
    }
    for (const utteranceLabels of utteranceLabelsPairArray) {
      // ---------------------------------------------------------------------
      if (utteranceLabels) {
        const utterance: string = utteranceLabels[0];
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreObjectLabels() failed to produce a prediction for an empty utterance');
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), utterance=${utterance}`);
        }
        // -------------------------------------------------------------------
        const labels: Label[] =
          utteranceLabels[1];
        const labelsIndexes: number[] =
          labels.map((x: Label) => Utility.carefullyAccessStringMap(
            labelArrayAndMap.stringMap,
            x.name));
        const labelsStringArray: string[] =
          labels.map((label: Label) => Utility.outputLabelString(
            label,
            UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
        // -------------------------------------------------------------------
        const labelsConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsConcatenated=${labelsConcatenated}`);
        }
        const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsConcatenatedToHtmlTable=${labelsConcatenatedToHtmlTable}`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        const scoreResults: any = LabelResolver.score(utterance, LabelType.Entity);
        // Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
        if (!scoreResults) {
          Utility.debuggingThrow(`UtilityLabelResolver.scoreObjectLabels() failed to produce a prediction for utterance "${utterance}"`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), scoreResults.length=${scoreResults.length}`);
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), before calling Utility.scoreResultsToArray(), utterance=${utterance}`);
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        // Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), after calling Utility.scoreResultsToArray(), utterance=${utterance}`);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), scoreResultArray)=${Utility.jsonStringify(scoreResultArray)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        // -------------------------------------------------------------------
        const scoreResultArrayFiltered: Result[] =
          scoreResultArray.filter((x: Result) => (x !== undefined));
        // -------------------------------------------------------------------
        const scoreArrayFiltered: number[] = scoreResultArrayFiltered.map(
          (x: Result) => ((x === undefined) ? 0 : x.score));
        let argMax: { 'indexesMax': number[]; 'max': number } =
          {indexesMax: [], max: 0};
        if (!Utility.isEmptyNumberArray(scoreArrayFiltered)) {
          argMax =
            ((multiLabelPredictionThreshold > 0) ?
              Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArrayFiltered, multiLabelPredictionThreshold) :
              Utility.getIndexesOnMaxEntries(scoreArrayFiltered));
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
        }
        // -------------------------------------------------------------------
        const labelsPredictedScoreMax: number =
          argMax.max;
        const labelsPredictedIndexesMax: number[] =
          argMax.indexesMax;
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- let labelsPredictedMax: Label[] =
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedIndexesMax.map((x: number) => scoreResultArray[x].label);
        // -------------------------------------------------------------------
        const labelsPredicted: Label[] =
          scoreResultArrayFiltered.map((x: Result) => x.label);
        const labelsPredictedIndexes: number[] =
          labelsPredicted.map((x: Label) => Utility.carefullyAccessStringMap(
            labelArrayAndMap.stringMap,
            x.name));
        const labelsPredictedStringArray: string[] =
          labelsPredicted.map((label: Label) => Utility.outputLabelString(
            label,
            UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver));
        // -------------------------------------------------------------------
        const labelsPredictedClosestText: string[] =
          labelsPredictedIndexesMax.map((x: number) => scoreResultArrayFiltered[x].closesttext);
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- const unknownPrediction: boolean = labelsPredictedScoreMax < unknownLabelPredictionThreshold;
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- if (unknownPrediction) {
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedIndexesMax = [Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedMax = [Label.newLabel(LabelType.Entity, Utility.UnknownLabel, 0, 0)];
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ----   labelsPredictedClosestText = [];
        // ---- NOTE-FOR-REFERENCE-all-entity-prediction-is-included-no-need-for-ArgMax-and-UNKNOWN-threshold ---- }
        // -------------------------------------------------------------------
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
        }
        // -------------------------------------------------------------------
        const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredictedConcatenated=${labelsPredictedConcatenated}`);
        }
        const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredictedConcatenatedToHtmlTable=${labelsPredictedConcatenatedToHtmlTable}`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
        }
        let labelsPredictedEvaluation: number = Utility.evaluateMultiLabelObjectExactPrediction(labels, labelsPredicted);
        if (labelsPredictedEvaluation === PredictionType.TrueNegative) {
          labelsPredictedEvaluation = PredictionType.FalseNegative; // ---- NOTE ----override the default logic, for entity, true negative does not exist.
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
        }
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- const predictedScoreStructureHtmlTable: string =
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   labelsPredictedConcatenatedToHtmlTable;
        const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArrayFiltered,
          [...(new Array(scoreResultArrayFiltered.length)).keys()], // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- labelsPredictedIndexes,
          unknownLabelPredictionThreshold,
          UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
        }
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----
        const labelsScoreStructureHtmlTable: string =
          labelsConcatenatedToHtmlTable;
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   scoreResultArrayFiltered,
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   [...(new Array(scoreResultArrayFiltered.length)).keys()], // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- labelsIndexes,
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   unknownLabelPredictionThreshold,
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver,
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   '',
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   ['Label', 'Score', 'Closest Example'],
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   ['30%', '10%', '60%']);
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ---- }
        predictionStructureWithScoreLabelObjectArray.push(new PredictionStructureWithScoreLabelObject(
          utterance,
          labelsPredictedEvaluation,
          labels,
          labelsConcatenated,
          labelsConcatenatedToHtmlTable,
          labelsIndexes,
          labelsPredicted,
          labelsPredictedConcatenated,
          labelsPredictedConcatenatedToHtmlTable,
          labelsPredictedIndexes,
          labelsPredictedScoreMax,
          labelsPredictedClosestText,
          scoreResultArrayFiltered,
          scoreArrayFiltered,
          predictedScoreStructureHtmlTable,
          labelsScoreStructureHtmlTable));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), finished scoring for utterance "${utterance}"`);
        }
        // ---- NOTE ---- debugging ouput.
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          for (const result of scoreResults) {
            // eslint-disable-next-line max-depth
            if (result) {
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), result=${Utility.jsonStringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), closesttext=${closesttext}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), score=${score}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), label=${Utility.jsonStringify(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), label.name=${labelname}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), span=${Utility.jsonStringify(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), label.span.offset=${offset}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), label.span.length=${length}`);
            }
          }
        }
        if ((predictionStructureWithScoreLabelObjectArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(): Added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
        }
      }
      // ---------------------------------------------------------------------
    }
    Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(): Total added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
    // Utility.debuggingLog('UtilityLabelResolver.scoreObjectLabels(), leaving');
    // -----------------------------------------------------------------------
    return predictionStructureWithScoreLabelObjectArray;
  }

  public static resetFlagToObfuscateLabelTextInReportUtilityLabelResolver(flag: boolean) {
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = flag;
  }
}
