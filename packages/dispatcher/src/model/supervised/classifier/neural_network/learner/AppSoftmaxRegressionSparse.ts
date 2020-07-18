/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "./SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { LearnerUtility } from "./UtilityLearner";

export class AppSoftmaxRegressionSparse {

    public static defaultEpochs: number = 200;
    public static defaultMiniBatchSize: number = 768;
    public static defaultNumberUtterancesPerMiniBatch = AppSoftmaxRegressionSparse.defaultMiniBatchSize;
    public static defaultNumberHashingFeatures = 1536;

    public static defaultL1Regularization: number = 0.0;
    public static defaultL2Regularization: number = 0.0;

    public static defaultLossEarlyStopRatio: number = 0.01;

    public static defaultLearningRate: number = 0.1;

    public static exampleFunctionSoftmaxRegressionSparseMinibatching(
        trainDatasetFilename: string,
        testDatasetFilename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        lineIndexToStart: number,
        epochs: number = AppSoftmaxRegressionSparse.defaultEpochs,
        miniBatchSize: number = AppSoftmaxRegressionSparse.defaultMiniBatchSize,
        l1Regularization: number = AppSoftmaxRegressionSparse.defaultL1Regularization,
        l2Regularization: number = AppSoftmaxRegressionSparse.defaultL2Regularization,
        lossEarlyStopRatio: number = AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
        learningRate: number = AppSoftmaxRegressionSparse.defaultLearningRate,
        toCalculateOverallLossAfterEpoch: boolean = true,
        toCalculateOverallLossAfterGradientUpdate: boolean = false,
        toCalculateOverallLossInGradientUpdate: boolean = false):
        {
            "featurizer": NgramSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } {
        // -------------------------------------------------------------------
        const numberUtterancesPerMiniBatch =
            AppSoftmaxRegressionSparse.defaultNumberUtterancesPerMiniBatch;
        // -------------------------------------------------------------------
        const featurizer: NgramSubwordFeaturizer =
            LearnerUtility.exampleFunctionLoadFeaturizeTrainDataset(
                0,
                trainDatasetFilename,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart);
        const intentsUtterancesWeights: {
            "intents": string[],
            "utterances": string[],
            "weights": number[] } =
            featurizer.getIntentsUtterancesWeights();
        const labels: string[] =
            featurizer.getLabels();
        const labelMap: { [id: string]: number } =
            featurizer.getLabelMap();
        const features: string[] =
            featurizer.getFeatures();
        const featureMap: { [id: string]: number } =
            featurizer.getFeatureMap();
        // -------------------------------------------------------------------
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
        // -------------------------------------------------------------------
        // const inputIntents: string[] = intentsUtterancesWeights.intents;
        // const inputUtterances: string[] = intentsUtterancesWeights.utterances;
        // const inputWeights: number[] = intentsUtterancesWeights.weights;
        // const numberInstances: number = inputIntents.length;
        {
            // ---------------------------------------------------------------
            {
                // -----------------------------------------------------------
                const intentUtteranceSparseIndexArrays: {
                    "intentLabelIndexArray": number[],
                    "utteranceFeatureIndexArrays": number[][] } =
                    featurizer.createIntentUtteranceSparseIndexArrays(
                        intentsUtterancesWeights);
                const intentLabelIndexArray: number[] =
                    intentUtteranceSparseIndexArrays.intentLabelIndexArray;
                const utteranceFeatureIndexArrays: number[][] =
                    intentUtteranceSparseIndexArrays.utteranceFeatureIndexArrays;
                // -----------------------------------------------------------
                if (miniBatchSize <= 0) {
                    softmax.fit(
                        utteranceFeatureIndexArrays,
                        intentLabelIndexArray,
                        epochs,
                        learningRate,
                        toCalculateOverallLossAfterEpoch,
                        toCalculateOverallLossInGradientUpdate);
                } else {
                    softmax.fitMinibatching(
                        utteranceFeatureIndexArrays,
                        intentLabelIndexArray,
                        epochs,
                        miniBatchSize,
                        learningRate,
                        toCalculateOverallLossAfterEpoch,
                        toCalculateOverallLossAfterGradientUpdate,
                        toCalculateOverallLossInGradientUpdate);
                }
                // -----------------------------------------------------------
            }
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        LearnerUtility.exampleFunctionPredictAndEvaluateTestDataset(
            featurizer,
            softmax,
            testDatasetFilename,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            lineIndexToStart);
        // -------------------------------------------------------------------
        const learner: SoftmaxRegressionSparse =
            softmax;
        return { featurizer, learner };
        // -------------------------------------------------------------------
    }
}

if (require.main === module) {
    AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
        "resources/data/Columnar/Email.tsv",
        "resources/data/Columnar/EmailTest.tsv",
        100,
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
        0.00,
        0.00);
}
