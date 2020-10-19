/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ILabelObjectConfusionMatrix } from "./ILabelObjectConfusionMatrix";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";

import { Label } from "../../label_structure/Label";

import {DictionaryMapUtility} from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class LabelObjectConfusionMatrixBase
extends ConfusionMatrixBase
implements ILabelObjectConfusionMatrix {

    constructor(
        labels: string[],
        labelMap: Map<string, number>) {
        super(labels, labelMap);
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
