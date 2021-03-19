/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixWithBinaryBase } from "./MultiLabelConfusionMatrixWithBinaryBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class MultiLabelConfusionMatrixExact
extends MultiLabelConfusionMatrixWithBinaryBase {

    constructor(
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(labels, labelMap, populateTrueNegatives);
    }

    public addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number = 1): void {
        this.validateLabelIds(groundTrueLabelIds);
        this.validateLabelIds(predictedLabelIds);
        if (Utility.isEmptyNumberArray(predictedLabelIds)) {
            if (Utility.isEmptyNumberArray(groundTrueLabelIds)) {
                if (this.doesPopulateTrueNegatives()) {
                    this.getBinaryConfusionMatrix().addToTrueNegatives(value, true);
                }
            } else {
                this.getBinaryConfusionMatrix().addToFalseNegatives(value, true);
            }
            return;
        }
        let isPredictionSubsetOfGroundTruthLabelIds: boolean = true;
        for (const predictedLabelId of predictedLabelIds) {
            if (!this.isLabelIdInArray(groundTrueLabelIds, predictedLabelId)) {
                isPredictionSubsetOfGroundTruthLabelIds = false;
                break;
            }
        }
        if (!isPredictionSubsetOfGroundTruthLabelIds) {
            this.getBinaryConfusionMatrix().addToFalsePositives(value, true);
            return;
        }
        let isGroundTruthSubsetOfPredictionLabelIds: boolean = true;
        for (const groundTrueLabelId of groundTrueLabelIds) {
            if (!this.isLabelIdInArray(predictedLabelIds, groundTrueLabelId)) {
                isGroundTruthSubsetOfPredictionLabelIds = false;
                break;
            }
        }
        if (!isGroundTruthSubsetOfPredictionLabelIds) {
            this.getBinaryConfusionMatrix().addToFalseNegatives(value, true);
            return;
        }
        this.getBinaryConfusionMatrix().addToTruePositives(value, true);
    }
}
