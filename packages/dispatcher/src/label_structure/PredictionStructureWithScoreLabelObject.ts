/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Label } from "./Label";
import { Result } from "./Result";

import { PredictionStructureWithScore } from "./PredictionStructureWithScore";

export class PredictionStructureWithScoreLabelObject
extends PredictionStructureWithScore<Label> {

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
        labels: Label[],
        labelsConcatenated: string,
        labelsConcatenatedToHtmlTable: string,
        labelsIndexes: number[],
        labelsPredicted: Label[],
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
            labelsPredictedEvaluation,
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
