/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {PredictionScoreStructure} from './predictionscorestructure';

import {LabelType} from './labeltype';
import {Result} from './result';

import {LabelResolver} from './labelresolver';

import {Utility} from './utility';

export class UtilityLabelResolver {
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
    Utility.debuggingLog(`read to call Utility.getLabelResolverSettings(), LabelResolver=${LabelResolver}`);
    return LabelResolver.getConfigJson();
  }

  // eslint-disable-next-line max-params
  public static score(
    utteranceLabelsPairArray: [string, string[]][],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;},
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionScoreStructure[] {
    // ---- NOTE-FOR-DEBUGGING-ONLY ---- Utility.toPrintDetailedDebuggingLogToConsole = true;
    // ---- NOTE-FOR-FUTURE ---- const hasUnknownLabelInMapAlready: boolean = Utility.UnknownLabel in labelArrayAndMap.stringMap;
    const predictionScoreStructureArray: PredictionScoreStructure[] = [];
    for (const utteranceLabels of utteranceLabelsPairArray) {
      if (utteranceLabels) {
        const utterance: string = utteranceLabels[0];
        if (Utility.isEmptyString(utterance)) {
          Utility.debuggingThrow('UtilityLabelResolver.score() failed to produce a prediction for an empty utterance');
        }
        const labels: string[] = utteranceLabels[1];
        const labelsIndexes: number[] = labels.map((x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x));
        const labelsConcatenated: string = labels.join(',');
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), before calling score(), utterance=${utterance}`);
        }
        const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
        if (!scoreResults) {
          Utility.debuggingThrow(`UtilityLabelResolver.score() failed to produce a prediction for utterance "${utterance}"`);
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), scoreResults=${JSON.stringify(scoreResults)}`);
          Utility.debuggingLog(`UtilityLabelResolver.score(), scoreResults.length=${scoreResults.length}`);
        }
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(scoreResultArray)=${JSON.stringify(scoreResultArray)}`);
          Utility.debuggingLog(`UtilityLabelResolver.score(), scoreResultArray.length=${scoreResultArray.length}`);
        }
        const scoreArray: number[] = scoreResultArray.map((x: Result) => x.score);
        const argMax: { 'indexesMax': number[]; 'max': number } =
          ((multiLabelPredictionThreshold > 0) ?
            Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArray, multiLabelPredictionThreshold) :
            Utility.getIndexesOnMaxEntries(scoreArray));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(argMax.indexesMax)=${JSON.stringify(argMax.indexesMax)}`);
        }
        const labelsPredictedScore: number = argMax.max;
        let labelsPredictedIndexes: number[] = argMax.indexesMax;
        let labelsPredicted: string[] = labelsPredictedIndexes.map((x: number) => scoreResultArray[x].label.name);
        let labelsPredictedClosestText: string[] = labelsPredictedIndexes.map((x: number) => scoreResultArray[x].closesttext);
        const unknownPrediction: boolean = labelsPredictedScore < unknownLabelPredictionThreshold;
        if (unknownPrediction) {
          labelsPredictedIndexes = [Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
          labelsPredicted = [Utility.UnknownLabel];
          labelsPredictedClosestText = [];
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(labelsPredictedIndexes)=${JSON.stringify(labelsPredictedIndexes)}`);
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(labelsPredicted)=${JSON.stringify(labelsPredicted)}`);
        }
        const labelsPredictedConcatenated: string = labelsPredicted.join(',');
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(labelsPredictedConcatenated)="${JSON.stringify(labelsPredictedConcatenated)}"`);
        }
        const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(labels, labelsPredicted);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), labelsPredictedEvaluation="${labelsPredictedEvaluation}"`);
        }
        const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labelsPredictedIndexes,
          unknownLabelPredictionThreshold,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), predictedScoreStructureHtmlTable="${predictedScoreStructureHtmlTable}"`);
        }
        const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labels.map((x: string) => Utility.carefullyAccessStringMap(labelArrayAndMap.stringMap, x)),
          unknownLabelPredictionThreshold,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), labelsScoreStructureHtmlTable="${labelsScoreStructureHtmlTable}"`);
        }
        predictionScoreStructureArray.push(new PredictionScoreStructure(
          utterance,
          labelsPredictedEvaluation,
          labels,
          labelsConcatenated,
          labelsIndexes,
          labelsPredicted,
          labelsPredictedConcatenated,
          labelsPredictedScore,
          labelsPredictedIndexes,
          labelsPredictedClosestText,
          scoreResultArray,
          scoreArray,
          predictedScoreStructureHtmlTable,
          labelsScoreStructureHtmlTable));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), finished scoring for utterance "${utterance}"`);
        }
        // ---- NOTE ---- debugging ouput.
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          for (const result of scoreResults) {
            // eslint-disable-next-line max-depth
            if (result) {
              Utility.debuggingLog(`UtilityLabelResolver.score(), result=${JSON.stringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`UtilityLabelResolver.score(), closesttext=${closesttext}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), score=${score}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(label)=${JSON.stringify(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), label.name=${labelname}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(span)=${JSON.stringify(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), label.span.offset=${offset}`);
              Utility.debuggingLog(`UtilityLabelResolver.score(), label.span.length=${length}`);
            }
          }
        }
      }
    }
    return predictionScoreStructureArray;
  }
}
