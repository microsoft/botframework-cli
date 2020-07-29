/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrix } from "./IConfusionMatrix";

export interface ISingleLabelConfusionMatrix extends IConfusionMatrix {

    addInstanceByLabelIndex(
        groundTrueLabelId: number,
        predictedLabelId: number,
        value: number): void;
    addInstanceByLabel(
        groundTrueLabel: string,
        predictedLabel: string,
        value: number): void;
}
