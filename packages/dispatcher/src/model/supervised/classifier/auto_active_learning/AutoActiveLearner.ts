/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../neural_network/learner/SoftmaxRegressionSparse";

import { IMathematicsHelper } from "../../../../mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../../../../mathematics/confusion_matrix/ConfusionMatrix";

import { Utility } from "../../../../utility/Utility";

export class AutoActiveLearner {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    public static defaultDoAutoActiveLearning: boolean = false;
    public static defaultAalLimitInitialNumberOfInstancesPerCategory: number = 10;
    public static defaultAalNumberOfInstancesPerIteration: number = 100;
    public static defaultAalInstanceSelectionThreshold: number = 0.95;

    protected doAutoActiveLearning: boolean =
        AutoActiveLearner.defaultDoAutoActiveLearning;
    protected aalLimitInitialNumberOfInstancesPerCategory: number =
        AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory;
    protected aalNumberOfInstancesPerIteration: number =
        AutoActiveLearner.defaultAalNumberOfInstancesPerIteration;
    protected aalInstanceSelectionThreshold: number =
        AutoActiveLearner.defaultAalInstanceSelectionThreshold;

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

    constructor(
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
            true) {
        this.doAutoActiveLearning =
            doAutoActiveLearning;
        this.aalLimitInitialNumberOfInstancesPerCategory =
            aalLimitInitialNumberOfInstancesPerCategory;
        this.aalNumberOfInstancesPerIteration =
            aalNumberOfInstancesPerIteration;
        this.aalInstanceSelectionThreshold =
            aalInstanceSelectionThreshold;
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

    public getAalLimitInitialNumberOfInstancesPerCategory(): number {
        return this.aalLimitInitialNumberOfInstancesPerCategory;
    }
    public getAalNumberOfInstancesPerIteration(): number {
        return this.aalNumberOfInstancesPerIteration;
    }
    public getAalInstanceSelectionThreshold(): number {
        return this.aalInstanceSelectionThreshold;
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

    public learn(
        labels: string[],
        labelMap: Map<string, number>,
        numberLabels: number,
        numberFeatures: number,
        labelIndexArray: number[],
        featureIndexArrays: number[][],
        seedingInstanceIndexArray: number[],
        candidateInstanceIndexArray: number[]): {
            "seedingInstanceIndexArray": number[],
            "learner": SoftmaxRegressionSparse,
            } {
        // -------------------------------------------------------------------
        Utility.debuggingLog(`seedingInstanceIndexArray.size=` +
            `${seedingInstanceIndexArray.length}`);
        Utility.debuggingLog(`candidateInstanceIndexArray.size=` +
            `${candidateInstanceIndexArray.length}`);
        // -------------------------------------------------------------------
        const learner: SoftmaxRegressionSparse =
            this.createLearner(numberLabels, numberFeatures);
        // -------------------------------------------------------------------
        const aalLabelDenseIndexArray: number[] = [];
        const aalFeatureSparseIndexArrays: number[][] = [];
        for (const index of seedingInstanceIndexArray) {
            aalLabelDenseIndexArray.push(labelIndexArray[index]);
            aalFeatureSparseIndexArrays.push(featureIndexArrays[index]);
        }
        // -------------------------------------------------------------------
        if (this.learnerParameterMiniBatchSize <= 0) {
            learner.fit(
                aalFeatureSparseIndexArrays,
                aalLabelDenseIndexArray,
                this.learnerParameterEpochs,
                this.learnerParameterLearningRate,
                this.learnerParameterToCalculateOverallLossAfterEpoch,
                false);
        } else {
            learner.fitMinibatching(
                aalFeatureSparseIndexArrays,
                aalLabelDenseIndexArray,
                this.learnerParameterEpochs,
                this.learnerParameterMiniBatchSize,
                this.learnerParameterLearningRate,
                this.learnerParameterToCalculateOverallLossAfterEpoch,
                false,
                false);
        }
        // -------------------------------------------------------------------
        const confusionMatrix: ConfusionMatrix = new ConfusionMatrix(labels, labelMap);
        const numberOfInstancesPerIteration: number = this.aalNumberOfInstancesPerIteration;
        let iteration: number = 0;
        let beginCandidateIndex: number = 0;
        let endCandidateIndex: number = beginCandidateIndex;
        while (true) {
            // ---------------------------------------------------------------
            if (beginCandidateIndex >= candidateInstanceIndexArray.length) {
                break;
            }
            endCandidateIndex += numberOfInstancesPerIteration;
            if (endCandidateIndex > candidateInstanceIndexArray.length) {
                endCandidateIndex = candidateInstanceIndexArray.length;
            }
            if (beginCandidateIndex >= endCandidateIndex) {
                break;
            }
            // ---------------------------------------------------------------
            let numberTrainingInstances: number = seedingInstanceIndexArray.length;
            Utility.debuggingLog(
                `iteration=` +
                `${iteration}` +
                `, beginCandidateIndex=` +
                `${beginCandidateIndex}` +
                `, endCandidateIndex=` +
                `${endCandidateIndex}` +
                `, number-candidates-for-training=` +
                `${endCandidateIndex - beginCandidateIndex}` +
                `, numberTrainingInstances=` +
                `${numberTrainingInstances}`);
            const confusionMatrixCurrentIteration = new ConfusionMatrix(labels, labelMap);
            for (let index: number = beginCandidateIndex; index < endCandidateIndex; index++) {
                const instanceIndex: number =
                    candidateInstanceIndexArray[index];
                const groundTruthLabelId: number =
                    labelIndexArray[instanceIndex];
                const instanceFeatureIndexArray: number[] =
                    featureIndexArrays[instanceIndex];
                const prediction: number[] =
                    learner.predict([instanceFeatureIndexArray])[0];
                // Utility.debuggingLog(
                //     `iteration=` +
                //     `${iteration}` +
                //     `, index=` +
                //     `${index}` +
                //     `, instanceIndex=` +
                //     `${instanceIndex}` +
                //     `, prediction=` +
                //     `${prediction}`);
                const argMax: { "indexMax": number, "max": number } =
                    AutoActiveLearner.MathematicsHelperObject.getIndexOnFirstMaxEntry(prediction);
                const predictionLabelId: number =
                    argMax.indexMax;
                confusionMatrixCurrentIteration.addInstanceByLabelIndex(
                    groundTruthLabelId,
                    predictionLabelId);
                if (argMax.max < this.aalInstanceSelectionThreshold) {
                    seedingInstanceIndexArray.push(instanceIndex);
                    aalLabelDenseIndexArray.push(groundTruthLabelId);
                    aalFeatureSparseIndexArrays.push(instanceFeatureIndexArray);
                }
            }
            confusionMatrix.addFrom(confusionMatrixCurrentIteration);
            // ---------------------------------------------------------------
            numberTrainingInstances = seedingInstanceIndexArray.length;
            Utility.debuggingLog(
                `iteration=` +
                `${iteration}` +
                `, beginCandidateIndex=` +
                `${beginCandidateIndex}` +
                `, endCandidateIndex=` +
                `${endCandidateIndex}` +
                `, number-candidates-for-training=` +
                `${endCandidateIndex - beginCandidateIndex}` +
                `, numberTrainingInstances=` +
                `${numberTrainingInstances}` +
                `, confusionMatrixCurrentIteration=` +
                `${confusionMatrixCurrentIteration.getMicroAverageMetrics()}` +
                `, confusionMatrix=` +
                `${confusionMatrix.getMicroAverageMetrics()}`);
            // ---------------------------------------------------------------
            if (this.learnerParameterMiniBatchSize <= 0) {
                learner.fit(
                    aalFeatureSparseIndexArrays,
                    aalLabelDenseIndexArray,
                    this.learnerParameterEpochs,
                    this.learnerParameterLearningRate,
                    this.learnerParameterToCalculateOverallLossAfterEpoch,
                    false);
            } else {
                learner.fitMinibatching(
                    aalFeatureSparseIndexArrays,
                    aalLabelDenseIndexArray,
                    this.learnerParameterEpochs,
                    this.learnerParameterMiniBatchSize,
                    this.learnerParameterLearningRate,
                    this.learnerParameterToCalculateOverallLossAfterEpoch,
                    false,
                    false);
            }
            // ---------------------------------------------------------------
            beginCandidateIndex = endCandidateIndex;
            iteration++;
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        return { seedingInstanceIndexArray, learner };
        // -------------------------------------------------------------------
    }
}
