/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

export class PredictionStructureEssential {

    public text: string;

    public labelsPredictedEvaluation: number;
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):FN
    // ---- NOTE ---- PredictionType.TrueNegative(8):TN

    public labelsIndexes: number[];

    public labelsPredictedIndexes: number[];

    constructor(
        text: string,
        labelsPredictedEvaluation: number,
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        labelsIndexes: number[],
        labelsPredictedIndexes: number[]) {
        this.text = text;
        this.labelsPredictedEvaluation = labelsPredictedEvaluation;
        this.labelsIndexes = labelsIndexes;
        this.labelsPredictedIndexes = labelsPredictedIndexes;
    }

    public toObjectPredictionStructureEssential(): {
        "text": string;
        "labelsPredictedEvaluation": number;
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        "labelsIndexes": number[];
        "labelsPredictedIndexes": number[];
    } {
        return {
            text: this.text,
            labelsPredictedEvaluation: this.labelsPredictedEvaluation,
            // ---- NOTE ---- PredictionType.TruePositive(1):TP
            // ---- NOTE ---- PredictionType.FalsePositive(2):FP
            // ---- NOTE ---- PredictionType.FalseNegative(4):FN
            // ---- NOTE ---- PredictionType.TrueNegative(8):TN
            labelsIndexes: this.labelsIndexes,
            labelsPredictedIndexes: this.labelsPredictedIndexes,
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
