/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrixBaseMetrics } from "./IConfusionMatrixBaseMetrics";
import { IConfusionMatrixMeanDerivedWeightedMetrics } from "./IConfusionMatrixMeanDerivedWeightedMetrics";
import { IConfusionMatrixMeanMetrics } from "./IConfusionMatrixMeanMetrics";
import { IConfusionMatrixQuantileMetrics } from "./IConfusionMatrixQuantileMetrics";
import { IConfusionMatrixSummationMetrics } from "./IConfusionMatrixSummationMetrics";

import { IConfusionMatrix } from "./IConfusionMatrix";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

export interface IConfusionMatrixagglomeratedMetricStructure {
    confusionMatrix: IConfusionMatrix;
    labelBinaryConfusionMatrixBasicMetricMap: Map<string, Map<string, number>>;
    labelBinaryConfusionMatrixMap: Map<string, BinaryConfusionMatrix>;
    microQuantileMetrics: IConfusionMatrixQuantileMetrics;
    macroQuantileMetrics: IConfusionMatrixQuantileMetrics;
    microAverageMetrics: IConfusionMatrixBaseMetrics;
    summationMicroAverageMetrics: IConfusionMatrixSummationMetrics;
    macroAverageMetrics: IConfusionMatrixMeanMetrics;
    summationMacroAverageMetrics: IConfusionMatrixMeanMetrics;
    positiveSupportLabelMacroAverageMetrics: IConfusionMatrixMeanMetrics;
    positiveSupportLabelSummationMacroAverageMetrics: IConfusionMatrixMeanMetrics;
    weightedMacroAverageMetrics: IConfusionMatrixMeanDerivedWeightedMetrics;
    summationWeightedMacroAverageMetrics: IConfusionMatrixMeanMetrics;
}
