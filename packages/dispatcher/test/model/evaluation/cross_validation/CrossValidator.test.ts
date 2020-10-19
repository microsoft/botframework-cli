/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { CrossValidator } from "../../../../src/model/evaluation/cross_validation/CrossValidator";

import { AppSoftmaxRegressionSparse } from "../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

import { ColumnarContentEmail } from "../../../data/ColumnarData.test";

import { LuContentEmail } from "../../../data/LuData.test";

import { ConfusionMatrix } from "../../../../src/mathematics/confusion_matrix/ConfusionMatrix";

import { ThresholdReporter } from "../../../../src/model/evaluation/report/ThresholdReporter";

import { ColumnarData } from "../../../../src/data/ColumnarData";

import { LuData } from "../../../../src/data/LuData";

import { NgramSubwordFeaturizer } from "../../../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../utility/Utility.test";

describe("Test Suite - model/evaluation/cross_validator/CrossValidator", async () => {
    it("Test.0000 crossValidate() - LuContentEmail", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const luContent: string = LuContentEmail;
        const numberOfCrossValidationFolds: number =
            CrossValidator.defaultNumberOfCrossValidationFolds;
        const learnerParameterEpochs: number =
            AppSoftmaxRegressionSparse.defaultEpochs;
        const learnerParameterMiniBatchSize: number =
            AppSoftmaxRegressionSparse.defaultMiniBatchSize;
        const learnerParameterL1Regularization: number =
            AppSoftmaxRegressionSparse.defaultL1Regularization;
        const learnerParameterL2Regularization: number =
            AppSoftmaxRegressionSparse.defaultL2Regularization;
        const learnerParameterLossEarlyStopRatio: number =
            AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learnerParameterLearningRate: number =
            AppSoftmaxRegressionSparse.defaultLearningRate;
        const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            true;
        const luData: LuData =
            await LuData.createLuData(
                luContent,
                new NgramSubwordFeaturizer(),
                true);
        const intentLabelIndexArray: number[] =
            luData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            luData.getUtteranceFeatureIndexArrays();
        assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
        assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
        const crossValidator: CrossValidator =
            new CrossValidator(
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        crossValidator.crossValidate(
            luData.getFeaturizerLabels(),
                luData.getFeaturizerLabelMap(),
                luData.getFeaturizer().getNumberLabels(),
                luData.getFeaturizer().getNumberFeatures(),
                luData.getIntents(),
                luData.getUtterances(),
                luData.getIntentLabelIndexArray(),
                luData.getUtteranceFeatureIndexArrays(),
                luData.getIntentInstanceIndexMapArray());
        const crossValidationResult: {
            "confusionMatrixCrossValidation": ConfusionMatrix
            "thresholdReporterCrossValidation": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            crossValidator.getCrossValidationResult();
        Utility.debuggingLog(
            `crossValidationResult.confusionMatrixCrossValidation.getMicroQuantileMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMicroQuantileMetrics()}` +
            `crossValidationResult.confusionMatrixCrossValidation.getMacroQuantileMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMacroQuantileMetrics()}` +
            `crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
            // tslint:disable-next-line: max-line-length
            `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
    });
    it("Test.0001 crossValidate() - ColumnarContentEmail", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const columnarContent: string = ColumnarContentEmail;
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const weightColumnIndex: number = 1;
        const linesToSkip: number = 1;
        const numberOfCrossValidationFolds: number =
            CrossValidator.defaultNumberOfCrossValidationFolds;
        const learnerParameterEpochs: number =
            AppSoftmaxRegressionSparse.defaultEpochs;
        const learnerParameterMiniBatchSize: number =
            AppSoftmaxRegressionSparse.defaultMiniBatchSize;
        const learnerParameterL1Regularization: number =
            AppSoftmaxRegressionSparse.defaultL1Regularization;
        const learnerParameterL2Regularization: number =
            AppSoftmaxRegressionSparse.defaultL2Regularization;
        const learnerParameterLossEarlyStopRatio: number =
            AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learnerParameterLearningRate: number =
            AppSoftmaxRegressionSparse.defaultLearningRate;
        const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            true;
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                columnarContent,
                new NgramSubwordFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                true);
        const intentLabelIndexArray: number[] =
            columnarData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            columnarData.getUtteranceFeatureIndexArrays();
        assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
        assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
        const crossValidator: CrossValidator =
            new CrossValidator(
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        crossValidator.crossValidate(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            columnarData.getIntents(),
            columnarData.getUtterances(),
            columnarData.getIntentLabelIndexArray(),
            columnarData.getUtteranceFeatureIndexArrays(),
            columnarData.getIntentInstanceIndexMapArray());
        const crossValidationResult: {
            "confusionMatrixCrossValidation": ConfusionMatrix
            "thresholdReporterCrossValidation": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } =
            crossValidator.getCrossValidationResult();
        Utility.debuggingLog(
            `crossValidationResult.confusionMatrixCrossValidation.getMicroQuantileMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMicroQuantileMetrics()}` +
            `crossValidationResult.confusionMatrixCrossValidation.getMacroQuantileMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMacroQuantileMetrics()}` +
            `crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
            // tslint:disable-next-line: max-line-length
            `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
            `,crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
            `${crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
    });
});
