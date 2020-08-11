/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISingleLabelConfusionMatrix } from "./ISingleLabelConfusionMatrix";
import { ILabelObjectConfusionMatrix } from "./ILabelObjectConfusionMatrix";

import { Label } from "../../label_structure/Label";

export interface ISingleLabelObjectConfusionMatrix extends ISingleLabelConfusionMatrix, ILabelObjectConfusionMatrix {

    addInstanceByLabelObject(
        groundTrueLabel: Label,
        predictedLabel: Label,
        value: number): void;
}
