/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class PredictionStructureFoundationDisplay {

    public labelsConcatenated: string;

    public labelsConcatenatedToHtmlTable: string;

    public labelsPredictedConcatenated: string;

    public labelsPredictedConcatenatedToHtmlTable: string;

    constructor(
        labelsConcatenated: string,
        labelsConcatenatedToHtmlTable: string,
        labelsPredictedConcatenated: string,
        labelsPredictedConcatenatedToHtmlTable: string) {
        this.labelsConcatenated = labelsConcatenated;
        this.labelsConcatenatedToHtmlTable = labelsConcatenatedToHtmlTable;
        this.labelsPredictedConcatenated = labelsPredictedConcatenated;
        this.labelsPredictedConcatenatedToHtmlTable = labelsPredictedConcatenatedToHtmlTable;
    }

    public toObject(): {
        "labelsConcatenated": string;
        "labelsConcatenatedToHtmlTable": string;
        "labelsPredictedConcatenated": string;
        "labelsPredictedConcatenatedToHtmlTable": string;
    } {
        return {
            labelsConcatenated: this.labelsConcatenated,
            labelsConcatenatedToHtmlTable: this.labelsConcatenatedToHtmlTable,
            labelsPredictedConcatenated: this.labelsPredictedConcatenated,
            labelsPredictedConcatenatedToHtmlTable: this.labelsPredictedConcatenatedToHtmlTable,
        };
    }
}
