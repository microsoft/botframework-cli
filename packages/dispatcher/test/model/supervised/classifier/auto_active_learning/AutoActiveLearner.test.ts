/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { AutoActiveLearner } from "../../../../../src/model/supervised/classifier/auto_active_learning/AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { ColumnarContentEmail } from "../../../../data/ColumnarData.test";

// import { LuContentEmail } from "../../../../data/LuData.test";

import { ColumnarData } from "../../../../../src/data/ColumnarData";

// import { LuData } from "../../../../../src/data/LuData";

import { NgramSubwordFeaturizer } from "../../../../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../../../src/Utility/Utility";

import { UnitTestHelper } from "../../../../Utility/Utility.test";

export function exampleFunctionCreateAutoActiveLearner(): AutoActiveLearner {
    const doAutoActiveLearning: boolean =
        AutoActiveLearner.defaultDoAutoActiveLearning;
    const aalLimitInitialNumberOfInstancesPerCategory: number =
        AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory;
    const aalNumberOfInstancesPerIteration: number =
        AutoActiveLearner.defaultAalNumberOfInstancesPerIteration;
    const aalInstanceSelectionThreshold: number =
        AutoActiveLearner.defaultAalInstanceSelectionThreshold;
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
    const autoActiveLearnerObject: AutoActiveLearner =
        new AutoActiveLearner(
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    return autoActiveLearnerObject;
}

const autoActiveLearner: AutoActiveLearner =
    exampleFunctionCreateAutoActiveLearner();

describe("Test Suite - model/supervised/classifier/auto_active_learning/auto_active_learner/AutoActiveLearner", () => {
    it("Test.0000 constructor()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionCreateAutoActiveLearner();
    });

    it("Test.0100 getAalLimitInitialNumberOfInstancesPerCategory()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalLimitInitialNumberOfInstancesPerCategory: number =
            autoActiveLearner.getAalLimitInitialNumberOfInstancesPerCategory();
        Utility.debuggingLog(
            `aalLimitInitialNumberOfInstancesPerCategory=${aalLimitInitialNumberOfInstancesPerCategory}`);
    });
    it("Test.0101 getAalNumberOfInstancesPerIteration()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalNumberOfInstancesPerIteration: number =
            autoActiveLearner.getAalNumberOfInstancesPerIteration();
        Utility.debuggingLog(
            `aalNumberOfInstancesPerIteration=${aalNumberOfInstancesPerIteration}`);
    });
    it("Test.0102 getAalInstanceSelectionThreshold()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalInstanceSelectionThreshold: number =
            autoActiveLearner.getAalInstanceSelectionThreshold();
        Utility.debuggingLog(
            `aalInstanceSelectionThreshold=${aalInstanceSelectionThreshold}`);
    });

    it("Test.0200 createLearner()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const learner: SoftmaxRegressionSparse =
            autoActiveLearner.createLearner(
                10,
                10);
    });

    it("Test.0300 learn()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        // -----------------------------------------------------------------------
        const columnarContent: string = ColumnarContentEmail;
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const weightColumnIndex: number = 1;
        const linesToSkip: number = 1;
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                columnarContent,
                new NgramSubwordFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                true);
        // -----------------------------------------------------------------------
        const results =
            columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
        const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
        const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
        const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
            results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
        const remainingUtteranceIndexSet: Set<number> =
            results.remainingUtteranceIndexSet;
        Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
        Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
            `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
        Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
            `${Utility.setToJsonSerialization(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
        Utility.debuggingLog(`remainingUtteranceIndexSet=` +
            `${Utility.setToJsonSerialization(remainingUtteranceIndexSet)}`);
        Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
            `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
        Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
            `${remainingUtteranceIndexSet.size}`);
        // -------------------------------------------------------------------
        const doAutoActiveLearning: boolean =
            true; // ---- AutoActiveLearner.defaultDoAutoActiveLearning;
        let aalLimitInitialNumberOfInstancesPerCategory: number =
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory;
        // const aalNumberOfInstancesPerIteration: number =
        //     AutoActiveLearner.defaultAalNumberOfInstancesPerIteration;
        // const aalInstanceSelectionThreshold: number =
        //     AutoActiveLearner.defaultAalInstanceSelectionThreshold;
        if (!doAutoActiveLearning) {
            aalLimitInitialNumberOfInstancesPerCategory = -1;
        }
        const resultsInitialSampling =
            columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
                smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
                remainingUtteranceIndexSet,
                aalLimitInitialNumberOfInstancesPerCategory);
        const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
        const candidateUtteranceIndexSetSampled: Set<number> =
            resultsInitialSampling.candidateUtteranceIndexSetSampled;
        const candidateUtteranceIndexSetRemaining: Set<number> =
            resultsInitialSampling.candidateUtteranceIndexSetRemaining;
        Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
        Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
            `${Utility.setToJsonSerialization(candidateUtteranceIndexSetSampled)}`);
        Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
            `${Utility.setToJsonSerialization(candidateUtteranceIndexSetRemaining)}`);
        Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
            `${candidateUtteranceIndexSetSampled.size}`);
        Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
            `${candidateUtteranceIndexSetRemaining.size}`);
        // const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
        //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
        //         (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
        // Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        //     `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])),
                []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const intentLabelIndexArray: number[] =
            columnarData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            columnarData.getUtteranceFeatureIndexArrays();
        const learned: {
            "seedingInstanceIndexArray": number[],
            "learner": SoftmaxRegressionSparse,
        } = autoActiveLearner.learn(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            seedingUtteranceIndexArray,
            Array.from(candidateUtteranceIndexSetRemaining));
        // const aalSampledInstanceIndexArray: number[] =
        //     learned.seedingInstanceIndexArray;
        // const learner: SoftmaxRegressionSparse =
        //     learned.learner;
        // const newColumnarData: ColumnarData =
        //     ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
        //     columnarData,
        //     labelColumnIndex,
        //     textColumnIndex,
        //     weightColumnIndex,
        //     linesToSkip,
        //     new Set<number>(aalSampledInstanceIndexArray));
    });
});
