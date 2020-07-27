/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISingleLabelConfusionMatrix } from "./ISingleLabelConfusionMatrix";
import { ConfusionMatrixBase } from "./ConfusionMatrixBase";
import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class ConfusionMatrix
extends ConfusionMatrixBase
implements ISingleLabelConfusionMatrix {

    protected confusionMatrix: number[][] = [];
    protected confusionMatrixRows: number[] = [];
    protected confusionMatrixColumns: number[] = [];
    protected confusionMatrixTotal: number = 0;

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        super(labels, labelMap);
        this.reset();
    }

    public reset(): void {
        this.confusionMatrix = [];
        this.confusionMatrixRows = [];
        this.confusionMatrixColumns = [];
        this.confusionMatrixTotal = 0;
        const numberLabels: number = this.getNumberLabels();
        for (let row: number = 0; row < numberLabels; row++) {
            this.confusionMatrixRows[row] = 0;
            this.confusionMatrixColumns[row] = 0;
            this.confusionMatrix[row] = [];
            for (let column: number = 0; column < numberLabels; column++) {
                this.confusionMatrix[row][column] = 0;
            }
        }
    }

    public addFrom(other: ConfusionMatrix): void {
        Utility.validateStringArrayPairEquality(this.labels, other.labels);
        DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(this.labelMap, other.labelMap);
        this.confusionMatrixTotal += other.confusionMatrixTotal;
        const numberLabels: number = this.getNumberLabels();
        for (let row: number = 0; row < numberLabels; row++) {
            this.confusionMatrixRows[row] += other.confusionMatrixRows[row];
            this.confusionMatrixColumns[row] += other.confusionMatrixColumns[row];
            for (let column: number = 0; column < numberLabels; column++) {
                this.confusionMatrix[row][column] += other.confusionMatrix[row][column];
            }
        }
    }

    public getConfusionMatrixRows(): number[] {
        return this.confusionMatrixRows;
    }
    public getConfusionMatrixColumns(): number[] {
        return this.confusionMatrixColumns;
    }
    public getConfusionMatrixTotal(): number {
        return this.confusionMatrixTotal;
    }
    public getConfusionMatrix(): number[][] {
        return this.confusionMatrix;
    }

    public addInstanceByLabelIndex(
        groundTrueLabelId: number,
        predictedLabelId: number,
        value: number = 1): void {
        this.validateLabelId(groundTrueLabelId);
        this.validateLabelId(predictedLabelId);
        this.confusionMatrixRows[groundTrueLabelId] += value;
        this.confusionMatrixColumns[predictedLabelId] += value;
        this.confusionMatrixTotal += value;
        this.confusionMatrix[groundTrueLabelId][predictedLabelId] += value;
    }

    public addInstanceByLabel(
        groundTrueLabel: string,
        predictedLabel: string,
        value: number = 1): void {
        this.validateLabel(groundTrueLabel);
        this.validateLabel(predictedLabel);
        const groundTrueLabelId: number = this.labelMap[groundTrueLabel];
        const predictedLabelId: number = this.labelMap[predictedLabel];
        this.addInstanceByLabelIndex(groundTrueLabelId, predictedLabelId, value);
    }

    public getBinaryConfusionMatrices(): BinaryConfusionMatrix[] {
        const numberLabels: number = this.getNumberLabels();
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
            new Array<BinaryConfusionMatrix>(numberLabels);
        for (let labelId: number = 0; labelId < numberLabels; labelId++) {
            binaryConfusionMatrices[labelId] =
                new BinaryConfusionMatrix(
                    this.confusionMatrixTotal,
                    this.confusionMatrix[labelId][labelId],
                    this.confusionMatrixRows[labelId],
                    this.confusionMatrixColumns[labelId]);
        }
        return binaryConfusionMatrices;
    }
}
