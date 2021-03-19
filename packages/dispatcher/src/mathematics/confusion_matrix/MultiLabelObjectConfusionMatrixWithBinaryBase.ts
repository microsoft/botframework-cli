/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IMultiLabelObjectConfusionMatrix } from "./IMultiLabelObjectConfusionMatrix";
import { MultiLabelObjectConfusionMatrixBase } from "./MultiLabelObjectConfusionMatrixBase";
import { LabelObjectConfusionMatrixBase } from "./LabelObjectConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class MultiLabelObjectConfusionMatrixWithBinaryBase
extends MultiLabelObjectConfusionMatrixBase {

    protected binaryConfusionMatrix: BinaryConfusionMatrix = new BinaryConfusionMatrix();

    constructor(
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(labels, labelMap, populateTrueNegatives);
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
