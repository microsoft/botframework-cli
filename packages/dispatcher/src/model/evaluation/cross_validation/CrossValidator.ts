/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { IMathematicsHelper } from "../../../mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { IConfusionMatrix } from "../../../mathematics/confusion_matrix/IConfusionMatrix";
import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";
import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { AbstractBaseEvaluator } from "../abstract_base_evaluator/AbstractBaseEvaluator";

import { Utility } from "../../../utility/Utility";

export class CrossValidator extends AbstractBaseEvaluator {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    public static defaultNumberOfCrossValidationFolds: number = 5;

    protected numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds;

    protected labelsCachedAfterCrossValidation: string[] = [];
    protected labelMapCachedAfterCrossValidation: { [id: string]: number } = {};
    protected numberLabelsCachedAfterCrossValidation: number = -1;
    protected numberFeaturesCachedAfterCrossValidation: number = -1;
    protected intentsCachedAfterCrossValidation: string[] = [];
    protected utterancesCachedAfterCrossValidation: string[] = [];
    protected labelIndexArrayCachedAfterCrossValidation: number[] = [];
    protected featureIndexArraysCachedAfterCrossValidation: number[][] = [];
    protected labelInstanceIndexMapArrayCachedAfterCrossValidation: Map<string, number[]> = new Map<string, number[]>();

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

    protected crossValidationResultCachedAfterCrossValidation: {
        "confusionMatrixCrossValidation": ConfusionMatrix
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "instanceIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = {
            confusionMatrixCrossValidation: new ConfusionMatrix([], {}),
            thresholdReporterCrossValidation: new ThresholdReporter("", "", null, null, [], {}),
            predictionLabels: [],
            predictionLabelIndexes: [],
            instanceIndexes: [],
            groundTruthLabels: [],
            groundTruthLabelIndexes: [],
            predictions: [] };

    constructor(
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
    }

    public getCrossValidationResult(): {
        "confusionMatrixCrossValidation": ConfusionMatrix
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "instanceIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } {
        return this.crossValidationResultCachedAfterCrossValidation;
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
            const predictionLabels: string[] =
                this.crossValidationResultCachedAfterCrossValidation.predictionLabels;
            const predictionLabelIndexes: number[] =
                this.crossValidationResultCachedAfterCrossValidation.predictionLabelIndexes;
            const instanceIndexes: number[] =
                this.crossValidationResultCachedAfterCrossValidation.instanceIndexes;
            const groundTruthLabels: string[] =
                this.crossValidationResultCachedAfterCrossValidation.groundTruthLabels;
            const groundTruthLabelIndexes: number[] =
                this.crossValidationResultCachedAfterCrossValidation.groundTruthLabelIndexes;
            const predictions: number[][] =
                this.crossValidationResultCachedAfterCrossValidation.predictions;
            const outputEvaluationReportDataArraysScoreRecords: string[][] = [];
            for (let index: number = 0; index < this.intentsCachedAfterCrossValidation.length; index++) {
                const instanceIndex: number = instanceIndexes[index];
                const intent: string = this.intentsCachedAfterCrossValidation[instanceIndex];
                const utterance: string = this.utterancesCachedAfterCrossValidation[instanceIndex];
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
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}): {
            "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
            "outputFilenames": string[],
            } {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        const outputFilenames: string[] = [];
        {
            let outputFilename: string =
                `${outputReportFilenamePrefix}_CrossValidationScoreRecords.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.CrossValidationScoreRecords,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
            outputFilenames.push(outputFilename);
        }
        {
            let outputFilename: string =
                `${outputReportFilenamePrefix}_CrossValidationScoreRecordsLabel.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                [this.labelsCachedAfterCrossValidation],
                [],
                columnDelimiter,
                recordDelimiter,
                encoding);
            outputFilenames.push(outputFilename);
        }
        return { outputEvaluationReportDataArrays, outputFilenames };
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        const outputEvaluationReport: IDictionaryStringIdGenericValue<any> = {};
        const confusionMatrixCrossValidation: ConfusionMatrix =
            this.crossValidationResultCachedAfterCrossValidation.confusionMatrixCrossValidation;
        const confusionMatrixMetricStructure: {
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": { [id: string]: { [id: string]: number } },
            "labelBinaryConfusionMatrixMap": { [id: string]: BinaryConfusionMatrix },
            "microAverageMetrics": {
                "accuracy": number,
                "truePositives": number,
                "falsePositives": number,
                "falseNegatives": number,
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
            confusionMatrixCrossValidation.generateConfusionMatrixMetricStructure();
        Utility.debuggingLog(
            `confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
            // tslint:disable-next-line: max-line-length
            `${confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
            `,confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
            `${confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
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
                `${outputReportFilenamePrefix}_CrossValidationConfusionMatrixReport.json`;
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

    public crossValidate(
        labels: string[],
        labelMap: { [id: string]: number },
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
            "instanceIndexes": number[],
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
        this.labelsCachedAfterCrossValidation = labels;
        this.labelMapCachedAfterCrossValidation = labelMap;
        this.numberLabelsCachedAfterCrossValidation = numberLabels;
        this.numberFeaturesCachedAfterCrossValidation = numberFeatures;
        this.intentsCachedAfterCrossValidation = intents;
        this.utterancesCachedAfterCrossValidation = utterances;
        this.labelIndexArrayCachedAfterCrossValidation = labelIndexArray;
        this.featureIndexArraysCachedAfterCrossValidation = featureIndexArrays;
        this.labelInstanceIndexMapArrayCachedAfterCrossValidation = labelInstanceIndexMapArray;
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
        const instanceIndexes: number[] =
            [];
        const groundTruthLabels: string[] =
            [];
        const groundTruthLabelIndexes: number[] =
            [];
        const numberOfCrossValidationFolds: number =
            this.getNumberOfCrossValidationFolds();
        let numberAcrossFoldsPredictions: number = 0;
        let numberAcrossFoldsPredictionLabelMatches: number = 0;
        let numberAcrossFoldsPredictionLabelIndexMatches: number = 0;
        for (let fold: number = 0; fold < numberOfCrossValidationFolds; fold++) {
            // ---------------------------------------------------------------
            const learner: SoftmaxRegressionSparse =
                this.createLearner(numberLabels, numberFeatures);
            // ---------------------------------------------------------------
            const cvLabelDenseIndexArrayForTraining: number[] = [];
            const cvFeatureSparseIndexArraysForTraining: number[][] = [];
            const cvInstanceIndexDenseArrayForTesting: number[] = [];
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
                    cvInstanceIndexDenseArrayForTesting.push(instanceIndex);
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
                const instanceIndex: number =
                    cvInstanceIndexDenseArrayForTesting[index];
                instanceIndexes.push(instanceIndex);
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
                    CrossValidator.MathematicsHelperObject.getIndexOnFirstMaxEntry(prediction);
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
                    `${index}`,
                    1);
                {
                    numberAcrossFoldsPredictions++;
                    if (predictionLabel === groundTruthLabel) {
                        numberAcrossFoldsPredictionLabelMatches++;
                    }
                    if (predictionLabelIndex === groundTruthLabelIndex) {
                        numberAcrossFoldsPredictionLabelIndexMatches++;
                    }
                }
            }
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        {
            Utility.debuggingLog(
                `numberAcrossFoldsPredictions=${numberAcrossFoldsPredictions}` +
                `,numberAcrossFoldsPredictionLabelMatches=${numberAcrossFoldsPredictionLabelMatches}` +
                `,numberAcrossFoldsPredictionLabelIndexMatches=${numberAcrossFoldsPredictionLabelIndexMatches}` +
                `,numberAcrossFoldsPredictionLabelMatchRatio=${numberAcrossFoldsPredictionLabelMatches / numberAcrossFoldsPredictions}` +
                `,numberAcrossFoldsPredictionLabelIndexMatchRatio=${numberAcrossFoldsPredictionLabelIndexMatches / numberAcrossFoldsPredictions}`);
        }
        // -------------------------------------------------------------------
        this.crossValidationResultCachedAfterCrossValidation = {
            confusionMatrixCrossValidation,
            thresholdReporterCrossValidation,
            predictionLabels,
            predictionLabelIndexes,
            instanceIndexes,
            groundTruthLabels,
            groundTruthLabelIndexes,
            predictions };
        return this.crossValidationResultCachedAfterCrossValidation;
        // -------------------------------------------------------------------
    }
}
