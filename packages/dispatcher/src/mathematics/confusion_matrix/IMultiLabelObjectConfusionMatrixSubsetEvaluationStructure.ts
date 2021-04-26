/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultiLabelObjectConfusionMatrixSubset } from "./MultiLabelObjectConfusionMatrixSubset";

export interface IMultiLabelObjectConfusionMatrixSubsetEvaluationStructure {
    multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset;
    confusionMatrixAverageOutputLines: string[][];
    confusionMatrixAverageMetricsHtml: string;
    confusionMatrixAverageDescriptionOutputLines: string[][];
    confusionMatrixAverageDescriptionMetricsHtml: string;
}
