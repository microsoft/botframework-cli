/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixBaseMicroAverageMetrics {
    averagePrecisionRecallF1Accuracy: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    total: number;
}
