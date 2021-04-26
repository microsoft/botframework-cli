/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrix } from "./IConfusionMatrix";

import { Label } from "../../label_structure/Label";

export interface ILabelObjectConfusionMatrix
extends IConfusionMatrix {
    validateLabelObject(
        label: Label,
        throwIfNotLegal: boolean): boolean;
}
