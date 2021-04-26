/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixMeanDerivedWeightedMetrics {
    weightedAveragePrecision: number;
    weightedAverageRecall: number;
    weightedAverageF1Score: number;
    weightedAverageAccuracy: number;
    weightedAverageSupport: number;
    total: number;
}
