/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { ILabelObjectConfusionMatrix } from "./ILabelObjectConfusionMatrix";

import { Label } from "../../label_structure/Label";

export interface IMultiLabelObjectConfusionMatrix extends IMultiLabelConfusionMatrix, ILabelObjectConfusionMatrix {

    addInstanceByLabelObjects(
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number): void;

    validateLabelObjects(
        labels: Label[],
        throwIfNotLegal: boolean): boolean;
}
