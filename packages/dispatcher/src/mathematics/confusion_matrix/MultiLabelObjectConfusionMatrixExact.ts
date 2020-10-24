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

export class MultiLabelObjectConfusionMatrixExact
extends MultiLabelObjectConfusionMatrixWithBinaryBase {

    protected labelObjectHasTrueNegative: boolean = false;

    constructor(
        labels: string[],
        labelMap: Map<string, number>,
        labelObjectHasTrueNegative: boolean = false) {
        super(labels, labelMap);
        this.labelObjectHasTrueNegative = labelObjectHasTrueNegative;
    }

    public addInstanceByLabelObjects(
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number = 1): void {
        this.validateLabelObjects(groundTrueLabels);
        this.validateLabelObjects(predictedLabels);
        if (Utility.isEmptyGenericArray(predictedLabels)) {
            if (Utility.isEmptyGenericArray(groundTrueLabels)) {
                if (this.labelObjectHasTrueNegative) {
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
        // ---- NOTE-FOR-REFERENCE ---- for (const predictedLabel of predictedLabels) {
        // ---- NOTE-FOR-REFERENCE ----     let predictedIsInGroundTruth: boolean = false;
        // ---- NOTE-FOR-REFERENCE ----     for (const groundTrueLabel of groundTrueLabels) {
        // ---- NOTE-FOR-REFERENCE ----         if (predictedLabel.equals(groundTrueLabel)) {
        // ---- NOTE-FOR-REFERENCE ----             predictedIsInGroundTruth = true;
        // ---- NOTE-FOR-REFERENCE ----             break;
        // ---- NOTE-FOR-REFERENCE ----         }
        // ---- NOTE-FOR-REFERENCE ----     }
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----     const predictedLabelId: number = this.labelMap.get(predictedLabel.name) as number;
        // ---- NOTE-FOR-REFERENCE ----     if (predictedIsInGroundTruth) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----         this.getBinaryConfusionMatrices()[predictedLabelId].addToTruePositives(value, false);
        // ---- NOTE-FOR-REFERENCE ----     } else {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----         this.getBinaryConfusionMatrices()[predictedLabelId].addToFalsePositives(value, false);
        // ---- NOTE-FOR-REFERENCE ----     }
        // ---- NOTE-FOR-REFERENCE ---- }
        // ---- NOTE-FOR-REFERENCE ---- for (const groundTrueLabel of groundTrueLabels) {
        // ---- NOTE-FOR-REFERENCE ----     let groundTruthIsInPredicted: boolean = false;
        // ---- NOTE-FOR-REFERENCE ----     for (const predictedLabel of predictedLabels) {
        // ---- NOTE-FOR-REFERENCE ----         if (groundTrueLabel.equals(predictedLabel)) {
        // ---- NOTE-FOR-REFERENCE ----             groundTruthIsInPredicted = true;
        // ---- NOTE-FOR-REFERENCE ----             break;
        // ---- NOTE-FOR-REFERENCE ----         }
        // ---- NOTE-FOR-REFERENCE ----     }
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----     const groundTrueLabelId: number = this.labelMap.get(groundTrueLabel.name) as number;
        // ---- NOTE-FOR-REFERENCE ----     if (!groundTruthIsInPredicted) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----         this.getBinaryConfusionMatrices()[groundTrueLabelId].addToFalseNegatives(value, false);
        // ---- NOTE-FOR-REFERENCE ----     }
        // ---- NOTE-FOR-REFERENCE ---- }
        // ---- NOTE-FOR-REFERENCE ---- for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
        // ---- NOTE-FOR-REFERENCE ----     this.getBinaryConfusionMatrices()[labelId].calculateDerivedCells();
        // ---- NOTE-FOR-REFERENCE ---- }
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
