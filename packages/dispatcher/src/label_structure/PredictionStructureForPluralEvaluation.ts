/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionTypeArrayOutputIndex } from "./PredictionType";

// import { Utility } from "../utility/Utility";

export class PredictionStructureForPluralEvaluation {

    public labelsPredictedEvaluationArray: number[];
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
    // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN

    constructor(
        labelsPredictedEvaluationArray: number[],
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
        ) {
        this.labelsPredictedEvaluationArray = labelsPredictedEvaluationArray;
    }

    public toObjectPredictionStructureForPluralEvaluation(): {
        "labelsPredictedEvaluationArray": number[];
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
    } {
        return {
            labelsPredictedEvaluationArray: this.labelsPredictedEvaluationArray,
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
        };
    }

    public hasMisclassified(): boolean {
        return (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalsePositive] > 0) ||
          (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalseNegative] > 0);
    }
}
