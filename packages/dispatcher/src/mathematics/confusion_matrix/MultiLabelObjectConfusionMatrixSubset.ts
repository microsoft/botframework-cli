/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelObjectConfusionMatrix } from "./IMultiLabelObjectConfusionMatrix";
import { MultiLabelObjectConfusionMatrixWithBinaryBase } from "./MultiLabelObjectConfusionMatrixWithBinaryBase";
import { LabelObjectConfusionMatrixBase } from "./LabelObjectConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { Label } from "../../label_structure/Label";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class MultiLabelObjectConfusionMatrixSubset
extends MultiLabelObjectConfusionMatrixWithBinaryBase {

    constructor(
        labels: string[],
        labelMap: Map<string, number>) {
        super(labels, labelMap);
    }

    public addInstanceByLabelObjects(
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number = 1): void {
        this.validateLabelObjects(groundTrueLabels);
        this.validateLabelObjects(predictedLabels);
        for (const predictedLabel of predictedLabels) {
            let predictedIsInGroundTruth: boolean = false;
            for (const groundTrueLabel of groundTrueLabels) {
                if (predictedLabel.equals(groundTrueLabel)) {
                    predictedIsInGroundTruth = true;
                    break;
                }
            }
            const predictedLabelId: number = this.labelMap.get(predictedLabel.name) as number;
            if (predictedIsInGroundTruth) {
                this.getBinaryConfusionMatrices()[predictedLabelId].addToTruePositives(value, false);
            } else {
                this.getBinaryConfusionMatrices()[predictedLabelId].addToFalsePositives(value, false);
            }
        }
        for (const groundTrueLabel of groundTrueLabels) {
            let groundTruthIsInPredicted: boolean = false;
            for (const predictedLabel of predictedLabels) {
                if (groundTrueLabel.equals(predictedLabel)) {
                    groundTruthIsInPredicted = true;
                    break;
                }
            }
            const groundTrueLabelId: number = this.labelMap.get(groundTrueLabel.name) as number;
            if (!groundTruthIsInPredicted) {
                this.getBinaryConfusionMatrices()[groundTrueLabelId].addToFalseNegatives(value, false);
            }
        }
        for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
            this.getBinaryConfusionMatrices()[labelId].calculateDerivedCells();
        }
    }

    public addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number = 1): void {
        this.validateLabelIds(groundTrueLabelIds);
        this.validateLabelIds(predictedLabelIds);
        if (Utility.isEmptyNumberArray(predictedLabelIds)) {
            if (Utility.isEmptyNumberArray(groundTrueLabelIds)) {
                this.getBinaryConfusionMatrix().addToTrueNegatives(value, true);
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
        if (isPredictionSubsetOfGroundTruthLabelIds) {
            this.getBinaryConfusionMatrix().addToTruePositives(value, true);
        } else {
            this.getBinaryConfusionMatrix().addToFalsePositives(value, true);
        }
    }
}
