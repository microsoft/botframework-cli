/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructureEssential } from "./PredictionStructureEssential";
import { PredictionStructureForDisplay } from "./PredictionStructureForDisplay";

export class PredictionStructure<TL> extends PredictionStructureEssential {

    public predictionStructureForDisplay: PredictionStructureForDisplay;

    public labels: TL[];

    public labelsPredicted: TL[];

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
            labelsIndexes,
            labelsPredictedIndexes);
        this.predictionStructureForDisplay = new PredictionStructureForDisplay(
            labelsConcatenated,
            labelsConcatenatedToHtmlTable,
            labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable);
        this.labels = labels;
        this.labelsPredicted = labelsPredicted;
    }

    public toObjectPredictionStructure(): {
        "text": string;
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
            labelsPredictedEvaluation:
                this.labelsPredictedEvaluation,
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
}
