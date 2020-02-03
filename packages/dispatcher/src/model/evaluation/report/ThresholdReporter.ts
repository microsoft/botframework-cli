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

import { Utility } from "../../../utility/Utility";

export class ThresholdReporter extends AbstractBaseModelFeaturizerEvaluator {

    protected instancePredictedScoreArrays: number[][] = [];
    protected instanceGroudTruthLabelIds: number[] = [];
    protected instanceFeatureTexts: string[] = [];
    protected instanceIdentifiers: string[] = [];

    protected targetLabelBatchesToReport: string[][] = [];
    protected numberOfLabelsPerBatch: number = 8;
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
        labelMap: { [id: string]: number; },
        targetLabelBatchesToReport: string[][] = [],
        numberOfLabelsPerBatch: number = 8,
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
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}):
        IDictionaryStringIdGenericArrays<string> {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_ConfusionMatrixThresholdMetrics.txt`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.ConfusionMatrixThresholdMetrics,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        return outputEvaluationReportDataArrays;
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any> = {}):
        IDictionaryStringIdGenericValue<any> {
        // ---- NOTE: nothing to report here.
        return outputEvaluationReportJson;
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
        instanceIdentifier: string): void {
        this.instancePredictedScoreArrays.push(instancePredictedScoreArray);
        this.instanceGroudTruthLabelIds.push(instanceGroudTruthLabelId);
        this.instanceFeatureTexts.push(instanceFeatureText);
        this.instanceIdentifiers.push(instanceIdentifier);
    }

    public reportToDataArrays(): string[][] {
        const report: Array<Array<{
            "targetLabel": string,
            "scoreThresholds": number[],
            "binaryConfusionMatrices": BinaryConfusionMatrix[],
            "metricNames": string[],
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
        const outputEvaluationReportDataArrayHeader: string[] = [];
        const outputEvaluationReportDataArrays: string[][] = [];
        for (const reportPerBatch of report) {
            for (const reportPerLabel of reportPerBatch) {
                const tarrgetLabel: string = reportPerLabel.targetLabel;
                const scoreThresholds: number[] = reportPerLabel.scoreThresholds;
                const metricNames: string[] = reportPerLabel.metricNames;
                const metricValues: number[][] = reportPerLabel.metricValues;
                if (Utility.isEmptyStringArray(outputEvaluationReportDataArrayHeader)) {
                    outputEvaluationReportDataArrayHeader.push("TargetLabel");
                    outputEvaluationReportDataArrayHeader.push("ScoreThreshold");
                    for (const metricName of metricNames) {
                        outputEvaluationReportDataArrayHeader.push(metricName);
                    }
                    outputEvaluationReportDataArrays.push(outputEvaluationReportDataArrayHeader);
                }
                const numberInstancs: number = scoreThresholds.length;
                for (let indexInstance: number = 0; indexInstance < numberInstancs; indexInstance++) {
                    const outputEvaluationReportDataArray: string[] = [];
                    const scoreThreshold: number = scoreThresholds[indexInstance];
                    const metricValueArray: number[] = metricValues[indexInstance];
                    outputEvaluationReportDataArray.push(tarrgetLabel);
                    outputEvaluationReportDataArray.push(scoreThreshold.toString());
                    for (const metricValue of metricValueArray) {
                        outputEvaluationReportDataArray.push(metricValue.toString());
                    }
                    outputEvaluationReportDataArrays.push(outputEvaluationReportDataArray);
                }
            }
        }
        return outputEvaluationReportDataArrays;
    }
    public report(
        targetLabelBatchesToReport: string[][] = [],
        numberOfLabelsPerBatch: number = 8,
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
            "metricValues": number[][],
        }>> {
        this.validate();
        const labels: string[] = this.getLabels();
        const numberLabels: number = labels.length;
        if (Utility.isEmptyStringArrays(targetLabelBatchesToReport)) {
            targetLabelBatchesToReport = [];
            if (numberOfLabelsPerBatch <= 0) {
                numberOfLabelsPerBatch = 8;
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
        const labelMap: { [id: string]: number; } = this.getLabelMap();
        const numberInstances: number = this.instanceGroudTruthLabelIds.length;
        const report: Array<Array<{
            "targetLabel": string,
            "scoreThresholds": number[],
            "binaryConfusionMatrices": BinaryConfusionMatrix[],
            "metricNames": string[],
            "metricValues": number[][],
        }>> = [];
        for (const targetLabelsPerBatchToReport of targetLabelBatchesToReport) {
            const reportPerBatch: Array<{
                "targetLabel": string,
                "scoreThresholds": number[],
                "binaryConfusionMatrices": BinaryConfusionMatrix[],
                "metricNames": string[],
                "metricValues": number[][],
            }> = [];
            for (const targetLabel of targetLabelsPerBatchToReport) {
                const targetLabelIndex: number =
                    labelMap[targetLabel];
                if (targetLabelIndex === undefined) {
                    Utility.debuggingThrow(
                        `targetLabel|${targetLabel}| is not defined.`);
                }
                const targetLabelIndexScores: number[] = this.instancePredictedScoreArrays.map(
                    (scoreArray) => scoreArray[targetLabelIndex]);
                const targetLabelPositives: number = this.instanceGroudTruthLabelIds.reduce(
                    (total, instanceGroudTruthLabelId) =>
                    (instanceGroudTruthLabelId === targetLabelIndex ? total + 1 : total), 0);
                const orderSequence: number[] = ListArrayUtility.sortGenerateOrderSequence(
                    targetLabelIndexScores);
                const binaryConfusionMatrixBase: BinaryConfusionMatrix = new BinaryConfusionMatrix(
                    numberInstances,
                    0,
                    targetLabelPositives,
                    0);
                const binaryConfusionMatrices: BinaryConfusionMatrix[] = orderSequence.map(
                    (instanceIndex) => binaryConfusionMatrixBase.moveFromPredictedNegativeToPositive(
                        this.instanceGroudTruthLabelIds[instanceIndex] === targetLabelIndex));
                const metricNames: string[] =
                    binaryConfusionMatrixBase.getMetricNames();
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
                reportPerBatch.push({
                    targetLabel,
                    scoreThresholds: targetLabelIndexScores,
                    binaryConfusionMatrices,
                    metricNames,
                    metricValues,
                });
            }
            report.push(reportPerBatch);
        }
        return report;
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
    }

    public loadScoreFileAndPopulate(
        scoreFilename: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        scoreColumnBeginIndex: number = 2,
        // numberOfScoreColumns: number = 0,
        weightColumnIndex: number = -1,
        lineIndexToStart: number = 0): void {
        const scoreDataStructure: {
            "intents": string[],
            "utterances": string[],
            "weights": number[],
            "scoreArrays": number[][] } =
            Utility.loadLabelTextScoreContent(
                scoreFilename,
                labelColumnIndex,
                textColumnIndex,
                scoreColumnBeginIndex,
                this.getNumberLabels(),
                weightColumnIndex,
                lineIndexToStart);
        const labelMap: { [id: string]: number; } =
            this.getLabelMap();
        const numberInstances: number = scoreDataStructure.intents.length;
        for (let i = 0; i < numberInstances; i++) {
            const label: string = scoreDataStructure.intents[i];
            const text: string = scoreDataStructure.utterances[i];
            const scoreArray: number[] = scoreDataStructure.scoreArrays[i];
            const labelId: number = labelMap[label];
            this.addInstance(scoreArray, labelId, text, i.toString());
        }
    }
}
