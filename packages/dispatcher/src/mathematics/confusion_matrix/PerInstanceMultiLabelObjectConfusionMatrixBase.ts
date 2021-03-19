/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IPerInstanceMultiLabelObjectConfusionMatrix } from "./IPerInstanceMultiLabelObjectConfusionMatrix";
import { PerInstanceMultiLabelConfusionMatrixBase } from "./PerInstanceMultiLabelConfusionMatrixBase";

import { Label } from "../../label_structure/Label";

import {DictionaryMapUtility} from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class PerInstanceMultiLabelObjectConfusionMatrixBase
extends PerInstanceMultiLabelConfusionMatrixBase
implements IPerInstanceMultiLabelObjectConfusionMatrix {

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(numberInstances, labels, labelMap, populateTrueNegatives);
    }

    public abstract addInstanceByLabelIndexes(
        instanceIndex: number,
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;

    public abstract addInstanceByLabelObjects(
        instanceIndex: number,
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number): void;

    public validateLabelObjects(
        labels: Label[],
        throwIfNotLegal: boolean = true): boolean {
        for (const label of labels) {
            if (!this.validateLabelObject(label, throwIfNotLegal)) {
                return false;
            }
        }
        return true;
    }

    public validateLabelObject(
        label: Label,
        throwIfNotLegal: boolean = true): boolean {
        if (!this.getLabelMap().has(label.name)) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `label=${label}, not int the label map=${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(this.getLabelMap())}`);
            }
            return false;
        }
        return true;
    }

    // ---- NOTE ---- label set is usually very small, mostly 1, so a linear search is sufficiently fast.
    public isLabelObjectInArray(labels: Label[], label: Label): boolean {
        for (const labelEntry of labels) {
            if (label.equals(labelEntry)) {
                return true;
            }
        }
        return false;
    }
}
