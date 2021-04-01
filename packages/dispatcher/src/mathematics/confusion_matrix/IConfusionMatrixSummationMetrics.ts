/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixSummationMetrics {
    summationPrecision: number;
    summationRecall: number;
    summationF1Score: number;
    summationAccuracy: number;
    summationTruePositives: number;
    summationFalsePositives: number;
    summationTrueNegatives: number;
    summationFalseNegatives: number;
    summationSupport: number;
    total: number;
}
