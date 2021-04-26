/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultiLabelConfusionMatrixWithBinaryArrayBase } from "./MultiLabelConfusionMatrixWithBinaryArrayBase";

import { PredictionType } from "../../label_structure/PredictionType";
import { PredictionTypeArrayOutputIndex } from "../../label_structure/PredictionType";

export class MultiLabelConfusionMatrix
extends MultiLabelConfusionMatrixWithBinaryArrayBase {
    public static evaluateMultiLabelSubsetPrediction(groundTruths: any[], predictions: any[]): number {
        if (predictions.length <= 0) {
            if (groundTruths.length <= 0) {
                return PredictionType.TrueNegative;
                /** ---- NOTE ---- PredictionType.TrueNegative for
                 *  true negative as there is no prediction on an empty ground-truth set.
                 */
            }
            return PredictionType.FalseNegative;
            /** ---- NOTE ---- PredictionType.FalseNegative for
             * false negative as there is no prediction on a non-empty ground-truth set.
             */
        }
        for (const prediction of predictions) {
            if (!groundTruths.includes(prediction)) {
                return PredictionType.FalsePositive;
                /** ---- NOTE ---- PredictionType.FalsePositive for
                 *  false positive as there is a prediction not in the ground-truth set.
                 */
            }
        }
        return PredictionType.TruePositive;
        /** ---- NOTE ---- PredictionType.TruePositive for
         *  true positive as every prediction is in the ground-trueh set.
         */
    }

      public static evaluateMultiLabelPrediction(groundTruths: any[], predictions: any[]): number[] {
        const microConfusionMatrix: number[] = [0, 0, 0];
        for (const prediction of predictions) {
            if (groundTruths.includes(prediction)) {
                microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForTruePositive]++;
                /** ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForTruePositive for
                 *  true positive as the prediction is in the ground-truth set.
                 */
            } else {
                microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalsePositive]++;
                /** ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalsePositive for
                 *  false positive as the prediction is not in the ground-truth set.
                 */
            }
        }
        for (const groundTruth of groundTruths) {
            if (!predictions.includes(groundTruth)) {
                microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalseNegative]++;
                /** ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalseNegative for
                 *  false negative as the ground-truth is not in the prediction set.
                 */
            }
        }
        return microConfusionMatrix;
      }

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
                    if (this.doesPopulateTrueNegatives()) {
                        this.getBinaryConfusionMatrices()[labelId].addToTrueNegatives(value, false);
                    }
                }
            }
        }
        for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
            this.getBinaryConfusionMatrices()[labelId].calculateDerivedCells();
        }
    }
}
