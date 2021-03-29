/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixBaseMetrics {
    accuracy: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    total: number;
}
