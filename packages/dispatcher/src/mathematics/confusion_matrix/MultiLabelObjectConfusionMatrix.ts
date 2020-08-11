/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelObjectConfusionMatrix } from "./IMultiLabelObjectConfusionMatrix";
import { MultiLabelObjectConfusionMatrixWithBinaryArrayBase } from "./MultiLabelObjectConfusionMatrixWithBinaryArrayBase";
import { LabelObjectConfusionMatrixBase } from "./LabelObjectConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { Label } from "../../label_structure/Label";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class MultiLabelObjectConfusionMatrix
extends MultiLabelObjectConfusionMatrixWithBinaryArrayBase {

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
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
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- if (predictedLabel.name === "served_dish") {
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----     Utility.debuggingLog(
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         "==== XXXXX=DEBUG=XXXXX ==== " +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `predictedLabel=${predictedLabel.toSimpleString()}, ` +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `predictedIsInGroundTruth=${predictedIsInGroundTruth}`);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- }
            const predictedLabelId: number = this.labelMap[predictedLabel.name];
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
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- if (groundTrueLabel.name === "served_dish") {
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----     Utility.debuggingLog(
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         "==== XXXXX=DEBUG=XXXXX ==== " +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `groundTrueLabel=${groundTrueLabel.toSimpleString()}, ` +
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ----         `groundTruthIsInPredicted=${groundTruthIsInPredicted}`);
            // ---- NOTE-PLACE-HOLDER-FOR-TRACING ---- }
            if (!groundTruthIsInPredicted) {
                const groundTrueLabelId: number = this.labelMap[groundTrueLabel.name];
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
