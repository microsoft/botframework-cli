/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

import { PredictionScoreStructureFoundationDisplay } from "./PredictionScoreStructureFoundationDisplay";

export class PredictionScoreStructureFoundation {

    public labelsPredictedScore: number;

    public labelsPredictedClosestText: string[];

    public scoreResultArray: Result[];

    public scoreArray: number[];

    public predictionScoreStructureFoundationDisplay: PredictionScoreStructureFoundationDisplay;

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
        this.predictionScoreStructureFoundationDisplay = new PredictionScoreStructureFoundationDisplay(
            predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable);
    }

    public toObject(): {
        "labelsPredictedScore": number;
        "labelsPredictedClosestText": string[];
        "scoreResultArray": Result[];
        "scoreArray": number[];
        "predictionScoreStructureFoundationDisplay": PredictionScoreStructureFoundationDisplay; } {
        return {
            labelsPredictedScore: this.labelsPredictedScore,
            labelsPredictedClosestText: this.labelsPredictedClosestText,
            scoreResultArray: this.scoreResultArray,
            scoreArray: this.scoreArray,
            predictionScoreStructureFoundationDisplay: this.predictionScoreStructureFoundationDisplay,
        };
    }
}
