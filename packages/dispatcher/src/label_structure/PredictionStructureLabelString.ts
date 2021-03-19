/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionStructure } from "./PredictionStructure";

export class PredictionStructureLabelString
extends PredictionStructure<string> {

    constructor(
        text: string,
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
