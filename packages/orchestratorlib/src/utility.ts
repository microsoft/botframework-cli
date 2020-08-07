/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs';
import * as path from 'path';

import {BinaryConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {Example} from './example';
import {Label} from './label';
import {LabelType} from './labeltype';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Result} from './result';
import {ScoreStructure} from './scorestructure';
import {Span} from './span';

import {EvaluationSummaryTemplateHtml} from './resources/evaluation-summary-template-html';

export class Utility {
  public static toPrintDebuggingLogToConsole: boolean = true;

  public static toPrintDetailedDebuggingLogToConsole: boolean = false;

  public static readonly DefaultAmbiguousClosenessParameter: number = 0.2;

  public static readonly DefaultLowConfidenceScoreThresholdParameter: number = 0.5;

  public static readonly DefaultMultiLabelPredictionThresholdParameter: number = 1.0;

  public static readonly DefaultUnknownLabelPredictionThresholdParameter: number = 0.3;

  public static readonly UnknownLabel: string = 'UNKNOWN';

  public static readonly UnknownLabelSet: Set<string> = new Set<string>(['', 'NONE', Utility.UnknownLabel]);

  // eslint-disable-next-line max-params
  public static processUtteranceMultiLabelTsv(
    lines: string[],
    utteranceLabelsMap: { [id: string]: string[] },
    utterancesLabelsPredictedMap: { [id: string]: string[] },
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
    utteranceLabelsMap: { [id: string]: string[] },
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const existingLabels: string[] = utteranceLabelsMap[utterance];
    if (existingLabels) {
      if (!Utility.addIfNewLabel(label, existingLabels)) {
        Utility.insertStringPairToStringIdStringSetNativeMap(
          utterance,
          label,
          utteranceLabelDuplicateMap);
      }
    } else {
      utteranceLabelsMap[utterance] = [label];
    }
  }

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
    return Utility.getLabelResolverSettings();
  }

  public static getLabelResolverSettings(): any {
    const labelResolverConfig: any = LabelResolver.getConfigJson();
    return labelResolverConfig;
  }

  public static addIfNewLabel(newLabel: string, labels: string[]): boolean {
    for (const label of labels) {
      if (label === newLabel) {
        return false;
      }
    }
    labels.push(newLabel);
    return true;
  }

  public static parseLabelResolverLabelEntry(
    label: string,
    intentLabelArray: string[]): string {
    label = label.trim();
    if (!Utility.isEmptyString(label)) {
      if (Number.isInteger(Number(label))) {
        const labelIndex: number = Number(label);
        const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
        const currentLabelArrayAndMap: {
          'stringArray': string[];
          'stringMap': {[id: string]: number};} =
          Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
        const labelArray: string[] = currentLabelArrayAndMap.stringArray;
        // eslint-disable-next-line max-depth
        if ((labelIndex < 0) || (labelIndex >= labelArray.length)) {
          const errorMessage: string =
            `The label index "${labelIndex}" you entered is not in range, label-index map: ${Utility.jsonStringify(currentLabelArrayAndMap.stringMap)}`;
          return errorMessage;
        }
        intentLabelArray.push(labelArray[labelIndex]);
      } else {
        intentLabelArray.push(label);
      }
    }
    return '';
  }

  public static generateEmptyEvaluationReport(): {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': {[id: string]: number};};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': { [id: string]: string[] };
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': {[id: number]: number};
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
        'confusionMatrix': MultiLabelConfusionMatrix;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'scoringConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;}; };
    'scoreStructureArray': ScoreStructure[];
    'scoreOutputLines': string[][];
    } {
    const evaluationOutput: {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
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
          'confusionMatrix': MultiLabelConfusionMatrix;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'scoringConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;}; };
      'scoreStructureArray': ScoreStructure[];
      'scoreOutputLines': string[][];
    } = {
      evaluationReportLabelUtteranceStatistics: {
        evaluationSummary: '',
        labelArrayAndMap: {
          stringArray: [],
          stringMap: {}},
        labelStatisticsAndHtmlTable: {
          labelUtterancesMap: {},
          labelUtterancesTotal: 0,
          labelStatistics: [],
          labelStatisticsHtml: ''},
        utteranceStatisticsAndHtmlTable: {
          utteranceStatisticsMap: {},
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
          confusionMatrix: new MultiLabelConfusionMatrix([], {}),
          multiLabelConfusionMatrixSubset: new MultiLabelConfusionMatrixSubset([], {}),
          scoringConfusionMatrixOutputLines: [],
          confusionMatrixMetricsHtml: '',
          confusionMatrixAverageMetricsHtml: ''}},
      scoreStructureArray: [],
      scoreOutputLines: [],
    };
    return evaluationOutput;
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReportFiles(
    stringArray: string[],
    scoreOutputLines: string[][],
    evaluationSummary: string,
    labelsOutputFilename: string,
    evaluationSetScoreOutputFilename: string,
    evaluationSetSummaryOutputFilename: string): void {
    // ---- NOTE ---- output the labels by their index order to a file.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.storeDataArraysToTsvFile()');
    Utility.storeDataArraysToTsvFile(
      labelsOutputFilename,
      stringArray.map((x: string) => [x]));
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.storeDataArraysToTsvFile()');
    // ---- NOTE ---- produce a score TSV file.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.storeDataArraysToTsvFile()');
    Utility.storeDataArraysToTsvFile(
      evaluationSetScoreOutputFilename,
      scoreOutputLines);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finishing calling Utility.storeDataArraysToTsvFile');
    // ---- NOTE ---- produce the evaluation summary file.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.dumpFile()');
    Utility.dumpFile(
      evaluationSetSummaryOutputFilename,
      evaluationSummary);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.dumpFile()');
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReport(
    trainingSetLabels: string[],
    utteranceLabelsMap: { [id: string]: string[] },
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    ambiguousCloseness: number,
    lowConfidenceScoreThreshold: number,
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'evaluationReportLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
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
          'confusionMatrix': MultiLabelConfusionMatrix;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'scoringConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;}; };
      'scoreStructureArray': ScoreStructure[];
      'scoreOutputLines': string[][];
    } {
    // ---- NOTE ---- generate evaluation report before calling the score() function.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateEvaluationReportLabelUtteranceStatistics()');
    const evaluationReportLabelUtteranceStatistics: {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': {[id: string]: number};};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': { [id: string]: string[] };
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': {[id: number]: number};
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'utterancesMultiLabelArrays': [string, string][];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string;
    } = Utility.generateEvaluationReportLabelUtteranceStatistics(
      trainingSetLabels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      // ---- multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateEvaluationReportLabelUtteranceStatistics()');
    // ---- NOTE ---- collect utterance prediction and scores.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.score()');
    const utteranceLabelsPairArray: [string, string[]][] = Object.entries(utteranceLabelsMap);
    const scoreStructureArray: ScoreStructure[] = Utility.score(
      utteranceLabelsPairArray,
      evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
      multiLabelPredictionThreshold,
      unknownLabelPredictionThreshold);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.score()');
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
        'confusionMatrix': MultiLabelConfusionMatrix;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'scoringConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;};
    } = Utility.generateEvaluationReportAnalyses(
      evaluationReportLabelUtteranceStatistics.evaluationSummary,
      evaluationReportLabelUtteranceStatistics.labelArrayAndMap,
      scoreStructureArray,
      ambiguousCloseness,
      lowConfidenceScoreThreshold);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateEvaluationReportAnalyses()');
    // ---- NOTE ---- generate score output file lines.
    Utility.debuggingLog('Utility.generateEvaluationReport(), ready to call Utility.generateScoreOutputLines()');
    const scoreOutputLines: string[][] = Utility.generateScoreOutputLines(
      scoreStructureArray);
    Utility.debuggingLog('Utility.generateEvaluationReport(), finished calling Utility.generateScoreOutputLines()');
    // ---- NOTE ---- debugging ouput.
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray)}`);
      Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringMap)}`);
      const labels: any = LabelResolver.getLabels(LabelType.Intent);
      Utility.debuggingLog(`Utility.generateEvaluationReport(), JSON.stringify(labels)=${JSON.stringify(labels)}`);
    }
    // ---- NOTE ---- return
    return {
      evaluationReportLabelUtteranceStatistics,
      evaluationReportAnalyses,
      scoreStructureArray,
      scoreOutputLines};
  }

  // eslint-disable-next-line max-params
  public static generateEvaluationReportLabelUtteranceStatistics(
    trainingSetLabels: string[],
    utteranceLabelsMap: { [id: string]: string[] },
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    // ---- multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': {[id: string]: number};};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': { [id: string]: string[] };
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': {[id: number]: number};
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
      'stringMap': {[id: string]: number};} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(trainingSetLabels);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
    if (Utility.isEmptyStringArray(labelArrayAndMap.stringArray)) {
      Utility.debuggingThrow('there is no label, something wrong?');
    }
    // ---- NOTE ---- as the unknown threshold is greater than 0, the score function can make an UNKNOWN prediction.
    if (unknownLabelPredictionThreshold > 0) {
      if (!(Utility.UnknownLabel in labelArrayAndMap.stringMap)) {
        labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
        labelArrayAndMap.stringMap[Utility.UnknownLabel] = labelArrayAndMap.stringArray.length - 1;
      }
    }
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringArray)=${JSON.stringify(labelArrayAndMap.stringArray)}`);
    Utility.debuggingLog(`Utility.generateEvaluationReportLabelUtteranceStatistics(), JSON.stringify(labelArrayAndMap.stringMap)=${JSON.stringify(labelArrayAndMap.stringMap)}`);
    // ---- NOTE ---- load the evaluation summary template.
    let evaluationSummary: string = EvaluationSummaryTemplateHtml.html;
    // ---- NOTE ---- generate label statistics.
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': { [id: string]: string[] };
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string;
    } = Utility.generateLabelStatisticsAndHtmlTable(
      utteranceLabelsMap,
      labelArrayAndMap);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateLabelStatisticsAndHtmlTable()');
    // ---- NOTE ---- generate utterance statistics
    const utteranceStatisticsAndHtmlTable: {
      'utteranceStatisticsMap': {[id: number]: number};
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } = Utility.generateUtteranceStatisticsAndHtmlTable(
        utteranceLabelsMap);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finish calling Utility.generateUtteranceStatisticsAndHtmlTable()');
    // ---- NOTE ---- create the evaluation INTENTUTTERANCESTATISTICS summary from template.
    const intentsUtterancesStatisticsHtml: string =
      labelStatisticsAndHtmlTable.labelStatisticsHtml + utteranceStatisticsAndHtmlTable.utteranceStatisticsHtml;
    evaluationSummary = evaluationSummary.replace('{INTENTUTTERANCESTATISTICS}', intentsUtterancesStatisticsHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finished generating {INTENTUTTERANCESTATISTICS} content');
    // ---- NOTE ---- generate duplicate report.
    const utterancesMultiLabelArrays: [string, string][] = Object.entries(utteranceLabelsMap).filter(
      (x: [string, string[]]) => x[1].length > 1).map((x: [string, string[]]) => [x[0], x[1].join(',')]);
    const utterancesMultiLabelArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Multi-label utterances and their intents',
      utterancesMultiLabelArrays,
      ['Utterance', 'Intents']);
    // ---- NOTE ---- generate duplicate report.
    const utteranceLabelDuplicateHtml: string = Utility.convertMapSetToIndexedHtmlTable(
      'Duplicate utterance and intent pairs',
      utteranceLabelDuplicateMap,
      ['Utterance', 'Intent']);
    // ---- NOTE ---- create the evaluation DUPLICATES summary from template.
    const duplicateStatisticsHtml: string =
      utterancesMultiLabelArraysHtml + utteranceLabelDuplicateHtml;
    evaluationSummary = evaluationSummary.replace('{DUPLICATES}', duplicateStatisticsHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportLabelUtteranceStatistics(), finished generating {DUPLICATES} content');
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
      'stringMap': {[id: string]: number};},
    scoreStructureArray: ScoreStructure[],
    ambiguousCloseness: number,
    lowConfidenceScoreThreshold: number): {
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
        'confusionMatrix': MultiLabelConfusionMatrix;
        'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
        'scoringConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;};
    } {
    // ---- NOTE ---- generate ambiguous HTML.
    const ambiguousAnalysis: {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } = Utility.generateAmbiguousStatisticsAndHtmlTable(
      scoreStructureArray,
      ambiguousCloseness);
    evaluationSummary = evaluationSummary.replace('{AMBIGUOUS}', ambiguousAnalysis.scoringAmbiguousUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {AMBIGUOUS} content');
    // ---- NOTE ---- generate misclassified HTML.
    const misclassifiedAnalysis: {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } = Utility.generateMisclassifiedStatisticsAndHtmlTable(
      scoreStructureArray);
    evaluationSummary = evaluationSummary.replace('{MISCLASSIFICATION}', misclassifiedAnalysis.scoringMisclassifiedUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {MISCLASSIFICATION} content');
    // ---- NOTE ---- generate low-confidence HTML.
    const lowConfidenceAnalysis: {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } = Utility.generateLowConfidenceStatisticsAndHtmlTable(
      scoreStructureArray,
      lowConfidenceScoreThreshold);
    evaluationSummary = evaluationSummary.replace('{LOWCONFIDENCE}', lowConfidenceAnalysis.scoringLowConfidenceUtterancesArraysHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {LOWCONFIDENCE} content');
    // ---- NOTE ---- produce confusion matrix result.
    const confusionMatrixAnalysis: {
      'confusionMatrix': MultiLabelConfusionMatrix;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'scoringConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
    } = Utility.generateConfusionMatrixMetricsAndHtmlTable(
      scoreStructureArray,
      labelArrayAndMap);
    evaluationSummary = evaluationSummary.replace(
      '{MODELEVALUATION}',
      confusionMatrixAnalysis.confusionMatrixMetricsHtml + confusionMatrixAnalysis.confusionMatrixAverageMetricsHtml);
    Utility.debuggingLog('Utility.generateEvaluationReportAnalyses(), finished generating {MODELEVALUATION} content');
    // ---- NOTE ---- return
    return {
      evaluationSummary,
      ambiguousAnalysis,
      misclassifiedAnalysis,
      lowConfidenceAnalysis,
      confusionMatrixAnalysis};
  }

  public static generateScoreOutputLines(
    scoreStructureArray: ScoreStructure[]): string[][] {
    const scoreOutputLines: string[][] = [];
    for (const scoreStructure of scoreStructureArray) {
      if (scoreStructure) {
        const scoreArray: number[] = scoreStructure.scoreResultArray.map((x: Result) => x.score);
        const labelConcatenated: string = scoreStructure.labels.join(',');
        const labelPredictedConcatenated: string = scoreStructure.labelsPredicted.join(',');
        const scoreArrayConcatenated: string = scoreArray.join('\t');
        const scoreOutputLine: string[] = [
          scoreStructure.utterance,
          labelConcatenated,
          labelPredictedConcatenated,
          scoreArrayConcatenated,
        ];
        scoreOutputLines.push(scoreOutputLine);
      }
    }
    return scoreOutputLines;
  }

  public static generateConfusionMatrixMetricsAndHtmlTable(
    scoreStructureArray: ScoreStructure[],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': {[id: string]: number};}): {
      'confusionMatrix': MultiLabelConfusionMatrix;
      'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
      'scoringConfusionMatrixOutputLines': string[][];
      'confusionMatrixMetricsHtml': string;
      'confusionMatrixAverageMetricsHtml': string;
    } {
    // -----------------------------------------------------------------------
    const scoringConfusionMatrixOutputLines: string[][] = [];
    const confusionMatrix: MultiLabelConfusionMatrix = new MultiLabelConfusionMatrix(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    const multiLabelConfusionMatrixSubset: MultiLabelConfusionMatrixSubset = new MultiLabelConfusionMatrixSubset(
      labelArrayAndMap.stringArray,
      labelArrayAndMap.stringMap);
    for (const scoreStructure of scoreStructureArray) {
      if (scoreStructure) {
        confusionMatrix.addInstanceByLabelIndexes(scoreStructure.labelsIndexes, scoreStructure.labelsPredictedIndexes);
        multiLabelConfusionMatrixSubset.addInstanceByLabelIndexes(scoreStructure.labelsIndexes, scoreStructure.labelsPredictedIndexes);
      }
    }
    const binaryConfusionMatrices: BinaryConfusionMatrix[] = confusionMatrix.getBinaryConfusionMatrices();
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices.length=${binaryConfusionMatrices.length}`);
    for (let i: number = 0; i < binaryConfusionMatrices.length; i++) {
      const label: string = labelArrayAndMap.stringArray[i];
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
      const scoringConfusionMatrixOutputLine: any[] = [
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
      scoringConfusionMatrixOutputLines.push(scoringConfusionMatrixOutputLine);
      Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices[${i}].getTotal()         =${binaryConfusionMatrices[i].getTotal()}`);
      Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices[${i}].getTruePositives() =${binaryConfusionMatrices[i].getTruePositives()}`);
      Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices[${i}].getFalsePositives()=${binaryConfusionMatrices[i].getFalsePositives()}`);
      Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices[${i}].getTrueNegatives() =${binaryConfusionMatrices[i].getTrueNegatives()}`);
      Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), binaryConfusionMatrices[${i}].getFalseNegatives()=${binaryConfusionMatrices[i].getFalseNegatives()}`);
    }
    const confusionMatrixMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Confusion matrix metrics',
      scoringConfusionMatrixOutputLines,
      ['Intent', 'Precision', 'Recall', 'F1', 'Accuracy', '#TruePositives', '#FalsePositives', '#TrueNegatives', '#FalseNegatives', 'Support', 'Total']);
    // -----------------------------------------------------------------------
    const scoringConfusionMatrixAverageOutputLines: string[][] = [];
    const microAverageMetrics: {
      'averagePrecisionRecallF1Accuracy': number;
      'truePositives': number;
      'falsePositives': number;
      'falseNegatives': number;
      'total': number;
    } = confusionMatrix.getMicroAverageMetrics();
    const scoringConfusionMatrixOutputLineMicroAverage: any[] = [
      'Micro-Average',
      Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-label, there is no negative, so calculation of precision is equal to that of recall.
      Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-label, there is no negative, so calculation of precision is equal to that of recall.
      Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-label, there is no negative, so calculation of precision is equal to that of recall.
      Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-label, there is no negative, so calculation of precision is equal to that of recall.
      microAverageMetrics.truePositives,
      'N/A', // ---- NOTE ---- in multi-label, there is no negative, so calculation of precision is equal to that of recall.
      'N/A',
      microAverageMetrics.falseNegatives,
      'N/A',
      microAverageMetrics.total,
    ];
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineMicroAverage);
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
    } = confusionMatrix.getMacroAverageMetrics();
    const scoringConfusionMatrixOutputLineMacroAverage: any[] = [
      'Macro-Average',
      Utility.round(macroAverageMetrics.averagePrecision),
      Utility.round(macroAverageMetrics.averageRecall),
      Utility.round(macroAverageMetrics.averageF1Score),
      Utility.round(macroAverageMetrics.averageAccuracy),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageTruePositives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageFalsePositives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageTrueNegatives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageFalseNegatives),
      'N/A', // ---- Utility.round(macroAverageMetrics.averageSupport),
      'N/A', // ---- macroAverageMetrics.total,
    ];
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineMacroAverage);
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
    } = confusionMatrix.getSummationMacroAverageMetrics();
    const scoringConfusionMatrixOutputLineSummationMacroAverage: any[] = [
      'Summation Macro-Average',
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
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineSummationMacroAverage);
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
    } = confusionMatrix.getPositiveSupportLabelMacroAverageMetrics();
    const scoringConfusionMatrixOutputLinePositiveSupportLabelMacroAverage: any[] = [
      'Positive Support Macro-Average',
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
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLinePositiveSupportLabelMacroAverage);
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
    } = confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics();
    const scoringConfusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage: any[] = [
      'Positive Support Summation Macro-Average',
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
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage);
    const weightedMacroAverageMetrics: {
      'averagePrecision': number;
      'averageRecall': number;
      'averageF1Score': number;
      'averageAccuracy': number;
      'averageSupport': number;
      'total': number;
    } = confusionMatrix.getWeightedMacroAverageMetrics();
    const scoringConfusionMatrixOutputLineWeightedMacroAverage: any[] = [
      'Weighted Macro-Average',
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
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineWeightedMacroAverage);
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
    } = confusionMatrix.getSummationWeightedMacroAverageMetrics();
    const scoringConfusionMatrixOutputLineSummationWeightedMacroAverage: any[] = [
      'Weighted Summation Macro-Average',
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
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineSummationWeightedMacroAverage);
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
    } = multiLabelConfusionMatrixSubset.getMacroAverageMetrics();
    const scoringConfusionMatrixOutputLineSubsetMacroAggregate: any[] = [
      'Multi-Label Subset Aggregate',
      Utility.round(subsetMacroAggregateMetrics.averagePrecision),
      Utility.round(subsetMacroAggregateMetrics.averageRecall),
      Utility.round(subsetMacroAggregateMetrics.averageF1Score),
      Utility.round(subsetMacroAggregateMetrics.averageAccuracy),
      Utility.round(subsetMacroAggregateMetrics.averageTruePositives),
      Utility.round(subsetMacroAggregateMetrics.averageFalsePositives),
      Utility.round(subsetMacroAggregateMetrics.averageTrueNegatives),
      Utility.round(subsetMacroAggregateMetrics.averageFalseNegatives),
      Utility.round(subsetMacroAggregateMetrics.averageSupport),
      subsetMacroAggregateMetrics.total,
    ];
    scoringConfusionMatrixAverageOutputLines.push(scoringConfusionMatrixOutputLineSubsetMacroAggregate);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(confusionMatrix.getMicroAverageMetrics())=${JSON.stringify(confusionMatrix.getMicroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(confusionMatrix.getMacroAverageMetrics())=${JSON.stringify(confusionMatrix.getMacroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(confusionMatrix.getWeightedMacroAverageMetrics())=${JSON.stringify(confusionMatrix.getWeightedMacroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(multiLabelConfusionMatrixSubset.getMicroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getMicroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(multiLabelConfusionMatrixSubset.getMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getMacroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), JSON.stringify(multiLabelConfusionMatrixSubset.getWeightedMacroAverageMetrics())=${JSON.stringify(multiLabelConfusionMatrixSubset.getWeightedMacroAverageMetrics())}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()         =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives() =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives()}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives()}`);
    Utility.debuggingLog(`Utility.generateConfusionMatrixMetricsAndHtmlTable(), multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()}`);
    Utility.debuggingLog('Utility.generateConfusionMatrixMetricsAndHtmlTable(), finished generating {MODELEVALUATION} content');
    const confusionMatrixAverageMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Average confusion matrix metrics',
      scoringConfusionMatrixAverageOutputLines,
      ['Type', 'Precision', 'Recall', 'F1', 'Accuracy', '#TruePositives', '#FalsePositives', '#TrueNegatives', '#FalseNegatives', 'Support', 'Total']);
    // -----------------------------------------------------------------------
    return {confusionMatrix, multiLabelConfusionMatrixSubset, scoringConfusionMatrixOutputLines, confusionMatrixMetricsHtml, confusionMatrixAverageMetricsHtml};
  }

  public static generateLowConfidenceStatisticsAndHtmlTable(
    scoreStructureArray: ScoreStructure[],
    lowConfidenceScoreThreshold: number): {
      'scoringLowConfidenceUtterancesArrays': string[][];
      'scoringLowConfidenceUtterancesArraysHtml': string;
      'scoringLowConfidenceUtterancesSimpleArrays': string[][];
    } {
    const scoringLowConfidenceUtterancesArrays: string[][] = [];
    const scoringLowConfidenceUtterancesSimpleArrays: string[][] = [];
    for (const scoreStructure of scoreStructureArray.filter((x: ScoreStructure) => ((x.labelsPredictedEvaluation === 0) || (x.labelsPredictedEvaluation === 3)) && (x.labelsPredictedScore < lowConfidenceScoreThreshold))) {
      if (scoreStructure) {
        const labelsScoreStructureHtmlTable: string = scoreStructure.labelsScoreStructureHtmlTable;
        const labelsPredictedConcatenated: string = scoreStructure.labelsPredictedConcatenated;
        const scoringLowConfidenceUtterancesArray: any[] = [
          scoreStructure.utterance,
          labelsScoreStructureHtmlTable,
          labelsPredictedConcatenated,
        ];
        scoringLowConfidenceUtterancesArrays.push(scoringLowConfidenceUtterancesArray);
        const labelsConcatenated: string = scoreStructure.labelsConcatenated;
        const scoringLowConfidenceUtterancesSimpleArray: any[] = [
          scoreStructure.utterance,
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        scoringLowConfidenceUtterancesSimpleArrays.push(scoringLowConfidenceUtterancesSimpleArray);
      }
    }
    const scoringLowConfidenceUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Low confidence utterances and their intents',
      scoringLowConfidenceUtterancesArrays,
      ['Utterance', 'Intents', 'Predictions']);
    return {scoringLowConfidenceUtterancesArrays, scoringLowConfidenceUtterancesArraysHtml, scoringLowConfidenceUtterancesSimpleArrays};
  }

  public static generateMisclassifiedStatisticsAndHtmlTable(
    scoreStructureArray: ScoreStructure[]): {
      'scoringMisclassifiedUtterancesArrays': string[][];
      'scoringMisclassifiedUtterancesArraysHtml': string;
      'scoringMisclassifiedUtterancesSimpleArrays': string[][];
    } {
    const scoringMisclassifiedUtterancesArrays: string[][] = [];
    const scoringMisclassifiedUtterancesSimpleArrays: string[][] = [];
    for (const scoreStructure of scoreStructureArray.filter((x: ScoreStructure) => (x.labelsPredictedEvaluation === 1) || (x.labelsPredictedEvaluation === 2))) {
      if (scoreStructure) {
        const labelsScoreStructureHtmlTable: string = scoreStructure.labelsScoreStructureHtmlTable;
        const predictedScoreStructureHtmlTable: string = scoreStructure.predictedScoreStructureHtmlTable;
        const scoringMisclassifiedUtterancesArray: string[] = [
          scoreStructure.utterance,
          labelsScoreStructureHtmlTable,
          predictedScoreStructureHtmlTable,
        ];
        scoringMisclassifiedUtterancesArrays.push(scoringMisclassifiedUtterancesArray);
        const labelsConcatenated: string = scoreStructure.labelsConcatenated;
        const labelsPredictedConcatenated: string = scoreStructure.labelsPredictedConcatenated;
        const scoringMisclassifiedUtterancesSimpleArray: string[] = [
          scoreStructure.utterance,
          labelsConcatenated,
          labelsPredictedConcatenated,
        ];
        scoringMisclassifiedUtterancesSimpleArrays.push(scoringMisclassifiedUtterancesSimpleArray);
      }
    }
    const scoringMisclassifiedUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Misclassified utterances and their intents',
      scoringMisclassifiedUtterancesArrays,
      ['Utterance', 'Intents', 'Predictions']);
    return {scoringMisclassifiedUtterancesArrays, scoringMisclassifiedUtterancesArraysHtml, scoringMisclassifiedUtterancesSimpleArrays};
  }

  public static generateAmbiguousStatisticsAndHtmlTable(
    scoreStructureArray: ScoreStructure[],
    ambiguousCloseness: number): {
      'scoringAmbiguousUtterancesArrays': string[][];
      'scoringAmbiguousUtterancesArraysHtml': string;
      'scoringAmbiguousUtteranceSimpleArrays': string[][];
    } {
    const scoringAmbiguousUtterancesArrays: string[][] = [];
    const scoringAmbiguousUtteranceSimpleArrays: string[][] = [];
    for (const scoreStructure of scoreStructureArray.filter((x: ScoreStructure) => ((x.labelsPredictedEvaluation === 0) || (x.labelsPredictedEvaluation === 3)))) {
      if (scoreStructure) {
        const predictedScore: number = scoreStructure.labelsPredictedScore;
        const scoreArray: number[] = scoreStructure.scoreArray;
        const scoreArrayAmbiguous: number[][] = scoreArray.map(
          (x: number, index: number) => [x, index, Math.abs((predictedScore - x) / predictedScore)]).filter(
          (x: number[]) => ((x[2] < ambiguousCloseness) && (x[2] > 0))).map(
          (x: number[]) => [x[1], x[0], x[2]]);
        if (scoreArrayAmbiguous.length > 0) {
          const labelsScoreStructureHtmlTable: string = scoreStructure.labelsScoreStructureHtmlTable;
          const labelsPredictedConcatenated: string = scoreStructure.labelsPredictedConcatenated;
          const ambiguousScoreStructureHtmlTable: string = Utility.selectedScoreStructureToHtmlTable(
            scoreStructure,
            '',
            ['Label', 'Score', 'Closest Example'],
            ['30%', '10%', '60%'],
            scoreArrayAmbiguous.map((x: number[]) => x[0]));
          const scoringAmbiguousUtterancesArray: string[] = [
            scoreStructure.utterance,
            labelsScoreStructureHtmlTable,
            labelsPredictedConcatenated,
            ambiguousScoreStructureHtmlTable,
          ];
          const labelsConcatenated: string = scoreStructure.labelsConcatenated;
          scoringAmbiguousUtterancesArrays.push(scoringAmbiguousUtterancesArray);
          const scoringAmbiguousUtterancesSimpleArray: string[] = [
            scoreStructure.utterance,
            labelsConcatenated,
            labelsPredictedConcatenated,
          ];
          scoringAmbiguousUtteranceSimpleArrays.push(scoringAmbiguousUtterancesSimpleArray);
        }
      }
    }
    const scoringAmbiguousUtterancesArraysHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
      'Ambiguous utterances and their intents',
      scoringAmbiguousUtterancesArrays,
      ['Utterance', 'Intents', 'Predictions', 'Close Predictions']);
    return {scoringAmbiguousUtterancesArrays, scoringAmbiguousUtterancesArraysHtml, scoringAmbiguousUtteranceSimpleArrays};
  }

  // eslint-disable-next-line max-params
  public static score(
    utteranceLabelsPairArray: [string, string[]][],
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': {[id: string]: number};},
    multiLabelPredictionThreshold: number,
    unknownLabelPredictionThreshold: number): ScoreStructure[] {
    const scoreStructureArray: ScoreStructure[] = [];
    for (const utteranceLabels of utteranceLabelsPairArray) {
      if (utteranceLabels) {
        const utterance: string = utteranceLabels[0];
        if (Utility.isEmptyString(utterance)) {
          continue;
        }
        const labels: string[] = utteranceLabels[1];
        const labelsIndexes: number[] = labels.map((x: string) => labelArrayAndMap.stringMap[x]);
        const labelsConcatenated: string = labels.join(',');
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`Utility.score(), before calling score(), utterance=${utterance}`);
        }
        const scoreResults: any = LabelResolver.score(utterance, LabelType.Intent);
        if (!scoreResults) {
          continue;
        }
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`Utility.score(), scoreResults=${JSON.stringify(scoreResults)}`);
        }
        const scoreResultArray: Result[] = Utility.scoreResultsToArray(scoreResults, labelArrayAndMap.stringMap);
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`Utility.score(), JSON.stringify(scoreResultArray)=${JSON.stringify(scoreResultArray)}`);
        }
        const scoreArray: number[] = scoreResultArray.map((x: Result) => x.score);
        const argMax: { 'indexesMax': number[]; 'max': number } =
          ((multiLabelPredictionThreshold > 0) ?
            Utility.getIndexesOnMaxOrEntriesOverThreshold(scoreArray, multiLabelPredictionThreshold) :
            Utility.getIndexesOnMaxEntries(scoreArray));
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`Utility.score(), JSON.stringify(argMax.indexesMax)=${JSON.stringify(argMax.indexesMax)}`);
        }
        const labelsPredictedScore: number = argMax.max;
        let labelsPredictedIndexes: number[] = argMax.indexesMax;
        let labelsPredicted: string[] = labelsPredictedIndexes.map((x: number) => scoreResultArray[x].label.name);
        if (labelsPredictedScore < unknownLabelPredictionThreshold) {
          labelsPredictedIndexes = [labelArrayAndMap.stringMap[Utility.UnknownLabel]];
          labelsPredicted = [Utility.UnknownLabel];
        }
        const labelsPredictedConcatenated: string = labelsPredicted.join(',');
        const labelsPredictedEvaluation: number = Utility.evaluateMultiLabelPrediction(labels, labelsPredicted);
        const labelsPredictedClosestText: string[] = labelsPredictedIndexes.map((x: number) => scoreResultArray[x].closesttext);
        const predictedScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labelsPredictedIndexes,
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        const labelsScoreStructureHtmlTable: string = Utility.selectedScoreResultsToHtmlTable(
          scoreResultArray,
          labels.map((x: string) => labelArrayAndMap.stringMap[x]),
          '',
          ['Label', 'Score', 'Closest Example'],
          ['30%', '10%', '60%']);
        scoreStructureArray.push(new ScoreStructure(
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
              Utility.debuggingLog(`Utility.score(), result=${JSON.stringify(result)}`);
              const closesttext: string = result.closesttext;
              const score: number = result.score;
              const label: any = result.label;
              const labelname: string = label.name;
              const labeltype: LabelType = label.labeltype;
              const span: any = label.span;
              const offset: number = span.offset;
              const length: number = span.length;
              Utility.debuggingLog(`Utility.score(), closesttext=${closesttext}`);
              Utility.debuggingLog(`Utility.score(), score=${score}`);
              Utility.debuggingLog(`Utility.score(), JSON.stringify(label)=${JSON.stringify(label)}`);
              Utility.debuggingLog(`Utility.score(), Object.keys(label)=${Object.keys(label)}`);
              Utility.debuggingLog(`Utility.score(), label.name=${labelname}`);
              Utility.debuggingLog(`Utility.score(), label.labeltype=${labeltype}`);
              Utility.debuggingLog(`Utility.score(), JSON.stringify(span)=${JSON.stringify(span)}`);
              Utility.debuggingLog(`Utility.score(), Object.keys(span)=${Object.keys(span)}`);
              Utility.debuggingLog(`Utility.score(), label.span.offset=${offset}`);
              Utility.debuggingLog(`Utility.score(), label.span.length=${length}`);
            }
          }
        }
      }
    }
    return scoreStructureArray;
  }

  public static generateUtteranceStatisticsAndHtmlTable(
    utteranceLabelsMap: { [id: string]: string[] }): {
      'utteranceStatisticsMap': {[id: number]: number};
      'utteranceStatistics': [string, number][];
      'utteranceCount': number;
      'utteranceStatisticsHtml': string; } {
    const utteranceStatisticsMap: {[id: number]: number} = Object.entries(utteranceLabelsMap).map(
      (x: [string, string[]]) => [1, x[1].length]).reduce(
      (accumulant: {[id: number]: number}, entry: number[]) => {
        const count: number = entry[0];
        const key: number = entry[1];
        if (key in accumulant) {
          accumulant[key] += count;
        } else {
          accumulant[key] = count;
        }
        return accumulant;
      }, {});
    const utteranceStatistics: [string, number][] = [...Object.entries(utteranceStatisticsMap)].sort(
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
    const utteranceStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
      'Utterance statistics',
      utteranceStatistics,
      ['# Multi-Labels', 'Utterance Count']);
    return {utteranceStatisticsMap, utteranceStatistics, utteranceCount, utteranceStatisticsHtml};
  }

  public static generateLabelStatisticsAndHtmlTable(
    utteranceLabelsMap: { [id: string]: string[] },
    labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': {[id: string]: number};}): {
        'labelUtterancesMap': { [id: string]: string[] };
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;
      } {
    // ---- NOTE ---- generate label statistics.
    const labelUtterancesMap: { [id: string]: string[] } = Utility.reverseUniqueKeyedArray(utteranceLabelsMap);
    const labelUtterancesTotal: number = Object.entries(labelUtterancesMap).reduce(
      (accumulant: number, x: [string, string[]]) => accumulant + x[1].length, 0);
    const labelStatistics: string[][] = Object.entries(labelUtterancesMap).sort(
      (n1: [string, string[]], n2: [string, string[]]) => {
        if (n1[0] > n2[0]) {
          return 1;
        }
        if (n1[0] < n2[0]) {
          return -1;
        }
        return 0;
      }).map(
      (x: [string, string[]], index: number) => [index.toString(), x[0], labelArrayAndMap.stringMap[x[0]].toString(), x[1].length.toString(), Utility.round(x[1].length / labelUtterancesTotal).toString()]);
    labelStatistics.push(['Total', 'N/A', 'N/A', labelUtterancesTotal.toString(), 'N/A']);
    const labelStatisticsHtml: string = Utility.convertDataArraysToHtmlTable(
      'Intent statistics',
      labelStatistics,
      ['No', 'Intent', 'Intent Index', 'Utterance Count', 'Utterance Prevalence']);
    return {labelUtterancesMap, labelUtterancesTotal, labelStatistics, labelStatisticsHtml};
  }

  // eslint-disable-next-line max-params
  public static selectedScoreStructureToHtmlTable(
    scoreStructure: ScoreStructure,
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = [],
    indexes: number[] = []): string {
    if (Utility.isEmptyNumberArray(indexes)) {
      indexes = scoreStructure.labelsPredictedIndexes;
    }
    return Utility.selectedScoreResultsToHtmlTable(
      scoreStructure.scoreResultArray,
      indexes,
      tableDescription,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
  }

  // eslint-disable-next-line max-params
  public static selectedScoreResultsToHtmlTable(
    scoreResultArray: Result[],
    indexes: number[],
    tableDescription: string = '',
    selectedOutputDataArraryHeaders: string[] = [],
    outputDataColumnWidthSettings: string[] = []): string {
    const labelsSelectedArrays: any[][] = indexes.map(
      (x: number) => [scoreResultArray[x].label.name, scoreResultArray[x].score, scoreResultArray[x].closesttext]);
    const selectedScoreStructureHtmlTable: string = Utility.convertDataArraysToHtmlTable(
      tableDescription,
      labelsSelectedArrays,
      selectedOutputDataArraryHeaders,
      outputDataColumnWidthSettings);
    return selectedScoreStructureHtmlTable;
  }

  public static evaluateMultiLabelPrediction(groundTruths: any[], predictions: any[]): number {
    if (predictions.length <= 0) {
      if (groundTruths.length <= 0) {
        return 3; // ---- NOTE ---- 3 for true negative as there is no prediction on an empty ground-truth set.
      }
      return 1; // ---- NOTE ---- 1 for false negative as there is no prediction on a non-empty ground-truth set.
    }
    for (const prediction of predictions) {
      if (!groundTruths.includes(prediction)) {
        return 2; // ---- NOTE ---- 2 for false positive as there is a prediction not in the ground-truth set.
      }
    }
    return 0; // ---- NOTE ---- 0 for true positive as every prediction is in the ground-trueh set.
  }

  public static reverseUniqueKeyedArray(input: {[id: string]: string[]}): {[id: string]: string[]} {
    const reversed: {[id: string]: string[]} = {};
    for (const key in input) {
      if (key) {
        const keyedArray: string[] = input[key];
        for (const keyedArrayElement of keyedArray) {
          if (keyedArrayElement in reversed) {
            reversed[keyedArrayElement].push(key);
          } else {
            reversed[keyedArrayElement] = [key];
          }
        }
      }
    }
    return reversed;
  }

  public static processUnknowLabelsInUtteranceLabelsMapUsingLabelSet(
    utteranceLabels: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; },
    labelSet: Set<string>): {
        'utteranceLabelsMap': { [id: string]: string[] };
        'utteranceLabelDuplicateMap': Map<string, Set<string>>; } {
    const utteranceLabelsMap: { [id: string]: string[] } = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey in utteranceLabelsMap) {
        if (utteranceKey) {
          const concreteLabels: string[] = utteranceLabelsMap[utteranceKey].filter(
            (label: string) => !Utility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          if (!hasConcreteLabel) {
            utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
            utteranceLabelsMap[utteranceKey].push(Utility.UnknownLabel);
            continue;
          }
          utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
          for (const label of concreteLabels) {
            utteranceLabelsMap[utteranceKey].push(label);
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
        const labelsArray: string[] = [...labelsSet];
        const concreteLabels: string[] = labelsArray.filter(
          (label: string) => !Utility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
        const hasConcreteLabel: boolean = concreteLabels.length > 0;
        // eslint-disable-next-line max-depth
        if (hasConcreteLabel) {
          labelsSet.clear(); // ---- NOTE ---- truncate the array!
          // eslint-disable-next-line max-depth
          for (const label of concreteLabels) {
            labelsSet.add(label);
          }
        } else {
          labelsSet.clear(); // ---- NOTE ---- truncate the array!
          labelsSet.add(Utility.UnknownLabel);
        }
      });
    }
    return utteranceLabels;
  }

  public static processUnknowLabelsInUtteranceLabelsMap(
    utteranceLabels: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; }): {
        'utteranceLabelsMap': { [id: string]: string[] };
        'utteranceLabelDuplicateMap': Map<string, Set<string>>; } {
    const utteranceLabelsMap: { [id: string]: string[] } = utteranceLabels.utteranceLabelsMap;
    const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
    if (utteranceLabelsMap) {
      for (const utteranceKey in utteranceLabelsMap) {
        if (utteranceKey) {
          const concreteLabels: string[] = utteranceLabelsMap[utteranceKey].filter(
            (label: string) => !Utility.UnknownLabelSet.has(label.toUpperCase()));
          const hasConcreteLabel: boolean = concreteLabels.length > 0;
          if (!hasConcreteLabel) {
            utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
            utteranceLabelsMap[utteranceKey].push(Utility.UnknownLabel);
            continue;
          }
          utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
          for (const label of concreteLabels) {
            utteranceLabelsMap[utteranceKey].push(label);
          }
        }
      }
    }
    if (utteranceLabelDuplicateMap) {
      utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
        const labelsArray: string[] = [...labelsSet];
        const concreteLabels: string[] = labelsArray.filter(
          (label: string) => !Utility.UnknownLabelSet.has(label.toUpperCase()));
        const hasConcreteLabel: boolean = concreteLabels.length > 0;
        // eslint-disable-next-line max-depth
        if (hasConcreteLabel) {
          labelsSet.clear(); // ---- NOTE ---- truncate the array!
          // eslint-disable-next-line max-depth
          for (const label of concreteLabels) {
            labelsSet.add(label);
          }
        } else {
          labelsSet.clear(); // ---- NOTE ---- truncate the array!
          labelsSet.add(Utility.UnknownLabel);
        }
      });
    }
    return utteranceLabels;
  }

  public static processUnknowLabelsInBluFileContent(bluFileContents: string): string {
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
      Utility.debuggingThrow(
        'outputEvaluationReportDataArrays is empty');
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
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulative + indent + '<tr>');
      for (let i: number = 0; i < outputDataArraryHeaders.length; i++) {
        const headerEntry: string = outputDataArraryHeaders[i];
        let widthSetting: string = '';
        if (!Utility.isEmptyStringArray(outputDataColumnWidthSettings) && (outputDataColumnWidthSettings.length > i)) {
          widthSetting = ` width=${outputDataColumnWidthSettings[i]}`;
        }
        outputLines.push(indentCumulative + indent + indent + '<th' + widthSetting + '>');
        outputLines.push(indentCumulative + indent + indent + headerEntry);
        outputLines.push(indentCumulative + indent + indent + '</th>');
      }
      outputLines.push(indentCumulative + indent + '<tr>');
    }
    if (!Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulative + indent + '<tr>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulative + indent + indent + '<td>');
          outputLines.push(indentCumulative + indent + indent + dataEntry);
          outputLines.push(indentCumulative + indent + indent + '</td>');
        }
        outputLines.push(indentCumulative + indent + '</tr>');
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
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulative + indent + '<tr>');
      outputLines.push(indentCumulative + indent + indent + '<th>');
      outputLines.push(indentCumulative + indent + indent + 'No');
      outputLines.push(indentCumulative + indent + indent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulative + indent + indent + '<th>');
        outputLines.push(indentCumulative + indent + indent + headerEntry);
        outputLines.push(indentCumulative + indent + indent + '</th>');
      }
      outputLines.push(indentCumulative + indent + '<tr>');
    }
    if (!Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
      let index: number = 0;
      for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
        outputLines.push(indentCumulative + indent + '<tr>');
        outputLines.push(indentCumulative + indent + indent + '<td>');
        outputLines.push(indentCumulative + indent + indent + index++);
        outputLines.push(indentCumulative + indent + indent + '</td>');
        for (const dataEntry of outputEvaluationReportDataArray) {
          outputLines.push(indentCumulative + indent + indent + '<td>');
          outputLines.push(indentCumulative + indent + indent + dataEntry);
          outputLines.push(indentCumulative + indent + indent + '</td>');
        }
        outputLines.push(indentCumulative + indent + '</tr>');
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
    if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
      outputLines.push(indentCumulative + indent + '<tr>');
      outputLines.push(indentCumulative + indent + indent + '<th>');
      outputLines.push(indentCumulative + indent + indent + 'No');
      outputLines.push(indentCumulative + indent + indent + '</th>');
      for (const headerEntry of outputDataArraryHeaders) {
        outputLines.push(indentCumulative + indent + indent + '<th>');
        outputLines.push(indentCumulative + indent + indent + headerEntry);
        outputLines.push(indentCumulative + indent + indent + '</th>');
      }
      outputLines.push(indentCumulative + indent + '<tr>');
    }
    if (Utility.isEmptyAnyKeyGenericSetMap(outputEvaluationMapSet)) {
      let index: number = 0;
      for (const outputEvaluationMapSetEntry of outputEvaluationMapSet) {
        const key: any = outputEvaluationMapSetEntry[0];
        for (const valueSetEntry of outputEvaluationMapSetEntry[1]) {
          outputLines.push(indentCumulative + indent + '<tr>');
          outputLines.push(indentCumulative + indent + indent + '<td>');
          outputLines.push(indentCumulative + indent + indent + index++);
          outputLines.push(indentCumulative + indent + indent + '</td>');
          outputLines.push(indentCumulative + indent + indent + '<td>');
          outputLines.push(indentCumulative + indent + indent + key);
          outputLines.push(indentCumulative + indent + indent + '</td>');
          outputLines.push(indentCumulative + indent + indent + '<td>');
          outputLines.push(indentCumulative + indent + indent + valueSetEntry);
          outputLines.push(indentCumulative + indent + indent + '</td>');
          outputLines.push(indentCumulative + indent + '</tr>');
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

  public static isEmptyAnyKeyGenericSetMap(
    anyKeyGenericSetMap: Map<any, Set<any>>): boolean {
    return !(anyKeyGenericSetMap &&
      [...anyKeyGenericSetMap].length > 0);
  }

  public static isEmptyNumberArrays(inputArrays: number[][]): boolean {
    return !(inputArrays && inputArrays.length > 0);
  }

  public static isEmptyStringArrays(inputArrays: string[][]): boolean {
    return !(inputArrays && inputArrays.length > 0);
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
    utteranceLabelsMap: { [id: string]: string[] },
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
    labelIndexMap: {[id: string]: number},
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
        const closesttext: string = result.closesttext;
        const scoreResult: Result = new Result(
          new Label(labeltype, label, new Span(labelspanoffset, labelspanlength)),
          score,
          closesttext);
        const labelIndex: number = labelIndexMap[label];
        if (labelIndex >= 0) {
          scoreResultArray[labelIndex] = scoreResult;
        }
      }
    }
    return scoreResultArray;
  }

  public static buildStringIdNumberValueDictionaryFromUniqueStringArray(
    inputStringArray: string[]): {[id: string]: number} {
    const stringMap: {[id: string]: number} = { };
    for (let index: number = 0; index < inputStringArray.length; index++) {
      stringMap[inputStringArray[index]] = index;
    }
    return stringMap;
  }

  public static buildStringIdNumberValueDictionaryFromStringArray(
    inputStringArray: string[]): {
      'stringArray': string[];
      'stringMap': {[id: string]: number};} {
    const stringSet: Set<string> = new Set(inputStringArray);
    let stringArray: string[] = [...stringSet.values()];
    stringArray = Utility.sortStringArray(stringArray);
    const stringMap: {[id: string]: number} =
      Utility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
    return {stringArray, stringMap};
  }

  public static buildStringIdNumberValueDictionaryFromStringArrays(
    inputStringArrays: string[][]): {
      'stringArray': string[];
      'stringMap': {[id: string]: number}; } {
    const stringSet: Set<string> = new Set();
    for (const elementStringArray of inputStringArrays) {
      for (const elementString of elementStringArray) {
        stringSet.add(elementString);
      }
    }
    let stringArray: string[] = [...stringSet.values()];
    stringArray = Utility.sortStringArray(stringArray);
    const stringMap: {[id: string]: number} =
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
    for (const key in stringKeyGenericSetMap) {
      if (key) {
        const value: Set<T> | undefined = stringKeyGenericSetMap.get(key);
        stringIdGenericSetDictionary[key] = value as Set<T>;
      }
    }
    return stringIdGenericSetDictionary;
  }

  public static convertStringKeyGenericValueValueNativeMapToDictionary<T>(
    stringKeyGenericValueMap: Map<string, T>): { [id: string]: T } {
    const stringIdGenericValueDictionary: { [id: string]: T } = {};
    for (const key in stringKeyGenericValueMap) {
      if (key) {
        const value: T | undefined = stringKeyGenericValueMap.get(key);
        stringIdGenericValueDictionary[key] = value as T;
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
      Utility.addUniqueEntityLabel(value, labelSet);
    } else {
      const labelSet: Label[] = [];
      stringKeyLabelSetMap.set(key, labelSet);
      labelSet.push(value);
    }
    return stringKeyLabelSetMap;
  }

  public static addUniqueLabel(newLabel: string, labels: string[]): boolean {
    for (const label of labels) {
      if (label === newLabel) {
        return false;
      }
    }
    labels.push(newLabel);
    return true;
  }

  public static addUniqueEntityLabel(newLabel: Label, labels: Label[]): boolean {
    for (const label of labels) {
      if (label.equals(newLabel)) {
        return false;
      }
    }
    labels.push(newLabel);
    return true;
  }

  public static countMapValues(inputStringToStringArrayMap: { [id: string]: string[] }): number {
    return Object.entries(inputStringToStringArrayMap).reduce(
      (accumulant: number,  value: [string, string[]]) => accumulant + value[1].length, 0);
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
