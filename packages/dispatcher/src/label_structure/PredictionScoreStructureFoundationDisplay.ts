/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Result } from "./Result";

export class PredictionScoreStructureFoundationDisplay {

    public predictedScoreStructureHtmlTable: string;

    public labelsScoreStructureHtmlTable: string;

    constructor(
        predictedScoreStructureHtmlTable: string,
        labelsScoreStructureHtmlTable: string) {
        this.predictedScoreStructureHtmlTable = predictedScoreStructureHtmlTable;
        this.labelsScoreStructureHtmlTable = labelsScoreStructureHtmlTable;
    }

    public toObject(): {
        "predictedScoreStructureHtmlTable": string;
        "labelsScoreStructureHtmlTable": string; } {
        return {
            predictedScoreStructureHtmlTable: this.predictedScoreStructureHtmlTable,
            labelsScoreStructureHtmlTable: this.labelsScoreStructureHtmlTable,
        };
    }
}
