/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrix } from "./IConfusionMatrix";

export interface IMultiLabelConfusionMatrix extends IConfusionMatrix {

    addInstanceByLabelIndexes(
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;

    validateLabelIds(
        labelIds: number[],
        throwIfNotLegal: boolean): boolean;
    validateLabels(
        labels: string[],
        throwIfNotLegal: boolean): boolean;
}
