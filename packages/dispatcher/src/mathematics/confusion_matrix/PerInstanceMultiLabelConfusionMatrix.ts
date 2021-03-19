/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IPerInstanceMultiLabelConfusionMatrix } from "./IPerInstanceMultiLabelConfusionMatrix";
import { PerInstanceMultiLabelConfusionMatrixWithBinaryArrayBase } from "./PerInstanceMultiLabelConfusionMatrixWithBinaryArrayBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { PredictionType } from "../../label_structure/PredictionType";
import { PredictionTypeArrayOutputIndex } from "../../label_structure/PredictionType";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class PerInstanceMultiLabelConfusionMatrix
extends PerInstanceMultiLabelConfusionMatrixWithBinaryArrayBase {
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ---- public static evaluatePerInstanceMultiLabelSubsetPrediction(groundTruths: any[], predictions: any[]): number {
    // ---- NOTE-NO-NEED-YET ----     if (predictions.length <= 0) {
    // ---- NOTE-NO-NEED-YET ----         if (groundTruths.length <= 0) {
    // ---- NOTE-NO-NEED-YET ----             return PredictionType.TrueNegative;
    // ---- NOTE-NO-NEED-YET ----             // ---- NOTE ---- PredictionType.TrueNegative for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----             // ---- NOTE ---- true negative as there is no prediction on an empty ground-truth set.
    // ---- NOTE-NO-NEED-YET ----         }
    // ---- NOTE-NO-NEED-YET ----         return PredictionType.FalseNegative;
    // ---- NOTE-NO-NEED-YET ----         // ---- NOTE ---- PredictionType.FalseNegative for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----         // ---- NOTE ---- false negative as there is no prediction on a non-empty ground-truth set.
    // ---- NOTE-NO-NEED-YET ----     }
    // ---- NOTE-NO-NEED-YET ----     for (const prediction of predictions) {
    // ---- NOTE-NO-NEED-YET ----         if (!groundTruths.includes(prediction)) {
    // ---- NOTE-NO-NEED-YET ----             return PredictionType.FalsePositive;
    // ---- NOTE-NO-NEED-YET ----             // ---- NOTE ---- PredictionType.FalsePositive for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----             // ---- NOTE ---- false positive as there is a prediction not in the ground-truth set.
    // ---- NOTE-NO-NEED-YET ----         }
    // ---- NOTE-NO-NEED-YET ----     }
    // ---- NOTE-NO-NEED-YET ----     return PredictionType.TruePositive;
    // ---- NOTE-NO-NEED-YET ----     // ---- NOTE ---- PredictionType.TruePositive for
    // ---- NOTE-NO-NEED-YET ----     // ---- NOTE ---- true positive as every prediction is in the ground-trueh set.
    // ---- NOTE-NO-NEED-YET ---- }

    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ---- public static evaluatePerInstanceMultiLabelPrediction(groundTruths: any[], predictions: any[]): number[] {
    // ---- NOTE-NO-NEED-YET ----   const microConfusionMatrix: number[] = [0, 0, 0];
    // ---- NOTE-NO-NEED-YET ----   for (const prediction of predictions) {
    // ---- NOTE-NO-NEED-YET ----       if (groundTruths.includes(prediction)) {
    // ---- NOTE-NO-NEED-YET ----           microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForTruePositive]++;
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForTruePositive for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- true positive as the prediction is in the ground-truth set.
    // ---- NOTE-NO-NEED-YET ----       } else {
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----           microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalsePositive]++;
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalsePositive for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- false positive as the prediction is not in the ground-truth set.
    // ---- NOTE-NO-NEED-YET ----       }
    // ---- NOTE-NO-NEED-YET ----   }
    // ---- NOTE-NO-NEED-YET ----   for (const groundTruth of groundTruths) {
    // ---- NOTE-NO-NEED-YET ----       if (!predictions.includes(groundTruth)) {
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----           microConfusionMatrix[PredictionTypeArrayOutputIndex.IndexForFalseNegative]++;
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- PredictionTypeArrayOutputIndex.IndexForFalseNegative for
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-NO-NEED-YET ----           // ---- NOTE ---- false negative as the ground-truth is not in the prediction set.
    // ---- NOTE-NO-NEED-YET ----       }
    // ---- NOTE-NO-NEED-YET ----   }
    // ---- NOTE-NO-NEED-YET ----   return microConfusionMatrix;
    // ---- NOTE-NO-NEED-YET ---- }

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(numberInstances, labels, labelMap, populateTrueNegatives);
    }

    public addInstanceByLabelIndexes(
        instanceIndex: number,
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number = 1): void {
        this.validateInstanceId(instanceIndex);
        this.validateLabelIds(groundTrueLabelIds);
        this.validateLabelIds(predictedLabelIds);
        // ---- NOTE ---- implementation 1 - does not avoid redundant label predictions -can be faster with many labels.
        let numberTruePositives: number  = 0;
        let numberOfFalsePositives: number = 0;
        for (const predictedLabelId of predictedLabelIds) {
            const isInGroundTruthLabelIds: boolean = this.isLabelIdInArray(groundTrueLabelIds, predictedLabelId);
            if (isInGroundTruthLabelIds) {
                numberTruePositives++;
            } else {
                numberOfFalsePositives++;
            }
        }
        let numberOfFalseNegatives: number = 0;
        for (const groundTrueLabelId of groundTrueLabelIds) {
            const isInPredictedLabelIds: boolean = this.isLabelIdInArray(predictedLabelIds, groundTrueLabelId);
            if (!isInPredictedLabelIds) {
                numberOfFalseNegatives++;
            }
        }
        this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(numberTruePositives * value, false);
        this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(numberOfFalseNegatives * value, false);
        this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(numberOfFalsePositives * value, false);
        if (this.doesPopulateTrueNegatives()) {
            const numberOfTrueNegatives: number =
                this.getNumberLabels() - numberTruePositives - numberOfFalsePositives - numberOfFalseNegatives;
            this.getBinaryConfusionMatrices()[instanceIndex].addToTrueNegatives(numberOfTrueNegatives * value, false);
        }
        // ---- NOTE ---- implementation 2 - filter out redundant label predictions.
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW --- for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---     const isInGroundTruthLabelIds: boolean = this.isLabelIdInArray(groundTrueLabelIds, labelId);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---     const isInPredictedLabelIds: boolean = this.isLabelIdInArray(predictedLabelIds, labelId);
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---     if (isInGroundTruthLabelIds) {
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         if (isInPredictedLabelIds) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---             this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(value, false);
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         } else {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---             this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(value, false);
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         }
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---     } else {
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         if (isInPredictedLabelIds) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---             this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(value, false);
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         } else {
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---             if (this.doesPopulateTrueNegatives()) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---                 this.getBinaryConfusionMatrices()[instanceIndex].addToTrueNegatives(value, false);
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---             }
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---         }
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW ---     }
        // ---- NOTE-USE-IMPLEMENTaTION-1-FOR-NOW --- }
        this.getBinaryConfusionMatrices()[instanceIndex].calculateDerivedCells();
    }
}
