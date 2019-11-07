/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrixMetrics } from "./BinaryConfusionMatrix";

import { Utility } from "../../utility/Utility";

export function exampleFunctionBinaryConfusionMatrixMetrics(): void {
    const cell11: number = 1;
    const row1: number = 2;
    const column1: number = 2;
    const total: number = 4;
    const binaryConfusionMatrixMetrics = new BinaryConfusionMatrixMetrics(
        total,
        cell11,
        row1,
        column1);
    Utility.debuggingLog(
        "getTotal() = " + binaryConfusionMatrixMetrics.getTotal());
    Utility.debuggingLog(
        "getPrecision() = " + binaryConfusionMatrixMetrics.getPrecision());
    Utility.debuggingLog(
        "getRecall() = " + binaryConfusionMatrixMetrics.getRecall());
    Utility.debuggingLog(
        "getF1Score() = " + binaryConfusionMatrixMetrics.getF1Score());
}

if (require.main === module) {
    exampleFunctionBinaryConfusionMatrixMetrics();
}
