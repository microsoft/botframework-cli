/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultiLabelConfusionMatrixBase } from "./MultiLabelConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

export abstract class MultiLabelConfusionMatrixWithBinaryArrayBase
extends MultiLabelConfusionMatrixBase {

    constructor(
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(labels, labelMap, populateTrueNegatives);
        this.reset();
    }

    public reset(): void {
        const numberLabels: number = this.getNumberLabels();
        this.binaryConfusionMatrices =
            new Array<BinaryConfusionMatrix>(numberLabels);
        for (let l: number = 0; l < numberLabels; l++) {
            this.binaryConfusionMatrices[l] = new BinaryConfusionMatrix();
        }
    }
}
