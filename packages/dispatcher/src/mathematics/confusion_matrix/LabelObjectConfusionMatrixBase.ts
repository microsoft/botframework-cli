/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ILabelObjectConfusionMatrix } from "./ILabelObjectConfusionMatrix";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";

import { Label } from "../../label_structure/Label";

import { Utility } from "../../utility/Utility";

export abstract class LabelObjectConfusionMatrixBase
extends ConfusionMatrixBase
implements ILabelObjectConfusionMatrix {

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
    }

    public validateLabelObject(
        label: Label,
        throwIfNotLegal: boolean = true): boolean {
        if (!(label.name in this.getLabelMap())) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `label=${label}, not int the label map=${Utility.jsonStringify(this.getLabelMap())}`);
            }
            return false;
        }
        return true;
    }
}
