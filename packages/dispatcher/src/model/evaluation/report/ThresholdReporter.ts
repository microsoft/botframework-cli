/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { AbstractBaseModelFeaturizerEvaluator } from "../abstract_base_evaluator/AbstractBaseModelFeaturizerEvaluator";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ListArrayUtility } from "../../../utility/ListArrayUtility";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { Utility } from "../../../Utility/Utility";

const NumberOfLabelsPerBatchToReport: number = 8;
const EnableDebuggingInstrumentation: boolean = false;

export class ThresholdReporter extends AbstractBaseModelFeaturizerEvaluator {

    protected instancePredictedScoreArrays: number[][] = [];
    protected instanceGroudTruthLabelIds: number[] = [];
    protected instanceFeatureTexts: string[] = [];
    protected instanceIdentifiers: string[] = [];
    protected instanceWeights: number[] = [];

    protected targetLabelBatchesToReport: string[][] = [];
    protected numberOfLabelsPerBatch: number = NumberOfLabelsPerBatchToReport;
    protected explicitTotal: number = -1;
    protected explicitTotalPositives: number = -1;
    protected explicitTotalNegatives: number = -1;
    protected fMeasureBeta: number = 1;
    protected effectivenessMeasureAlpha: number = 0.5;
    protected rejectRate: number = -1;
    protected alpha: number = 1;
    protected beta: number = 1;
    protected A: number = 1;
    protected B: number = 1;
    protected explicitMaxPositives: number = -1;

    constructor(
        modelFilename: string,
        featurizerFilename: string,
        modelNullable: SoftmaxRegressionSparse|null,
        featurizerNullable: NgramSubwordFeaturizer|null,
        labels: string[],
        labelMap: Map<string, number>,
        targetLabelBatchesToReport: string[][] = [],
        numberOfLabelsPerBatch: number = NumberOfLabelsPerBatchToReport,
        explicitTotal: number = -1,
        explicitTotalPositives: number = -1,
        explicitTotalNegatives: number = -1,
        fMeasureBeta: number = 1,
        effectivenessMeasureAlpha: number = 0.5,
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1,
        explicitMaxPositives: number = -1) {
        super(modelFilename, featurizerFilename, modelNullable, featurizerNullable, labels, labelMap);
        this.targetLabelBatchesToReport = targetLabelBatchesToReport;
        this.numberOfLabelsPerBatch = numberOfLabelsPerBatch;
        this.explicitTotal = explicitTotal;
        this.explicitTotalPositives = explicitTotalPositives;
        this.explicitTotalNegatives = explicitTotalNegatives;
        this.fMeasureBeta = fMeasureBeta;
        this.effectivenessMeasureAlpha = effectivenessMeasureAlpha;
        this.rejectRate = rejectRate;
        this.alpha = alpha;
        this.beta = beta;
        this.A = A;
        this.B = B;
        this.explicitMaxPositives = explicitMaxPositives;
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const outputEvaluationReportDataArrayConfusionMatrixThresholdMetrics: string[][] =
                this.reportToDataArrays();
            outputEvaluationReportDataArrays.ConfusionMatrixThresholdMetrics =
                outputEvaluationReportDataArrayConfusionMatrixThresholdMetrics;
        }
        return outputEvaluationReportDataArrays;
    }
    public generateEvaluationDataArraysReportToFiles(
        outputReportFilenamePrefix: string,
        outputDataArraryHeaders: string[] = [],
        columnDelimiter: string = "\t",
        recordDelimiter: string = "\n",
        encoding: string = "utf8",
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}): {
            "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
            "outputFilenames": string[],
            } {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        {
            let outputFilename: string =
                `${outputReportFilenamePrefix}_ConfusionMatrixThresholdMetrics.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.ConfusionMatrixThresholdMetrics,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
            const outputFilenames: string[] =
                [outputFilename];
            return { outputEvaluationReportDataArrays, outputFilenames };
        }
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any> = {}): {
            "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
            "outputFilenames": string[],
            } {
        const outputFilenames: string[] = [];
        // ---- NOTE: nothing to report here.
        return {
            outputEvaluationReportJson,
            outputFilenames,
            };
    }

    public generateEvaluationDirectReport(): IDictionaryStringIdGenericValue<string> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationDirectReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string,
        outputEvaluationReportDirect: IDictionaryStringIdGenericValue<string> = {}):
        IDictionaryStringIdGenericValue<string> {
        // ---- NOTE: nothing to report here.
        return outputEvaluationReportDirect;
    }

    public getNumberInstances(): number {
        return this.instancePredictedScoreArrays.length;
    }

    public addInstance(
        instancePredictedScoreArray: number[],
        instanceGroudTruthLabelId: number,
        instanceFeatureText: string,
        instanceIdentifier: string,
        instanceWeight: number): void {
        this.instancePredictedScoreArrays.push(instancePredictedScoreArray);
        this.instanceGroudTruthLabelIds.push(instanceGroudTruthLabelId);
        this.instanceFeatureTexts.push(instanceFeatureText);
        this.instanceIdentifiers.push(instanceIdentifier);
        this.instanceWeights.push(instanceWeight);
    }

    public reportToDataArrays(): string[][] {
        const reportResults: Array<Array<{
            "targetLabel": string,
            "scoreThresholds": number[],
            "binaryConfusionMatrices": BinaryConfusionMatrix[],
            "metricNames": string[],
            "metricNameMap": IDictionaryStringIdGenericValue<number>,
            "metricValues": number[][],
        }>> = this.report(
            this.targetLabelBatchesToReport,
            this.numberOfLabelsPerBatch,
            this.explicitTotal,
            this.explicitTotalPositives,
            this.explicitTotalNegatives,
            this.fMeasureBeta,
            this.effectivenessMeasureAlpha,
            this.rejectRate,
            this.alpha,
            this.beta,
            this.A,
            this.B,
            this.explicitMaxPositives);
        let cell11MetricIndexForDebugInstrumentation: number = -1;
        let ratioCell11MetricIndexForDebugInstrumentation: number = -1;
        let cell11MetricIndexInOutputArrayForDebugInstrumentation: number = -1;
        let ratioCell11MetricIndexInOutputArrayForDebugInstrumentation: number = -1;
        const outputEvaluationReportDataArrayHeader: string[] = [];
        const outputEvaluationReportDataArrays: string[][] = [];
        for (const reportResultsPerBatch of reportResults) {
            for (const reportResultPerLabel of reportResultsPerBatch) {
                const tarrgetLabel: string = reportResultPerLabel.targetLabel;
                const scoreThresholds: number[] = reportResultPerLabel.scoreThresholds;
                const metricNames: string[] = reportResultPerLabel.metricNames;
                const metricNameMap: IDictionaryStringIdGenericValue<number> = reportResultPerLabel.metricNameMap;
                const metricValues: number[][] = reportResultPerLabel.metricValues;
                if (EnableDebuggingInstrumentation) { // ---- NOTE-DEBUG-INSTRUMENTATION ----
                    // const binaryConfusionMatrices: BinaryConfusionMatrix[] =
                    //     reportResultPerLabel.binaryConfusionMatrices;
                    cell11MetricIndexForDebugInstrumentation =
                        metricNameMap.Cell11;
                    ratioCell11MetricIndexForDebugInstrumentation =
                        metricNameMap.RatioCell11;
                    cell11MetricIndexInOutputArrayForDebugInstrumentation =
                        cell11MetricIndexForDebugInstrumentation + 2;
                    ratioCell11MetricIndexInOutputArrayForDebugInstrumentation =
                        ratioCell11MetricIndexForDebugInstrumentation + 2;
                }
                if (Utility.isEmptyStringArray(outputEvaluationReportDataArrayHeader)) {
                    outputEvaluationReportDataArrayHeader.push("TargetLabel");
                    outputEvaluationReportDataArrayHeader.push("ScoreThreshold");
                    for (const metricName of metricNames) {
                        outputEvaluationReportDataArrayHeader.push(metricName);
                    }
                    outputEvaluationReportDataArrays.push(outputEvaluationReportDataArrayHeader);
                }
                const numberInstances: number = scoreThresholds.length;
                for (let indexInstance: number = 0; indexInstance < numberInstances; indexInstance++) {
                    const outputEvaluationReportDataArray: string[] = [];
                    const scoreThreshold: number = scoreThresholds[indexInstance];
                    const metricValueArray: number[] = metricValues[indexInstance];
                    outputEvaluationReportDataArray.push(tarrgetLabel);
                    outputEvaluationReportDataArray.push(scoreThreshold.toString());
                    for (const metricValue of metricValueArray) {
                        outputEvaluationReportDataArray.push(metricValue.toString());
                    }
                    outputEvaluationReportDataArrays.push(outputEvaluationReportDataArray);
                    if (EnableDebuggingInstrumentation) { // ---- NOTE-DEBUG-INSTRUMENTATION ----
                        const cell1MetricValue: number =
                            metricValueArray[cell11MetricIndexForDebugInstrumentation];
                        const ratioCell1MetricValue: number =
                            metricValueArray[ratioCell11MetricIndexForDebugInstrumentation];
                        const cell1MetricValueInString: string =
                            outputEvaluationReportDataArray[cell11MetricIndexInOutputArrayForDebugInstrumentation];
                        const ratioCell1MetricValueInString: string =
                            outputEvaluationReportDataArray[ratioCell11MetricIndexInOutputArrayForDebugInstrumentation];
                        if (cell1MetricValue > 0) {
                            Utility.debuggingLog(
                                `cell1MetricValue=${cell1MetricValue}`);
                            Utility.debuggingLog(
                                `cell1MetricValueInString=${cell1MetricValueInString}`);
                            Utility.debuggingLog(
                                `ratioCell1MetricValue=${ratioCell1MetricValue}`);
                            Utility.debuggingLog(
                                `ratioCell1MetricValueInString=${ratioCell1MetricValueInString}`);
                        }
                    }
                }
            }
        }
        return outputEvaluationReportDataArrays;
    }
    public report(
        targetLabelBatchesToReport: string[][] = [],
        numberOfLabelsPerBatch: number = NumberOfLabelsPerBatchToReport,
        explicitTotal: number = -1,
        explicitTotalPositives: number = -1,
        explicitTotalNegatives: number = -1,
        fMeasureBeta: number = 1,
        effectivenessMeasureAlpha: number = 0.5,
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1,
        explicitMaxPositives: number = -1): Array<Array<{
            "targetLabel": string,
            "scoreThresholds": number[],
            "binaryConfusionMatrices": BinaryConfusionMatrix[],
            "metricNames": string[],
            "metricNameMap": IDictionaryStringIdGenericValue<number>,
            "metricValues": number[][],
        }>> {
        this.validate();
        const labels: string[] = this.getLabels();
        const numberLabels: number = labels.length;
        if (Utility.isEmptyStringArrays(targetLabelBatchesToReport)) {
            targetLabelBatchesToReport = [];
            if (numberOfLabelsPerBatch <= 0) {
                numberOfLabelsPerBatch = NumberOfLabelsPerBatchToReport;
            }
            let numberLabelBatches: number = Math.floor(numberLabels / numberOfLabelsPerBatch);
            if ((numberLabelBatches * numberOfLabelsPerBatch) < numberLabels) {
                numberLabelBatches++;
            }
            for (let batch = 0; batch < numberLabelBatches; batch++) {
                const labelIndexBegin = batch * numberOfLabelsPerBatch;
                let labelIndexEnd = labelIndexBegin + numberOfLabelsPerBatch;
                if (labelIndexEnd > numberLabels) {
                    labelIndexEnd = numberLabels;
                }
                if (labelIndexEnd > labelIndexBegin) {
                    const targetLabelsPerBatch: string[] = [];
                    for (let labelIndex = labelIndexBegin; labelIndex < labelIndexEnd; labelIndex++) {
                        targetLabelsPerBatch.push(labels[labelIndex]);
                    }
                    targetLabelBatchesToReport.push(targetLabelsPerBatch);
                }
            }
        }
        const labelMap: Map<string, number> = this.getLabelMap();
        let metricNames: string[] = [];
        let metricNameMap: IDictionaryStringIdGenericValue<number> = {};
        const numberInstances: number = this.instanceGroudTruthLabelIds.length;
        const reportResults: Array<Array<{
            "targetLabel": string,
            "scoreThresholds": number[],
            "binaryConfusionMatrices": BinaryConfusionMatrix[],
            "metricNames": string[],
            "metricNameMap": IDictionaryStringIdGenericValue<number>,
            "metricValues": number[][],
        }>> = [];
        for (const targetLabelsPerBatchToReport of targetLabelBatchesToReport) {
            const reportResultsPerBatch: Array<{
                "targetLabel": string,
                "scoreThresholds": number[],
                "binaryConfusionMatrices": BinaryConfusionMatrix[],
                "metricNames": string[],
                "metricNameMap": IDictionaryStringIdGenericValue<number>,
                "metricValues": number[][],
            }> = [];
            for (const targetLabel of targetLabelsPerBatchToReport) {
                const targetLabelIndex: number =
                    labelMap.get(targetLabel) as number;
                if (targetLabelIndex === undefined) {
                    Utility.debuggingThrow(
                        `targetLabel|${targetLabel}| is not defined.`);
                }
                let targetLabelIndexScores: number[] = this.instancePredictedScoreArrays.map(
                    (scoreArray) => scoreArray[targetLabelIndex]);
                const targetLabelPositives: number = this.instanceGroudTruthLabelIds.reduce(
                    (total, instanceGroudTruthLabelId) =>
                    (instanceGroudTruthLabelId === targetLabelIndex ? total + 1 : total), 0);
                let orderSequence: number[] = ListArrayUtility.sortGenerateOrderSequence(
                    targetLabelIndexScores);
                {
                    orderSequence = orderSequence.reverse();
                    targetLabelIndexScores = targetLabelIndexScores.reverse();
                }
                const binaryConfusionMatrixBase: BinaryConfusionMatrix = new BinaryConfusionMatrix(
                    numberInstances,
                    0,
                    targetLabelPositives,
                    0);
                if (Utility.isEmptyStringArray(metricNames)) {
                    metricNames = binaryConfusionMatrixBase.getMetricNames();
                }
                if (DictionaryMapUtility.isEmptyStringIdGenericValueDictionary(metricNameMap)) {
                    metricNameMap = binaryConfusionMatrixBase.getMetricNameMap();
                }
                const binaryConfusionMatrices: BinaryConfusionMatrix[] = orderSequence.map(
                    (instanceIndex) => binaryConfusionMatrixBase.moveFromPredictedNegativeToPositive(
                        this.instanceGroudTruthLabelIds[instanceIndex] === targetLabelIndex));
                const metricValues: number[][] =
                    binaryConfusionMatrices.map((binaryConfusionMatrix) => binaryConfusionMatrix.getMetricValues(
                        explicitTotal,
                        explicitTotalPositives,
                        explicitTotalNegatives,
                        fMeasureBeta,
                        effectivenessMeasureAlpha,
                        rejectRate,
                        alpha,
                        beta,
                        A,
                        B,
                        explicitMaxPositives));
                if (EnableDebuggingInstrumentation) { // ---- NOTE-DEBUG-INSTRUMENTATION ----
                    const totalMetricIndex: number =
                        metricNameMap.Total;
                    const cell11MetricIndex: number =
                        metricNameMap.Cell11;
                    const ratioCell11MetricIndex: number =
                        metricNameMap.RatioCell11;
                    const totalMatricValues: number[] =
                        metricValues.map((x: number[]) => x[totalMetricIndex]);
                    const cell11MatricValues: number[] =
                        metricValues.map((x: number[]) => x[cell11MetricIndex]);
                    const ratioCell11MatricValues: number[] =
                        metricValues.map((x: number[]) => x[ratioCell11MetricIndex]);
                    Utility.debuggingLog(
                        `cell11MatricValues=${cell11MatricValues}`);
                    Utility.debuggingLog(
                        `ratioCell11MatricValues=${ratioCell11MatricValues}`);
                    Utility.debuggingLog(
                        `totalMatricValues=${totalMatricValues}`);
                }
                const reportResultPerLabel: {
                    "targetLabel": string,
                    "scoreThresholds": number[],
                    "binaryConfusionMatrices": BinaryConfusionMatrix[],
                    "metricNames": string[],
                    "metricNameMap": IDictionaryStringIdGenericValue<number>,
                    "metricValues": number[][],
                } = {
                    targetLabel,
                    scoreThresholds: targetLabelIndexScores,
                    binaryConfusionMatrices,
                    metricNames,
                    metricNameMap,
                    metricValues,
                };
                reportResultsPerBatch.push(reportResultPerLabel);
            }
            reportResults.push(reportResultsPerBatch);
        }
        return reportResults;
    }

    public validate(): void {
        if (Utility.isEmptyArray(this.instancePredictedScoreArrays)) {
            Utility.debuggingThrow("'this.instancePredictedScoreArrays' array is empty");
        }
        if (Utility.isEmptyNumberArray(this.instanceGroudTruthLabelIds)) {
            Utility.debuggingThrow("'this.instanceGroudTruthLabelIds' array is empty");
        }
        if (Utility.isEmptyStringArray(this.instanceFeatureTexts)) {
            Utility.debuggingThrow("'this.instanceFeatureTexts' array is empty");
        }
        if (Utility.isEmptyStringArray(this.instanceIdentifiers)) {
            Utility.debuggingThrow("'this.instanceIdentifiers' array is empty");
        }
        if (Utility.isEmptyNumberArray(this.instanceWeights)) {
            Utility.debuggingThrow("'this.instanceWeights' array is empty");
        }
        const numberInstances: number = this.getNumberInstances();
        if (this.instanceGroudTruthLabelIds.length !== numberInstances) {
            Utility.debuggingThrow(
                `this.instanceGroudTruthLabelIds.length|${this.instanceGroudTruthLabelIds.length}|!==numberInstances|${numberInstances}|`);
        }
        if (this.instanceFeatureTexts.length !== numberInstances) {
            Utility.debuggingThrow(
                `this.instanceFeatureTexts.length|${this.instanceFeatureTexts.length}|!==numberInstances|${numberInstances}|`);
        }
        if (this.instanceIdentifiers.length !== numberInstances) {
            Utility.debuggingThrow(
                `this.instanceIdentifiers.length|${this.instanceIdentifiers.length}|!==numberInstances|${numberInstances}|`);
        }
        if (this.instanceWeights.length !== numberInstances) {
            Utility.debuggingThrow(
                `this.instanceWeights.length|${this.instanceWeights.length}|!==numberInstances|${numberInstances}|`);
        }
    }

    public loadScoreFileAndPopulate(
        scoreFilename: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        scoreColumnBeginIndex: number = 2,
        identifierColumnIndex: number = -1,
        predictedLabelColumnIndex: number = -1,
        revisedTextColumnIndex: number = -1,
        lineIndexToStart: number = 0): void {
        const scoreDataStructure: {
            "labels": string[],
            "texts": string[],
            "weights": number[],
            "identifiers": string[],
            "scoreArrays": number[][],
            "predictedLabels": string[],
            "revisedTexts": string[] } =
            Utility.loadLabelTextScoreFile(
                scoreFilename,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                scoreColumnBeginIndex,
                this.getNumberLabels(),
                identifierColumnIndex,
                predictedLabelColumnIndex,
                revisedTextColumnIndex,
                lineIndexToStart);
        const labelMap: Map<string, number> =
            this.getLabelMap();
        const numberInstances: number = scoreDataStructure.labels.length;
        for (let i = 0; i < numberInstances; i++) {
            const label: string = scoreDataStructure.labels[i];
            const text: string = scoreDataStructure.texts[i];
            const identifier: string = scoreDataStructure.identifiers[i];
            const scoreArray: number[] = scoreDataStructure.scoreArrays[i];
            const labelId: number = labelMap.get(label) as number;
            const weight: number = scoreDataStructure.weights[i];
            this.addInstance(scoreArray, labelId, text, identifier, weight);
        }
    }
}
