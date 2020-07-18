/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class MultiLabelConfusionMatrixBase
extends ConfusionMatrixBase implements IMultiLabelConfusionMatrix {

    protected binaryConfusionMatrices: BinaryConfusionMatrix[] = [];

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
    }

    public addFrom(other: MultiLabelConfusionMatrixBase): void {
        Utility.validateStringArrayPairEquality(this.labels, other.labels);
        DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(this.labelMap, other.labelMap);
        const numbergetBinaryConfusionMatrices: number = this.getBinaryConfusionMatrices().length;
        for (let l: number = 0; l < numbergetBinaryConfusionMatrices; l++) {
            this.binaryConfusionMatrices[l].addFrom(other.binaryConfusionMatrices[l]);
        }
    }

    public abstract addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;

    public addInstanceByLabels(
        groundTrueLabels: string[],
        predictedLabels: string[],
        value: number = 1): void {
        this.validateLabels(groundTrueLabels);
        this.validateLabels(predictedLabels);
        const groundTrueLabelIds: number[] = groundTrueLabels.map((x: string) => this.labelMap[x]);
        const predictedLabelIds: number[] = predictedLabels.map((x: string) => this.labelMap[x]);
        this.addInstanceByLabelIndexes(groundTrueLabelIds, predictedLabelIds, value);
    }

    public getBinaryConfusionMatrices(): BinaryConfusionMatrix[] {
        return this.binaryConfusionMatrices;
    }

    public validateLabelIds(
        labelIds: number[],
        throwIfNotLegal: boolean = true): boolean {
        for (const labelId of labelIds) {
            if (!this.validateLabelId(labelId, throwIfNotLegal)) {
                return false;
            }
        }
        return true;
    }
    public validateLabels(
        labels: string[],
        throwIfNotLegal: boolean = true): boolean {
        for (const label of labels) {
            if (!this.validateLabel(label, throwIfNotLegal)) {
                return false;
            }
        }
        return true;
    }

    // ---- NOTE ---- label id set is usually very small, mostly 1, so a linear search is sufficiently fast.
    public isLabelIdInArray(labelIds: number[], labelId: number): boolean {
        return labelIds.includes(labelId);
    }
}
