/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IConfusionMatrixQuantileMetrics {
    quantilesPrecisions: number[];
    quantilesRecalls: number[];
    quantilesF1Scores: number[];
    quantilesTruePositives: number[];
    quantilesFalsePositives: number[];
    quantilesTrueNegatives: number[];
    quantilesFalseNegatives: number[];
    quantilesAccuracies: number[];
    quantilesSupports: number[];
    total: number;
}
