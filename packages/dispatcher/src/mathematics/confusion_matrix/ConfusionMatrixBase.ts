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

    public generateConfusionMatrixMetricStructure(
        quantileConfiguration: number = 4): {
        "confusionMatrix": IConfusionMatrix,
        "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
        "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
        "microQuantileMetrics": {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number },
        "macroQuantileMetrics": {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number },
        "microAverageMetrics": {
            "accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number },
        "summationMicroAverageMetrics": {
            "summationPrecision": number,
            "summationRecall": number,
            "summationF1Score": number,
            "summationAccuracy": number,
            "summationTruePositives": number,
            "summationFalsePositives": number,
            "summationTrueNegatives": number,
            "summationFalseNegatives": number,
            "summationSupport": number,
            "total": number },
        "macroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "summationMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "positiveSupportLabelMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "positiveSupportLabelSummationMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number },
        "weightedMacroAverageMetrics": {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "weightedAverageAccuracy": number,
            "weightedAverageSupport": number,
            "total": number },
        "summationWeightedMacroAverageMetrics": {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } } {
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
        const microQuantileMetrics: {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number } =
            confusionMatrix.getMicroQuantileMetrics(binaryConfusionMatrices, quantileConfiguration);
        const macroQuantileMetrics: {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number } =
            confusionMatrix.getMacroQuantileMetrics(binaryConfusionMatrices, quantileConfiguration);
        const microAverageMetricArray: {
            "averagePrecisionRecallF1Accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number } =
            confusionMatrix.getMicroAverageMetrics(binaryConfusionMatrices);
        const accuracy: number =
            microAverageMetricArray.averagePrecisionRecallF1Accuracy;
        const truePositives: number =
            microAverageMetricArray.truePositives;
        const falsePositives: number =
            microAverageMetricArray.falsePositives;
        const falseNegatives: number =
            microAverageMetricArray.falseNegatives;
        const supportMicroAverage: number =
            microAverageMetricArray.total;
        const microAverageMetrics: {
            "accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "accuracy": accuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "truePositives": truePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "falsePositives": falsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "falseNegatives": falseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": supportMicroAverage };
        const summationMicroAverageMetricArray: {
            "summationPrecision": number,
            "summationRecall": number,
            "summationF1Score": number,
            "summationAccuracy": number,
            "summationTruePositives": number,
            "summationFalsePositives": number,
            "summationTrueNegatives": number,
            "summationFalseNegatives": number,
            "summationSupport": number,
            "total": number } =
            confusionMatrix.getSummationMicroAverageMetrics(binaryConfusionMatrices);
        const summationPrecision: number =
            summationMicroAverageMetricArray.summationPrecision;
        const summationRecall: number =
            summationMicroAverageMetricArray.summationRecall;
        const summationF1Score: number =
            summationMicroAverageMetricArray.summationF1Score;
        const summationAccuracy: number =
            summationMicroAverageMetricArray.summationAccuracy;
        const summationTruePositives: number =
            summationMicroAverageMetricArray.summationTruePositives;
        const summationFalsePositives: number =
            summationMicroAverageMetricArray.summationFalsePositives;
        const summationTrueNegatives: number =
            summationMicroAverageMetricArray.summationTrueNegatives;
        const summationFalseNegatives: number =
            summationMicroAverageMetricArray.summationFalseNegatives;
        const summationSupport: number =
            summationMicroAverageMetricArray.summationSupport;
        const total: number =
            summationMicroAverageMetricArray.total;
        const summationMicroAverageMetrics: {
            "summationPrecision": number,
            "summationRecall": number,
            "summationF1Score": number,
            "summationAccuracy": number,
            "summationTruePositives": number,
            "summationFalsePositives": number,
            "summationTrueNegatives": number,
            "summationFalseNegatives": number,
            "summationSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "summationPrecision": summationPrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationRecall": summationRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationF1Score": summationF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationAccuracy": summationAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationTruePositives": summationTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationFalsePositives": summationFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationTrueNegatives": summationTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationFalseNegatives": summationFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "summationSupport": summationSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": total };
        const macroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getMacroAverageMetrics(binaryConfusionMatrices);
        const averagePrecision: number =
            macroAverageMetricArray.averagePrecision;
        const averageRecall: number =
            macroAverageMetricArray.averageRecall;
        const averageF1Score: number =
            macroAverageMetricArray.averageF1Score;
        const averageAccuracy: number =
            macroAverageMetricArray.averageAccuracy;
        const averageTruePositives: number =
            macroAverageMetricArray.averageTruePositives;
        const averageFalsePositives: number =
            macroAverageMetricArray.averageFalsePositives;
        const averageTrueNegatives: number =
            macroAverageMetricArray.averageTrueNegatives;
        const averageFalseNegatives: number =
            macroAverageMetricArray.averageFalseNegatives;
        const averageSupport: number =
            macroAverageMetricArray.averageSupport;
        const supportMacroAverage: number =
            macroAverageMetricArray.total;
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": averagePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": averageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": averageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageAccuracy": averageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTruePositives": averageTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalsePositives": averageFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTrueNegatives": averageTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalseNegatives": averageFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageSupport": averageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": supportMacroAverage };
        const summationMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getSummationMacroAverageMetrics(binaryConfusionMatrices);
        const summationAveragePrecision: number =
            summationMacroAverageMetricArray.averagePrecision;
        const summationAverageRecall: number =
            summationMacroAverageMetricArray.averageRecall;
        const summationAverageF1Score: number =
            summationMacroAverageMetricArray.averageF1Score;
        const summationAverageAccuracy: number =
            summationMacroAverageMetricArray.averageAccuracy;
        const summationAverageTruePositives: number =
            summationMacroAverageMetricArray.averageTruePositives;
        const summationAverageFalsePositives: number =
            summationMacroAverageMetricArray.averageFalsePositives;
        const summationAverageTrueNegatives: number =
            summationMacroAverageMetricArray.averageTrueNegatives;
        const summationAverageFalseNegatives: number =
            summationMacroAverageMetricArray.averageFalseNegatives;
        const summationAverageSupport: number =
            summationMacroAverageMetricArray.averageSupport;
        const summationSupportMacroAverage: number =
            summationMacroAverageMetricArray.total;
        const summationMacroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": summationAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": summationAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": summationAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageAccuracy": summationAverageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTruePositives": summationAverageTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalsePositives": summationAverageFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTrueNegatives": summationAverageTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalseNegatives": summationAverageFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageSupport": summationAverageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": summationSupportMacroAverage };
        const positiveSupportLabelMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getPositiveSupportLabelMacroAverageMetrics(binaryConfusionMatrices);
        const positiveSupportLabelAveragePrecision: number =
            positiveSupportLabelMacroAverageMetricArray.averagePrecision;
        const positiveSupportLabelAverageRecall: number =
            positiveSupportLabelMacroAverageMetricArray.averageRecall;
        const positiveSupportLabelAverageF1Score: number =
            positiveSupportLabelMacroAverageMetricArray.averageF1Score;
        const positiveSupportLabelAverageAccuracy: number =
            positiveSupportLabelMacroAverageMetricArray.averageAccuracy;
        const positiveSupportLabelAverageTruePositives: number =
            positiveSupportLabelMacroAverageMetricArray.averageTruePositives;
        const positiveSupportLabelAverageFalsePositives: number =
            positiveSupportLabelMacroAverageMetricArray.averageFalsePositives;
        const positiveSupportLabelAverageTrueNegatives: number =
            positiveSupportLabelMacroAverageMetricArray.averageTrueNegatives;
        const positiveSupportLabelAverageFalseNegatives: number =
            positiveSupportLabelMacroAverageMetricArray.averageFalseNegatives;
        const positiveSupportLabelAverageSupport: number =
            positiveSupportLabelMacroAverageMetricArray.averageSupport;
        const positiveSupportLabelSupportMacroAverage: number =
            positiveSupportLabelMacroAverageMetricArray.total;
        const positiveSupportLabelMacroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": positiveSupportLabelAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": positiveSupportLabelAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": positiveSupportLabelAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageAccuracy": positiveSupportLabelAverageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTruePositives": positiveSupportLabelAverageTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalsePositives": positiveSupportLabelAverageFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTrueNegatives": positiveSupportLabelAverageTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalseNegatives": positiveSupportLabelAverageFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageSupport": positiveSupportLabelAverageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": positiveSupportLabelSupportMacroAverage };
        const positiveSupportLabelSummationMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics(binaryConfusionMatrices);
        const positiveSupportLabelSummationAveragePrecision: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averagePrecision;
        const positiveSupportLabelSummationAverageRecall: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageRecall;
        const positiveSupportLabelSummationAverageF1Score: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageF1Score;
        const positiveSupportLabelSummationAverageAccuracy: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageAccuracy;
        const positiveSupportLabelSummationAverageTruePositives: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageTruePositives;
        const positiveSupportLabelSummationAverageFalsePositives: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageFalsePositives;
        const positiveSupportLabelSummationAverageTrueNegatives: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageTrueNegatives;
        const positiveSupportLabelSummationAverageFalseNegatives: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageFalseNegatives;
        const positiveSupportLabelSummationAverageSupport: number =
            positiveSupportLabelSummationMacroAverageMetricArray.averageSupport;
        const positiveSupportLabelSummationSupportMacroAverage: number =
            positiveSupportLabelSummationMacroAverageMetricArray.total;
        const positiveSupportLabelSummationMacroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": positiveSupportLabelSummationAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": positiveSupportLabelSummationAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": positiveSupportLabelSummationAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageAccuracy": positiveSupportLabelSummationAverageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTruePositives": positiveSupportLabelSummationAverageTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalsePositives": positiveSupportLabelSummationAverageFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTrueNegatives": positiveSupportLabelSummationAverageTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalseNegatives": positiveSupportLabelSummationAverageFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageSupport": positiveSupportLabelSummationAverageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": positiveSupportLabelSummationSupportMacroAverage };
        const weightedMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getWeightedMacroAverageMetrics(binaryConfusionMatrices);
        const weightedAveragePrecision: number =
            weightedMacroAverageMetricArray.averagePrecision;
        const weightedAverageRecall: number =
            weightedMacroAverageMetricArray.averageRecall;
        const weightedAverageF1Score: number =
            weightedMacroAverageMetricArray.averageF1Score;
        const weightedAverageAccuracy: number =
            weightedMacroAverageMetricArray.averageAccuracy;
        const weightedAverageSupport: number =
            weightedMacroAverageMetricArray.averageSupport;
        const supportWeightedMacroAverage: number =
            weightedMacroAverageMetricArray.total;
        const weightedMacroAverageMetrics: {
            "weightedAveragePrecision": number,
            "weightedAverageRecall": number,
            "weightedAverageF1Score": number,
            "weightedAverageAccuracy": number,
            "weightedAverageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAveragePrecision": weightedAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageRecall": weightedAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageF1Score": weightedAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageAccuracy": weightedAverageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "weightedAverageSupport": weightedAverageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": supportWeightedMacroAverage };
        const summationWeightedMacroAverageMetricArray: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getSummationWeightedMacroAverageMetrics(binaryConfusionMatrices);
        const summationWeightedAveragePrecision: number =
            summationWeightedMacroAverageMetricArray.averagePrecision;
        const summationWeightedAverageRecall: number =
            summationWeightedMacroAverageMetricArray.averageRecall;
        const summationWeightedAverageF1Score: number =
            summationWeightedMacroAverageMetricArray.averageF1Score;
        const summationWeightedAverageAccuracy: number =
            summationWeightedMacroAverageMetricArray.averageAccuracy;
        const summationWeightedAverageTruePositives: number =
            summationWeightedMacroAverageMetricArray.averageTruePositives;
        const summationWeightedAverageFalsePositives: number =
            summationWeightedMacroAverageMetricArray.averageFalsePositives;
        const summationWeightedAverageTrueNegatives: number =
            summationWeightedMacroAverageMetricArray.averageTrueNegatives;
        const summationWeightedAverageFalseNegatives: number =
            summationWeightedMacroAverageMetricArray.averageFalseNegatives;
        const summationWeightedAverageSupport: number =
            summationWeightedMacroAverageMetricArray.averageSupport;
        const summationWeightedSupportMacroAverage: number =
            summationWeightedMacroAverageMetricArray.total;
        const summationWeightedMacroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageSupport": number,
            "total": number } = {
            // tslint:disable-next-line: object-literal-key-quotes
            "averagePrecision": summationWeightedAveragePrecision,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageRecall": summationWeightedAverageRecall,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageF1Score": summationWeightedAverageF1Score,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageAccuracy": summationWeightedAverageAccuracy,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTruePositives": summationWeightedAverageTruePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalsePositives": summationWeightedAverageFalsePositives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageTrueNegatives": summationWeightedAverageTrueNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageFalseNegatives": summationWeightedAverageFalseNegatives,
            // tslint:disable-next-line: object-literal-key-quotes
            "averageSupport": summationWeightedAverageSupport,
            // tslint:disable-next-line: object-literal-key-quotes
            "total": summationWeightedSupportMacroAverage };
        const confusionMatrixMetricStructure: {
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
            "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
            "microQuantileMetrics": {
                "quantilesPrecisions": number[],
                "quantilesRecalls": number[],
                "quantilesF1Scores": number[],
                "quantilesTruePositives": number[],
                "quantilesFalsePositives": number[],
                "quantilesTrueNegatives": number[],
                "quantilesFalseNegatives": number[],
                "quantilesAccuracies": number[],
                "quantilesSupports": number[],
                "total": number },
            "macroQuantileMetrics": {
                "quantilesPrecisions": number[],
                "quantilesRecalls": number[],
                "quantilesF1Scores": number[],
                "quantilesTruePositives": number[],
                "quantilesFalsePositives": number[],
                "quantilesTrueNegatives": number[],
                "quantilesFalseNegatives": number[],
                "quantilesAccuracies": number[],
                "quantilesSupports": number[],
                "total": number },
            "microAverageMetrics": {
                "accuracy": number,
                "truePositives": number,
                "falsePositives": number,
                "falseNegatives": number,
                "total": number },
            "summationMicroAverageMetrics": {
                "summationPrecision": number,
                "summationRecall": number,
                "summationF1Score": number,
                "summationAccuracy": number,
                "summationTruePositives": number,
                "summationFalsePositives": number,
                "summationTrueNegatives": number,
                "summationFalseNegatives": number,
                "summationSupport": number,
                "total": number },
            "macroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "summationMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "positiveSupportLabelMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "positiveSupportLabelSummationMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "weightedMacroAverageMetrics": {
                "weightedAveragePrecision": number,
                "weightedAverageRecall": number,
                "weightedAverageF1Score": number,
                "weightedAverageAccuracy": number,
                "weightedAverageSupport": number,
                "total": number },
            "summationWeightedMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number } } = {
            microQuantileMetrics,
            macroQuantileMetrics,
            confusionMatrix,
            labelBinaryConfusionMatrixBasicMetricMap,
            labelBinaryConfusionMatrixMap,
            microAverageMetrics,
            summationMicroAverageMetrics,
            macroAverageMetrics,
            summationMacroAverageMetrics,
            positiveSupportLabelMacroAverageMetrics,
            positiveSupportLabelSummationMacroAverageMetrics,
            weightedMacroAverageMetrics,
            summationWeightedMacroAverageMetrics };
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

    public getTotal(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): number {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const total: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPositives(), 0);
        return total;
    }

    public getMicroQuantileMetrics(
        binaryConfusionMatrices: BinaryConfusionMatrix[] = [],
        quantileConfiguration: number = 4): {
        "quantilesPrecisions": number[],
        "quantilesRecalls": number[],
        "quantilesF1Scores": number[],
        "quantilesTruePositives": number[],
        "quantilesFalsePositives": number[],
        "quantilesTrueNegatives": number[],
        "quantilesFalseNegatives": number[],
        "quantilesAccuracies": number[],
        "quantilesSupports": number[],
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const precisions: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getPrecision(), x.getSupport()]);
        const quantilesPrecisions: number[] =
            Utility.findValueCountPairQuantiles(precisions, quantileConfiguration) as number[];
        const recalls: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getRecall(), x.getSupport()]);
        const quantilesRecalls: number[] =
            Utility.findValueCountPairQuantiles(recalls, quantileConfiguration) as number[];
        const f1Scores: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getF1Score(), x.getSupport()]);
        const quantilesF1Scores: number[] =
            Utility.findValueCountPairQuantiles(f1Scores, quantileConfiguration) as number[];
        const truePositives: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getTruePositives(), x.getSupport()]);
        const quantilesTruePositives: number[] =
            Utility.findValueCountPairQuantiles(truePositives, quantileConfiguration) as number[];
        const falsePositives: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getFalsePositives(), x.getSupport()]);
        const quantilesFalsePositives: number[] =
            Utility.findValueCountPairQuantiles(falsePositives, quantileConfiguration) as number[];
        const trueNegatives: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getTrueNegatives(), x.getSupport()]);
        const quantilesTrueNegatives: number[] =
            Utility.findValueCountPairQuantiles(trueNegatives, quantileConfiguration) as number[];
        const falseNegatives: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getFalseNegatives(), x.getSupport()]);
        const quantilesFalseNegatives: number[] =
            Utility.findValueCountPairQuantiles(falseNegatives, quantileConfiguration) as number[];
        const accuracies: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getAccuracy(), x.getSupport()]);
        const quantilesAccuracies: number[] =
            Utility.findValueCountPairQuantiles(accuracies, quantileConfiguration) as number[];
        const supports: Array<[number, number]> = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => [x.getSupport(), x.getSupport()]);
        const quantilesSupports: number[] =
            Utility.findValueCountPairQuantiles(supports, quantileConfiguration) as number[];
        const microQuantileMetrics: {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number } = {
                quantilesPrecisions,
                quantilesRecalls,
                quantilesF1Scores,
                quantilesTruePositives,
                quantilesFalsePositives,
                quantilesTrueNegatives,
                quantilesFalseNegatives,
                quantilesAccuracies,
                quantilesSupports,
                total};
        return microQuantileMetrics;
    }

    public getMacroQuantileMetrics(
        binaryConfusionMatrices: BinaryConfusionMatrix[] = [],
        quantileConfiguration: number = 4): {
        "quantilesPrecisions": number[],
        "quantilesRecalls": number[],
        "quantilesF1Scores": number[],
        "quantilesTruePositives": number[],
        "quantilesFalsePositives": number[],
        "quantilesTrueNegatives": number[],
        "quantilesFalseNegatives": number[],
        "quantilesAccuracies": number[],
        "quantilesSupports": number[],
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const precisions: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getPrecision());
        const quantilesPrecisions: number[] =
            Utility.findQuantiles(precisions, quantileConfiguration) as number[];
        const recalls: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getRecall());
        const quantilesRecalls: number[] =
            Utility.findQuantiles(recalls, quantileConfiguration) as number[];
        const f1Scores: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getF1Score());
        const quantilesF1Scores: number[] =
            Utility.findQuantiles(f1Scores, quantileConfiguration) as number[];
        const truePositives: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getTruePositives());
        const quantilesTruePositives: number[] =
            Utility.findQuantiles(truePositives, quantileConfiguration) as number[];
        const falsePositives: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getFalsePositives());
        const quantilesFalsePositives: number[] =
            Utility.findQuantiles(falsePositives, quantileConfiguration) as number[];
        const trueNegatives: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getTrueNegatives());
        const quantilesTrueNegatives: number[] =
            Utility.findQuantiles(trueNegatives, quantileConfiguration) as number[];
        const falseNegatives: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getFalseNegatives());
        const quantilesFalseNegatives: number[] =
            Utility.findQuantiles(falseNegatives, quantileConfiguration) as number[];
        const accuracies: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getAccuracy());
        const quantilesAccuracies: number[] =
            Utility.findQuantiles(accuracies, quantileConfiguration) as number[];
        const supports: number[] = binaryConfusionMatrices.map(
            (x: BinaryConfusionMatrix) => x.getSupport());
        const quantilesSupports: number[] =
            Utility.findQuantiles(supports, quantileConfiguration) as number[];
        const macroQuantileMetrics: {
            "quantilesPrecisions": number[],
            "quantilesRecalls": number[],
            "quantilesF1Scores": number[],
            "quantilesTruePositives": number[],
            "quantilesFalsePositives": number[],
            "quantilesTrueNegatives": number[],
            "quantilesFalseNegatives": number[],
            "quantilesAccuracies": number[],
            "quantilesSupports": number[],
            "total": number } = {
                quantilesPrecisions,
                quantilesRecalls,
                quantilesF1Scores,
                quantilesTruePositives,
                quantilesFalsePositives,
                quantilesTrueNegatives,
                quantilesFalseNegatives,
                quantilesAccuracies,
                quantilesSupports,
                total};
        return macroQuantileMetrics;
    }

    public getMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecisionRecallF1Accuracy": number,
        "truePositives": number,
        "falsePositives": number,
        "falseNegatives": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const truePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0);
        const falsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalsePositives(), 0);
        const falseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalseNegatives(), 0);
        const averagePrecisionRecallF1Accuracy: number =
            truePositives / total;
        const microAverageMetrics: {
            "averagePrecisionRecallF1Accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number } = {
            averagePrecisionRecallF1Accuracy,
            truePositives,
            falsePositives,
            falseNegatives,
            total };
        return microAverageMetrics;
    }

    public getSummationMicroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "summationPrecision": number,
        "summationRecall": number,
        "summationF1Score": number,
        "summationTruePositives": number,
        "summationFalsePositives": number,
        "summationTrueNegatives": number,
        "summationFalseNegatives": number,
        "summationAccuracy": number,
        "summationSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const summationTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0);
        const summationFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalsePositives(), 0);
        const summationTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTrueNegatives(), 0);
        const summationFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalseNegatives(), 0);
        const summationArithmeticAverageTotal: number =
            summationTruePositives + summationFalsePositives + summationTrueNegatives + summationFalseNegatives;
        const summationArithmeticAveragePositives: number =
            summationTruePositives + summationFalseNegatives;
        const summationArithmeticAveragePredictedPositives: number =
            summationTruePositives + summationFalsePositives;
        const summationArithmeticAverageBinaryConfusionMatrix: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                summationArithmeticAverageTotal,
                summationTruePositives,
                summationArithmeticAveragePositives,
                summationArithmeticAveragePredictedPositives);
        const summationPrecision: number =
            summationArithmeticAverageBinaryConfusionMatrix.getPrecision();
        const summationRecall: number =
            summationArithmeticAverageBinaryConfusionMatrix.getRecall();
        const summationF1Score: number =
            summationArithmeticAverageBinaryConfusionMatrix.getF1Score();
        const summationAccuracy: number =
            summationArithmeticAverageBinaryConfusionMatrix.getAccuracy();
        const summationSupport: number =
            summationArithmeticAverageBinaryConfusionMatrix.getSupport();
        const total: number =
            summationArithmeticAverageTotal;
        const macroAverageMetrics: {
            "summationPrecision": number,
            "summationRecall": number,
            "summationF1Score": number,
            "summationTruePositives": number,
            "summationFalsePositives": number,
            "summationTrueNegatives": number,
            "summationFalseNegatives": number,
            "summationAccuracy": number,
            "summationSupport": number,
            "total": number } = {
                summationPrecision,
                summationRecall,
                summationF1Score,
                summationTruePositives,
                summationFalsePositives,
                summationTrueNegatives,
                summationFalseNegatives,
                summationAccuracy,
                summationSupport,
                total };
        return macroAverageMetrics;
    }

    public getMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
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
        const averageTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0) / numberLabels;
        const averageFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalsePositives(), 0) / numberLabels;
        const averageTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTrueNegatives(), 0) / numberLabels;
        const averageFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalseNegatives(), 0) / numberLabels;
        const averageAccuracy: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getAccuracy(), 0) / numberLabels;
        const averageSupport: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getSupport(), 0) / numberLabels;
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageTruePositives,
                averageFalsePositives,
                averageTrueNegatives,
                averageFalseNegatives,
                averageAccuracy,
                averageSupport,
                total };
        return macroAverageMetrics;
    }

    public getSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const numberLabels: number =
            binaryConfusionMatrices.length;
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const averageTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives(), 0) / numberLabels;
        const averageFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalsePositives(), 0) / numberLabels;
        const averageTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTrueNegatives(), 0) / numberLabels;
        const averageFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalseNegatives(), 0) / numberLabels;
        const summationArithmeticAverageTotal: number =
            averageTruePositives + averageFalsePositives + averageTrueNegatives + averageFalseNegatives;
        const summationArithmeticAveragePositives: number =
            averageTruePositives + averageFalseNegatives;
        const summationArithmeticAveragePredictedPositives: number =
            averageTruePositives + averageFalsePositives;
        const summationArithmeticAverageBinaryConfusionMatrix: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                summationArithmeticAverageTotal,
                averageTruePositives,
                summationArithmeticAveragePositives,
                summationArithmeticAveragePredictedPositives);
        const averagePrecision: number =
            summationArithmeticAverageBinaryConfusionMatrix.getPrecision();
        const averageRecall: number =
            summationArithmeticAverageBinaryConfusionMatrix.getRecall();
        const averageF1Score: number =
            summationArithmeticAverageBinaryConfusionMatrix.getF1Score();
        const averageAccuracy: number =
            summationArithmeticAverageBinaryConfusionMatrix.getAccuracy();
        const averageSupport: number =
            summationArithmeticAverageBinaryConfusionMatrix.getSupport();
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageTruePositives,
                averageFalsePositives,
                averageTrueNegatives,
                averageFalseNegatives,
                averageAccuracy,
                averageSupport,
                total };
        return macroAverageMetrics;
    }

    public getPositiveSupportLabelMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const numberPositiveSupportLabels: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? 1 : 0), 0);
        const averagePrecision: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getPrecision() : 0), 0) /
                numberPositiveSupportLabels;
        const averageRecall: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getRecall() : 0), 0) /
                numberPositiveSupportLabels;
        const averageF1Score: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getF1Score() : 0), 0) /
                numberPositiveSupportLabels;
        const averageTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getTruePositives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getFalsePositives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getTrueNegatives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getFalseNegatives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageAccuracy: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getAccuracy() : 0), 0) /
                numberPositiveSupportLabels;
        const averageSupport: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getSupport() : 0), 0) /
                numberPositiveSupportLabels;
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageTruePositives,
                averageFalsePositives,
                averageTrueNegatives,
                averageFalseNegatives,
                averageAccuracy,
                averageSupport,
                total };
        return macroAverageMetrics;
    }

    public getPositiveSupportLabelSummationMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        const numberPositiveSupportLabels: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? 1 : 0), 0);
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const averageTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getTruePositives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getFalsePositives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getTrueNegatives() : 0), 0) /
                numberPositiveSupportLabels;
        const averageFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + (entry.getSupport() > 0 ? entry.getFalseNegatives() : 0), 0) /
                numberPositiveSupportLabels;
        const summationArithmeticAverageTotal: number =
            averageTruePositives + averageFalsePositives + averageTrueNegatives + averageFalseNegatives;
        const summationArithmeticAveragePositives: number =
            averageTruePositives + averageFalseNegatives;
        const summationArithmeticAveragePredictedPositives: number =
            averageTruePositives + averageFalsePositives;
        const summationArithmeticAverageBinaryConfusionMatrix: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                summationArithmeticAverageTotal,
                averageTruePositives,
                summationArithmeticAveragePositives,
                summationArithmeticAveragePredictedPositives);
        const averagePrecision: number =
            summationArithmeticAverageBinaryConfusionMatrix.getPrecision();
        const averageRecall: number =
            summationArithmeticAverageBinaryConfusionMatrix.getRecall();
        const averageF1Score: number =
            summationArithmeticAverageBinaryConfusionMatrix.getF1Score();
        const averageAccuracy: number =
            summationArithmeticAverageBinaryConfusionMatrix.getAccuracy();
        const averageSupport: number =
            summationArithmeticAverageBinaryConfusionMatrix.getSupport();
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageTruePositives,
                averageFalsePositives,
                averageTrueNegatives,
                averageFalseNegatives,
                averageAccuracy,
                averageSupport,
                total };
        return macroAverageMetrics;
    }

    public getWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const averagePrecision: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getPrecision() * entry.getPositives(), 0) / total;
        const averageRecall: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getRecall() * entry.getPositives(), 0) / total;
        const averageF1Score: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getF1Score() * entry.getPositives(), 0) / total;
        const averageAccuracy: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getAccuracy() * entry.getPositives(), 0) / total;
        const averageSupport: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getSupport() * entry.getPositives(), 0) / total;
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageAccuracy,
                averageSupport,
                total };
        return macroAverageMetrics;
    }

    public getSummationWeightedMacroAverageMetrics(binaryConfusionMatrices: BinaryConfusionMatrix[] = []): {
        "averagePrecision": number,
        "averageRecall": number,
        "averageF1Score": number,
        "averageTruePositives": number,
        "averageFalsePositives": number,
        "averageTrueNegatives": number,
        "averageFalseNegatives": number,
        "averageAccuracy": number,
        "averageSupport": number,
        "total": number } {
        if (Utility.isEmptyArray(binaryConfusionMatrices)) {
            binaryConfusionMatrices =
                this.getBinaryConfusionMatrices();
        }
        // ---- NOTE-use-getTotal() ---- const total: number =
        // ---- NOTE-use-getTotal() ----     binaryConfusionMatrices.reduce(
        // ---- NOTE-use-getTotal() ----         (accumulation, entry) => accumulation + entry.getPositives(), 0);
        const total: number =
            this.getTotal(binaryConfusionMatrices);
        const averageTruePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTruePositives() * entry.getPositives(), 0) / total;
        const averageFalsePositives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalsePositives() * entry.getPositives(), 0) / total;
        const averageTrueNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getTrueNegatives() * entry.getPositives(), 0) / total;
        const averageFalseNegatives: number =
            binaryConfusionMatrices.reduce(
                (accumulation, entry) => accumulation + entry.getFalseNegatives() * entry.getPositives(), 0) / total;
        const summationWeightedAverageTotal: number =
            averageTruePositives + averageFalsePositives + averageTrueNegatives + averageFalseNegatives;
        const summationWeightedAveragePositives: number =
            averageTruePositives + averageFalseNegatives;
        const summationWeightedAveragePredictedPositives: number =
            averageTruePositives + averageFalsePositives;
        const summationWeightedAverageBinaryConfusionMatrix: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                summationWeightedAverageTotal,
                averageTruePositives,
                summationWeightedAveragePositives,
                summationWeightedAveragePredictedPositives);
        const averagePrecision: number =
            summationWeightedAverageBinaryConfusionMatrix.getPrecision();
        const averageRecall: number =
            summationWeightedAverageBinaryConfusionMatrix.getRecall();
        const averageF1Score: number =
            summationWeightedAverageBinaryConfusionMatrix.getF1Score();
        const averageAccuracy: number =
            summationWeightedAverageBinaryConfusionMatrix.getAccuracy();
        const averageSupport: number =
            summationWeightedAverageBinaryConfusionMatrix.getSupport();
        const macroAverageMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } = {
                averagePrecision,
                averageRecall,
                averageF1Score,
                averageTruePositives,
                averageFalsePositives,
                averageTrueNegatives,
                averageFalseNegatives,
                averageAccuracy,
                averageSupport,
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
