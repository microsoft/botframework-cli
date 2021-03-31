/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

export interface IMultiLabelObjectConfusionMatrixEvaluationStructure {
    binaryConfusionMatrices: BinaryConfusionMatrix[];
    confusionMatrixOutputLines: string[][];
    confusionMatrixMetricsHtml: string;
    confusionMatrixAverageOutputLines: string[][];
    confusionMatrixAverageMetricsHtml: string;
    confusionMatrixAverageDescriptionOutputLines: string[][];
    confusionMatrixAverageDescriptionMetricsHtml: string;
}
