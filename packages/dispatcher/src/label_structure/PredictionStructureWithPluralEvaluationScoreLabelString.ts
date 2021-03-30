/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionStructureWithPluralEvaluationScore } from "./PredictionStructureWithPluralEvaluationScore";

export class PredictionStructureWithPluralEvaluationScoreLabelString
extends PredictionStructureWithPluralEvaluationScore<string> {

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
        labels: string[],
        labelsConcatenated: string,
        labelsConcatenatedToHtmlTable: string,
        labelsIndexes: number[],
        labelsPredicted: string[],
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
            labelsPredictedIndexes,
            labelsPredictedScore,
            labelsPredictedClosestText,
            scoreResultArray,
            scoreArray,
            predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable);
    }
}
