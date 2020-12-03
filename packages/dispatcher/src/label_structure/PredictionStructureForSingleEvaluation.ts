/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

import { Utility } from "../utility/Utility";

export class PredictionStructureForSingleEvaluation {

    public labelsPredictedEvaluation: number;
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):FN
    // ---- NOTE ---- PredictionType.TrueNegative(8):TN

    constructor(
        labelsPredictedEvaluation: number,
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        ) {
        this.labelsPredictedEvaluation = labelsPredictedEvaluation;
    }

    public toObjectPredictionStructureForSingleEvaluation(): {
        "labelsPredictedEvaluation": number;
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
    } {
        return {
            labelsPredictedEvaluation: this.labelsPredictedEvaluation,
            // ---- NOTE ---- PredictionType.TruePositive(1):TP
            // ---- NOTE ---- PredictionType.FalsePositive(2):FP
            // ---- NOTE ---- PredictionType.FalseNegative(4):FN
            // ---- NOTE ---- PredictionType.TrueNegative(8):TN
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
}
