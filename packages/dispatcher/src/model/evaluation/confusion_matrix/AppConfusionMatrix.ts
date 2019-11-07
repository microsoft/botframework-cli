/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ConfusionMatrix } from "./ConfusionMatrix";

import { Utility } from "../../../utility/Utility";

export function exampleFunctionConfusionMatrix(): void {
    const labels: string[] = [ "label0", "label1", "label2" ];
    const labelMap: { [id: string]: number; } = { };
    labelMap.label0 = 0;
    labelMap.label1 = 1;
    labelMap.label2 = 2;
    const confusionMatrix = new ConfusionMatrix(labels, labelMap);
    confusionMatrix.addInstance("label0", "label0");
    confusionMatrix.addInstance("label0", "label1");
    confusionMatrix.addInstance("label0", "label2");
    confusionMatrix.addInstance("label1", "label0");
    confusionMatrix.addInstance("label1", "label1");
    confusionMatrix.addInstance("label1", "label2");
    confusionMatrix.addInstance("label2", "label0");
    confusionMatrix.addInstance("label2", "label1");
    confusionMatrix.addInstance("label2", "label2");
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
    Utility.debuggingLog(
        confusionMatrix.getLabelMap());
    Utility.debuggingLog(
        "rows=" + confusionMatrix.getConfusionMatrixRows());
    Utility.debuggingLog(
        "columns=" + confusionMatrix.getConfusionMatrixColumns());
    Utility.debuggingLog(
        "total=" + confusionMatrix.getConfusionMatrixTotal());
    const binaryConfusionMatrices = confusionMatrix.getBinaryConfusionMatrices();
    const confusionMatrixLabels: string[] = confusionMatrix.getLabels();
    for (let i = 0; i < binaryConfusionMatrices.length; i++) {
        const binaryConfusionMatrix = binaryConfusionMatrices[i];
        const label: string = confusionMatrixLabels[i];
        Utility.debuggingLog(
            label + ":" + i + ", precision = " + binaryConfusionMatrix.getPrecision());
        Utility.debuggingLog(
            label + ":" + i + ", recall    = " + binaryConfusionMatrix.getRecall());
        Utility.debuggingLog(
            label + ":" + i + ", F1        = " + binaryConfusionMatrix.getF1Score());
        Utility.debuggingLog(
            label + ":" + i + ", support   = " + binaryConfusionMatrix.getSupport());
        Utility.debuggingLog(
            label + ":" + i + ", total     = " + binaryConfusionMatrix.getTotal());
    }
    Utility.debuggingLog(
        "micro-average metrics = " + confusionMatrix.getMicroAverageMetrics());
    Utility.debuggingLog(
        "macro-average metrics = " + confusionMatrix.getMacroAverageMetrics());
    Utility.debuggingLog(
        "weighted-macro-average metrics = " + confusionMatrix.getWeightedMacroAverageMetrics());
}

if (require.main === module) {
    exampleFunctionConfusionMatrix();
}
