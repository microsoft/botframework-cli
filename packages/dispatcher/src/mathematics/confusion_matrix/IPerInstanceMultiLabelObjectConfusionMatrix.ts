/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IPerInstanceMultiLabelConfusionMatrix } from "./IPerInstanceMultiLabelConfusionMatrix";
import { ILabelObjectConfusionMatrix } from "./ILabelObjectConfusionMatrix";

import { Label } from "../../label_structure/Label";

export interface IPerInstanceMultiLabelObjectConfusionMatrix
extends IPerInstanceMultiLabelConfusionMatrix, ILabelObjectConfusionMatrix {

    addInstanceByLabelObjects(
        instanceIndex: number,
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number): void;

    validateLabelObjects(
        labels: Label[],
        throwIfNotLegal: boolean): boolean;
}
