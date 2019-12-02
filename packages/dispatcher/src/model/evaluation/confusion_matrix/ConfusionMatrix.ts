/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrixMetrics } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { Utility } from "../../../utility/Utility";

export class ConfusionMatrix {

    public static generateConfusionMatrixMetricStructure(
        confusionMatrix: ConfusionMatrix): { "confusionMatrix": ConfusionMatrix,
            "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
            "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrixMetrics; },
            "macroAverageMetrics": { "averagePrecision": number,
                                     "averageRecall": number,
                                     "averageF1Score": number,
                                     "totalMacroAverage": number },
            "microAverageMetrics": { "accuracy": number,
                                     "truePositives": number,
                                     "totalMicroAverage": number },
            "weightedMacroAverageMetrics": { "weightedAveragePrecision": number,
                                     "weightedAverageRecall": number,
                                     "weightedAverageF1Score": number,
                                     "weightedTotalMacroAverage": number } } {
        const crossValidationBinaryConfusionMatrixMetrics: BinaryConfusionMatrixMetrics[] =
            confusionMatrix.getBinaryConfusionMatrices();
        const labelMap: { [id: string]: number; } =
            confusionMatrix.getLabelMap();
        const labelBinaryConfusionMatrixDerivedMetricMap: { [id: string]: { [id: string]: number }; } =
            Object.entries(labelMap).reduce(
                (accumulant, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrixMetrics[value].getBasicMetrics()}), {});
        const labelBinaryConfusionMatrixMetricMap: { [id: string]: BinaryConfusionMatrixMetrics; } =
            Object.entries(labelMap).reduce(
                (accumulant, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrixMetrics[value]}), {});
        const microAverageMetricArray: [number, number, number] =
            confusionMatrix.getMicroAverageMetrics();
        const accuracy: number =
            microAverageMetricArray[0];
        const truePositives: number =
            microAverageMetricArray[1];
        const totalMicroAverage: number =
            microAverageMetricArray[2];
        const microAverageMetrics: { "accuracy": number,
            "truePositives": number,
            "totalMicroAverage": number } = { accuracy,
            truePositives,
            totalMicroAverage };
        const macroAverageMetricArray: [number, number, number, number] =
            confusionMatrix.getMacroAverageMetrics();
        const averagePrecision: number =
            macroAverageMetricArray[0];
        const averageRecall: number =
            macroAverageMetricArray[1];
        const averageF1Score: number =
            macroAverageMetricArray[2];
        const totalMacroAverage: number =
            macroAverageMetricArray[3];
        const macroAverageMetrics: { "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "totalMacroAverage": number } = { averagePrecision,
            averageRecall,
            averageF1Score,
            totalMacroAverage };
        const weightedMacroAverageMetricArray: [number, number, number, number] =
            confusionMatrix.getWeightedMacroAverageMetrics();
        const weightedAveragePrecision: number =
            weightedMacroAverageMetricArray[0];
        const weightedAverageRecall: number =
            weightedMacroAverageMetricArray[1];
        const weightedAverageF1Score: number =
            weightedMacroAverageMetricArray[2];
        const weightedTotalMacroAverage: number =
            weightedMacroAverageMetricArray[3];
        const weightedMacroAverageMetrics: { "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "weightedTotalMacroAverage": number } = { weightedAveragePrecision,
            weightedAverageRecall,
            weightedAverageF1Score,
            weightedTotalMacroAverage };
        const confusionMatrixMetricStructure: { "confusionMatrix": ConfusionMatrix,
            "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
            "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrixMetrics; },
            "macroAverageMetrics": { "averagePrecision": number,
                                     "averageRecall": number,
                                     "averageF1Score": number,
                                     "totalMacroAverage": number },
            "microAverageMetrics": { "accuracy": number,
                                     "truePositives": number,
                                     "totalMicroAverage": number },
            "weightedMacroAverageMetrics": { "weightedAveragePrecision": number,
                                     "weightedAverageRecall": number,
                                     "weightedAverageF1Score": number,
                                     "weightedTotalMacroAverage": number } } = {
            confusionMatrix,
            labelBinaryConfusionMatrixDerivedMetricMap,
            labelBinaryConfusionMatrixMetricMap,
            macroAverageMetrics,
            microAverageMetrics,
            weightedMacroAverageMetrics,
            };
        return confusionMatrixMetricStructure;
    }

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number; } = {};
    protected confusionMatrix: number[][] = [];
    protected confusionMatrixRows: number[] = [];
    protected confusionMatrixColumns: number[] = [];
    protected confusionMatrixTotal: number = 0;

    constructor(
        labels: string[],
        labelMap: { [id: string]: number; }) {
        Utility.validateStringMap(labels, labelMap);
        this.labels = labels;
        this.labelMap = labelMap;
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

    public addFrom(confusionMatrix: ConfusionMatrix): void {
        Utility.validateStringArrays(this.labels, confusionMatrix.labels);
        Utility.validateStringMaps(this.labelMap, confusionMatrix.labelMap);
        this.confusionMatrixTotal += confusionMatrix.confusionMatrixTotal;
        const numberLabels: number = this.getNumberLabels();
        for (let row: number = 0; row < numberLabels; row++) {
            this.confusionMatrixRows[row] += confusionMatrix.confusionMatrixRows[row];
            this.confusionMatrixColumns[row] += confusionMatrix.confusionMatrixColumns[row];
            for (let column: number = 0; column < numberLabels; column++) {
                this.confusionMatrix[row][column] += confusionMatrix.confusionMatrix[row][column];
            }
        }
    }

    public getNumberLabels(): number {
        return this.labels.length;
    }
    public getLabels(): string[] {
        return this.labels;
    }
    public getLabelMap(): { [id: string]: number; } {
        return this.labelMap;
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

    public addInstance(
        groundTrueLabel: string,
        predictedLabel: string,
        value: number = 1): void {
        this.validateLabel(groundTrueLabel);
        this.validateLabel(predictedLabel);
        const groundTrueLabelId: number = this.labelMap[groundTrueLabel];
        const predictedLabelId: number = this.labelMap[predictedLabel];
        this.addInstanceByLabelIndex(groundTrueLabelId, predictedLabelId, value);
    }

    public getBinaryConfusionMatrices(): BinaryConfusionMatrixMetrics[] {
        const numberLabels: number = this.getNumberLabels();
        const binaryConfusionMatrices: BinaryConfusionMatrixMetrics[] =
            new Array<BinaryConfusionMatrixMetrics>(numberLabels);
        for (let labelId: number = 0; labelId < numberLabels; labelId++) {
            binaryConfusionMatrices[labelId] =
                new BinaryConfusionMatrixMetrics(
                    this.confusionMatrixTotal,
                    this.confusionMatrix[labelId][labelId],
                    this.confusionMatrixRows[labelId],
                    this.confusionMatrixColumns[labelId]);
        }
        return binaryConfusionMatrices;
    }

    public getMicroAverageMetrics(): [number, number, number] {
        const binaryConfusionMatrices: BinaryConfusionMatrixMetrics[] =
            this.getBinaryConfusionMatrices();
        const total: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const truePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0);
        const microAverageMetrics: [number, number, number] =
            [truePositives / total, truePositives, total];
        return microAverageMetrics;
    }

    public getMacroAverageMetrics(): [number, number, number, number] {
        const binaryConfusionMatrices: BinaryConfusionMatrixMetrics[] =
            this.getBinaryConfusionMatrices();
        const numberLabels: number =
            binaryConfusionMatrices.length;
        const averagePrecision: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPrecision(), 0) / numberLabels;
        const averageRecall: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getRecall(), 0) / numberLabels;
        const averageF1Score: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getF1Score(), 0) / numberLabels;
        const total: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const macroAverageMetrics: [number, number, number, number] =
            [averagePrecision, averageRecall, averageF1Score, total];
        return macroAverageMetrics;
    }

    public getWeightedMacroAverageMetrics(): [number, number, number, number] {
        const binaryConfusionMatrices: BinaryConfusionMatrixMetrics[] =
            this.getBinaryConfusionMatrices();
        const total: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const averagePrecision: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPrecision() * entry.getPositives(), 0) / total;
        const averageRecall: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getRecall() * entry.getPositives(), 0) / total;
        const averageF1Score: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getF1Score() * entry.getPositives(), 0) / total;
        const macroAverageMetrics: [number, number, number, number] =
            [averagePrecision, averageRecall, averageF1Score, total];
        return macroAverageMetrics;
    }

    public validateLabelId(
        labelId: number,
        throwIfNotLegal: boolean = true): boolean {
        if (labelId < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `labelId=${labelId}, small than 0`);
            }
            return false;
        }
        if (labelId >= this.getNumberLabels()) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `labelId=${labelId}, greater or equal to number of labels, ${this.getNumberLabels()}`);
            }
            return false;
        }
        return true;
    }
    public validateLabel(
        label: string,
        throwIfNotLegal: boolean = true): boolean {
        if (!(label in this.getLabelMap())) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `label=${label}, not int the label map=${this.getLabelMap()}`);
            }
            return false;
        }
        return true;
    }
}
