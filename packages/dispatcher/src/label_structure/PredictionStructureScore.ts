/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionStructureScoreForDisplay } from "./PredictionStructureScoreForDisplay";

export class PredictionStructureScore {

    public labelsPredictedScore: number;

    public labelsPredictedClosestText: string[];

    public scoreResultArray: Result[];

    public scoreArray: number[];

    public predictionStructureScoreForDisplay: PredictionStructureScoreForDisplay;

    constructor(
        labelsPredictedScore: number,
        labelsPredictedClosestText: string[],
        scoreResultArray: Result[],
        scoreArray: number[],
        predictedScoreStructureHtmlTable: string,
        labelsScoreStructureHtmlTable: string) {
        this.labelsPredictedScore = labelsPredictedScore;
        this.labelsPredictedClosestText = labelsPredictedClosestText;
        this.scoreResultArray = scoreResultArray;
        this.scoreArray = scoreArray;
        this.predictionStructureScoreForDisplay = new PredictionStructureScoreForDisplay(
            predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable);
    }

    public toObject(): {
        "labelsPredictedScore": number;
        "labelsPredictedClosestText": string[];
        "scoreResultArray": Result[];
        "scoreArray": number[];
        "predictionStructureScoreForDisplay": PredictionStructureScoreForDisplay; } {
        return {
            labelsPredictedScore: this.labelsPredictedScore,
            labelsPredictedClosestText: this.labelsPredictedClosestText,
            scoreResultArray: this.scoreResultArray,
            scoreArray: this.scoreArray,
            predictionStructureScoreForDisplay: this.predictionStructureScoreForDisplay,
        };
    }
}
