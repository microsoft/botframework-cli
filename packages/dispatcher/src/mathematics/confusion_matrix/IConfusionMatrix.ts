/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrixagglomeratedMetricStructure } from "./IConfusionMatrixagglomeratedMetricStructure";
import { IConfusionMatrixBaseMetrics } from "./IConfusionMatrixBaseMetrics";
import { IConfusionMatrixBaseMicroAverageMetrics } from "./IConfusionMatrixBaseMicroAverageMetrics";
import { IConfusionMatrixMeanDerivedMetrics } from "./IConfusionMatrixMeanDerivedMetrics";
import { IConfusionMatrixMeanDerivedWeightedMetrics } from "./IConfusionMatrixMeanDerivedWeightedMetrics";
import { IConfusionMatrixMeanMetrics } from "./IConfusionMatrixMeanMetrics";
import { IConfusionMatrixQuantileMetrics } from "./IConfusionMatrixQuantileMetrics";
import { IConfusionMatrixSummationMetrics } from "./IConfusionMatrixSummationMetrics";

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

export interface IConfusionMatrix {

    reset(): void;

    generateConfusionMatrixMetricStructure(quantileConfiguration: number): IConfusionMatrixagglomeratedMetricStructure;

    getNumberLabels(): number;
    getLabels(): string[];
    getLabelMap(): Map<string, number>;

    getBinaryConfusionMatrices(): BinaryConfusionMatrix[];

    getTotal(binaryConfusionMatrices: BinaryConfusionMatrix[]): number;

    getMicroQuantileMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[], quantileConfiguration: number):
        IConfusionMatrixQuantileMetrics;

    getMacroQuantileMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[], quantileConfiguration: number):
        IConfusionMatrixQuantileMetrics;

    getMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): IConfusionMatrixBaseMicroAverageMetrics;

    getSummationMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixSummationMetrics;

    getMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanMetrics;

    getSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanMetrics;

    getPositiveSupportLabelMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanMetrics;

    getPositiveSupportLabelSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanMetrics;

    getWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanDerivedMetrics;

    getSummationWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]):
        IConfusionMatrixMeanMetrics;

    validateLabelId(
        labelId: number,
        throwIfNotLegal: boolean): boolean;
    validateLabel(
        label: string,
        throwIfNotLegal: boolean): boolean;
}
