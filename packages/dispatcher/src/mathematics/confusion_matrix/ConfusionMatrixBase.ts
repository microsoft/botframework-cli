/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IConfusionMatrix } from "./IConfusionMatrix";

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export abstract class ConfusionMatrixBase implements IConfusionMatrix {

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number } = {};

    constructor(
        labels: string[],
        labelMap: { [id: string]: number }) {
        this.resetLabelsAndMap(labels, labelMap);
    }

    public abstract reset(): void;

    public generateConfusionMatrixMetricStructure(): {
        "confusionMatrix": IConfusionMatrix,
        "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
        "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
        "macroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "support": number },
        "microAverageMetrics": {
            "accuracy": number,
            "truePositives": number,
            "support": number },
        "weightedMacroAverageMetrics": {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "support": number } } {
        const confusionMatrix: IConfusionMatrix = this;
        const crossValidationBinaryConfusionMatrix: BinaryConfusionMatrix[] =
            confusionMatrix.getBinaryConfusionMatrices();
        const labelMap: { [id: string]: number } =
            confusionMatrix.getLabelMap();
        const labelBinaryConfusionMatrixBasicMetricMap: { [id: string]: { [id: string]: number } } =
            Object.entries(labelMap).reduce(
                (accumulant: { [id: string]: { [id: string]: number } }, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrix[value].getBasicMetrics()}), {});
        const labelBinaryConfusionMatrixMap: { [id: string]: BinaryConfusionMatrix } =
            Object.entries(labelMap).reduce(
                (accumulant: { [id: string]: BinaryConfusionMatrix }, [id, value]) =>
                ({...accumulant, [id]: crossValidationBinaryConfusionMatrix[value]}), {});
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
            confusionMatrix.getBinaryConfusionMatrices();
        const microAverageMetricArray: {
            "averagePrecisionRecallF1Accuracy": number,
            "truePositives": number,
            "total": number } =
            confusionMatrix.getMicroAverageMetrics(binaryConfusionMatrices);
        const accuracy: number =
            microAverageMetricArray.averagePrecisionRecallF1Accuracy;
        const truePositives: number =
            microAverageMetricArray.truePositives;
        const supportMicroAverage: number =
            microAverageMetricArray.total;
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
        const macroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "total": number } =
            confusionMatrix.getMacroAverageMetrics(binaryConfusionMatrices);
        const averagePrecision: number =
            macroAverageMetricArray.averagePrecision;
        const averageRecall: number =
            macroAverageMetricArray.averageRecall;
        const averageF1Score: number =
            macroAverageMetricArray.averageF1Score;
        const supportMacroAverage: number =
            macroAverageMetricArray.total;
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
        const weightedMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "total": number } =
            confusionMatrix.getWeightedMacroAverageMetrics(binaryConfusionMatrices);
        const weightedAveragePrecision: number =
            weightedMacroAverageMetricArray.averagePrecision;
        const weightedAverageRecall: number =
            weightedMacroAverageMetricArray.averageRecall;
        const weightedAverageF1Score: number =
            weightedMacroAverageMetricArray.averageF1Score;
        const supportWeightedMacroAverage: number =
            weightedMacroAverageMetricArray.total;
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
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
            "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
            "macroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "support": number },
            "microAverageMetrics": {
                "accuracy": number,
                "truePositives": number,
                "support": number },
            "weightedMacroAverageMetrics": {
                "weightedAveragePrecision": number,
                "weightedAverageRecall": number,
                "weightedAverageF1Score": number,
                "support": number } } = {
            confusionMatrix,
            labelBinaryConfusionMatrixBasicMetricMap,
            labelBinaryConfusionMatrixMap,
            macroAverageMetrics,
            microAverageMetrics,
            weightedMacroAverageMetrics,
            };
        return confusionMatrixMetricStructure;
    }

    public getNumberLabels(): number {
        return this.labels.length;
    }
    public getLabels(): string[] {
        return this.labels;
    }
    public getLabelMap(): { [id: string]: number } {
        return this.labelMap;
    }

    public abstract getBinaryConfusionMatrices(): BinaryConfusionMatrix[];

    public getMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecisionRecallF1Accuracy": number,
        "truePositives": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const total: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const truePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0);
        const averagePrecisionRecallF1Accuracy: number =
            truePositives / total;
        const microAverageMetrics: {
            "averagePrecisionRecallF1Accuracy": number,
            "truePositives": number,
            "total": number } = {
            averagePrecisionRecallF1Accuracy,
            truePositives,
            total };
        return microAverageMetrics;
    }

    public getMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
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
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                total };
        return macroAverageMetrics;
    }

    public getWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
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
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                total };
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
                    `label=${label}, not int the label map=${Utility.jsonStringify(this.getLabelMap())}`);
            }
            return false;
        }
        return true;
    }

    protected resetLabelsAndMap(
        labels: string[],
        labelMap: { [id: string]: number }): void {
        DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(labels, labelMap);
        this.labels = labels;
        this.labelMap = labelMap;
    }
}
