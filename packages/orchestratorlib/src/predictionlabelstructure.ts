/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from './label';

export class PredictionLabelStructure {
  // eslint-disable-next-line max-params
  constructor(
    utterance: string,
    labelsPredictedEvaluation: number[], // ---- 0: #TP, 1, #FN, 2: #FP
    labels: Label[],
    labelsConcatenated: string,
    labelsIndexes: number[],
    labelsPredicted: Label[],
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
    'labelsPredictedEvaluation': number[]; // ---- 0: #TP, 1, #FN, 2: #FP
    'labels': Label[];
    'labelsConcatenated': string;
    'labelsIndexes': number[];
    'labelsPredicted': Label[];
    'labelsPredictedConcatenated': string;
    'labelsPredictedIndexes': number[]; } {
    return {
      utterance: this.utterance,
      labelsPredictedEvaluation: this.labelsPredictedEvaluation, // ---- 0: #TP, 1, #FN, 2: #FP
      labels: this.labels,
      labelsConcatenated: this.labelsConcatenated,
      labelsIndexes: this.labelsIndexes,
      labelsPredicted: this.labelsPredicted,
      labelsPredictedConcatenated: this.labelsPredictedConcatenated,
      labelsPredictedIndexes: this.labelsPredictedIndexes,
    };
  }

  public utterance: string;

  public labelsPredictedEvaluation: number[]; // ---- 0: #TP, 1, #FN, 2: #FP

  public labels: Label[];

  public labelsConcatenated: string;

  public labelsIndexes: number[];

  public labelsPredicted: Label[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedIndexes: number[];
}
