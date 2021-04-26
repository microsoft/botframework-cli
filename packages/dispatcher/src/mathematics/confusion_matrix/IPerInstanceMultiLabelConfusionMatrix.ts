/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrix } from "./IConfusionMatrix";

export interface IPerInstanceMultiLabelConfusionMatrix
extends IConfusionMatrix {

    getNumberInstances(): number;

    doesPopulateTrueNegatives(): boolean;

    addInstanceByLabelIndexes(
        instanceIndex: number,
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number): void;
    addInstanceByLabels(
        instanceIndex: number,
        groundTrueLabels: string[],
        predictedLabels: string[],
        value: number): void;

    validateInstanceId(
        instanceIndex: number,
        throwIfNotLegal: boolean): boolean;

    validateLabelIds(
        labelIds: number[],
        throwIfNotLegal: boolean): boolean;
    validateLabels(
        labels: string[],
        throwIfNotLegal: boolean): boolean;
}
