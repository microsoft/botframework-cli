/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

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

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number; } = {};

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
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return {
            confusionMatrixPrediction: this.confusionMatrixPrediction,
            thresholdReporterPrediction: this.thresholdReporterPrediction,
            predictionLabels: this.predictionLabels,
            predictionLabelIndexes: this.predictionLabelIndexes,
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
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            this.getPredictionResult();
        {
            const predictionLabels: string[] = predictionResult.predictionLabels;
            const predictionLabelIndexes: number[] = predictionResult.predictionLabelIndexes;
            const groundTruthLabels: string[] = predictionResult.predictionLabels;
            const groundTruthLabelIndexes: number[] = predictionResult.predictionLabelIndexes;
            const predictions: number[][] = predictionResult.predictions;
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
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}):
        IDictionaryStringIdGenericArrays<string> {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_PredictionScoreRecords.json`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.PredictionScoreRecords,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        return outputEvaluationReportDataArrays;
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        const outputEvaluationReport: IDictionaryStringIdGenericValue<any> = {};
        const predictionResult: {
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            this.getPredictionResult();
        const confusionMatrixPrediction: ConfusionMatrix =
            predictionResult.confusionMatrixPrediction;
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
                confusionMatrixPrediction);
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
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any> = {}):
        IDictionaryStringIdGenericValue<any> {
        if (DictionaryMapUtility.isEmptyStringIdGenericValueDictionary(outputEvaluationReportJson)) {
            outputEvaluationReportJson =
                this.generateEvaluationJsonReport();
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_PredictionConfusionMatrixReport.json`;
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

    public predict(
        utterance: string,
        intent: string): {
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
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
        const labelMap: { [id: string]: number; } = this.getLabelMap();
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
                MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
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
                        `${this.thresholdReporterPrediction.getNumberInstances()}`);
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
            this.groundTruthLabels.push(groundTruthLabel);
            this.groundTruthLabelIndexes.push(groundTruthLabelIndex);
            this.predictions.push(prediction);
            // ---------------------------------------------------------------
            return this.getPredictionResult();
            // ---------------------------------------------------------------
        }
    }
}
