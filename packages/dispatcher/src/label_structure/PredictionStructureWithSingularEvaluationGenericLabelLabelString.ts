/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionStructureWithSingularEvaluationGenericLabel } from "./PredictionStructureWithSingularEvaluationGenericLabel";

export class PredictionStructureWithSingularEvaluationGenericLabelLabelString
extends PredictionStructureWithSingularEvaluationGenericLabel<string> {

    constructor(
        text: string,
        labelsPredictedEvaluation: number,
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        labels: string[],
        labelsIndexes: number[],
        labelsPredicted: string[],
        labelsPredictedIndexes: number[]) {
        super(
            text,
            labelsPredictedEvaluation,
            labels,
            labelsIndexes,
            labelsPredicted,
            labelsPredictedIndexes);
    }
}
