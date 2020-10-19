/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { AppSoftmaxRegressionSparse } from "../../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../../../../../src/model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../../../../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

// import { LearnerUtility }
// from "../../../../../../src/model/supervised/classifier/neural_network/learner/UtilityLearner";

import { Utility } from "../../../../../../src/Utility/Utility";

import { UnitTestHelper } from "../../../../../Utility/Utility.test";

function getFeaturizerAndLearner(): {
    "featurizer": NgramSubwordFeaturizer,
    "learner": SoftmaxRegressionSparse } {
    const result: {
        "featurizer": NgramSubwordFeaturizer,
        "learner": SoftmaxRegressionSparse,
    } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
        "resources/data/Columnar/Email.tsv",
        "resources/data/Columnar/EmailTest.tsv",
        0,
        2,
        1,
        100,
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
        0.00,
        0.00);
    // const featurizer: NgramSubwordFeaturizer =
    //     result.featurizer;
    // const learner: SoftmaxRegressionSparse =
    //     result.learner;
    return result;
}

describe("Test Suite - model/supervised/classifier/neural_network/learner/softmax_regression_sparse", () => {
    it("Test.0000 constructor()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        // const featurizer: NgramSubwordFeaturizer =
        //     result.featurizer;
        // const learner: SoftmaxRegressionSparse =
        //     result.learner;
    });

    it("Test.0100 getModelWeights()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const modelWeights: number[][] = learner.getModelWeights();
        const numberOutputUnits: number = learner.getNumberOutputUnits();
        const numberInputUnits: number = learner.getNumberInputUnits();
        assert.ok(modelWeights.length === numberOutputUnits,
            `modelWeights.length=${modelWeights.length}` +
            `, numberOutputUnits=${numberOutputUnits}`);
        assert.ok(modelWeights[0].length === numberInputUnits,
            `modelWeights[0].length=${modelWeights[0].length}` +
            `, numberInputUnits=${numberInputUnits}`);
    });
    it("Test.0101 getModelBiases()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const modelBiases: number[] = learner.getModelBiases();
        const numberOutputUnits: number = learner.getNumberOutputUnits();
        assert.ok(modelBiases.length === numberOutputUnits,
            `modelBiases.length=${modelBiases.length}` +
            `, numberOutputUnits=${numberOutputUnits}`);
    });

    it("Test.0200 getNumberInputUnits()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const numberLabels: number = featurizer.getNumberLabels();
        const numberFeatures: number = featurizer.getNumberFeatures();
        const numberOutputUnits: number = learner.getNumberOutputUnits();
        const numberInputUnits: number = learner.getNumberInputUnits();
        assert.ok(numberLabels === numberOutputUnits,
            `numberLabels=${numberLabels}` +
            `, numberOutputUnits=${numberOutputUnits}`);
        assert.ok(numberFeatures === numberInputUnits,
            `numberFeatures=${numberFeatures}` +
            `, numberInputUnits=${numberInputUnits}`);
    });
    it("Test.0201 getNumberOutputUnits()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const numberLabels: number = featurizer.getNumberLabels();
        const numberFeatures: number = featurizer.getNumberFeatures();
        const numberOutputUnits: number = learner.getNumberOutputUnits();
        const numberInputUnits: number = learner.getNumberInputUnits();
        assert.ok(numberLabels === numberOutputUnits,
            `numberLabels=${numberLabels}` +
            `, numberOutputUnits=${numberOutputUnits}`);
        assert.ok(numberFeatures === numberInputUnits,
            `numberFeatures=${numberFeatures}` +
            `, numberInputUnits=${numberInputUnits}`);
    });

    it("Test.0300 getL1Regularization()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const l1Regularization: number = learner.getL1Regularization();
        Utility.debuggingLog(
            `l1Regularization=${l1Regularization}`);
    });
    it("Test.0301 getL2Regularization()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const l2Regularization: number = learner.getL2Regularization();
        Utility.debuggingLog(
            `l2Regularization=${l2Regularization}`);
    });

    it("Test.0400 getLossEarlyStopRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = getFeaturizerAndLearner();
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const lossEarlyStopRatio: number = learner.getLossEarlyStopRatio();
        Utility.debuggingLog(
            `lossEarlyStopRatio=${lossEarlyStopRatio}`);
    });

    it("Test.0500 fit()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            0, // ---- AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        // const featurizer: NgramSubwordFeaturizer =
        //     result.featurizer;
        // const learner: SoftmaxRegressionSparse =
        //     result.learner;
    });

    it("Test.0600 fitMinibatching()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        // const featurizer: NgramSubwordFeaturizer =
        //     result.featurizer;
        // const learner: SoftmaxRegressionSparse =
        //     result.learner;
    });

    it("Test.0700 predict()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            0, // ---- AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        // const featurizer: NgramSubwordFeaturizer =
        //     result.featurizer;
        // const learner: SoftmaxRegressionSparse =
        //     result.learner;
    });

    it("Test.0800 serializeToJsonString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            0, // ---- AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const serialized: string = learner.serializeToJsonString(undefined, 4);
        Utility.debuggingLog(
            `serialized=${serialized}`);
    });

    it("Test.0900 deserializeFromJsonString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const result: {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "resources/data/Columnar/Email.tsv",
            "resources/data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            0, // ---- AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
        const featurizer: NgramSubwordFeaturizer =
            result.featurizer;
        const learner: SoftmaxRegressionSparse =
            result.learner;
        const serializedJsonString: string =
            learner.serializeToJsonString(undefined, 4);
        Utility.debuggingLog(
            `serializedJsonString=${serializedJsonString}`);
        const numberFeatures: number = featurizer.getNumberFeatures(); // ==== featurizer.getNumberHashingFeatures();
        const numberLabels: number = featurizer.getNumberLabels();
        const numberInputUnits: number = numberFeatures;
        const numberOutputUnits: number = numberLabels;
        const learnerDeserialized: SoftmaxRegressionSparse = new SoftmaxRegressionSparse(
            numberInputUnits,
            numberOutputUnits,
            learner.getL1Regularization(),
            learner.getL2Regularization(),
            learner.getLossEarlyStopRatio());
        learnerDeserialized.deserializeFromJsonString(serializedJsonString);
        const modelBiases: number[] = learner.getModelBiases();
        const modelBiasesDeserialized: number[] = learnerDeserialized.getModelBiases();
        assert.ok(modelBiases.length === modelBiasesDeserialized.length,
            `modelBiases.length=${modelBiases.length}` +
            `, modelBiasesDeserialized.length=${modelBiasesDeserialized.length}`);
        assert.ok(modelBiases[0] === modelBiasesDeserialized[0],
            `modelBiases[0]=${modelBiases[0]}` +
            `, modelBiasesDeserialized[0]=${modelBiasesDeserialized[0]}`);
        const modelWeights: number[][] = learner.getModelWeights();
        const modelWeightsDeserialized: number[][] = learnerDeserialized.getModelWeights();
        assert.ok(modelWeights.length === modelWeightsDeserialized.length,
            `modelWeights.length=${modelWeights.length}` +
            `, modelWeightsDeserialized.length=${modelWeightsDeserialized.length}`);
        assert.ok(modelWeights[0][0] === modelWeightsDeserialized[0][0],
            `modelWeights[0][0]=${modelWeights[0][0]}` +
            `, modelWeightsDeserialized[0][0]=${modelWeightsDeserialized[0][0]}`);
    });
});
