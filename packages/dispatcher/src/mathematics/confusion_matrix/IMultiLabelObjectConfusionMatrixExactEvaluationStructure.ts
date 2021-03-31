/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultiLabelObjectConfusionMatrixExact } from "./MultiLabelObjectConfusionMatrixExact";

export interface IMultiLabelObjectConfusionMatrixExactEvaluationStructure {
    multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact;
    confusionMatrixAverageOutputLines: string[][];
    confusionMatrixAverageMetricsHtml: string;
    confusionMatrixAverageDescriptionOutputLines: string[][];
    confusionMatrixAverageDescriptionMetricsHtml: string;
}
