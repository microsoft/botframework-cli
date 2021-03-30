/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IPerInstanceMultiLabelConfusionMatrix } from "./IPerInstanceMultiLabelConfusionMatrix";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class PerInstanceMultiLabelConfusionMatrixBase
extends ConfusionMatrixBase
implements IPerInstanceMultiLabelConfusionMatrix {

    protected numberInstances: number = 0;

    protected binaryConfusionMatrices: BinaryConfusionMatrix[] = [];

    protected populateTrueNegatives: boolean = false;

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(labels, labelMap);
        this.numberInstances = numberInstances;
        this.populateTrueNegatives = populateTrueNegatives;
    }

    public getNumberInstances(): number {
        return this.numberInstances;
    }

    public doesPopulateTrueNegatives(): boolean {
        return this.populateTrueNegatives;
    }

    public addFrom(other: PerInstanceMultiLabelConfusionMatrixBase): void {
        Utility.validateStringArrayPairEquality(this.labels, other.labels);
        DictionaryMapUtility.validateStringKeyNumberValueMapPair(this.labelMap, other.labelMap);
        const numbergetBinaryConfusionMatrices: number = this.getBinaryConfusionMatrices().length;
        for (let l: number = 0; l < numbergetBinaryConfusionMatrices; l++) {
            this.binaryConfusionMatrices[l].addFrom(other.binaryConfusionMatrices[l]);
        }
    }

    public abstract addInstanceByLabelIndexes(
        instanceIndex: number,
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;

    public addInstanceByLabels(
        instanceIndex: number,
        groundTrueLabels: string[],
        predictedLabels: string[],
        value: number = 1): void {
        this.validateInstanceId(instanceIndex);
        this.validateLabels(groundTrueLabels);
        this.validateLabels(predictedLabels);
        const groundTrueLabelIds: number[] = groundTrueLabels.map((x: string) => this.labelMap.get(x) as number);
        const predictedLabelIds: number[] = predictedLabels.map((x: string) => this.labelMap.get(x) as number);
        this.addInstanceByLabelIndexes(instanceIndex, groundTrueLabelIds, predictedLabelIds, value);
    }

    public getBinaryConfusionMatrices(): BinaryConfusionMatrix[] {
        return this.binaryConfusionMatrices;
    }

    public validateInstanceId(
        instanceIndex: number,
        throwIfNotLegal: boolean = true): boolean {
        if (instanceIndex < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `instanceIndex=${instanceIndex}, small than 0`);
            }
            return false;
        }
        if (instanceIndex >= this.getNumberInstances()) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `instanceIndex=${instanceIndex}, greater or equal to number of instances, ${this.getNumberInstances()}`);
            }
            return false;
        }
        return true;
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

    /** ---- NOTE ---- label id set is usually very small, mostly 1, so a linear search is sufficiently fast.
     */
    public isLabelIdInArray(labelIds: number[], labelId: number): boolean {
        return labelIds.includes(labelId);
    }
}
