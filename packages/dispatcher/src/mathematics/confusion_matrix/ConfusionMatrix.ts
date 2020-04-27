/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export class ConfusionMatrix {

    public static generateConfusionMatrixMetricStructure(
        confusionMatrix: ConfusionMatrix): {
            "confusionMatrix": ConfusionMatrix,
            "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
            "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrix; },
            "macroAverageMetrics": { "averagePrecision": number,
                                     "averageRecall": number,
                                     "averageF1Score": number,
                                     "support": number },
            "microAverageMetrics": { "accuracy": number,
                                     "truePositives": number,
                                     "support": number },
            "weightedMacroAverageMetrics": { "weightedAveragePrecision": number,
                                             "weightedAverageRecall": number,
                                             "weightedAverageF1Score": number,
                                             "support": number } } {
        const crossValidationBinaryConfusionMatrix: BinaryConfusionMatrix[] =
            confusionMatrix.getBinaryConfusionMatrices();
        const labelMap: { [id: string]: number; } =
            confusionMatrix.getLabelMap();
        const labelBinaryConfusionMatrixDerivedMetricMap: { [id: string]: { [id: string]: number }; } =
            Object.entries(labelMap).reduce(
                (accumulant, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrix[value].getBasicMetrics()}), {});
        const labelBinaryConfusionMatrixMetricMap: { [id: string]: BinaryConfusionMatrix; } =
            Object.entries(labelMap).reduce(
                (accumulant, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrix[value]}), {});
        const microAverageMetricArray: [number, number, number] =
            confusionMatrix.getMicroAverageMetrics();
        const accuracy: number =
            microAverageMetricArray[0];
        const truePositives: number =
            microAverageMetricArray[1];
        const supportMicroAverage: number =
            microAverageMetricArray[2];
        const microAverageMetrics: {
            "accuracy": number,
            "truePositives": number,
            "support": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "accuracy": accuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "truePositives": truePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "support": supportMicroAverage };
        const macroAverageMetricArray: [number, number, number, number] =
            confusionMatrix.getMacroAverageMetrics();
        const averagePrecision: number =
            macroAverageMetricArray[0];
        const averageRecall: number =
            macroAverageMetricArray[1];
        const averageF1Score: number =
            macroAverageMetricArray[2];
        const supportMacroAverage: number =
            macroAverageMetricArray[3];
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "support": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": averagePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": averageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": averageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "support": supportMacroAverage };
        const weightedMacroAverageMetricArray: [number, number, number, number] =
            confusionMatrix.getWeightedMacroAverageMetrics();
        const weightedAveragePrecision: number =
            weightedMacroAverageMetricArray[0];
        const weightedAverageRecall: number =
            weightedMacroAverageMetricArray[1];
        const weightedAverageF1Score: number =
            weightedMacroAverageMetricArray[2];
        const supportWeightedMacroAverage: number =
            weightedMacroAverageMetricArray[3];
        const weightedMacroAverageMetrics: {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "support": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAveragePrecision": weightedAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageRecall": weightedAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageF1Score": weightedAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "support": supportWeightedMacroAverage };
        const confusionMatrixMetricStructure: {
            "confusionMatrix": ConfusionMatrix,
            "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
            "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrix; },
            "macroAverageMetrics": { "averagePrecision": number,
                                     "averageRecall": number,
                                     "averageF1Score": number,
                                     "support": number },
            "microAverageMetrics": { "accuracy": number,
                                     "truePositives": number,
                                     "support": number },
            "weightedMacroAverageMetrics": { "weightedAveragePrecision": number,
                                             "weightedAverageRecall": number,
                                             "weightedAverageF1Score": number,
                                             "support": number } } = {
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
        DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(labels, labelMap);
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
        Utility.validateStringArrayPairEquality(this.labels, confusionMatrix.labels);
        DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(this.labelMap, confusionMatrix.labelMap);
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

    public getMicroAverageMetrics(): [number, number, number] {
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
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
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
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
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
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
                    `label=${label}, not int the label map=${Utility.JSONstringify(this.getLabelMap())}`);
            }
            return false;
        }
        return true;
    }
}
