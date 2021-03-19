/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructure } from "./PredictionStructure";
import { PredictionStructureFoundationPluralEvaluation } from "./PredictionStructureFoundationPluralEvaluation";
import { PredictionStructureFoundationDisplay } from "./PredictionStructureFoundationDisplay";

export class PredictionStructureWithPluralEvaluation<TL>
extends PredictionStructure<TL> {

    public predictionStructureFoundationPluralEvaluation: PredictionStructureFoundationPluralEvaluation;

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
            // ---- NOTE ---- PredictionType.TruePositive(1):TP
            // ---- NOTE ---- PredictionType.FalsePositive(2):FP
            // ---- NOTE ---- PredictionType.FalseNegative(4):FN
            // ---- NOTE ---- PredictionType.TrueNegative(8):TN
            labels,
            labelsConcatenated,
            labelsConcatenatedToHtmlTable,
            labelsIndexes,
            labelsPredicted,
            labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable,
            labelsPredictedIndexes);
        this.predictionStructureFoundationPluralEvaluation = new PredictionStructureFoundationPluralEvaluation(
            labelsPredictedEvaluationArray);
    }

    public toObjectPredictionStructureWithPluralEvaluation(): {
        "text": string;
        "labelsPredictedEvaluationArray": number[];
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
        // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
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
            labelsPredictedEvaluationArray:
                this.predictionStructureFoundationPluralEvaluation.labelsPredictedEvaluationArray,
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
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

    public hasMisclassified(): boolean {
        return this.predictionStructureFoundationPluralEvaluation.hasMisclassified();
    }
}
