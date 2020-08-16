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
      'stringMap': {[id: string]: number};},
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): PredictionScoreStructure[] {
    const predictionScoreStructureArray: PredictionScoreStructure[] = [];
    for (const utteranceLabels of utteranceLabelsPairArray) {
      if (utteranceLabels) {
        const utterance: string = utteranceLabels[0];
        if (Utility.isEmptyString(utterance)) {
          continue;
        }
        const labels: string[] = utteranceLabels[1];
        const labelsIndexes: number[] = labels.map((x: string) => Utility.safeAccessStringMap(labelArrayAndMap.stringMap, x));
        const labelsConcatenated: string = labels.join(',');
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), before calling score(), utterance=${utterance}`);
        }
        const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
        if (!scoreResults) {
          continue;
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), scoreResults=${JSON.stringify(scoreResults)}`);
        }
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`UtilityLabelResolver.score(), JSON.stringify(scoreResultArray)=${JSON.stringify(scoreResultArray)}`);
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
        if (labelsPredictedScore < unknownLabelPredictionThreshold) {
          labelsPredictedIndexes = [Utility.safeAccessStringMap(labelArrayAndMap.stringMap, Utility.UnknownLabel)];
          labelsPredicted = [Utility.UnknownLabel];
        }
        const labelsPredictedConcatenated: string = labelsPredicted.join(',');
        const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelSubsetPrediction(labels, labelsPredicted);
        const labelsPredictedClosestText: string[] = labelsPredictedIndexes.map((x: number) => scoreResultArray[x].closesttext);
        const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labelsPredictedIndexes,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labels.map((x: string) => Utility.safeAccessStringMap(labelArrayAndMap.stringMap, x)),
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
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
