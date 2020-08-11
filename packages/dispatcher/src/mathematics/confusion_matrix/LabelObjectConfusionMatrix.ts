/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISingleLabelObjectConfusionMatrix } from "./ISingleLabelObjectConfusionMatrix";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { Label } from "../../label_structure/Label";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class LabelObjectConfusionMatrix
extends ConfusionMatrix
implements ISingleLabelObjectConfusionMatrix {

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
    }

    public addInstanceByLabelObject(
        groundTrueLabel: Label,
        predictedLabel: Label,
        value: number = 1): void {
        this.validateLabelObject(groundTrueLabel);
        this.validateLabelObject(predictedLabel);
        const groundTrueLabelId: number = this.labelMap[groundTrueLabel.name];
        const predictedLabelId: number = this.labelMap[predictedLabel.name];
        this.addInstanceByLabelIndex(groundTrueLabelId, predictedLabelId, value);
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
