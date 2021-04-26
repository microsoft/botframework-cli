/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixMeanMetrics {
    averagePrecision: number;
    averageRecall: number;
    averageF1Score: number;
    averageAccuracy: number;
    averageTruePositives: number;
    averageFalsePositives: number;
    averageTrueNegatives: number;
    averageFalseNegatives: number;
    averageSupport: number;
    total: number;
}
