/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

import { Utility } from "../utility/Utility";

export class PredictionStructureFoundation {

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureFoundation object has
     *  a text, which can be a NLP utterance, sentence, or document.
     *  It contains all the feature information for a prediction,
     *  thus it can also be an aggreagte of all the featuer records
     *  from a traditional multi-variate, machine-learning data instance.
     */
    public text: string;

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureFoundation object has a ground-truth
     *  collection (i.e., multi-labeled) of label indexes, that can contain 0, 1,
     *  or more labels in integer indexes.
     *  Empty label arrays are for an unsupervised-learning problem.
     *  If there is only one label in the array, then it's for a single-label
     *  supervised-learning problem, otherwise the instance is for
     *  a multi-label problem.
     */
    public labelsIndexes: number[];

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureFoundation object has a predicted
     *  collection (i.e., multi-labeled) of label indexes, that can contain 0, 1,
     *  or more labels in integer indexes.
     *  Empty label arrays are for an unsupervised-learning problem.
     *  If there is only one label in the array, then it's for a single-label
     *  supervised-learning problem, otherwise the instance is for
     *  a multi-label problem.
     */
     public labelsPredictedIndexes: number[];

    constructor(
        text: string,
        labelsIndexes: number[],
        labelsPredictedIndexes: number[]) {
        this.text = text;
        this.labelsIndexes = labelsIndexes;
        this.labelsPredictedIndexes = labelsPredictedIndexes;
    }

    public toObjectPredictionStructureFoundation(): {
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
