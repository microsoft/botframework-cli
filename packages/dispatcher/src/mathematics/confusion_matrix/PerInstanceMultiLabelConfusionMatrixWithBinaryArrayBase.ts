/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IPerInstanceMultiLabelConfusionMatrix } from "./IPerInstanceMultiLabelConfusionMatrix";
import { PerInstanceMultiLabelConfusionMatrixBase } from "./PerInstanceMultiLabelConfusionMatrixBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class PerInstanceMultiLabelConfusionMatrixWithBinaryArrayBase
extends PerInstanceMultiLabelConfusionMatrixBase {

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(numberInstances, labels, labelMap, populateTrueNegatives);
        this.reset();
    }

    public reset(): void {
        const numberInstances: number = this.getNumberInstances();
        this.binaryConfusionMatrices =
            new Array<BinaryConfusionMatrix>(numberInstances);
        for (let l: number = 0; l < numberInstances; l++) {
            this.binaryConfusionMatrices[l] = new BinaryConfusionMatrix();
        }
    }
}
