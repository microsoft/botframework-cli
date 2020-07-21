/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixBase } from "./MultiLabelConfusionMatrixBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class MultiLabelConfusionMatrixWithBinaryArrayBase
extends MultiLabelConfusionMatrixBase {

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
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
