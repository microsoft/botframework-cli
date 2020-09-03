/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export enum PredictionType {
    All = 0xFFFF,
    Unknown = 0,
    TP = 1,
    FP = 2,
    FN = 4,
    TN = 8,
    TruePositive = 1,
    FalsePositive = 2,
    FalseNegative = 4,
    TrueNegative = 8,
    TypeIError = 2,
    TypeIIError = 4,
    Positive = 5,
    Negative = 10,
    PredictedPositive = 3,
    PredictedNegative = 12,
    MaskPositive = 5,
    MaskNegative = 10,
    MaskPredictedPositive = 3,
    MaskPredictedNegative = 12,
    MaskCorrect = 9,
    MaskNotCorrect = 6,
    MaskInGroundTruth = 9,
    MaskNotInGroundTruth = 6,
    MaskCouldBeyondGroundTruth = 11,
}

export enum PredictionTypeArrayOutputIndex {
    IndexForTruePositive = 0,
    IndexForFalsePositive = 1,
    IndexForFalseNegative = 2,
    IndexForTrueNegative = 3,
    // ---- NOTE ---- sometimes, true negative is not recorded, so it's placed at last and can be omitted!
}
