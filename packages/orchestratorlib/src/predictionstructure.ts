/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {PredictionType} from '@microsoft/bf-dispatcher';

export class PredictionStructure {
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
    labelsPredictedIndexes: number[]) {
    this.utterance = utterance;
    this.labelsPredictedEvaluation = labelsPredictedEvaluation;
    this.labels = labels;
    this.labelsConcatenated = labelsConcatenated;
    this.labelsConcatenatedToHtmlTable = labelsConcatenatedToHtmlTable;
    this.labelsIndexes = labelsIndexes;
    this.labelsPredicted = labelsPredicted;
    this.labelsPredictedConcatenated = labelsPredictedConcatenated;
    this.labelsPredictedConcatenatedToHtmlTable = labelsPredictedConcatenatedToHtmlTable;
    this.labelsPredictedIndexes = labelsPredictedIndexes;
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
    'labelsPredictedIndexes': number[]; } {
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
      labelsPredictedIndexes: this.labelsPredictedIndexes,
    };
  }

  public isCorrectPrediction(): boolean {
    return (this.labelsPredictedEvaluation === PredictionType.TruePositive) ||
    (this.labelsPredictedEvaluation === PredictionType.TrueNegative);
  }

  public isMisclassified(): boolean {
    return (this.labelsPredictedEvaluation === PredictionType.FalsePositive) ||
    (this.labelsPredictedEvaluation === PredictionType.FalseNegative);
  }

  public utterance: string;

  public labelsPredictedEvaluation: number;
  // ---- NOTE ---- PredictionType.TruePositive(1):TP
  // ---- NOTE ---- PredictionType.FalsePositive(2):FP
  // ---- NOTE ---- PredictionType.FalseNegative(4):FN
  // ---- NOTE ---- PredictionType.TrueNegative(8):TN

  public labels: string[];

  public labelsConcatenated: string;

  public labelsConcatenatedToHtmlTable: string;

  public labelsIndexes: number[];

  public labelsPredicted: string[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedConcatenatedToHtmlTable: string;

  public labelsPredictedIndexes: number[];
}
