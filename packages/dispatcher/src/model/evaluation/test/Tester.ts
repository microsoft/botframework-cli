/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// tslint:disable-next-line: max-line-length
// import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

// import { ColumnarData } from "../../../data/ColumnarData";
// import { LuData } from "../../../data/LuData";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { AbstractBaseModelFeaturizerEvaluator } from "../abstract_base_evaluator/AbstractBaseModelFeaturizerEvaluator";

import { Utility } from "../../../utility/Utility";

export class Tester extends AbstractBaseModelFeaturizerEvaluator {

    protected intents: string[] = [];
    protected utterances: string[] = [];
    protected labelIndexArray: number[] = [];
    protected featureIndexArrays: number[][] = [];

    protected testResult: {
        "confusionMatrixTest": ConfusionMatrix
        "thresholdReporterTest": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = {
            confusionMatrixTest: new ConfusionMatrix([], {}),
            thresholdReporterTest: new ThresholdReporter("", "", null, null, [], {}),
            predictionLabels: [],
            predictionLabelIndexes: [],
            groundTruthLabels: [],
            groundTruthLabelIndexes: [],
            predictions: [] };

    public constructor(
        modelFilename: string,
        featurizerFilename: string,
        intents: string[],
        utterances: string[],
        labelIndexArray: number[],
        featureIndexArrays: number[][]) {
        super(modelFilename, featurizerFilename, null, null, [], {});
        this.intents = intents;
        this.utterances = utterances;
        this.labelIndexArray = labelIndexArray;
        this.featureIndexArrays = featureIndexArrays;
        this.testResult = this.test(
            this.intents,
            this.utterances,
            this.labelIndexArray,
            this.featureIndexArrays);
    }

    public getTestResult(): {
        "confusionMatrixTest": ConfusionMatrix
        "thresholdReporterTest": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return this.testResult;
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const predictionLabels: string[] = this.testResult.predictionLabels;
            const predictionLabelIndexes: number[] = this.testResult.predictionLabelIndexes;
            const groundTruthLabels: string[] = this.testResult.predictionLabels;
            const groundTruthLabelIndexes: number[] = this.testResult.predictionLabelIndexes;
            const predictions: number[][] = this.testResult.predictions;
            const outputEvaluationReportDataArraysScoreRecords: string[][] = [];
            for (let index: number = 0; index < this.intents.length; index++) {
                const intent: string = this.intents[index];
                const utterance: string = this.utterances[index];
                const groundTruthLabel: string = groundTruthLabels[index];
                const groundTruthLabelIndex: number = groundTruthLabelIndexes[index];
                const predictionLabel: string = predictionLabels[index];
                const predictionLabelIndex: number = predictionLabelIndexes[index];
                const outputEvaluationReportDataArraysScoreRecord: string[] = [];
                outputEvaluationReportDataArraysScoreRecord.push(intent);
                outputEvaluationReportDataArraysScoreRecord.push(utterance);
                outputEvaluationReportDataArraysScoreRecord.push(groundTruthLabel);
                outputEvaluationReportDataArraysScoreRecord.push(groundTruthLabelIndex.toString());
                outputEvaluationReportDataArraysScoreRecord.push(predictionLabel);
                outputEvaluationReportDataArraysScoreRecord.push(predictionLabelIndex.toString());
                const prediction: number[] = predictions[index];
                for (const labelIndex of Array(prediction.length).keys()) {
                    outputEvaluationReportDataArraysScoreRecord.push(prediction[labelIndex].toString());
                }
                outputEvaluationReportDataArraysScoreRecords.push(
                    outputEvaluationReportDataArraysScoreRecord);
            }
            outputEvaluationReportDataArrays.TestScoreRecords =
                outputEvaluationReportDataArraysScoreRecords;
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
                `${outputReportFilenamePrefix}_TestScoreRecords.json`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.TestScoreRecords,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        return outputEvaluationReportDataArrays;
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        const outputEvaluationReport: IDictionaryStringIdGenericValue<any> = {};
        const confusionMatrixTest: ConfusionMatrix =
            this.testResult.confusionMatrixTest;
        const confusionMatrixMetricStructure: {
            "confusionMatrix": ConfusionMatrix,
            "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
            "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrix; },
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
                                     "weightedTotalMacroAverage": number } } =
            ConfusionMatrix.generateConfusionMatrixMetricStructure(
                confusionMatrixTest);
        Utility.debuggingLog(
           `confusionMatrixTest.getMicroAverageMetrics()=` +
           `${confusionMatrixTest.getMicroAverageMetrics()}` +
           `,confusionMatrixTest.getMacroAverageMetrics()=` +
           `${confusionMatrixTest.getMacroAverageMetrics()}` +
           `,confusionMatrixTest.getWeightedMacroAverageMetrics()=` +
           `${confusionMatrixTest.getWeightedMacroAverageMetrics()}`);
        outputEvaluationReport.confusionMatrixMetricStructure =
            confusionMatrixMetricStructure;
        return outputEvaluationReport;
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any> = {}):
        IDictionaryStringIdGenericValue<any> {
        if (DictionaryMapUtility.isEmptyStringIdGenericValueDictionary(outputEvaluationReportJson)) {
            outputEvaluationReportJson =
                this.generateEvaluationJsonReport();
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_TestConfusionMatrixReport.json`;
            this.dumpEvaluationJsonReportToFile(
                outputFilename,
                outputEvaluationReportJson.confusionMatrixMetricStructure,
                encoding);
        }
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

    public test(
        intents: string[],
        utterances: string[],
        labelIndexArray: number[],
        featureIndexArrays: number[][]): {
            "confusionMatrixTest": ConfusionMatrix,
            "thresholdReporterTest": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } {
        // -------------------------------------------------------------------
        const model: SoftmaxRegressionSparse =
            this.getModel();
        const featurizer: NgramSubwordFeaturizer =
            this.getFeaturizer();
        // -------------------------------------------------------------------
        const labels: string[] = this.getLabels();
        const labelMap: { [id: string]: number; } = this.getLabelMap();
        // const numberLabels: number = featurizer.getNumberLabels();
        // const numberFeatures: number = featurizer.getNumberFeatures();
        // -------------------------------------------------------------------
        Utility.debuggingLog(`labelIndexArray.length=` +
            `${labelIndexArray.length}`);
        Utility.debuggingLog(`featureIndexArrays.length=` +
            `${featureIndexArrays.length}`);
        // -------------------------------------------------------------------
        const confusionMatrixTest: ConfusionMatrix =
            new ConfusionMatrix(labels, labelMap);
        const thresholdReporterTest: ThresholdReporter =
            new ThresholdReporter("", "", null, null, labels, labelMap);
        const numberInstances: number =
            intents.length;
        if (utterances.length !== numberInstances) {
            Utility.debuggingThrow(
                `utterances.length|${utterances.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        if (labelIndexArray.length !== numberInstances) {
            Utility.debuggingThrow(
                `labelIndexArray.length|${labelIndexArray.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        if (featureIndexArrays.length !== numberInstances) {
            Utility.debuggingThrow(
                `featureIndexArrays.length|${featureIndexArrays.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        const predictions: number[][] =
            model.predict(featureIndexArrays);
        const predictionLabels: string[] =
            new Array<string>(numberInstances);
        const predictionLabelIndexes: number[] =
            new Array<number>(numberInstances);
        const groundTruthLabels: string[] =
            new Array<string>(numberInstances);
        const groundTruthLabelIndexes: number[] =
            new Array<number>(numberInstances);
        for (let index: number = 0; index < numberInstances; index++) {
            // ---------------------------------------------------------------
            // const intent: string = intents[index];
            const utterance: string = utterances[index];
            const labelIndex: number = labelIndexArray[index];
            // const featureIndexArray: number[] = featureIndexArrays[index];
            const prediction: number[] = predictions[index];
            // ---------------------------------------------------------------
            const groundTruthLabel: string = labels[labelIndex];
            groundTruthLabels[index] = groundTruthLabel;
            groundTruthLabelIndexes[index] = labelIndex;
            // ---------------------------------------------------------------
            const argMax: { "indexMax": number, "max": number } =
                MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
            const predictionLabelIndex: number =
                argMax.indexMax;
            predictionLabelIndexes[index] =
                predictionLabelIndex;
            const predictionLabel: string =
                labels[predictionLabelIndex];
            predictionLabels[index] =
                predictionLabel;
            confusionMatrixTest.addInstanceByLabelIndex(
                labelIndex,
                predictionLabelIndex);
            thresholdReporterTest.addInstance(
                prediction,
                labelIndex,
                utterance,
                `${index}`);
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        return {
            confusionMatrixTest,
            thresholdReporterTest,
            predictionLabels,
            predictionLabelIndexes,
            groundTruthLabels,
            groundTruthLabelIndexes,
            predictions };
        // -------------------------------------------------------------------
    }
}
