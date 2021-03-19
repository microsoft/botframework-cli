/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionStructureWithPluralEvaluation } from "./PredictionStructureWithPluralEvaluation";

export class PredictionStructureWithPluralEvaluationLabelString
extends PredictionStructureWithPluralEvaluation<string> {

    constructor(
        text: string,
        labelsPredictedEvaluationArray: number[],
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
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
        super(
            text,
            labelsPredictedEvaluationArray,
            labelsPredictedEvaluation,
            labels,
            labelsConcatenated,
            labelsConcatenatedToHtmlTable,
            labelsIndexes,
            labelsPredicted,
            labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable,
            labelsPredictedIndexes);
    }
}
