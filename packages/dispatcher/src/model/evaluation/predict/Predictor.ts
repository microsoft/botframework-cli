/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { IMathematicsHelper } from "../../../mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { IConfusionMatrix } from "../../../mathematics/confusion_matrix/IConfusionMatrix";
import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";
import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { AbstractBaseModelFeaturizerEvaluator } from "../abstract_base_evaluator/AbstractBaseModelFeaturizerEvaluator";

import { Utility } from "../../../utility/Utility";

export class Predictor extends AbstractBaseModelFeaturizerEvaluator {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number } = {};

    protected intents: string[] = [];
    protected utterances: string[] = [];
    protected labelIndexArray: number[] = [];
    protected featureIndexArrays: number[][] = [];

    protected confusionMatrixPrediction: ConfusionMatrix =
        new ConfusionMatrix([], {});
    protected thresholdReporterPrediction: ThresholdReporter =
        new ThresholdReporter("", "", null, null, [], {});
    protected predictionLabels: string[] = [];
    protected predictionLabelIndexes: number[] = [];
    protected instanceIndexes: number[] = [];
    protected groundTruthLabels: string[] = [];
    protected groundTruthLabelIndexes: number[] = [];
    protected predictions: number[][] = [];

    constructor(
        modelFilename: string,
        featurizerFilename: string) {
        super(modelFilename, featurizerFilename, null, null, [], {});
        this.labels = this.getFeaturizer().getLabels();
        this.labelMap = this.getFeaturizer().getLabelMap();
        this.confusionMatrixPrediction =
            new ConfusionMatrix(this.labels, this.labelMap);
        this.thresholdReporterPrediction =
            new ThresholdReporter("", "", null, null, this.labels, this.labelMap);
    }

    public getPredictionResult(): {
        "confusionMatrixPrediction": ConfusionMatrix
        "thresholdReporterPrediction": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "instanceIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return {
            confusionMatrixPrediction: this.confusionMatrixPrediction,
            thresholdReporterPrediction: this.thresholdReporterPrediction,
            predictionLabels: this.predictionLabels,
            predictionLabelIndexes: this.predictionLabelIndexes,
            instanceIndexes: this.instanceIndexes,
            groundTruthLabels: this.groundTruthLabels,
            groundTruthLabelIndexes: this.groundTruthLabelIndexes,
            predictions: this.predictions,
        };
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        const predictionResult: {
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "instanceIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            this.getPredictionResult();
        {
            const predictionLabels: string[] = predictionResult.predictionLabels;
            const predictionLabelIndexes: number[] = predictionResult.predictionLabelIndexes;
            const instanceIndexes: number[] = predictionResult.instanceIndexes;
            const groundTruthLabels: string[] = predictionResult.predictionLabels;
            const groundTruthLabelIndexes: number[] = predictionResult.predictionLabelIndexes;
            const predictions: number[][] = predictionResult.predictions;
            const outputEvaluationReportDataArraysScoreRecords: string[][] = [];
            for (let index: number = 0; index < this.intents.length; index++) {
                const instanceIndex: number = instanceIndexes[index];
                const intent: string = this.intents[instanceIndex];
                const utterance: string = this.utterances[instanceIndex];
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
            outputEvaluationReportDataArrays.PredictionScoreRecords =
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
                `${outputReportFilenamePrefix}_PredictionScoreRecords.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.PredictionScoreRecords,
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
        const predictionResult: {
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "instanceIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            this.getPredictionResult();
        const confusionMatrixPrediction: ConfusionMatrix =
            predictionResult.confusionMatrixPrediction;
        const confusionMatrixMetricStructure: {
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
            "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
            "microAverageMetrics": {
                "accuracy": number,
                "truePositives": number,
                "falsePositives": number,
                "falseNegatives": number,
                "support": number },
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
                "support": number },
            "weightedMacroAverageMetrics": {
                "weightedAveragePrecision": number,
                "weightedAverageRecall": number,
                "weightedAverageF1Score": number,
                "weightedAverageAccuracy": number,
                "weightedAverageSupport": number,
                "support": number } } =
            confusionMatrixPrediction.generateConfusionMatrixMetricStructure();
        Utility.debuggingLog(
           `confusionMatrixPrediction.getMicroAverageMetrics()=` +
           `${confusionMatrixPrediction.getMicroAverageMetrics()}` +
           `,confusionMatrixPrediction.getMacroAverageMetrics()=` +
           `${confusionMatrixPrediction.getMacroAverageMetrics()}` +
           `,confusionMatrixPrediction.getWeightedMacroAverageMetrics()=` +
           `${confusionMatrixPrediction.getWeightedMacroAverageMetrics()}`);
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
                `${outputReportFilenamePrefix}_PredictionConfusionMatrixReport.json`;
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

    public predict(
        utterance: string,
        intent: string): {
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "instanceIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } {
        // -------------------------------------------------------------------
        this.intents.push(intent);
        this.utterances.push(utterance);
        // -------------------------------------------------------------------
        const model: SoftmaxRegressionSparse =
            this.getModel();
        const featurizer: NgramSubwordFeaturizer =
            this.getFeaturizer();
        // -------------------------------------------------------------------
        const labels: string[] = this.getLabels();
        const labelMap: { [id: string]: number } = this.getLabelMap();
        // const numberLabels: number = featurizer.getNumberLabels();
        // const numberFeatures: number = featurizer.getNumberFeatures();
        // -------------------------------------------------------------------
        const featureIndexArray: number[] =
            featurizer.createFeatureSparseIndexArray(utterance);
        if (Utility.isEmptyNumberArray(featureIndexArray)) {
            Utility.debuggingThrow(
                `featureIndexArray is empty`);
        }
        const predictions: number[][] =
            model.predict([featureIndexArray]);
        {
            // ---------------------------------------------------------------
            const prediction: number[] = predictions[0];
            // ---------------------------------------------------------------
            const argMax: { "indexMax": number, "max": number } =
                Predictor.MathematicsHelperObject.getIndexOnFirstMaxEntry(prediction);
            const predictionLabelIndex: number =
                argMax.indexMax;
            let groundTruthLabelIndex: number = labelMap[intent];
            if (!Utility.isEmptyString(intent)) {
                if (!groundTruthLabelIndex) {
                    groundTruthLabelIndex = -1;
                }
                if (groundTruthLabelIndex >= 0) {
                    this.confusionMatrixPrediction.addInstanceByLabelIndex(
                        groundTruthLabelIndex,
                        predictionLabelIndex);
                    this.thresholdReporterPrediction.addInstance(
                        prediction,
                        groundTruthLabelIndex,
                        utterance,
                        `${this.thresholdReporterPrediction.getNumberInstances()}`,
                        1);
                    }
            }
            const predictionLabel: string = labels[predictionLabelIndex];
            const groundTruthLabel: string = (groundTruthLabelIndex >= 0) ? labels[groundTruthLabelIndex] : "";
            // ---------------------------------------------------------------
            this.labelIndexArray.push(groundTruthLabelIndex);
            this.featureIndexArrays.push(featureIndexArray);
            // ---------------------------------------------------------------
            this.predictionLabels.push(predictionLabel);
            this.predictionLabelIndexes.push(predictionLabelIndex);
            this.instanceIndexes.push(this.instanceIndexes.length);
            this.groundTruthLabels.push(groundTruthLabel);
            this.groundTruthLabelIndexes.push(groundTruthLabelIndex);
            this.predictions.push(prediction);
            // ---------------------------------------------------------------
            return this.getPredictionResult();
            // ---------------------------------------------------------------
        }
    }
}
