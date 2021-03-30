/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Label } from "./Label";
import { PredictionStructureWithSingularEvaluationGenericLabel } from "./PredictionStructureWithSingularEvaluationGenericLabel";

export class PredictionStructureWithSingularEvaluationGenericLabelLabelObject
extends PredictionStructureWithSingularEvaluationGenericLabel<Label> {

    constructor(
        text: string,
        labelsPredictedEvaluation: number,
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
        labels: Label[],
        labelsIndexes: number[],
        labelsPredicted: Label[],
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
