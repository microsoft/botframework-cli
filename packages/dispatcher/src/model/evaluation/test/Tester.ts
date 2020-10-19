/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// tslint:disable-next-line: max-line-length
// import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { IMathematicsHelper } from "../../../mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { IConfusionMatrix } from "../../../mathematics/confusion_matrix/IConfusionMatrix";
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

import { Utility } from "../../../Utility/Utility";

export class Tester extends AbstractBaseModelFeaturizerEvaluator {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    protected intentsCachedAfterTest: string[] = [];
    protected utterancesCachedAfterTest: string[] = [];
    protected labelIndexArrayCachedAfterTest: number[] = [];
    protected featureIndexArraysCachedAfterTest: number[][] = [];

    protected testResultCachedAfterTest: {
        "confusionMatrixTest": ConfusionMatrix
        "thresholdReporterTest": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "instanceIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = {
            confusionMatrixTest: new ConfusionMatrix([], new Map<string, number>()),
            thresholdReporterTest: new ThresholdReporter("", "", null, null, [], new Map<string, number>()),
            predictionLabels: [],
            predictionLabelIndexes: [],
            instanceIndexes: [],
            groundTruthLabels: [],
            groundTruthLabelIndexes: [],
            predictions: [] };

    public constructor(
        modelFilename: string,
        featurizerFilename: string) {
        super(modelFilename, featurizerFilename, null, null, [], new Map<string, number>());
    }

    public getTestResult(): {
        "confusionMatrixTest": ConfusionMatrix
        "thresholdReporterTest": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "instanceIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return this.testResultCachedAfterTest;
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const predictionLabels: string[] = this.testResultCachedAfterTest.predictionLabels;
            const predictionLabelIndexes: number[] = this.testResultCachedAfterTest.predictionLabelIndexes;
            const instanceIndexes: number[] = this.testResultCachedAfterTest.instanceIndexes;
            const groundTruthLabels: string[] = this.testResultCachedAfterTest.groundTruthLabels;
            const groundTruthLabelIndexes: number[] = this.testResultCachedAfterTest.groundTruthLabelIndexes;
            const predictions: number[][] = this.testResultCachedAfterTest.predictions;
            const outputEvaluationReportDataArraysScoreRecords: string[][] = [];
            for (let index: number = 0; index < this.intentsCachedAfterTest.length; index++) {
                const instanceIndex: number = instanceIndexes[index];
                const intent: string = this.intentsCachedAfterTest[instanceIndex];
                const utterance: string = this.utterancesCachedAfterTest[instanceIndex];
                const groundTruthLabel: string = groundTruthLabels[index];
                const groundTruthLabelIndex: number = groundTruthLabelIndexes[index];
                const predictionLabel: string = predictionLabels[index];
                const predictionLabelIndex: number = predictionLabelIndexes[index];
                const outputEvaluationReportDataArraysScoreRecord: string[] = [];
                outputEvaluationReportDataArraysScoreRecord.push(intent);
                outputEvaluationReportDataArraysScoreRecord.push(utterance);
                outputEvaluationReportDataArraysScoreRecord.push(instanceIndex.toString());
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
                `${outputReportFilenamePrefix}_TestScoreRecords.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.TestScoreRecords,
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
        const outputEvaluationReport: IDictionaryStringIdGenericValue<any> = {};
        const confusionMatrixTest: ConfusionMatrix =
            this.testResultCachedAfterTest.confusionMatrixTest;
        const confusionMatrixMetricStructure: {
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": Map<string, Map<string, number>>,
            "labelBinaryConfusionMatrixMap": Map<string, BinaryConfusionMatrix>,
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
                "total": number } } =
            confusionMatrixTest.generateConfusionMatrixMetricStructure();
        Utility.debuggingLog(
            `confusionMatrixTest.getMicroQuantileMetrics()=` +
            `${confusionMatrixTest.getMicroQuantileMetrics()}` +
            `confusionMatrixTest.getMacroQuantileMetrics()=` +
            `${confusionMatrixTest.getMacroQuantileMetrics()}` +
            `confusionMatrixTest.getMicroAverageMetrics()=` +
            `${confusionMatrixTest.getMicroAverageMetrics()}` +
            `,confusionMatrixTest.getSummationMicroAverageMetrics()=` +
            `${confusionMatrixTest.getSummationMicroAverageMetrics()}` +
            `,confusionMatrixTest.getMacroAverageMetrics()=` +
            `${confusionMatrixTest.getMacroAverageMetrics()}` +
            `,confusionMatrixTest.getSummationMacroAverageMetrics()=` +
            `${confusionMatrixTest.getSummationMacroAverageMetrics()}` +
            `,confusionMatrixTest.getPositiveSupportLabelMacroAverageMetrics()=` +
            `${confusionMatrixTest.getPositiveSupportLabelMacroAverageMetrics()}` +
            `,confusionMatrixTest.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
            // tslint:disable-next-line: max-line-length
            `${confusionMatrixTest.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
            `,confusionMatrixTest.getWeightedMacroAverageMetrics()=` +
            `${confusionMatrixTest.getWeightedMacroAverageMetrics()}` +
            `,confusionMatrixTest.getSummationWeightedMacroAverageMetrics()=` +
            `${confusionMatrixTest.getSummationWeightedMacroAverageMetrics()}`);
        outputEvaluationReport.confusionMatrixMetricStructure =
            confusionMatrixMetricStructure;
        return outputEvaluationReport;
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any> = {}): {
            "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
            "outputFilenames": string[],
            } {
        if (DictionaryMapUtility.isEmptyStringIdGenericValueDictionary(outputEvaluationReportJson)) {
            outputEvaluationReportJson =
                this.generateEvaluationJsonReport();
        }
        {
            let outputFilename: string =
                `${outputReportFilenamePrefix}_TestConfusionMatrixReport.json`;
            outputFilename = this.dumpEvaluationJsonReportToFile(
                outputFilename,
                outputEvaluationReportJson.confusionMatrixMetricStructure,
                encoding);
            const outputFilenames: string[] =
                [outputFilename];
            return { outputEvaluationReportJson, outputFilenames };
        }
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
        weights: number[],
        labelIndexArray: number[],
        featureIndexArrays: number[][]): {
            "confusionMatrixTest": ConfusionMatrix,
            "thresholdReporterTest": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "instanceIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } {
        // -------------------------------------------------------------------
        this.intentsCachedAfterTest = intents;
        this.utterancesCachedAfterTest = utterances;
        this.labelIndexArrayCachedAfterTest = labelIndexArray;
        this.featureIndexArraysCachedAfterTest = featureIndexArrays;
        // -------------------------------------------------------------------
        const model: SoftmaxRegressionSparse =
            this.getModel();
        const featurizer: NgramSubwordFeaturizer =
            this.getFeaturizer();
        // -------------------------------------------------------------------
        const labels: string[] = this.getLabels();
        const labelMap: Map<string, number> = this.getLabelMap();
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
        const isWeightsArrayNotEmpty: boolean = !Utility.isEmptyNumberArray(weights);
        if (isWeightsArrayNotEmpty) {
            if (weights.length !== numberInstances) {
                Utility.debuggingThrow(
                    `weights.length|${weights.length}|!==` +
                    `numberInstances|${numberInstances}|`);
            }
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
        const instanceIndexes: number[] =
            new Array<number>(numberInstances);
        const groundTruthLabels: string[] =
            new Array<string>(numberInstances);
        const groundTruthLabelIndexes: number[] =
            new Array<number>(numberInstances);
        for (let index: number = 0; index < numberInstances; index++) {
            // ---------------------------------------------------------------
            // const intent: string = intents[index];
            const utterance: string = utterances[index];
            let weight: number = 1;
            if (isWeightsArrayNotEmpty) {
                weight = weights[index];
            }
            const labelIndex: number = labelIndexArray[index];
            // const featureIndexArray: number[] = featureIndexArrays[index];
            const prediction: number[] = predictions[index];
            // ---------------------------------------------------------------
            const groundTruthLabel: string = labels[labelIndex];
            instanceIndexes[index] = index;
            groundTruthLabels[index] = groundTruthLabel;
            groundTruthLabelIndexes[index] = labelIndex;
            // ---------------------------------------------------------------
            const argMax: { "indexMax": number, "max": number } =
                Tester.MathematicsHelperObject.getIndexOnFirstMaxEntry(prediction);
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
                predictionLabelIndex,
                weight);
            thresholdReporterTest.addInstance(
                prediction,
                labelIndex,
                utterance,
                `${index}`,
                weight);
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        this.testResultCachedAfterTest = {
            confusionMatrixTest,
            thresholdReporterTest,
            predictionLabels,
            predictionLabelIndexes,
            instanceIndexes,
            groundTruthLabels,
            groundTruthLabelIndexes,
            predictions };
        return this.testResultCachedAfterTest;
        // -------------------------------------------------------------------
    }
}
