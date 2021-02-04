/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructureFoundation } from "./PredictionStructureFoundation";
import { PredictionStructureFoundationSingularEvaluation } from "./PredictionStructureFoundationSingularEvaluation";

export class PredictionStructureWithSingularEvaluationGenericLabel<TL>
extends PredictionStructureFoundation {

    // ---- NOTE-DOCUMENTATION ---- A PredictionStructureWithSingularEvaluationGenericLabel object is
    // ---- NOTE-DOCUMENTATION ---- a PredictionStructureFoundation and
    // ---- NOTE-DOCUMENTATION ---- a predictionStructureFoundationSingularEvaluation
    public predictionStructureFoundationSingularEvaluation: PredictionStructureFoundationSingularEvaluation;

    // ---- NOTE-DOCUMENTATION ---- A PredictionStructure object has
    // ---- NOTE-DOCUMENTATION ---- an array of labels, which are label objcets from
    // ---- NOTE-DOCUMENTATION ---- PredictionStructureFoundation parent's labelsIndexes array.
    public labels: TL[];

    // ---- NOTE-DOCUMENTATION ---- A PredictionStructure object has
    // ---- NOTE-DOCUMENTATION ---- an array of labelsPredicted, which are predicted label objcets from
    // ---- NOTE-DOCUMENTATION ---- PredictionStructureFoundation parent's labelsPredictedIndexes array.
    public labelsPredicted: TL[];

    constructor(
        text: string,
        labelsPredictedEvaluation: number,
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        labels: TL[],
        labelsIndexes: number[],
        labelsPredicted: TL[],
        labelsPredictedIndexes: number[]) {
        super(
            text,
            labelsIndexes,
            labelsPredictedIndexes);
        this.predictionStructureFoundationSingularEvaluation = new PredictionStructureFoundationSingularEvaluation(
            labelsPredictedEvaluation);
        this.labels = labels;
        this.labelsPredicted = labelsPredicted;
    }

    public toObjectPredictionStructureWithSingularEvaluationGenericLabel(): {
        "text": string;
        "labelsPredictedEvaluation": number;
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        "labels": TL[];
        "labelsIndexes": number[];
        "labelsPredicted": TL[];
        "labelsPredictedIndexes": number[];
        } {
        return {
            text:
                this.text,
            labelsPredictedEvaluation:
                this.predictionStructureFoundationSingularEvaluation.labelsPredictedEvaluation,
            // ---- NOTE ---- PredictionType.TruePositive(1):TP
            // ---- NOTE ---- PredictionType.FalsePositive(2):FP
            // ---- NOTE ---- PredictionType.FalseNegative(4):FN
            // ---- NOTE ---- PredictionType.TrueNegative(8):TN
            labels:
                this.labels,
            labelsIndexes:
                this.labelsIndexes,
            labelsPredicted:
                this.labelsPredicted,
            labelsPredictedIndexes:
                this.labelsPredictedIndexes,
        };
    }

    public isCorrectPrediction(): boolean {
        return this.predictionStructureFoundationSingularEvaluation.isCorrectPrediction();
    }

    public isMisclassified(): boolean {
        return this.predictionStructureFoundationSingularEvaluation.isMisclassified();
    }
}
