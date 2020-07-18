/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixWithBinaryArrayBase } from "./MultiLabelConfusionMatrixWithBinaryArrayBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class MultiLabelConfusionMatrix extends MultiLabelConfusionMatrixWithBinaryArrayBase {

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
    }

    public addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number = 1): void {
        this.validateLabelIds(groundTrueLabelIds);
        this.validateLabelIds(predictedLabelIds);
        for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
            const isInGroundTruthLabelIds: boolean = this.isLabelIdInArray(groundTrueLabelIds, labelId);
            const isInPredictedLabelIds: boolean = this.isLabelIdInArray(predictedLabelIds, labelId);
            if (isInGroundTruthLabelIds) {
                if (isInPredictedLabelIds) {
                    this.getBinaryConfusionMatrices()[labelId].addToTruePositives(value, false);
                } else {
                    this.getBinaryConfusionMatrices()[labelId].addToFalseNegatives(value, false);
                }
            } else {
                if (isInPredictedLabelIds) {
                    this.getBinaryConfusionMatrices()[labelId].addToFalsePositives(value, false);
                } else {
                    this.getBinaryConfusionMatrices()[labelId].addToTrueNegatives(value, false);
                }
            }
        }
        for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
            this.getBinaryConfusionMatrices()[labelId].calculateDerivedCells();
        }
    }
}
