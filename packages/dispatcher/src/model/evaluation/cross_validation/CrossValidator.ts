/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { AbstractBaseEvaluator } from "../abstract_base_evaluator/AbstractBaseEvaluator";

import { Utility } from "../../../utility/Utility";

export class CrossValidator extends AbstractBaseEvaluator {

    public static defaultNumberOfCrossValidationFolds: number = 5;

    protected numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds;

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number; } = {};
    protected numberLabels: number = -1;
    protected numberFeatures: number = -1;
    protected intents: string[] = [];
    protected utterances: string[] = [];
    protected labelIndexArray: number[] = [];
    protected featureIndexArrays: number[][] = [];
    protected labelInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();

    protected learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs;
    protected learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize;
    protected learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization;
    protected learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization;
    protected learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
    protected learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate;
    protected learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true;

    protected crossValidationResult: {
        "confusionMatrixCrossValidation": ConfusionMatrix
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = {
            confusionMatrixCrossValidation: new ConfusionMatrix([], {}),
            thresholdReporterCrossValidation: new ThresholdReporter("", "", null, null, [], {}),
            predictionLabels: [],
            predictionLabelIndexes: [],
            groundTruthLabels: [],
            groundTruthLabelIndexes: [],
            predictions: [] };

    constructor(
        labels: string[],
        labelMap: { [id: string]: number; },
        numberLabels: number,
        numberFeatures: number,
        intents: string[],
        utterances: string[],
        labelIndexArray: number[],
        featureIndexArrays: number[][],
        labelInstanceIndexMapArray: Map<string, number[]>,
        numberOfCrossValidationFolds: number =
            CrossValidator.defaultNumberOfCrossValidationFolds,
        learnerParameterEpochs: number =
            AppSoftmaxRegressionSparse.defaultEpochs,
        learnerParameterMiniBatchSize: number =
            AppSoftmaxRegressionSparse.defaultMiniBatchSize,
        learnerParameterL1Regularization: number =
            AppSoftmaxRegressionSparse.defaultL1Regularization,
        learnerParameterL2Regularization: number =
            AppSoftmaxRegressionSparse.defaultL2Regularization,
        learnerParameterLossEarlyStopRatio: number =
            AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
        learnerParameterLearningRate: number =
            AppSoftmaxRegressionSparse.defaultLearningRate,
        learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            true) {
        super();
        this.labels = labels;
        this.labelMap = labelMap;
        this.numberLabels = numberLabels;
        this.numberFeatures = numberFeatures;
        this.intents = intents;
        this.utterances = utterances;
        this.labelIndexArray = labelIndexArray;
        this.featureIndexArrays = featureIndexArrays;
        this.labelInstanceIndexMapArray = labelInstanceIndexMapArray;
        this.numberOfCrossValidationFolds =
            numberOfCrossValidationFolds;
        this.learnerParameterEpochs =
            learnerParameterEpochs;
        this.learnerParameterMiniBatchSize =
            learnerParameterMiniBatchSize;
        this.learnerParameterL1Regularization =
            learnerParameterL1Regularization;
        this.learnerParameterL2Regularization =
            learnerParameterL2Regularization;
        this.learnerParameterLossEarlyStopRatio =
            learnerParameterLossEarlyStopRatio;
        this.learnerParameterLearningRate =
            learnerParameterLearningRate;
        this.learnerParameterToCalculateOverallLossAfterEpoch =
            learnerParameterToCalculateOverallLossAfterEpoch;
        this.crossValidationResult = this.crossValidate(
            this.labels,
            this.labelMap,
            this.numberLabels,
            this.numberFeatures,
            this.intents,
            this.utterances,
            this.labelIndexArray,
            this.featureIndexArrays,
            labelInstanceIndexMapArray);
        Utility.debuggingLog(
            `this.crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
            `${this.crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `,this.crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
            `${this.crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
            `,this.crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
            `${this.crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}`);
    }

    public getCrossValidationResult(): {
        "confusionMatrixCrossValidation": ConfusionMatrix
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return this.crossValidationResult;
    }

    public getNumberOfCrossValidationFolds(): number {
        return this.numberOfCrossValidationFolds;
    }

    public createLearner(
        numberLabels: number,
        numberFeatures: number): SoftmaxRegressionSparse {
        const numberInputUnits: number = numberFeatures;
        const numberOutputUnits: number = numberLabels;
        const softmax: SoftmaxRegressionSparse = new SoftmaxRegressionSparse(
            numberInputUnits,
            numberOutputUnits,
            this.learnerParameterL1Regularization,
            this.learnerParameterL2Regularization,
            this.learnerParameterLossEarlyStopRatio);
        return softmax;
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const predictionLabels: string[] = this.crossValidationResult.predictionLabels;
            const predictionLabelIndexes: number[] = this.crossValidationResult.predictionLabelIndexes;
            const groundTruthLabels: string[] = this.crossValidationResult.predictionLabels;
            const groundTruthLabelIndexes: number[] = this.crossValidationResult.predictionLabelIndexes;
            const predictions: number[][] = this.crossValidationResult.predictions;
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
            outputEvaluationReportDataArrays.CrossValidationScoreRecords =
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
                `${outputReportFilenamePrefix}_CrossValidationScoreRecords.json`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.CrossValidationScoreRecords,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        return outputEvaluationReportDataArrays;
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        const outputEvaluationReport: IDictionaryStringIdGenericValue<any> = {};
        const confusionMatrixCrossValidation: ConfusionMatrix =
            this.crossValidationResult.confusionMatrixCrossValidation;
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
                confusionMatrixCrossValidation);
        Utility.debuggingLog(
           `confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
           `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
           `,confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
           `${confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
           `,confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
           `${confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}`);
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
                `${outputReportFilenamePrefix}_CrossValidationConfusionMatrixReport.json`;
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

    public crossValidate(
        labels: string[],
        labelMap: { [id: string]: number; },
        numberLabels: number,
        numberFeatures: number,
        intents: string[],
        utterances: string[],
        labelIndexArray: number[],
        featureIndexArrays: number[][],
        labelInstanceIndexMapArray: Map<string, number[]>): {
            "confusionMatrixCrossValidation": ConfusionMatrix,
            "thresholdReporterCrossValidation": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } {
        // -------------------------------------------------------------------
        Utility.debuggingLog(`labelIndexArray.length=` +
            `${labelIndexArray.length}`);
        Utility.debuggingLog(`featureIndexArrays.length=` +
            `${featureIndexArrays.length}`);
        Utility.debuggingLog(`labelInstanceIndexMapArray.size=` +
            `${labelInstanceIndexMapArray.size}`);
        // -------------------------------------------------------------------
        const confusionMatrixCrossValidation =
            new ConfusionMatrix(labels, labelMap);
        const thresholdReporterCrossValidation: ThresholdReporter =
            new ThresholdReporter("", "", null, null, labels, labelMap);
        const predictions: number[][] =
            [];
        const predictionLabels: string[] =
            [];
        const predictionLabelIndexes: number[] =
            [];
        const groundTruthLabels: string[] =
            [];
        const groundTruthLabelIndexes: number[] =
            [];
        const numberOfCrossValidationFolds: number =
            this.getNumberOfCrossValidationFolds();
        for (let fold: number = 0; fold < numberOfCrossValidationFolds; fold++) {
            // ---------------------------------------------------------------
            const learner: SoftmaxRegressionSparse =
                this.createLearner(numberLabels, numberFeatures);
            // ---------------------------------------------------------------
            const cvLabelDenseIndexArrayForTraining: number[] = [];
            const cvFeatureSparseIndexArraysForTraining: number[][] = [];
            const cvLabelDenseArrayForTesting: string[] = [];
            const cvLabelDenseIndexArrayForTesting: number[] = [];
            const cvFeatureSparseIndexArraysForTesting: number[][] = [];
            for (const label of labelInstanceIndexMapArray.keys()) {
                const instanceIndexArrayPerLabel: number[] =
                    labelInstanceIndexMapArray.get(label) as number[];
                const numberOfInstancesPerLabel: number =
                    instanceIndexArrayPerLabel.length;
                const numberOfInstancesPerFold: number =
                    Math.floor(numberOfInstancesPerLabel / numberOfCrossValidationFolds) + 1;
                const beginIndexPerFold: number =
                    numberOfInstancesPerFold * fold;
                let endIndexPerFold: number =
                    beginIndexPerFold + numberOfInstancesPerFold;
                if (beginIndexPerFold >= numberOfInstancesPerLabel) {
                    continue;
                }
                if (endIndexPerFold > numberOfInstancesPerLabel) {
                    endIndexPerFold = numberOfInstancesPerLabel;
                }
                Utility.debuggingLog(
                    `label=${label}` +
                    `,fold=${fold}` +
                    `,numberOfCrossValidationFolds=${numberOfCrossValidationFolds}` +
                    `,numberOfInstancesPerLabel=${numberOfInstancesPerLabel}` +
                    `,beginIndexPerFold=${beginIndexPerFold}` +
                    `,endIndexPerFold=${endIndexPerFold}`);
                for (let index = 0; index < beginIndexPerFold; index++) {
                    const instanceIndex: number = instanceIndexArrayPerLabel[index];
                    if ((instanceIndex === undefined) ||
                        (instanceIndex < 0) ||
                        (instanceIndex >= labelIndexArray.length) ||
                        (instanceIndex >= featureIndexArrays.length)) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceLabelIndex: number =
                        labelIndexArray[instanceIndex];
                    if (instanceLabelIndex === undefined) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,instanceLabelIndex=${instanceLabelIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceFeatureIndexArray: number[] =
                        featureIndexArrays[instanceIndex];
                    cvLabelDenseIndexArrayForTraining.push(instanceLabelIndex);
                    cvFeatureSparseIndexArraysForTraining.push(instanceFeatureIndexArray);
                }
                for (let index = beginIndexPerFold; index < endIndexPerFold; index++) {
                    const instanceIndex: number = instanceIndexArrayPerLabel[index];
                    if ((instanceIndex === undefined) ||
                        (instanceIndex < 0) ||
                        (instanceIndex >= labelIndexArray.length) ||
                        (instanceIndex >= featureIndexArrays.length)) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceLabel: string =
                        intents[instanceIndex];
                    const instanceLabelIndex: number =
                        labelIndexArray[instanceIndex];
                    if (instanceLabelIndex === undefined) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,instanceLabelIndex=${instanceLabelIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceFeatureIndexArray: number[] =
                        featureIndexArrays[instanceIndex];
                    cvLabelDenseArrayForTesting.push(instanceLabel);
                    cvLabelDenseIndexArrayForTesting.push(instanceLabelIndex);
                    cvFeatureSparseIndexArraysForTesting.push(instanceFeatureIndexArray);
                }
                for (let index = endIndexPerFold; index < numberOfInstancesPerLabel; index++) {
                    const instanceIndex: number = instanceIndexArrayPerLabel[index];
                    if ((instanceIndex === undefined) ||
                        (instanceIndex < 0) ||
                        (instanceIndex >= labelIndexArray.length) ||
                        (instanceIndex >= featureIndexArrays.length)) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceLabelIndex: number =
                        labelIndexArray[instanceIndex];
                    if (instanceLabelIndex === undefined) {
                        Utility.debuggingThrow(
                            `label=${label}` +
                            `,index=${index}` +
                            `,instanceIndex=${instanceIndex}` +
                            `,instanceLabelIndex=${instanceLabelIndex}` +
                            `,labelIndexArray.length=${labelIndexArray.length}` +
                            `,featureIndexArrays.length=${featureIndexArrays.length}`);
                    }
                    const instanceFeatureIndexArray: number[] =
                        featureIndexArrays[instanceIndex];
                    cvLabelDenseIndexArrayForTraining.push(instanceLabelIndex);
                    cvFeatureSparseIndexArraysForTraining.push(instanceFeatureIndexArray);
                }
            }
            Utility.debuggingLog(
                `fold=${fold}` +
                `,numberOfCrossValidationFolds=${numberOfCrossValidationFolds}` +
                `,cvLabelDenseIndexArrayForTraining.length=${cvLabelDenseIndexArrayForTraining.length}` +
                `,cvLabelDenseIndexArrayForTesting.length=${cvLabelDenseIndexArrayForTesting.length}`);
            // ---------------------------------------------------------------
            if (this.learnerParameterMiniBatchSize <= 0) {
                learner.fit(
                    cvFeatureSparseIndexArraysForTraining,
                    cvLabelDenseIndexArrayForTraining,
                    this.learnerParameterEpochs,
                    this.learnerParameterLearningRate,
                    this.learnerParameterToCalculateOverallLossAfterEpoch,
                    false);
            } else {
                learner.fitMinibatching(
                    cvFeatureSparseIndexArraysForTraining,
                    cvLabelDenseIndexArrayForTraining,
                    this.learnerParameterEpochs,
                    this.learnerParameterMiniBatchSize,
                    this.learnerParameterLearningRate,
                    this.learnerParameterToCalculateOverallLossAfterEpoch,
                    false,
                    false);
            }
            // ---------------------------------------------------------------
            for (let index = 0; index < cvLabelDenseIndexArrayForTesting.length; index++) {
                const groundTruthLabel: string =
                    cvLabelDenseArrayForTesting[index];
                groundTruthLabels.push(groundTruthLabel);
                const groundTruthLabelIndex: number =
                    cvLabelDenseIndexArrayForTesting[index];
                groundTruthLabelIndexes.push(groundTruthLabelIndex);
                const instanceFeatureIndexArray: number[] =
                    cvFeatureSparseIndexArraysForTesting[index];
                const prediction: number[] =
                    learner.predict([instanceFeatureIndexArray])[0];
                predictions.push(prediction);
                const argMax: { "indexMax": number, "max": number } =
                    MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
                const predictionLabelIndex: number =
                    argMax.indexMax;
                predictionLabelIndexes.push(predictionLabelIndex);
                const predictionLabel: string =
                    labels[predictionLabelIndex];
                predictionLabels.push(predictionLabel);
                confusionMatrixCrossValidation.addInstanceByLabelIndex(
                    groundTruthLabelIndex,
                    predictionLabelIndex);
                thresholdReporterCrossValidation.addInstance(
                    prediction,
                    groundTruthLabelIndex,
                    "",
                    `${index}`);
            }
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        return {
            confusionMatrixCrossValidation,
            thresholdReporterCrossValidation,
            predictionLabels,
            predictionLabelIndexes,
            groundTruthLabels,
            groundTruthLabelIndexes,
            predictions };
        // -------------------------------------------------------------------
    }
}
