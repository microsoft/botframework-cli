/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { Utility } from "../../utility/Utility";

export function exampleFunctionBinaryConfusionMatrix(): void {
    const cell11: number = 1;
    const row1: number = 2;
    const column1: number = 2;
    const total: number = 4;
    const binaryConfusionMatrix = new BinaryConfusionMatrix(
        total,
        cell11,
        row1,
        column1);
    Utility.debuggingLog(
        "getTotal() = " + binaryConfusionMatrix.getTotal());
    Utility.debuggingLog(
        "getPrecision() = " + binaryConfusionMatrix.getPrecision());
    Utility.debuggingLog(
        "getRecall() = " + binaryConfusionMatrix.getRecall());
    Utility.debuggingLog(
        "getF1Score() = " + binaryConfusionMatrix.getF1Score());
}

if (require.main === module) {
    exampleFunctionBinaryConfusionMatrix();
}
