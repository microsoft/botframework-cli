/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {PredictionType} from './predictiontype';

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
    labelsIndexes: number[],
    labelsPredicted: string[],
    labelsPredictedConcatenated: string,
    labelsPredictedIndexes: number[]) {
    this.utterance = utterance;
    this.labelsPredictedEvaluation = labelsPredictedEvaluation;
    this.labels = labels;
    this.labelsConcatenated = labelsConcatenated;
    this.labelsIndexes = labelsIndexes;
    this.labelsPredicted = labelsPredicted;
    this.labelsPredictedConcatenated = labelsPredictedConcatenated;
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
    'labelsIndexes': number[];
    'labelsPredicted': string[];
    'labelsPredictedConcatenated': string;
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
      labelsIndexes: this.labelsIndexes,
      labelsPredicted: this.labelsPredicted,
      labelsPredictedConcatenated: this.labelsPredictedConcatenated,
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

  public labelsIndexes: number[];

  public labelsPredicted: string[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedIndexes: number[];
}
