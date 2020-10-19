/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMultiLabelObjectConfusionMatrix } from "./IMultiLabelObjectConfusionMatrix";
import { MultiLabelConfusionMatrixBase } from "./MultiLabelConfusionMatrixBase";

import { Label } from "../../label_structure/Label";

import {DictionaryMapUtility} from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../Utility/Utility";

export abstract class MultiLabelObjectConfusionMatrixBase
extends MultiLabelConfusionMatrixBase
implements IMultiLabelObjectConfusionMatrix {

    constructor(
        labels: string[],
        labelMap: Map<string, number>) {
        super(labels, labelMap);
    }

    public abstract addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;

    public abstract addInstanceByLabelObjects(
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
}
