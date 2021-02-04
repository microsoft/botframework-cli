/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructureWithSingularEvaluationGenericLabel } from "./PredictionStructureWithSingularEvaluationGenericLabel";
import { PredictionStructureFoundationDisplay } from "./PredictionStructureFoundationDisplay";

export class PredictionStructure<TL>
extends PredictionStructureWithSingularEvaluationGenericLabel<TL> {

    // ---- NOTE-DOCUMENTATION ---- A PredictionStructure object has
    // ---- NOTE-DOCUMENTATION ---- an PredictionStructureFoundationDisplay object
    // ---- NOTE-DOCUMENTATION ---- for stroing labels and labelsPredicted representation.
    public predictionStructureFoundationDisplay: PredictionStructureFoundationDisplay;

    constructor(
        text: string,
        labelsPredictedEvaluation: number,
        // ---- NOTE ---- PredictionType.TruePositive(1):TP
        // ---- NOTE ---- PredictionType.FalsePositive(2):FP
        // ---- NOTE ---- PredictionType.FalseNegative(4):FN
        // ---- NOTE ---- PredictionType.TrueNegative(8):TN
        labels: TL[],
        labelsConcatenated: string,
        labelsConcatenatedToHtmlTable: string,
        labelsIndexes: number[],
        labelsPredicted: TL[],
        labelsPredictedConcatenated: string,
        labelsPredictedConcatenatedToHtmlTable: string,
        labelsPredictedIndexes: number[]) {
        super(
            text,
            labelsPredictedEvaluation,
            labels,
            labelsIndexes,
            labelsPredicted,
            labelsPredictedIndexes);
        this.predictionStructureFoundationDisplay = new PredictionStructureFoundationDisplay(
            labelsConcatenated,
            labelsConcatenatedToHtmlTable,
            labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable);
    }

    public toObjectPredictionStructure(): {
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
        "predictionStructureFoundationDisplay": PredictionStructureFoundationDisplay;
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
            predictionStructureFoundationDisplay:
                this.predictionStructureFoundationDisplay,
        };
    }

    public isCorrectPrediction(): boolean {
        return this.predictionStructureFoundationSingularEvaluation.isCorrectPrediction();
    }

    public isMisclassified(): boolean {
        return this.predictionStructureFoundationSingularEvaluation.isMisclassified();
    }
}
