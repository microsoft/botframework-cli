/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ArgumentParser } from "argparse";

import { DictionaryMapUtility } from "../../../../data_structure/DictionaryMapUtility";
import { TMapStringKeyGenericArray } from "../../../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../../../data_structure/TMapStringKeyGenericValue";

import { AutoActiveLearner } from "./AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "../neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../neural_network/learner/SoftmaxRegressionSparse";

import { Data } from "../../../../data/Data";
import { DataWithSubwordFeaturizer } from "../../../../data/DataWithSubwordFeaturizer";

import { ColumnarDataWithSubwordFeaturizer } from "../../../../data/ColumnarDataWithSubwordFeaturizer";
import { LuDataWithSubwordFeaturizer } from "../../../../data/LuDataWithSubwordFeaturizer";
import { DataWithSubwordFeaturizerUtility } from "../../../../data/DataWithSubwordFeaturizerUtility";

import { NgramSubwordFeaturizer } from "../../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { BootstrapSamplerKeyMapDistribution } from "../../../../mathematics/sampler/BootstrapSamplerKeyMapDistribution";
import { BootstrapSamplerKeyMap } from "../../../../mathematics/sampler/BootstrapSamplerKeyMap";
import { ReservoirArraySampler } from "../../../../mathematics/sampler/ReservoirArraySampler";

import { Utility } from "../../../../utility/Utility";

export const DefaultLimitingSampleSize: number = 15000;

export class AppAutoActiveLearner {

    public static defaultDoBootstrapResampling: boolean = false;

    /**
     * This function uses a DataWithSubwordFeaturizer object and retrieve label and text data to run through 3 steps of
     * sampling processes:
     * 0) Bootstrap Resampling
     * 1) Auto Active Learning Sampling
     * 2) Stratified Sampling
     *
     * @param dataWithSubwordFeaturizer - a DataWithSubwordFeaturizer object
     *        whose label and text connect are used as input.
     * @param labelColumnIndex - label/intent column index.
     * @param textColumnIndex - text/utterace column index.
     * @param weightColumnIndex - weight column index.
     * @param linesToSkip - number of header lines skipped before processing each line as an instance record.
     * @param doBootstrapResampling - boolean flag to activate bootstrap resampling (BRS) logic or not.
     * @param brsDistribution - explicit distribution to control bootstrap resampling process
     * @param doAutoActiveLearning - boolean flag to activate auto active leaning (AAL) process or not.
     * @param aalLimitInitialNumberOfInstancesPerCategory - AAL initial number of instances per category/label/intent.
     * @param aalNumberOfInstancesPerIteration - AAL number of instances processed per iterations.
     * @param aalInstanceSelectionThreshold - AAL threshold to pick a tested instance for training in next iteration
     * @param learnerParameterEpochs - AAL Softmax Regression learner parameter - number of epochs.
     * @param learnerParameterMiniBatchSize - AAL Softmax Regression learner parameter - mini-batch size.
     * @param learnerParameterL1Regularization - AAL Softmax Regression learner parameter - L1 regularization.
     * @param learnerParameterL2Regularization - AAL Softmax Regression learner parameter - L2 regularization.
     * @param learnerParameterLossEarlyStopRatio - AAL Softmax Regression learner parameter - early stop ratio.
     * @param learnerParameterLearningRate - AAL Softmax Regression learner parameter - learning rate.
     * @param learnerParameterToCalculateOverallLossAfterEpoch - AAL Softmax Regression learner parameter - flag
     * @param limitingSampleSize - sample size controled by a final stratified sampling process.
     */
    public static async mainAutoActiveLearnerWithDataWithSubwordFeaturizer(
        dataWithSubwordFeaturizer: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        doBootstrapResampling: boolean =
            AppAutoActiveLearner.defaultDoBootstrapResampling,
        brsDistribution: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>(),
        doAutoActiveLearning: boolean =
            AutoActiveLearner.defaultDoAutoActiveLearning,
        aalLimitInitialNumberOfInstancesPerCategory: number =
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
        aalNumberOfInstancesPerIteration: number =
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
        aalInstanceSelectionThreshold: number =
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
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
            true,
        limitingSampleSize: number =
            DefaultLimitingSampleSize): Promise<{
            "newDataWithSubwordFeaturizer": DataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            }> {
        // -------------------------------------------------------------------
        if (doBootstrapResampling) {
            const bootstrapSamplerKeyMap: BootstrapSamplerKeyMapDistribution<number> =
                new BootstrapSamplerKeyMapDistribution<number>(
                    brsDistribution,
                    dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            // ---- NOTE-FOR-REFERENCE ---- const bootstrapSamplerKeyMap: BootstrapSamplerKeyMap<number> =
            // ---- NOTE-FOR-REFERENCE ----     new BootstrapSamplerKeyMap(
            // ---- NOTE-FOR-REFERENCE ----         dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            Utility.debuggingLog(`dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray()=` +
                `${Utility.mapToJsonSerialization(dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray())}`);
            Utility.debuggingLog(`bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()=` +
                `${bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()}`);
            // ---- FOR-DEBUGGING ---- const samplingIndexArrayGenerator =
            // ---- FOR-DEBUGGING ----     bootstrapSamplerKeyMap.sampleInstances();
            // ---- FOR-DEBUGGING ---- for (const element of samplingIndexArrayGenerator) {
            // ---- FOR-DEBUGGING ----     Utility.debuggingLog(`element of samplingIndexArrayGenerator=` +
            // ---- FOR-DEBUGGING ----         `${element}`);
            // ---- FOR-DEBUGGING ---- }
            const samplingIndexArray: number[] =
                [...bootstrapSamplerKeyMap.sampleInstances()];
            Utility.debuggingLog(`samplingIndexArray.length=` +
                `${samplingIndexArray.length}`);
            const dataWithSubwordFeaturizerBootstrapSampled: Data =
                await dataWithSubwordFeaturizer.createDataFromSamplingExistingDataUtterances(
                    dataWithSubwordFeaturizer,
                    labelColumnIndex,
                    textColumnIndex,
                    weightColumnIndex,
                    linesToSkip,
                    samplingIndexArray,
                    false);
            dataWithSubwordFeaturizer = dataWithSubwordFeaturizerBootstrapSampled as DataWithSubwordFeaturizer;
        }
        // -------------------------------------------------------------------
        const results =
            dataWithSubwordFeaturizer.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
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
        if (!doAutoActiveLearning) {
            aalLimitInitialNumberOfInstancesPerCategory = -1;
        }
        const resultsInitialSampling: {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
            } = dataWithSubwordFeaturizer.collectUtteranceIndexSetSeedingIntentTrainingSet(
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
        const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number, entry: [string, Set<number>]) =>
                accumulation + entry[1].size, 0);
        Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) =>
                accumulation.concat(Array.from(entry[1])), []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const seedingInstanceIndexArray: number[] =
            Utility.cloneArray(seedingUtteranceIndexArray);
        const intentLabelIndexArray: number[] =
            dataWithSubwordFeaturizer.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            dataWithSubwordFeaturizer.getUtteranceFeatureIndexArrays();
        const autoActiveLearner: AutoActiveLearner =
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
        const learned: {
            "seedingInstanceIndexArray": number[],
            "learner": SoftmaxRegressionSparse,
            } = autoActiveLearner.learn(
                dataWithSubwordFeaturizer.getFeaturizerLabels(),
                dataWithSubwordFeaturizer.getFeaturizerLabelMap(),
                dataWithSubwordFeaturizer.getFeaturizer().getNumberLabels(),
                dataWithSubwordFeaturizer.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                seedingInstanceIndexArray,
                Array.from(candidateUtteranceIndexSetRemaining));
        let aalSampledInstanceIndexArray: number[] =
            learned.seedingInstanceIndexArray;
        const learner: SoftmaxRegressionSparse =
            learned.learner;
        // -------------------------------------------------------------------
        const numberInstancesPreSelected: number =
            seedingUtteranceIndexArray.length;
        if (limitingSampleSize > numberInstancesPreSelected) {
            limitingSampleSize -= numberInstancesPreSelected;
            const reservoirArraySampler: ReservoirArraySampler<number> = new ReservoirArraySampler(
                aalSampledInstanceIndexArray,
                numberInstancesPreSelected);
            aalSampledInstanceIndexArray =
                [...reservoirArraySampler.sampleInstances(limitingSampleSize)];
        }
        // -------------------------------------------------------------------
        const newDataWithSubwordFeaturizer: DataWithSubwordFeaturizer =
            await dataWithSubwordFeaturizer.createDataFromFilteringExistingDataUtterances(
                dataWithSubwordFeaturizer,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                new Set<number>(aalSampledInstanceIndexArray),
                false) as DataWithSubwordFeaturizer;
        return {
            newDataWithSubwordFeaturizer,
            learner,
            seedingInstanceIndexArray: aalSampledInstanceIndexArray,
            seedingInstanceIndexArrayInitial: seedingUtteranceIndexArray };
        // -------------------------------------------------------------------
    }

    /**
     * This function can read a LU file with intent and utterance data and run through 3 steps of
     * sampling processes:
     * 0) Bootstrap Resampling
     * 1) Auto Active Learning Sampling
     * 2) Stratified Sampling
     *
     * @param luContent - a .lu file content in string form as input.
     * @param doBootstrapResampling - boolean flag to activate bootstrap resampling (BRS) logic or not.
     * @param brsDistribution - explicit distribution to control bootstrap resampling process
     * @param doAutoActiveLearning - boolean flag to activate auto active leaning (AAL) process or not.
     * @param aalLimitInitialNumberOfInstancesPerCategory - AAL initial number of instances per category/label/intent.
     * @param aalNumberOfInstancesPerIteration - AAL number of instances processed per iterations.
     * @param aalInstanceSelectionThreshold - AAL threshold to pick a tested instance for training in next iteration
     * @param learnerParameterEpochs - AAL Softmax Regression learner parameter - number of epochs.
     * @param learnerParameterMiniBatchSize - AAL Softmax Regression learner parameter - mini-batch size.
     * @param learnerParameterL1Regularization - AAL Softmax Regression learner parameter - L1 regularization.
     * @param learnerParameterL2Regularization - AAL Softmax Regression learner parameter - L2 regularization.
     * @param learnerParameterLossEarlyStopRatio - AAL Softmax Regression learner parameter - early stop ratio.
     * @param learnerParameterLearningRate - AAL Softmax Regression learner parameter - learning rate.
     * @param learnerParameterToCalculateOverallLossAfterEpoch - AAL Softmax Regression learner parameter - flag
     * @param limitingSampleSize - sample size controled by a final stratified sampling process.
     */
    public static async mainAutoActiveLearnerWithLuContent(
        luContent: string,
        doBootstrapResampling: boolean =
            AppAutoActiveLearner.defaultDoBootstrapResampling,
        brsDistribution: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>(),
        doAutoActiveLearning: boolean =
            AutoActiveLearner.defaultDoAutoActiveLearning,
        aalLimitInitialNumberOfInstancesPerCategory: number =
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
        aalNumberOfInstancesPerIteration: number =
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
        aalInstanceSelectionThreshold: number =
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
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
            true,
        limitingSampleSize: number =
            DefaultLimitingSampleSize): Promise<{
            "newLuDataWithSubwordFeaturizer": LuDataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            }> {
        // -------------------------------------------------------------------
        let luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
            await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                luContent,
                new NgramSubwordFeaturizer(),
                true);
        // -------------------------------------------------------------------
        if (doBootstrapResampling) {
            const bootstrapSamplerKeyMap: BootstrapSamplerKeyMapDistribution<number> =
                new BootstrapSamplerKeyMapDistribution<number>(
                    brsDistribution,
                    luDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            // ---- NOTE-FOR-REFERENCE ---- const bootstrapSamplerKeyMap: BootstrapSamplerKeyMap<number> =
            // ---- NOTE-FOR-REFERENCE ----     new BootstrapSamplerKeyMap(
            // ---- NOTE-FOR-REFERENCE ----         dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            Utility.debuggingLog(`luDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray()=` +
                `${Utility.mapToJsonSerialization(luDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray())}`);
            Utility.debuggingLog(`bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()=` +
                `${bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()}`);
            // ---- NOTE-FOR-DEBUGGING ---- const samplingIndexArrayGenerator =
            // ---- NOTE-FOR-DEBUGGING ----     bootstrapSamplerKeyMap.sampleInstances();
            // ---- NOTE-FOR-DEBUGGING ---- for (const element of samplingIndexArrayGenerator) {
            // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`element of samplingIndexArrayGenerator=` +
            // ---- NOTE-FOR-DEBUGGING ----         `${element}`);
            // ---- NOTE-FOR-DEBUGGING ---- }
            const samplingIndexArray: number[] =
                [...bootstrapSamplerKeyMap.sampleInstances()];
            Utility.debuggingLog(`samplingIndexArray.length=` +
                `${samplingIndexArray.length}`);
            const luDataWithSubwordFeaturizerBootstrapSampled: DataWithSubwordFeaturizer =
                await luDataWithSubwordFeaturizer.createDataFromSamplingExistingDataUtterances(
                    luDataWithSubwordFeaturizer,
                    -1, // ---- NOTE-NO-NEED-FOR-LuDataWithSubwordFeaturizer ---- labelColumnIndex,
                    -1, // ---- NOTE-NO-NEED-FOR-LuDataWithSubwordFeaturizer ---- textColumnIndex,
                    -1, // ---- NOTE-NO-NEED-FOR-LuDataWithSubwordFeaturizer ---- weightColumnIndex,
                    -1, // ---- NOTE-NO-NEED-FOR-LuDataWithSubwordFeaturizer ---- linesToSkip,
                    samplingIndexArray,
                    false) as DataWithSubwordFeaturizer;
            luDataWithSubwordFeaturizer = luDataWithSubwordFeaturizerBootstrapSampled as LuDataWithSubwordFeaturizer;
        }
        // -------------------------------------------------------------------
        const results =
            luDataWithSubwordFeaturizer.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
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
        if (!doAutoActiveLearning) {
            aalLimitInitialNumberOfInstancesPerCategory = -1;
        }
        const resultsInitialSampling: {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
            } = luDataWithSubwordFeaturizer.collectUtteranceIndexSetSeedingIntentTrainingSet(
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
        const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number, entry: [string, Set<number>]) =>
                accumulation + entry[1].size, 0);
        Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) =>
                accumulation.concat(Array.from(entry[1])), []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const seedingInstanceIndexArray: number[] =
            Utility.cloneArray(seedingUtteranceIndexArray);
        const intentLabelIndexArray: number[] =
            luDataWithSubwordFeaturizer.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            luDataWithSubwordFeaturizer.getUtteranceFeatureIndexArrays();
        const autoActiveLearner: AutoActiveLearner =
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
        const learned: {
            "seedingInstanceIndexArray": number[],
            "learner": SoftmaxRegressionSparse,
            } = autoActiveLearner.learn(
                luDataWithSubwordFeaturizer.getFeaturizerLabels(),
                luDataWithSubwordFeaturizer.getFeaturizerLabelMap(),
                luDataWithSubwordFeaturizer.getFeaturizer().getNumberLabels(),
                luDataWithSubwordFeaturizer.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                seedingInstanceIndexArray,
                Array.from(candidateUtteranceIndexSetRemaining));
        let aalSampledInstanceIndexArray: number[] =
            learned.seedingInstanceIndexArray;
        const learner: SoftmaxRegressionSparse =
            learned.learner;
        // -------------------------------------------------------------------
        const numberInstancesPreSelected: number =
            seedingUtteranceIndexArray.length;
        if (limitingSampleSize > numberInstancesPreSelected) {
            limitingSampleSize -= numberInstancesPreSelected;
            const reservoirArraySampler: ReservoirArraySampler<number> = new ReservoirArraySampler(
                aalSampledInstanceIndexArray,
                numberInstancesPreSelected);
            aalSampledInstanceIndexArray =
                [...reservoirArraySampler.sampleInstances(limitingSampleSize)];
        }
        // -------------------------------------------------------------------
        const newLuDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
            await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizerFromFilteringExistingLuDataUtterances(
                luDataWithSubwordFeaturizer,
                new Set<number>(aalSampledInstanceIndexArray),
                false);
        return {
            newLuDataWithSubwordFeaturizer,
            learner,
            seedingInstanceIndexArray: aalSampledInstanceIndexArray,
            seedingInstanceIndexArrayInitial: seedingUtteranceIndexArray };
        // -------------------------------------------------------------------
    }

    /**
     * This function can read a TSV columnar file with label and text data and run through 3 steps of
     * sampling processes:
     * 0) Bootstrap Resampling
     * 1) Auto Active Learning Sampling
     * 2) Stratified Sampling
     *
     * @param columnarContent - content of a TSV columnar file in string form as input.
     * @param labelColumnIndex - label/intent column index.
     * @param textColumnIndex - text/utterace column index.
     * @param weightColumnIndex - weight column index.
     * @param linesToSkip - number of header lines skipped before processing each line as an instance record.
     * @param doBootstrapResampling - boolean flag to activate bootstrap resampling (BRS) logic or not.
     * @param brsDistribution - explicit distribution to control bootstrap resampling process
     * @param doAutoActiveLearning - boolean flag to activate auto active leaning (AAL) process or not.
     * @param aalLimitInitialNumberOfInstancesPerCategory - AAL initial number of instances per category/label/intent.
     * @param aalNumberOfInstancesPerIteration - AAL number of instances processed per iterations.
     * @param aalInstanceSelectionThreshold - AAL threshold to pick a tested instance for training in next iteration
     * @param learnerParameterEpochs - AAL Softmax Regression learner parameter - number of epochs.
     * @param learnerParameterMiniBatchSize - AAL Softmax Regression learner parameter - mini-batch size.
     * @param learnerParameterL1Regularization - AAL Softmax Regression learner parameter - L1 regularization.
     * @param learnerParameterL2Regularization - AAL Softmax Regression learner parameter - L2 regularization.
     * @param learnerParameterLossEarlyStopRatio - AAL Softmax Regression learner parameter - early stop ratio.
     * @param learnerParameterLearningRate - AAL Softmax Regression learner parameter - learning rate.
     * @param learnerParameterToCalculateOverallLossAfterEpoch - AAL Softmax Regression learner parameter - flag
     * @param limitingSampleSize - sample size controled by a final stratified sampling process.
     */
    public static async mainAutoActiveLearnerWithColumnarContent(
        columnarContent: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        doBootstrapResampling: boolean =
            AppAutoActiveLearner.defaultDoBootstrapResampling,
        brsDistribution: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>(),
        doAutoActiveLearning: boolean =
            AutoActiveLearner.defaultDoAutoActiveLearning,
        aalLimitInitialNumberOfInstancesPerCategory: number =
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
        aalNumberOfInstancesPerIteration: number =
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
        aalInstanceSelectionThreshold: number =
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
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
            true,
        limitingSampleSize: number =
            DefaultLimitingSampleSize): Promise<{
            "newColumnarDataWithSubwordFeaturizer": ColumnarDataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            }> {
        // -------------------------------------------------------------------
        let columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
            ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
                columnarContent,
                new NgramSubwordFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                true);
        // -------------------------------------------------------------------
        if (doBootstrapResampling) {
            const bootstrapSamplerKeyMap: BootstrapSamplerKeyMapDistribution<number> =
                new BootstrapSamplerKeyMapDistribution<number>(
                    brsDistribution,
                    columnarDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            // ---- NOTE-FOR-REFERENCE ---- const bootstrapSamplerKeyMap: BootstrapSamplerKeyMap<number> =
            // ---- NOTE-FOR-REFERENCE ----     new BootstrapSamplerKeyMap(
            // ---- NOTE-FOR-REFERENCE ----         dataWithSubwordFeaturizer.getIntentInstanceIndexMapArray());
            Utility.debuggingLog(`columnarDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray()=` +
                `${Utility.mapToJsonSerialization(
                    columnarDataWithSubwordFeaturizer.getIntentInstanceIndexMapArray())}`);
            Utility.debuggingLog(`bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()=` +
                `${bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()}`);
            // ---- NOTE-FOR-DEBUGGING ---- const samplingIndexArrayGenerator =
            // ---- NOTE-FOR-DEBUGGING ----     bootstrapSamplerKeyMap.sampleInstances();
            // ---- NOTE-FOR-DEBUGGING ---- for (const element of samplingIndexArrayGenerator) {
            // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`element of samplingIndexArrayGenerator=` +
            // ---- NOTE-FOR-DEBUGGING ----         `${element}`);
            // ---- NOTE-FOR-DEBUGGING ---- }
            const samplingIndexArray: number[] =
                [...bootstrapSamplerKeyMap.sampleInstances()];
            Utility.debuggingLog(`samplingIndexArray.length=` +
                `${samplingIndexArray.length}`);
            const columnarDataWithSubwordFeaturizerBootstrapSampled: DataWithSubwordFeaturizer =
                await columnarDataWithSubwordFeaturizer.createDataFromSamplingExistingDataUtterances(
                    columnarDataWithSubwordFeaturizer,
                    labelColumnIndex,
                    textColumnIndex,
                    weightColumnIndex,
                    linesToSkip,
                    samplingIndexArray,
                    false) as DataWithSubwordFeaturizer;
            columnarDataWithSubwordFeaturizer =
                columnarDataWithSubwordFeaturizerBootstrapSampled as ColumnarDataWithSubwordFeaturizer;
        }
        // -------------------------------------------------------------------
        const results =
            columnarDataWithSubwordFeaturizer.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
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
        if (!doAutoActiveLearning) {
            aalLimitInitialNumberOfInstancesPerCategory = -1;
        }
        const resultsInitialSampling: {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
            } = columnarDataWithSubwordFeaturizer.collectUtteranceIndexSetSeedingIntentTrainingSet(
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
        const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number, entry: [string, Set<number>]) =>
                accumulation + entry[1].size, 0);
        Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) =>
                accumulation.concat(Array.from(entry[1])), []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const seedingInstanceIndexArray: number[] =
            Utility.cloneArray(seedingUtteranceIndexArray);
        const intentLabelIndexArray: number[] =
            columnarDataWithSubwordFeaturizer.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            columnarDataWithSubwordFeaturizer.getUtteranceFeatureIndexArrays();
        const autoActiveLearner: AutoActiveLearner =
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
        const learned: {
            "seedingInstanceIndexArray": number[],
            "learner": SoftmaxRegressionSparse,
            } = autoActiveLearner.learn(
                columnarDataWithSubwordFeaturizer.getFeaturizerLabels(),
                columnarDataWithSubwordFeaturizer.getFeaturizerLabelMap(),
                columnarDataWithSubwordFeaturizer.getFeaturizer().getNumberLabels(),
                columnarDataWithSubwordFeaturizer.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                seedingInstanceIndexArray,
                Array.from(candidateUtteranceIndexSetRemaining));
        let aalSampledInstanceIndexArray: number[] =
            learned.seedingInstanceIndexArray;
        const learner: SoftmaxRegressionSparse =
            learned.learner;
        // -------------------------------------------------------------------
        const numberInstancesPreSelected: number =
            seedingUtteranceIndexArray.length;
        if (limitingSampleSize > numberInstancesPreSelected) {
            limitingSampleSize -= numberInstancesPreSelected;
            const reservoirArraySampler: ReservoirArraySampler<number> = new ReservoirArraySampler(
                aalSampledInstanceIndexArray,
                numberInstancesPreSelected);
            aalSampledInstanceIndexArray =
                [...reservoirArraySampler.sampleInstances(limitingSampleSize)];
        }
        // -------------------------------------------------------------------
        const newColumnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
            // tslint:disable-next-line: max-line-length
            ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizerFromFilteringExistingColumnarDataUtterances(
                columnarDataWithSubwordFeaturizer,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                new Set<number>(aalSampledInstanceIndexArray),
                false);
        return {
            newColumnarDataWithSubwordFeaturizer,
            learner,
            seedingInstanceIndexArray: aalSampledInstanceIndexArray,
            seedingInstanceIndexArrayInitial: seedingUtteranceIndexArray };
        // -------------------------------------------------------------------
    }

    public static async mainAutoActiveLearner(): Promise<string[]> {
        // -------------------------------------------------------------------
        const dateTimeBeginInString: string = (new Date()).toISOString();
        // -------------------------------------------------------------------
        const parser = new ArgumentParser({
            addHelp: true,
            description: "app_auto_active_learning",
            version: "0.0.1",
        });
        parser.addArgument(
            ["-f", "--filename"],
            {
                help: "an input data file",
                required: true,
            },
        );
        parser.addArgument(
            ["-t", "--filetype"],
            {
                help: "data file type",
                required: false,
            },
        );
        parser.addArgument(
            ["-o", "--outputFilename"],
            {
                help: "output data file",
                required: false,
            },
        );
        parser.addArgument(
            ["-m", "--outputModelFilename"],
            {
                help: "output serialized model file",
                required: false,
            },
        );
        parser.addArgument(
            ["-x", "--outputFeaturizerFilename"],
            {
                help: "output serialized featurizer file",
                required: false,
            },
        );
        parser.addArgument(
            ["-d", "--debug"],
            {
                defaultValue: false,
                help: "enable printing debug information",
                required: false,
            },
        );
        parser.addArgument(
            ["-brs", "--doBootstrapResampling"],
            {
                defaultValue: AppAutoActiveLearner.defaultDoBootstrapResampling,
                help: "whether to activate bootstrap resampling or not",
                required: false,
            },
        );
        parser.addArgument(
            ["-brdf", "--bootstrapResamplingDistributionFilename"],
            {
                defaultValue: "",
                help: "The file used to build a distribution for bootstrap resampling",
                required: false,
            },
        );
        parser.addArgument(
            ["-brss", "--bootstrapResamplingSampleSizeConfihuration"],
            {
                defaultValue: 1,
                help: "bootstrap resampling sample size configuration",
                required: false,
            },
        );
        parser.addArgument(
            ["-brdfli", "--bootstrapResamplingDistributionFileLabelColumnIndex"],
            {
                defaultValue: 0,
                help: "label column index for the bootstrap resampling file",
                required: false,
            },
        );
        parser.addArgument(
            ["-brdfti", "--bootstrapResamplingDistributionFileTextColumnIndex"],
            {
                defaultValue: 0,
                help: "text/utterance column index for the bootstrap resampling file",
                required: false,
            },
        );
        parser.addArgument(
            ["-brdfls", "--bootstrapResamplingDistributionFileLinesToSkip"],
            {
                defaultValue: 0,
                help: "number of lines to skip for the bootstrap resampling file",
                required: false,
            },
        );
        parser.addArgument(
            ["-aal", "--doAutoActiveLearning"],
            {
                defaultValue: AutoActiveLearner.defaultDoAutoActiveLearning,
                help: "whether to activate auto active learning or not",
                required: false,
            },
        );
        parser.addArgument(
            ["-aali", "--aalLimitInitialNumberOfInstancesPerCategory"],
            {
                defaultValue: AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
                help: "initial number of data instances per category for auto active learning",
                required: false,
            },
        );
        parser.addArgument(
            ["-aaln", "--aalNumberOfInstancesPerIteration"],
            {
                defaultValue: AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
                help: "number of data instances per iteration for auto active learning",
                required: false,
            },
        );
        parser.addArgument(
            ["-aalt", "--aalInstanceSelectionThreshold"],
            {
                defaultValue: AutoActiveLearner.defaultAalInstanceSelectionThreshold,
                help: "prediction threshold for selecting a new training instance from a candidate set",
                required: false,
            },
        );
        parser.addArgument(
            ["-le", "--learnerParameterEpochs"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultEpochs,
                help: "number of epochs",
                required: false,
            },
        );
        parser.addArgument(
            ["-lb", "--learnerParameterMiniBatchSize"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultMiniBatchSize,
                help: "mini batch size",
                required: false,
            },
        );
        parser.addArgument(
            ["-ll1", "--learnerParameterL1Regularization"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultL1Regularization,
                help: "l1 regularization coefficient",
                required: false,
            },
        );
        parser.addArgument(
            ["-ll2", "--learnerParameterL2Regularization"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultL2Regularization,
                help: "l2 regularization coefficient",
                required: false,
            },
        );
        parser.addArgument(
            ["-lesr", "--learnerParameterLossEarlyStopRatio"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
                help: "loss early stop ratio",
                required: false,
            },
        );
        parser.addArgument(
            ["-llr", "--learnerParameterLearningRate"],
            {
                defaultValue: AppSoftmaxRegressionSparse.defaultLearningRate,
                help: "learning rate",
                required: false,
            },
        );
        parser.addArgument(
            ["-ltl", "--learnerParameterToCalculateOverallLossAfterEpoch"],
            {
                defaultValue: true,
                help: "whether to calcualte loss after each epoch",
                required: false,
            },
        );
        parser.addArgument(
            ["-ss", "--limitingSampleSize"],
            {
                defaultValue: 0,
                help: "down sample the training instances to this limit",
                required: false,
            },
        );
        parser.addArgument(
            ["-li", "--labelColumnIndex"],
            {
                defaultValue: 0,
                help: "label column index",
                required: false,
            },
        );
        parser.addArgument(
            ["-ti", "--textColumnIndex"],
            {
                defaultValue: 1,
                help: "text/utterance column index",
                required: false,
            },
        );
        parser.addArgument(
            ["-wi", "--weightColumnIndex"],
            {
                defaultValue: -1,
                help: "weight column index",
                required: false,
            },
        );
        parser.addArgument(
            ["-ls", "--linesToSkip"],
            {
                defaultValue: 0,
                help: "number of lines to skip for the input file",
                required: false,
            },
        );
        const parsedKnownArgs: any[] = parser.parseKnownArgs();
        const args: any = parsedKnownArgs[0];
        const unknownArgs: any = parsedKnownArgs[1];
        Utility.debuggingLog(
            `args=${Utility.jsonStringify(args)}`);
        Utility.debuggingLog(
            `unknownArgs=${Utility.jsonStringify(unknownArgs)}`);
        const debugFlag: boolean = Utility.toBoolean(args.debug);
        Utility.resetFlagToPrintDebuggingLogToConsole(debugFlag);
        // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
        // -------------------------------------------------------------------
        const filename: string =
            args.filename;
        if (!Utility.exists(filename)) {
            Utility.debuggingThrow(
                `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
        }
        const filetype: string =
            args.filetype;
        let outputFilename: string = args.outputFilename;
        if (outputFilename == null) {
            outputFilename = filename + ".lu";
        }
        const doBootstrapResampling: boolean =
            args.doBootstrapResampling;
        const bootstrapResamplingDistributionFilename: string =
            args.bootstrapResamplingDistributionFilename;
        const bootstrapResamplingSampleSizeConfihuration: number =
            +args.bootstrapResamplingSampleSizeConfihuration;
        const doAutoActiveLearning: boolean =
            args.doAutoActiveLearning;
        const aalLimitInitialNumberOfInstancesPerCategory: number =
            +args.aalLimitInitialNumberOfInstancesPerCategory;
        const aalNumberOfInstancesPerIteration: number =
            +args.aalNumberOfInstancesPerIteration;
        const aalInstanceSelectionThreshold: number =
            +args.aalInstanceSelectionThreshold;
        const learnerParameterEpochs: number =
            +args.learnerParameterEpochs;
        const learnerParameterMiniBatchSize: number =
            +args.learnerParameterMiniBatchSize;
        const learnerParameterL1Regularization: number =
            +args.learnerParameterL1Regularization;
        const learnerParameterL2Regularization: number =
            +args.learnerParameterL2Regularization;
        const learnerParameterLossEarlyStopRatio: number =
            +args.learnerParameterLossEarlyStopRatio;
        const learnerParameterLearningRate: number =
            +args.learnerParameterLearningRate;
        const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            args.learnerParameterToCalculateOverallLossAfterEpoch;
        const limitingSampleSize: number =
            +args.limitingSampleSize;
        Utility.debuggingLog(
            `filename=${filename}`);
        Utility.debuggingLog(
            `outputFilename=${outputFilename}`);
        Utility.debuggingLog(
            `doBootstrapResampling=${doBootstrapResampling}`);
        Utility.debuggingLog(
            `bootstrapResamplingDistributionFilename=${bootstrapResamplingDistributionFilename}`);
        Utility.debuggingLog(
            `bootstrapResamplingSampleSizeConfihuration=${bootstrapResamplingSampleSizeConfihuration}`);
        Utility.debuggingLog(
            `doAutoActiveLearning=${doAutoActiveLearning}`);
        Utility.debuggingLog(
            `aalLimitInitialNumberOfInstancesPerCategory=${aalLimitInitialNumberOfInstancesPerCategory}`);
        Utility.debuggingLog(
            `aalNumberOfInstancesPerIteration=${aalNumberOfInstancesPerIteration}`);
        Utility.debuggingLog(
            `aalInstanceSelectionThreshold=${aalInstanceSelectionThreshold}`);
        Utility.debuggingLog(
            `learnerParameterEpochs=${learnerParameterEpochs}`);
        Utility.debuggingLog(
            `learnerParameterMiniBatchSize=${learnerParameterMiniBatchSize}`);
        Utility.debuggingLog(
            `learnerParameterL1Regularization=${learnerParameterL1Regularization}`);
        Utility.debuggingLog(
            `learnerParameterL2Regularization=${learnerParameterL2Regularization}`);
        Utility.debuggingLog(
            `learnerParameterLossEarlyStopRatio=${learnerParameterLossEarlyStopRatio}`);
        Utility.debuggingLog(
            `learnerParameterLearningRate=${learnerParameterLearningRate}`);
        Utility.debuggingLog(
            `learnerParameterToCalculateOverallLossAfterEpoch=${learnerParameterToCalculateOverallLossAfterEpoch}`);
        Utility.debuggingLog(
            `limitingSampleSize=${limitingSampleSize}`);
        const outputModelFilename: string =
            args.outputModelFilename;
        const outputFeaturizerFilename: string =
            args.outputFeaturizerFilename;
        // -------------------------------------------------------------------
        const labelColumnIndex: number = +args.labelColumnIndex;
        const textColumnIndex: number = +args.textColumnIndex;
        const weightColumnIndex: number = +args.weightColumnIndex;
        const linesToSkip: number = +args.linesToSkip;
        Utility.debuggingLog(
            `labelColumnIndex=${labelColumnIndex}`);
        Utility.debuggingLog(
            `textColumnIndex=${textColumnIndex}`);
        Utility.debuggingLog(
            `weightColumnIndex=${weightColumnIndex}`);
        Utility.debuggingLog(
            `linesToSkip=${linesToSkip}`);
        // -------------------------------------------------------------------
        const bootstrapResamplingDistributionFileLabelColumnIndex: number =
            +args.bootstrapResamplingDistributionFileLabelColumnIndex;
        const bootstrapResamplingDistributionFileTextColumnIndex: number =
            +args.bootstrapResamplingDistributionFileTextColumnIndex;
        const bootstrapResamplingDistributionFileLinesToSkip: number =
            +args.bootstrapResamplingDistributionFileLinesToSkip;
        Utility.debuggingLog(
            `bootstrapResamplingDistributionFileLabelColumnIndex=` +
            `${bootstrapResamplingDistributionFileLabelColumnIndex}`);
        Utility.debuggingLog(
            `bootstrapResamplingDistributionFileTextColumnIndex=` +
            `${bootstrapResamplingDistributionFileTextColumnIndex}`);
        Utility.debuggingLog(
            `bootstrapResamplingDistributionFileLinesToSkip=` +
            `${bootstrapResamplingDistributionFileLinesToSkip}`);
        // -------------------------------------------------------------------
        let intentsUtterancesWeights: {
            "intents": string[],
            "utterances": string[],
            "weights": number[] } = {
                intents: [],
                utterances: [],
                weights: [] };
        let intentLabelIndexArray: number[] = [];
        let utteranceFeatureIndexArrays: number[][] = [];
        const dataWithSubwordFeaturizer: DataWithSubwordFeaturizer =
            await DataWithSubwordFeaturizerUtility.LoadDataWithSubwordFeaturizer(
                filename,
                null,
                true,
                filetype,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip);
        intentsUtterancesWeights = dataWithSubwordFeaturizer.getIntentsUtterancesWeights();
        intentLabelIndexArray = dataWithSubwordFeaturizer.getIntentLabelIndexArray();
        utteranceFeatureIndexArrays = dataWithSubwordFeaturizer.getUtteranceFeatureIndexArrays();
        // -------------------------------------------------------------------
        const bootstrapResamplingDistribution: Map<string, number> = new Map<string, number>();
        if (doBootstrapResampling) {
            if (Utility.exists(bootstrapResamplingDistributionFilename)) {
                const dataWithSubwordFeaturizerBootstrapResampling: DataWithSubwordFeaturizer =
                    await DataWithSubwordFeaturizerUtility.LoadDataWithSubwordFeaturizer(
                        bootstrapResamplingDistributionFilename,
                        null,
                        true,
                        filetype,
                        bootstrapResamplingDistributionFileLabelColumnIndex,
                        bootstrapResamplingDistributionFileTextColumnIndex,
                        bootstrapResamplingDistributionFileLinesToSkip);
                const bootstrapResamplingIntentInstanceIndexMapArray: Map<string, number[]> =
                    dataWithSubwordFeaturizerBootstrapResampling.getIntentInstanceIndexMapArray();
                for (const entry of bootstrapResamplingIntentInstanceIndexMapArray) {
                    bootstrapResamplingDistribution.set(entry[0], entry[1].length);
                }
            }
        }
        // -------------------------------------------------------------------
        const aalResult: {
            "newDataWithSubwordFeaturizer": DataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            } = await AppAutoActiveLearner.mainAutoActiveLearnerWithDataWithSubwordFeaturizer(
            dataWithSubwordFeaturizer,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip,
            doBootstrapResampling,
            bootstrapResamplingDistribution,
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
            learnerParameterToCalculateOverallLossAfterEpoch,
            limitingSampleSize);
        const newDataWithSubwordFeaturizer: DataWithSubwordFeaturizer =
            aalResult.newDataWithSubwordFeaturizer;
        const learner: SoftmaxRegressionSparse =
            aalResult.learner;
        // -------------------------------------------------------------------
        const outputFilenames: string[] = [];
        const outputFilenameDump: string = newDataWithSubwordFeaturizer.dumpLuLuisJsonStructureInLuFormat(
            outputFilename);
        outputFilenames.push(outputFilenameDump);
        const outputFilenameLuis: string =
            outputFilename + ".luis";
        const outputFilenameLuisAfterDumpfile = newDataWithSubwordFeaturizer.dumpLuLuisJsonStructure(
            outputFilenameLuis, undefined, 4);
        outputFilenames.push(outputFilenameLuisAfterDumpfile);
        if (!Utility.isEmptyString(outputModelFilename)) {
            const outputModelFilenameAfterDumpfile: string = Utility.dumpFile(
                outputModelFilename,
                learner.serializeToJsonString(undefined, 4));
            outputFilenames.push(outputModelFilenameAfterDumpfile);
        }
        if (!Utility.isEmptyString(outputFeaturizerFilename)) {
            const outputFeaturizerFilenameAfterDumpfile: string = Utility.dumpFile(
                outputFeaturizerFilename,
                newDataWithSubwordFeaturizer.getFeaturizer().serializeToJsonString(undefined, 4));
            outputFilenames.push(outputFeaturizerFilenameAfterDumpfile);
        }
        // -------------------------------------------------------------------
        const dateTimeEndInString: string = (new Date()).toISOString();
        // -------------------------------------------------------------------
        Utility.debuggingLog(
            `dateTimeBeginInString=${dateTimeBeginInString}`);
        Utility.debuggingLog(
            `dateTimeEndInString=${dateTimeEndInString}`);
        // -------------------------------------------------------------------
        return outputFilenames;
    }
}

if (require.main === module) {
    AppAutoActiveLearner.mainAutoActiveLearner().then(() => { return; });
}
