/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Result}  from '@microsoft/bf-dispatcher';

import {PredictionStructure}  from './predictionstructure';

export class PredictionScoreStructure extends PredictionStructure {
  // eslint-disable-next-line max-params
  constructor(
    utterance: string,
    labelsPredictedEvaluation: number,
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):FN
    // ---- NOTE ---- PredictionType.TrueNegative(8):TN
    labels: string[],
    labelsConcatenated: string,
    labelsConcatenatedToHtmlTable: string,
    labelsIndexes: number[],
    labelsPredicted: string[],
    labelsPredictedConcatenated: string,
    labelsPredictedConcatenatedToHtmlTable: string,
    labelsPredictedScore: number,
    labelsPredictedIndexes: number[],
    labelsPredictedClosestText: string[],
    scoreResultArray: Result[],
    scoreArray: number[],
    predictedScoreStructureHtmlTable: string,
    labelsScoreStructureHtmlTable: string) {
    super(
      utterance,
      labelsPredictedEvaluation,
      labels,
      labelsConcatenated,
      labelsConcatenatedToHtmlTable,
      labelsIndexes,
      labelsPredicted,
      labelsPredictedConcatenated,
      labelsPredictedConcatenatedToHtmlTable,
      labelsPredictedIndexes);
    this.labelsPredictedScore = labelsPredictedScore;
    this.labelsPredictedClosestText = labelsPredictedClosestText;
    this.scoreResultArray = scoreResultArray;
    this.scoreArray = scoreArray;
    this.predictedScoreStructureHtmlTable = predictedScoreStructureHtmlTable;
    this.labelsScoreStructureHtmlTable = labelsScoreStructureHtmlTable;
  }

  public toObject(): {
    'utterance': string;
    'labelsPredictedEvaluation': number;
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):FN
    // ---- NOTE ---- PredictionType.TrueNegative(8):TN
    'labels': string[];
    'labelsConcatenated': string;
    'labelsConcatenatedToHtmlTable': string;
    'labelsIndexes': number[];
    'labelsPredicted': string[];
    'labelsPredictedConcatenated': string;
    'labelsPredictedConcatenatedToHtmlTable': string;
    'labelsPredictedScore': number;
    'labelsPredictedIndexes': number[];
    'labelsPredictedClosestText': string[];
    'scoreResultArray': Result[];
    'scoreArray': number[];
    'predictedScoreStructureHtmlTable': string;
    'labelsScoreStructureHtmlTable': string; } {
    return {
      utterance: this.utterance,
      labelsPredictedEvaluation: this.labelsPredictedEvaluation,
      // ---- NOTE ---- PredictionType.TruePositive(1):TP
      // ---- NOTE ---- PredictionType.FalsePositive(2):FP
      // ---- NOTE ---- PredictionType.FalseNegative(4):FN
      // ---- NOTE ---- PredictionType.TrueNegative(8):TN
      labels: this.labels,
      labelsConcatenated: this.labelsConcatenated,
      labelsConcatenatedToHtmlTable: this.labelsConcatenatedToHtmlTable,
      labelsIndexes: this.labelsIndexes,
      labelsPredicted: this.labelsPredicted,
      labelsPredictedConcatenated: this.labelsPredictedConcatenated,
      labelsPredictedConcatenatedToHtmlTable: this.labelsPredictedConcatenatedToHtmlTable,
      labelsPredictedScore: this.labelsPredictedScore,
      labelsPredictedIndexes: this.labelsPredictedIndexes,
      labelsPredictedClosestText: this.labelsPredictedClosestText,
      scoreResultArray: this.scoreResultArray,
      scoreArray: this.scoreArray,
      predictedScoreStructureHtmlTable: this.predictedScoreStructureHtmlTable,
      labelsScoreStructureHtmlTable: this.labelsScoreStructureHtmlTable,
    };
  }

  public labelsPredictedScore: number;

  public labelsPredictedClosestText: string[];

  public scoreResultArray: Result[];

  public scoreArray: number[];

  public predictedScoreStructureHtmlTable: string;

  public labelsScoreStructureHtmlTable: string;
}
