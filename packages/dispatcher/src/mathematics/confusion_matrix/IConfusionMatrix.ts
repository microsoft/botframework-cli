/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

export interface IConfusionMatrix {

    reset(): void;

    generateConfusionMatrixMetricStructure(): {
        "confusionMatrix": IConfusionMatrix,
        "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
        "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
        "macroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "support": number },
        "microAverageMetrics": {
            "accuracy": number,
            "truePositives": number,
            "support": number },
        "weightedMacroAverageMetrics": {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "support": number } };

    getNumberLabels(): number;
    getLabels(): string[];
    getLabelMap(): { [id: string]: number };

    getBinaryConfusionMatrices(): BinaryConfusionMatrix[];

    getMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecisionRecallF1Accuracy": number,
        "truePositives": number,
        "total": number };

    getMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "total": number };

    getWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "total": number };

    validateLabelId(
        labelId: number,
        throwIfNotLegal: boolean): boolean;
    validateLabel(
        label: string,
        throwIfNotLegal: boolean): boolean;
}
