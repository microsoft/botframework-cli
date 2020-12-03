/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionStructure } from "./PredictionStructure";
import { PredictionStructureForDisplay } from "./PredictionStructureForDisplay";
import { PredictionStructureScore } from "./PredictionStructureScore";

export class PredictionScoreStructure<TL> extends PredictionStructure<TL> {

    public predictionStructureScore: PredictionStructureScore;

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
        this.predictionStructureScore = new PredictionStructureScore(
            labelsPredictedScore,
            labelsPredictedClosestText,
            scoreResultArray,
            scoreArray,
            predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable);
    }

    public toObjectPredictionScoreStructure(): {
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
        "predictionStructureScore": PredictionStructureScore;
      } {
        return {
            text: this.text,
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
            predictionStructureScore:
              this.predictionStructureScore,
        };
    }
}
