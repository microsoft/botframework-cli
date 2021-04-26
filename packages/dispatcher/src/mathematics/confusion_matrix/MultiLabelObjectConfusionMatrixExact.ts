/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultiLabelObjectConfusionMatrixWithBinaryBase } from "./MultiLabelObjectConfusionMatrixWithBinaryBase";

import { Label } from "../../label_structure/Label";

import { Utility } from "../../utility/Utility";

export class MultiLabelObjectConfusionMatrixExact
extends MultiLabelObjectConfusionMatrixWithBinaryBase {

    constructor(
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(labels, labelMap, populateTrueNegatives);
    }

    public addInstanceByLabelObjects(
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number = 1): void {
        this.validateLabelObjects(groundTrueLabels);
        this.validateLabelObjects(predictedLabels);
        if (Utility.isEmptyGenericArray(predictedLabels)) {
            if (Utility.isEmptyGenericArray(groundTrueLabels)) {
                if (this.doesPopulateTrueNegatives()) {
                    this.getBinaryConfusionMatrix().addToTrueNegatives(value, true);
                }
            } else {
                this.getBinaryConfusionMatrix().addToFalseNegatives(value, true);
            }
            return;
        }
        let isPredictionSubsetOfGroundTruthLabels: boolean = true;
        for (const predictedLabel of predictedLabels) {
            if (!this.isLabelObjectInArray(groundTrueLabels, predictedLabel)) {
                isPredictionSubsetOfGroundTruthLabels = false;
                break;
            }
        }
        if (!isPredictionSubsetOfGroundTruthLabels) {
            this.getBinaryConfusionMatrix().addToFalsePositives(value, true);
            return;
        }
        let isGroundTruthSubsetOfPredictionLabels: boolean = true;
        for (const groundTrueLabel of groundTrueLabels) {
            if (!this.isLabelObjectInArray(predictedLabels, groundTrueLabel)) {
                isGroundTruthSubsetOfPredictionLabels = false;
                break;
            }
        }
        if (!isGroundTruthSubsetOfPredictionLabels) {
            this.getBinaryConfusionMatrix().addToFalseNegatives(value, true);
            return;
        }
        this.getBinaryConfusionMatrix().addToTruePositives(value, true);
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
