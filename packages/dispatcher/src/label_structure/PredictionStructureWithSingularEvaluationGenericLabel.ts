/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { PredictionType } from "./PredictionType";
import { PredictionStructureFoundation } from "./PredictionStructureFoundation";
import { PredictionStructureFoundationSingularEvaluation } from "./PredictionStructureFoundationSingularEvaluation";

export class PredictionStructureWithSingularEvaluationGenericLabel<TL>
extends PredictionStructureFoundation {

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureWithSingularEvaluationGenericLabel object is
     *  a PredictionStructureFoundation and
     *  a predictionStructureFoundationSingularEvaluation
     */
    public predictionStructureFoundationSingularEvaluation: PredictionStructureFoundationSingularEvaluation;

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructure object has
     *  an array of labels, which are label objcets from
     *  PredictionStructureFoundation parent's labelsIndexes array.
     */
    public labels: TL[];

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructure object has
     *  an array of labelsPredicted, which are predicted label objcets from
     *  PredictionStructureFoundation parent's labelsPredictedIndexes array.
     */
    public labelsPredicted: TL[];

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
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
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
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluation can be of following:
             *    PredictionType.TruePositive(1):TP
             *    PredictionType.FalsePositive(2):FP
             *    PredictionType.FalseNegative(4):FN
             *    PredictionType.TrueNegative(8):TN
             */
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
