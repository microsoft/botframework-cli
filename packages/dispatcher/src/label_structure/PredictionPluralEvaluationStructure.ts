/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructure } from "./PredictionStructure";
import { PredictionStructureForPluralEvaluation } from "./PredictionStructureForPluralEvaluation";
import { PredictionStructureForDisplay } from "./PredictionStructureForDisplay";

export class PredictionPluralEvaluationStructure<TL> extends PredictionStructure<TL> {

    public predictionStructureForPluralEvaluation: PredictionStructureForPluralEvaluation;

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
        this.predictionStructureForPluralEvaluation = new PredictionStructureForPluralEvaluation(
            labelsPredictedEvaluationArray);
    }

    public toObjectPredictionStructure(): {
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
        "labelsIndexes": number[];
        "labelsPredictedIndexes": number[];
        "labels": TL[];
        "labelsPredicted": TL[];
        "predictionStructureForDisplay": PredictionStructureForDisplay;
        } {
        return {
            text:
                this.text,
            labelsPredictedEvaluationArray:
                this.predictionStructureForPluralEvaluation.labelsPredictedEvaluationArray,
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
            // ---- NOTE ---- index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
            labelsPredictedEvaluation:
                this.predictionStructureForSingleEvaluation.labelsPredictedEvaluation,
            // ---- NOTE ---- PredictionType.TruePositive(1):TP
            // ---- NOTE ---- PredictionType.FalsePositive(2):FP
            // ---- NOTE ---- PredictionType.FalseNegative(4):FN
            // ---- NOTE ---- PredictionType.TrueNegative(8):TN
            labelsIndexes:
                this.labelsIndexes,
            labelsPredictedIndexes:
                this.labelsPredictedIndexes,
            labels:
                this.labels,
            labelsPredicted:
                this.labelsPredicted,
            predictionStructureForDisplay:
                this.predictionStructureForDisplay,
        };
    }

    public hasMisclassified(): boolean {
        return this.predictionStructureForPluralEvaluation.hasMisclassified();
    }
}
