/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {Result} from '@microsoft/bf-dispatcher';

import {ILabelArrayAndMap} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelString, PredictionType} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';

import {StructTextLabelObjects} from '@microsoft/bf-dispatcher';
import {StructTextLabelStrings} from '@microsoft/bf-dispatcher';

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

  // eslint-disable-next-line max-params
  // eslint-disable-next-line complexity
  public static scoreBatchStringLabels(
    utteranceLabelsPairArray: StructTextLabelStrings[],
    labelArrayAndMap: ILabelArrayAndMap,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelString[] {
    // -----------------------------------------------------------------------
    Utility.debuggingLog('UtilityLabelResolver.scoreBatchStringLabels(), entering');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), multiLabelPredictionThreshold="${multiLabelPredictionThreshold}"`);
    }
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), unknownLabelPredictionThreshold="${unknownLabelPredictionThreshold}"`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.resetToPrintDetailedDebuggingLogToConsole(true);
    // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
    // -----------------------------------------------------------------------
    const utterances: string[] = utteranceLabelsPairArray.map((x: StructTextLabelStrings) => x.text);
    const predictionStructureWithScoreLabelStringArray: PredictionStructureWithScoreLabelString[] = [];
    if (UtilityDispatcher.isEmptyStringArray(utterances)) {
      return predictionStructureWithScoreLabelStringArray;
    }
    const scoreResultsBatch: any = LabelResolver.scoreBatch(utterances, LabelType.Intent);
    if (utterances.length !== scoreResultsBatch.length) {
      UtilityDispatcher.debuggingNamedThrow2(
        'utterances.length !== scoreResultsBatch.length',
        utterances.length,
        scoreResultsBatch.length,
        'utterances.length',
        'scoreResultsBatch.length');
    }
    UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utterances.length, 'utterances.length');
    UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResultsBatch.length, 'scoreResultsBatch.length');
    if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
      UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utterances, 'utterances');
    }
    if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
      UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResultsBatch, 'scoreResultsBatch');
    }
    // -----------------------------------------------------------------------
    for (let index: number = 0; index < scoreResultsBatch.length; index++) {
      // ---------------------------------------------------------------------
      const utteranceLabels: StructTextLabelStrings = utteranceLabelsPairArray[index];
      const scoreResults: any = scoreResultsBatch[index];
      if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', index, 'index');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', utteranceLabels, 'utteranceLabels');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResults.length, 'scoreResults.length');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchStringLabels()', scoreResults, 'scoreResults');
      }
      // ---------------------------------------------------------------------
      if (utteranceLabels) {
        // -------------------------------------------------------------------
        const utterance: string = utteranceLabels.text;
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreBatchStringLabels() failed to produce a prediction for an empty utterance');
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), utterance=${utterance}`);
        }
        // -------------------------------------------------------------------
        const labels: string[] =
          utteranceLabels.labels;
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
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- }
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
        if (!scoreResults) {
          Utility.debuggingThrow(`UtilityLabelResolver.scoreBatchStringLabels() failed to produce a prediction for utterance "${utterance}"`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResults.length=${scoreResults.length}`);
        }
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResultArray=${Utility.jsonStringify(scoreResultArray)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        // -------------------------------------------------------------------
        const scoreArray: number[] = scoreResultArray.map(
          (x: Result) => x.score);
        const argMax: { 'indexesMax': number[]; 'max': number } =
          ((multiLabelPredictionThreshold > 0) ?
            Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArray, multiLabelPredictionThreshold) :
            Utility.getIndexesOnMaxEntries(scoreArray));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
        }
        // -------------------------------------------------------------------
        const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsPredictedStringArray);
        const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
        }
        const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(labels, labelsPredicted);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), finished scoring for utterance "${utterance}"`);
        }
        // ---- NOTE ---- debugging ouput.
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          for (const result of scoreResults) {
            // eslint-disable-next-line max-depth
            if (result) {
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), result=${Utility.jsonStringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), closesttext=${closesttext}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), score=${score}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label=${Utility.jsonStringify(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.name=${labelname}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), span=${Utility.jsonStringify(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.span.offset=${offset}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(), label.span.length=${length}`);
            }
          }
        }
        if ((predictionStructureWithScoreLabelStringArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(): Added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
        }
        // -------------------------------------------------------------------
      }
      // ---------------------------------------------------------------------
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`UtilityLabelResolver.scoreBatchStringLabels(): Total added predictionStructureWithScoreLabelStringArray.length=${predictionStructureWithScoreLabelStringArray.length}`);
    // Utility.debuggingLog('UtilityLabelResolver.scoreBatchStringLabels(), leaving');
    // -----------------------------------------------------------------------
    return predictionStructureWithScoreLabelStringArray;
  }

  // eslint-disable-next-line max-params
  // eslint-disable-next-line complexity
  public static scoreBatchObjectLabels(
    utteranceLabelsPairArray: StructTextLabelObjects[],
    labelArrayAndMap: ILabelArrayAndMap,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionStructureWithScoreLabelObject[] {
    // -----------------------------------------------------------------------
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), multiLabelPredictionThreshold="${multiLabelPredictionThreshold}"`);
    }
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), unknownLabelPredictionThreshold="${unknownLabelPredictionThreshold}"`);
    }
    Utility.debuggingLog('UtilityLabelResolver.scoreBatchObjectLabels(), entering');
    // -----------------------------------------------------------------------
    // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.resetToPrintDetailedDebuggingLogToConsole(true);
    // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
    // -----------------------------------------------------------------------
    const utterances: string[] = utteranceLabelsPairArray.map((x: StructTextLabelObjects) => x.text);
    const predictionStructureWithScoreLabelObjectArray: PredictionStructureWithScoreLabelObject[] = [];
    if (UtilityDispatcher.isEmptyStringArray(utterances)) {
      return predictionStructureWithScoreLabelObjectArray;
    }
    const scoreResultsBatch: any = LabelResolver.scoreBatch(utterances, LabelType.Entity);
    if (utterances.length !== scoreResultsBatch.length) {
      UtilityDispatcher.debuggingNamedThrow2(
        'utterances.length !== scoreResultsBatch.length',
        utterances.length,
        scoreResultsBatch.length,
        'utterances.length',
        'scoreResultsBatch.length');
    }
    UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utterances.length, 'utterances.length');
    UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResultsBatch.length, 'scoreResultsBatch.length');
    if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
      UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utterances, 'utterances');
    }
    if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
      UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResultsBatch, 'scoreResultsBatch');
    }
    // -----------------------------------------------------------------------
    for (let index: number = 0; index < scoreResultsBatch.length; index++) {
      // ---------------------------------------------------------------------
      const utteranceLabels: StructTextLabelObjects = utteranceLabelsPairArray[index];
      const scoreResults: any = scoreResultsBatch[index];
      if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', index, 'index');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', utteranceLabels, 'utteranceLabels');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResults.length, 'scoreResults.length');
        UtilityDispatcher.debuggingNamedLog1('UtilityLabelResolver.scoreBatchObjectLabels()', scoreResults, 'scoreResults');
      }
      // ---------------------------------------------------------------------
      if (utteranceLabels) {
        // -------------------------------------------------------------------
        const utterance: string = utteranceLabels.text;
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreBatchObjectLabels() failed to produce a prediction for an empty utterance');
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), utterance=${utterance}`);
        }
        // -------------------------------------------------------------------
        const labels: Label[] =
          utteranceLabels.labels;
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsConcatenated=${labelsConcatenated}`);
        }
        const labelsConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsConcatenatedToHtmlTable=${labelsConcatenatedToHtmlTable}`);
        }
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- if (Utility.toPrintDetailedDebuggingLogToConsole) {
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- }
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling LabelResolver.score(), utterance=${utterance}`);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- const scoreResults: any = LabelResolver.score(utterance, LabelType.Entity);
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), after calling LabelResolver.LabelResolver.score(), utterance=${utterance}`);
        if (!scoreResults) {
          Utility.debuggingThrow(`UtilityLabelResolver.scoreBatchObjectLabels() failed to produce a prediction for utterance "${utterance}"`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResults=${Utility.jsonStringify(scoreResults)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResults.length=${scoreResults.length}`);
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), before calling Utility.scoreResultsToArray(), utterance=${utterance}`);
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        // Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), after calling Utility.scoreResultsToArray(), utterance=${utterance}`);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray)=${Utility.jsonStringify(scoreResultArray)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), scoreResultArray.length=${scoreResultArray.length}`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), argMax.indexesMax=${Utility.jsonStringify(argMax.indexesMax)}`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedIndexes=${Utility.jsonStringify(labelsPredictedIndexes)}`);
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredicted=${Utility.jsonStringify(labelsPredicted)}`);
        }
        // -------------------------------------------------------------------
        const labelsPredictedConcatenated: string = Utility.concatenateDataArrayToDelimitedString(
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenated=${labelsPredictedConcatenated}`);
        }
        const labelsPredictedConcatenatedToHtmlTable: string = Utility.concatenateDataArrayToHtmlTable(
          '', // ---- 'Label',
          labelsPredictedStringArray);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenatedToHtmlTable=${labelsPredictedConcatenatedToHtmlTable}`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedConcatenated="${Utility.jsonStringify(labelsPredictedConcatenated)}"`);
        }
        let labelsPredictedEvaluation: number = Utility.evaluateMultiLabelObjectExactPrediction(labels, labelsPredicted);
        if (labelsPredictedEvaluation === PredictionType.TrueNegative) {
          labelsPredictedEvaluation = PredictionType.FalseNegative; // ---- NOTE ----override the default logic, for entity, true negative does not exist.
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
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
        // ---- NOTE-MAY-NOT-HAVE-SCORE-FOR-ALL-LABELS ----   Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
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
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), finished scoring for utterance "${utterance}"`);
        }
        // ---- NOTE ---- debugging ouput.
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          for (const result of scoreResults) {
            // eslint-disable-next-line max-depth
            if (result) {
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), result=${Utility.jsonStringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), closesttext=${closesttext}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), score=${score}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label=${Utility.jsonStringify(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.name=${labelname}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), span=${Utility.jsonStringify(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.span.offset=${offset}`);
              Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(), label.span.length=${length}`);
            }
          }
        }
        if ((predictionStructureWithScoreLabelObjectArray.length % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(): Added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
        }
        // -------------------------------------------------------------------
      }
      // ---------------------------------------------------------------------
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`UtilityLabelResolver.scoreBatchObjectLabels(): Total added predictionStructureWithScoreLabelObjectArray.length=${predictionStructureWithScoreLabelObjectArray.length}`);
    // Utility.debuggingLog('UtilityLabelResolver.scoreBatchObjectLabels(), leaving');
    // -----------------------------------------------------------------------
    return predictionStructureWithScoreLabelObjectArray;
  }

  // eslint-disable-next-line max-params
  // eslint-disable-next-line complexity
  public static scoreStringLabels(
    utteranceLabelsPairArray: StructTextLabelStrings[],
    labelArrayAndMap: ILabelArrayAndMap,
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
        const utterance: string = utteranceLabels.text;
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreStringLabels() failed to produce a prediction for an empty utterance');
        }
        // Utility.debuggingLog(`UtilityLabelResolver.scoreStringLabels(), utterance=${utterance}`);
        // -------------------------------------------------------------------
        const labels: string[] =
          utteranceLabels.labels;
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
    utteranceLabelsPairArray: StructTextLabelObjects[],
    labelArrayAndMap: ILabelArrayAndMap,
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
        const utterance: string = utteranceLabels.text;
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.scoreObjectLabels() failed to produce a prediction for an empty utterance');
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.scoreObjectLabels(), utterance=${utterance}`);
        }
        // -------------------------------------------------------------------
        const labels: Label[] =
          utteranceLabels.labels;
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
