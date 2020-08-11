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
        "microAverageMetrics": {
            "accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number },
        "macroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "summationMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "positiveSupportLabelMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "positiveSupportLabelSummationMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "weightedMacroAverageMetrics": {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "weightedAverageAccuracy": number,
            "weightedAverageSupport": number,
            "total": number },
        "summationWeightedMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } };

    getNumberLabels(): number;
    getLabels(): string[];
    getLabelMap(): { [id: string]: number };

    getBinaryConfusionMatrices(): BinaryConfusionMatrix[];

    getTotal(binaryConfusionMatrices: BinaryConfusionMatrix[]): number;

    getMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecisionRecallF1Accuracy": number,
        "truePositives": number,
        "falsePositives": number,
        "falseNegatives": number,
        "total": number };

    getMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    getSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    getPositiveSupportLabelMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    getPositiveSupportLabelSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    getWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    getSummationWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[]): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number };

    validateLabelId(
        labelId: number,
        throwIfNotLegal: boolean): boolean;
    validateLabel(
        label: string,
        throwIfNotLegal: boolean): boolean;
}
