/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";

import { Utility } from "../../../utility/Utility";

export class CrossValidator {

    public static defaultNumberOfCrossValidationFolds: number = 5;

    protected numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds;

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

    public crossValidate(
        labels: string[],
        labelMap: { [id: string]: number; },
        numberLabels: number,
        numberFeatures: number,
        labelIndexArray: number[],
        featureIndexArrays: number[][],
        labelInstanceIndexMapArray: Map<string, number[]>):
        ConfusionMatrix {
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
        const numberOfCrossValidationFolds: number =
            this.getNumberOfCrossValidationFolds();
        for (let fold: number = 0; fold < numberOfCrossValidationFolds; fold++) {
            // ---------------------------------------------------------------
            const learner: SoftmaxRegressionSparse =
                this.createLearner(numberLabels, numberFeatures);
            // ---------------------------------------------------------------
            const cvLabelDenseIndexArrayForTraining: number[] = [];
            const cvFeatureSparseIndexArraysForTraining: number[][] = [];
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
                const groundTruthLabelId: number =
                    cvLabelDenseIndexArrayForTesting[index];
                const instanceFeatureIndexArray: number[] =
                    cvFeatureSparseIndexArraysForTesting[index];
                const prediction: number[] =
                    learner.predict([instanceFeatureIndexArray])[0];
                const argMax: { "indexMax": number, "max": number } =
                    MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
                const predictionLabelId: number =
                    argMax.indexMax;
                confusionMatrixCrossValidation.addInstanceByLabelIndex(
                    groundTruthLabelId,
                    predictionLabelId);
            }
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        return confusionMatrixCrossValidation;
        // -------------------------------------------------------------------
    }
}
