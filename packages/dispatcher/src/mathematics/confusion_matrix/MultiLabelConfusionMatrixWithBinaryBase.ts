/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelConfusionMatrix } from "./IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixBase } from "./MultiLabelConfusionMatrixBase";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class MultiLabelConfusionMatrixWithBinaryBase
extends MultiLabelConfusionMatrixBase {

    protected binaryConfusionMatrix: BinaryConfusionMatrix = new BinaryConfusionMatrix();

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
        this.reset();
    }

    public reset(): void {
        const numberLabels: number = this.getNumberLabels();
        this.binaryConfusionMatrix =
            new BinaryConfusionMatrix();
        this.binaryConfusionMatrices =
            new Array<BinaryConfusionMatrix>(1);
        this.binaryConfusionMatrices[0] =
            this.binaryConfusionMatrix;
    }

    public getBinaryConfusionMatrix(): BinaryConfusionMatrix {
        return this.binaryConfusionMatrix;
    }

    public getTotal(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): number {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        let binaryConfusionMatrix: BinaryConfusionMatrix =
            this.getBinaryConfusionMatrix();
        if (!Utility.isEmptyArray(binaryConfusionMatrices) && (binaryConfusionMatrices.length > 0)) {
            binaryConfusionMatrix = binaryConfusionMatrices[0];
        }
        const total: number =
            binaryConfusionMatrix.getTotal();
        return total;
    }
}
