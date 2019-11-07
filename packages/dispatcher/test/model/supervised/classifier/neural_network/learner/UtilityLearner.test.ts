/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { AppSoftmaxRegressionSparse } from "../../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../../../../../src/model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../../../../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { LearnerUtility } from "../../../../../../src/model/supervised/classifier/neural_network/learner/UtilityLearner";

import { Utility } from "../../../../../../src/utility/Utility";

describe("Test Suite - model/supervised/classifier/neural_network/learner/utility_learner", () => {
    it("Test.0000 LearnerUtility-exampleFunctionPredictAndEvaluateTestDataset", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            LearnerUtility.exampleFunctionLoadFeaturizeTrainDataset(
                0,
                "data/Columnar/Email.tsv",
                0,
                2,
                1);
        const l1Regularization: number = AppSoftmaxRegressionSparse.defaultL1Regularization;
        const l2Regularization: number = AppSoftmaxRegressionSparse.defaultL2Regularization;
        const lossEarlyStopRatio: number = AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learningRate: number = AppSoftmaxRegressionSparse.defaultLearningRate;
        const numberFeatures: number = featurizer.getNumberFeatures(); // ==== featurizer.getNumberHashingFeatures();
        const numberLabels: number = featurizer.getNumberLabels();
        const numberInputUnits: number = numberFeatures;
        const numberOutputUnits: number = numberLabels;
        const softmax: SoftmaxRegressionSparse = new SoftmaxRegressionSparse(
            numberInputUnits,
            numberOutputUnits,
            l1Regularization,
            l2Regularization,
            lossEarlyStopRatio);
        LearnerUtility.exampleFunctionPredictAndEvaluateTestDataset(
            featurizer,
            softmax,
            "data/Columnar/EmailTest.tsv",
            0,
            2,
            1);
    });

    it("Test.0100 LearnerUtility-exampleFunctionPredictAndEvaluateTestDatasetHashing", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            LearnerUtility.exampleFunctionLoadFeaturizeTrainDataset(
                1024,
                "data/Columnar/Email.tsv",
                0,
                2,
                1);
        const l1Regularization: number = AppSoftmaxRegressionSparse.defaultL1Regularization;
        const l2Regularization: number = AppSoftmaxRegressionSparse.defaultL2Regularization;
        const lossEarlyStopRatio: number = AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learningRate: number = AppSoftmaxRegressionSparse.defaultLearningRate;
        const numberFeatures: number = featurizer.getNumberFeatures(); // ==== featurizer.getNumberHashingFeatures();
        const numberLabels: number = featurizer.getNumberLabels();
        const numberInputUnits: number = numberFeatures;
        const numberOutputUnits: number = numberLabels;
        const softmax: SoftmaxRegressionSparse = new SoftmaxRegressionSparse(
            numberInputUnits,
            numberOutputUnits,
            l1Regularization,
            l2Regularization,
            lossEarlyStopRatio);
        LearnerUtility.exampleFunctionPredictAndEvaluateTestDatasetHashing(
            featurizer,
            softmax,
            "data/Columnar/EmailTest.tsv",
            0,
            2,
            1);
    });

    it("Test.0200 LearnerUtility-exampleFunctionLoadFeaturizeTrainDataset", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        LearnerUtility.exampleFunctionLoadFeaturizeTrainDataset(
            0,
            "data/Columnar/Email.tsv",
            0,
            2,
            1);
    });

    it("Test.0300 LearnerUtility-exampleFunctionLoadTestDataset", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        LearnerUtility.exampleFunctionLoadTestDataset(
            "data/Columnar/EmailTest.tsv",
            0,
            2,
            1);
    });
});
