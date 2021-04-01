/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionStructure } from "./PredictionStructure";
import { PredictionStructureFoundationDisplay } from "./PredictionStructureFoundationDisplay";
import { PredictionScoreStructureFoundation } from "./PredictionScoreStructureFoundation";

export class PredictionStructureWithScore<TL>
extends PredictionStructure<TL> {

    public predictionScoreStructureFoundation: PredictionScoreStructureFoundation;

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
            labelsPredictedEvaluation,
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

    public toObjectPredictionStructureWithScore(): {
        "text": string;
        "labelsPredictedEvaluation": number;
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
        "labelsIndexes": number[];
        "labelsPredictedIndexes": number[];
        "labels": TL[];
        "labelsPredicted": TL[];
        "predictionStructureFoundationDisplay": PredictionStructureFoundationDisplay;
        "predictionScoreStructureFoundation": PredictionScoreStructureFoundation;
      } {
        return {
            text: this.text,
            labelsPredictedEvaluation:
              this.predictionStructureFoundationSingularEvaluation.labelsPredictedEvaluation,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluation can be of following:
             *    PredictionType.TruePositive(1):TP
             *    PredictionType.FalsePositive(2):FP
             *    PredictionType.FalseNegative(4):FN
             *    PredictionType.TrueNegative(8):TN
             */
            labelsIndexes:
              this.labelsIndexes,
            labelsPredictedIndexes:
              this.labelsPredictedIndexes,
            labels:
              this.labels,
            labelsPredicted:
              this.labelsPredicted,
            predictionStructureFoundationDisplay:
              this.predictionStructureFoundationDisplay,
            predictionScoreStructureFoundation:
              this.predictionScoreStructureFoundation,
        };
    }
}
