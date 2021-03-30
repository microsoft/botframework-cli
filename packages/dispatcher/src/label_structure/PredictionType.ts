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
    TypeIError = 2, // ---- FP
    TypeIIError = 4, // ---- FN
    Positive = 5, // ---- TP & FN
    Negative = 10, // ---- FP & TN
    PredictedPositive = 3, // TP & FP
    PredictedNegative = 12, // FN & TN
    MaskPositive = 5, // ---- TP & FN
    MaskNegative = 10, // ---- FP & TN
    MaskPredictedPositive = 3, // TP & FP
    MaskPredictedNegative = 12, // FN & TN
    MaskCorrect = 9, // ---- TP & TN
    MaskNotCorrect = 6, // ---- FP & FN
    MaskInGroundTruth = 9, // ---- TP & TN
    MaskNotInGroundTruth = 6, // ---- FP & FN
    MaskCouldBeyondGroundTruth = 11, // ---- TP & FN & TN
}

export enum PredictionTypeArrayOutputIndex {
    IndexForTruePositive = 0,
    IndexForFalsePositive = 1,
    IndexForFalseNegative = 2,
    IndexForTrueNegative = 3,
    // ---- NOTE ---- sometimes, true negative is not recorded, so it's placed at the end and can be omitted!
}
