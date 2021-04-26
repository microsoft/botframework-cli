/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixMeanDerivedMetrics {
    averagePrecision: number;
    averageRecall: number;
    averageF1Score: number;
    averageAccuracy: number;
    averageSupport: number;
    total: number;
}
