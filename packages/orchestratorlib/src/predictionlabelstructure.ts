/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from './label';
import {PredictionTypeArrayOutputIndex} from './predictiontype';

export class PredictionLabelStructure {
  // eslint-disable-next-line max-params
  constructor(
    utterance: string,
    labelsPredictedEvaluationArray: number[],
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
    labels: Label[],
    labelsConcatenated: string,
    labelsIndexes: number[],
    labelsPredicted: Label[],
    labelsPredictedConcatenated: string,
    labelsPredictedIndexes: number[]) {
    this.utterance = utterance;
    this.labelsPredictedEvaluationArray = labelsPredictedEvaluationArray;
    this.labels = labels;
    this.labelsConcatenated = labelsConcatenated;
    this.labelsIndexes = labelsIndexes;
    this.labelsPredicted = labelsPredicted;
    this.labelsPredictedConcatenated = labelsPredictedConcatenated;
    this.labelsPredictedIndexes = labelsPredictedIndexes;
  }

  public toObject(): {
    'utterance': string;
    'labelsPredictedEvaluationArray': number[];
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
    'labels': Label[];
    'labelsConcatenated': string;
    'labelsIndexes': number[];
    'labelsPredicted': Label[];
    'labelsPredictedConcatenated': string;
    'labelsPredictedIndexes': number[]; } {
    return {
      utterance: this.utterance,
      labelsPredictedEvaluationArray: this.labelsPredictedEvaluationArray,
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
      labels: this.labels,
      labelsConcatenated: this.labelsConcatenated,
      labelsIndexes: this.labelsIndexes,
      labelsPredicted: this.labelsPredicted,
      labelsPredictedConcatenated: this.labelsPredictedConcatenated,
      labelsPredictedIndexes: this.labelsPredictedIndexes,
    };
  }

  public hasMisclassified(): boolean {
    return (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalsePositive] > 0) ||
    (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalseNegative] > 0);
  }

  public utterance: string;

  public labelsPredictedEvaluationArray: number[];
  // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
  // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
  // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN

  public labels: Label[];

  public labelsConcatenated: string;

  public labelsIndexes: number[];

  public labelsPredicted: Label[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedIndexes: number[];
}
