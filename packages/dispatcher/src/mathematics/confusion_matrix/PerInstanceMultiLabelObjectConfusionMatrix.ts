/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IPerInstanceMultiLabelObjectConfusionMatrix } from "./IPerInstanceMultiLabelObjectConfusionMatrix";
import { PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase } from "./PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase";
import { LabelObjectConfusionMatrixBase } from "./LabelObjectConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { Label } from "../../label_structure/Label";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class PerInstanceMultiLabelObjectConfusionMatrix
extends PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase {

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(numberInstances, labels, labelMap, populateTrueNegatives);
    }

    public addInstanceByLabelObjects(
        instanceIndex: number,
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number = 1): void {
        this.validateInstanceId(instanceIndex);
        this.validateLabelObjects(groundTrueLabels);
        this.validateLabelObjects(predictedLabels);
        for (const predictedLabel of predictedLabels) {
            const predictedIsInGroundTruth: boolean = this.isLabelObjectInArray(groundTrueLabels, predictedLabel);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- if (predictedLabel.name === "served_dish") {
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----     Utility.debuggingLog(
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         "==== XXXXX=DEBUG=XXXXX ==== " +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `predictedLabel=${predictedLabel.toSimpleString()}, ` +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `predictedIsInGroundTruth=${predictedIsInGroundTruth}`);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- }
            // tslint:disable-next-line: max-line-length
            // ---- NOTE-NOT-USED ---- const predictedLabelId: number = this.labelMap.get(predictedLabel.name) as number;
            if (predictedIsInGroundTruth) {
                this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(value, false);
            } else {
                this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(value, false);
            }
        }
        for (const groundTrueLabel of groundTrueLabels) {
            const groundTruthIsInPredicted: boolean = this.isLabelObjectInArray(predictedLabels, groundTrueLabel);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- if (groundTrueLabel.name === "served_dish") {
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----     Utility.debuggingLog(
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         "==== XXXXX=DEBUG=XXXXX ==== " +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `groundTrueLabel=${groundTrueLabel.toSimpleString()}, ` +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `groundTruthIsInPredicted=${groundTruthIsInPredicted}`);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- }
            if (!groundTruthIsInPredicted) {
                // tslint:disable-next-line: max-line-length
                // ---- NOTE-NOT-USED ---- const groundTrueLabelId: number = this.labelMap.get(groundTrueLabel.name) as number;
                this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(value, false);
            }
        }
        this.getBinaryConfusionMatrices()[instanceIndex].calculateDerivedCells();
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
