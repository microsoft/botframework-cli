/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class PredictionStructure {
  // eslint-disable-next-line max-params
  constructor(
    utterance: string,
    labelsPredictedEvaluation: number, // ---- 0: TP, 1, FN, 2: FP, 3: TN
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
    'labelsPredictedEvaluation': number; // ---- 0: TP, 1, FN, 2: FP, 3: TN
    'labels': string[];
    'labelsConcatenated': string;
    'labelsIndexes': number[];
    'labelsPredicted': string[];
    'labelsPredictedConcatenated': string;
    'labelsPredictedIndexes': number[]; } {
    return {
      utterance: this.utterance,
      labelsPredictedEvaluation: this.labelsPredictedEvaluation, // ---- 0: TP, 1, FN, 2: FP, 3: TN
      labels: this.labels,
      labelsConcatenated: this.labelsConcatenated,
      labelsIndexes: this.labelsIndexes,
      labelsPredicted: this.labelsPredicted,
      labelsPredictedConcatenated: this.labelsPredictedConcatenated,
      labelsPredictedIndexes: this.labelsPredictedIndexes,
    };
  }

  public utterance: string;

  public labelsPredictedEvaluation: number; // ---- 0: TP, 1, FN, 2: FP, 3: TN

  public labels: string[];

  public labelsConcatenated: string;

  public labelsIndexes: number[];

  public labelsPredicted: string[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedIndexes: number[];
}
