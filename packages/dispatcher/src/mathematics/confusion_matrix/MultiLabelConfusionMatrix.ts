/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixWithBinaryArrayBase } from "./MultiLabelConfusionMatrixWithBinaryArrayBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class MultiLabelConfusionMatrix
extends MultiLabelConfusionMatrixWithBinaryArrayBase {

    public static evaluateMultiLabelPrediction(groundTruths: any[], predictions: any[]): number {
        if (predictions.length <= 0) {
          if (groundTruths.length <= 0) {
            return 3; // ---- NOTE ---- 3 for true negative as there is no prediction on an empty ground-truth set.
          }
          return 1; // ---- NOTE ---- 1 for false negative as there is no prediction on a non-empty ground-truth set.
        }
        for (const prediction of predictions) {
          if (!groundTruths.includes(prediction)) {
            return 2; // ---- NOTE ---- 2 for false positive as there is a prediction not in the ground-truth set.
          }
        }
        return 0; // ---- NOTE ---- 0 for true positive as every prediction is in the ground-trueh set.
      }

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
