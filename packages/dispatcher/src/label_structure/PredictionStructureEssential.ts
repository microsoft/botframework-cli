/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

import { Utility } from "../utility/Utility";

export class PredictionStructureEssential {

    public text: string;

    public labelsIndexes: number[];

    public labelsPredictedIndexes: number[];

    constructor(
        text: string,
        labelsIndexes: number[],
        labelsPredictedIndexes: number[]) {
        this.text = text;
        this.labelsIndexes = labelsIndexes;
        this.labelsPredictedIndexes = labelsPredictedIndexes;
    }

    public toObjectPredictionStructureEssential(): {
        "text": string;
        "labelsIndexes": number[];
        "labelsPredictedIndexes": number[];
    } {
        return {
            text: this.text,
            labelsIndexes: this.labelsIndexes,
            labelsPredictedIndexes: this.labelsPredictedIndexes,
        };
    }

    public getNumberLabelsInIntersectBetweenGroundtruthAndPredicted(): number {
        if (Utility.isEmptyNumberArray(this.labelsIndexes)) {
            return 0;
        }
        if (Utility.isEmptyNumberArray(this.labelsPredictedIndexes)) {
            return 0;
        }
        let numberLabelsInIntersectBetweenGroundtruthAndPredicted: number = 0;
        for (const labelIndex of this.labelsIndexes) {
            for (const labelPredictedIndex of this.labelsPredictedIndexes) {
                if (labelIndex === labelPredictedIndex) {
                    numberLabelsInIntersectBetweenGroundtruthAndPredicted++;
                    break;
                }
            }
        }
        return numberLabelsInIntersectBetweenGroundtruthAndPredicted;
    }

    public getVennDiagramNumbersOfLabelsBetweenGroundtruthAndPredicted(): number[] {
        const numberLabelsInIntersectBetweenGroundtruthAndPredicted: number =
            this.getNumberLabelsInIntersectBetweenGroundtruthAndPredicted();
        const numberLabelsInGroundtruth: number =
            Utility.isEmptyNumberArray(this.labelsIndexes) ? 0 : this.labelsIndexes.length;
        const numberLabelsInPredicted: number =
            Utility.isEmptyNumberArray(this.labelsPredictedIndexes) ? 0 : this.labelsPredictedIndexes.length;
        return [
            numberLabelsInIntersectBetweenGroundtruthAndPredicted,
            numberLabelsInGroundtruth - numberLabelsInIntersectBetweenGroundtruthAndPredicted,
            numberLabelsInPredicted - numberLabelsInIntersectBetweenGroundtruthAndPredicted,
            numberLabelsInGroundtruth + numberLabelsInPredicted - numberLabelsInIntersectBetweenGroundtruthAndPredicted,
        ];
    }
}
