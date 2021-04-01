/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionStructureWithPluralEvaluation } from "./PredictionStructureWithPluralEvaluation";
import { PredictionStructureFoundationDisplay } from "./PredictionStructureFoundationDisplay";
import { PredictionScoreStructureFoundation } from "./PredictionScoreStructureFoundation";

export class PredictionStructureWithPluralEvaluationScore<TL>
extends PredictionStructureWithPluralEvaluation<TL> {

    public predictionScoreStructureFoundation: PredictionScoreStructureFoundation;

    constructor(
        text: string,
        labelsPredictedEvaluationArray: number[],
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluationArray cells are
         *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
         */
        labelsPredictedEvaluation: number,
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
        labels: TL[],
        labelsConcatenated: string,
        labelsConcatenatedToHtmlTable: string,
        labelsIndexes: number[],
        labelsPredicted: TL[],
        labelsPredictedConcatenated: string,
        labelsPredictedConcatenatedToHtmlTable: string,
        labelsPredictedIndexes: number[],
        labelsPredictedScore: number,
        labelsPredictedClosestText: string[],
        scoreResultArray: Result[],
        scoreArray: number[],
        predictedScoreStructureHtmlTable: string,
        labelsScoreStructureHtmlTable: string) {
        super(
            text,
            labelsPredictedEvaluationArray,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluationArray cells are
             *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
             */
            labelsPredictedEvaluation,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluation can be of following:
             *    PredictionType.TruePositive(1):TP
             *    PredictionType.FalsePositive(2):FP
             *    PredictionType.FalseNegative(4):FN
             *    PredictionType.TrueNegative(8):TN
             */
            labels,
            labelsConcatenated,
            labelsConcatenatedToHtmlTable,
            labelsIndexes,
            labelsPredicted,
            labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable,
            labelsPredictedIndexes);
        this.predictionScoreStructureFoundation = new PredictionScoreStructureFoundation(
            labelsPredictedScore,
            labelsPredictedClosestText,
            scoreResultArray,
            scoreArray,
            predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable);
        }

    public toObjectPredictionStructureWithPluralEvaluationScore(): {
        "text": string;
        "labelsPredictedEvaluationArray": number[];
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluationArray cells are
         *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
         */
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
        "predictionStructureFoundationDisplay": PredictionStructureFoundationDisplay;
        "predictionScoreStructureFoundation": PredictionScoreStructureFoundation;
        } {
        return {
            text:
                this.text,
            labelsPredictedEvaluationArray:
                this.predictionStructureFoundationPluralEvaluation.labelsPredictedEvaluationArray,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluationArray cells are
             *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
             */
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
            predictionStructureFoundationDisplay:
                this.predictionStructureFoundationDisplay,
            predictionScoreStructureFoundation:
              this.predictionScoreStructureFoundation,
        };
    }
}
