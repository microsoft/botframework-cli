/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from '@microsoft/bf-dispatcher';
import {PredictionTypeArrayOutputIndex} from '@microsoft/bf-dispatcher';

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
    labelsConcatenatedToHtmlTable: string,
    labelsIndexes: number[],
    labelsPredicted: Label[],
    labelsPredictedConcatenated: string,
    labelsPredictedConcatenatedToHtmlTable: string,
    labelsPredictedIndexes: number[]) {
    this.utterance = utterance;
    this.labelsPredictedEvaluationArray = labelsPredictedEvaluationArray;
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
    'labelsPredictedEvaluationArray': number[];
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
    'labels': Label[];
    'labelsConcatenated': string;
    'labelsConcatenatedToHtmlTable': string;
    'labelsIndexes': number[];
    'labelsPredicted': Label[];
    'labelsPredictedConcatenated': string;
    'labelsPredictedConcatenatedToHtmlTable': string;
    'labelsPredictedIndexes': number[]; } {
    return {
      utterance: this.utterance,
      labelsPredictedEvaluationArray: this.labelsPredictedEvaluationArray,
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
      // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
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

  public labelsConcatenatedToHtmlTable: string;

  public labelsIndexes: number[];

  public labelsPredicted: Label[];

  public labelsPredictedConcatenated: string;

  public labelsPredictedConcatenatedToHtmlTable: string;

  public labelsPredictedIndexes: number[];
}
