/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Utility } from "../../utility/Utility";

export class MathematicsHelper {

    public static epsilon: number = Utility.epsilon;
    public static epsilonUp: number = 1 - MathematicsHelper.epsilon;

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    public static softmaxSingleFunction(inputs: number[], index: number): number {
        const max: number =
            MathematicsHelper.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return inputShiftExps[index] / inputShiftExpsSum;
    }
    public static smoothArgmaxApproximationSingleFunction(inputs: number[], index: number): number {
        return MathematicsHelper.softmaxSingleFunction(inputs, index);
    }
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    public static softmaxFunction(inputs: number[]): number[] {
        const max: number =
            MathematicsHelper.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return inputShiftExps.map((entry: number) => entry / inputShiftExpsSum);
    }
    public static smoothArgmaxApproximationFunction(inputs: number[]): number[] {
        return MathematicsHelper.softmaxFunction(inputs);
    }

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    public static logsumexpStrictConvexSingleFunction(inputs: number[]): number {
        let max: number =
            MathematicsHelper.getIndexOnFirstMaxEntry(inputs).max;
        if (max < 0) {
            max = 0;
        }
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        inputShifts.push(-max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return max + Math.log(inputShiftExpsSum);
    }
    public static smoothMaxApproximationStrictConvexFunction(inputs: number[]): number {
        return MathematicsHelper.logsumexpStrictConvexSingleFunction(inputs);
    }
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    public static logsumexpSingleFunction(inputs: number[]): number {
        const max: number =
            MathematicsHelper.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return max + Math.log(inputShiftExpsSum);
    }
    public static smoothMaxApproximationFunction(inputs: number[]): number {
        return MathematicsHelper.logsumexpSingleFunction(inputs);
    }

    public static sigmoidLogisticGradientFunction(input: number): number {
        const logisticValue = MathematicsHelper.sigmoidLogisticFunction(input);
        return logisticValue * (1 - logisticValue);
    }

    public static sigmoidLogisticFunction(input: number): number {
        return 1 / (1 + Math.exp(-input));
    }
    public static sigmoidHyperbolicTangentFunction(input: number): number {
        const exponent: number = Math.exp(input);
        const exponentNegative: number = Math.exp(-input);
        return (exponent - exponentNegative) / (exponent + exponentNegative);
    }
    public static sigmoidArctangentFunction(input: number): number {
        return Math.atan(input);
    }
    public static sigmoidGudermannianFunction(input: number): number {
        return 2 * Math.atan(Math.tanh(input / 2));
    }
    public static sigmoidGeneralizedLogisticFunction(input: number, alpha: number = 1): number {
        return Math.pow(1 + Math.exp(-input), -alpha);
    }
    public static sigmoidAlgebraicFunction(input: number): number {
        return input / Math.sqrt(1 + input * input);
    }

    public static getL1Regularized(weight: number, l1Regularization: number): number {
        if (weight > 0) { return l1Regularization; }
        if (weight < 0) { return -l1Regularization; }
        return 0;
    }
    public static getL2Regularized(weight: number, l2Regularization: number): number {
        return (weight * l2Regularization);
    }
    public static getL1l2RegularizedWeightOptimizedSparse(
        weight: number,
        l1Regularization: number,
        l2Regularization: number): number {
        if (weight === 0) {
            return 0; // ---- NOTE: most sparse weights would remain zero, this check is to optimize the branches.
        }
        let regularized = weight * l2Regularization;
        if (weight > 0) {
            regularized += l1Regularization;
            if (weight <= regularized) {
                return 0; // ---- NOTE: cap weight at 0.
            }
        } else if (weight < 0) {
            regularized -= l1Regularization;
            if (weight >= regularized) {
                return 0; // ---- NOTE: cap weight at 0.
            }
        }
        weight -= regularized;
        return weight;
    }
    public static getL1l2RegularizedWeightOptimizedDense(
        weight: number,
        l1Regularization: number,
        l2Regularization: number): number {
        let regularized = weight * l2Regularization;
        if (weight > 0) {
            regularized += l1Regularization;
            if (weight <= regularized) {
                return 0; // ---- NOTE: cap weight at 0.
            }
        } else if (weight < 0) {
            regularized -= l1Regularization;
            if (weight >= regularized) {
                return 0; // ---- NOTE: cap weight at 0.
            }
        }
        weight -= regularized;
        return weight;
    }

    /*
     *  return:
     *      softmaxVectors: number[][]:
     *  update:
     *      matrixWeightGradientDenseArrays:
     *          Each row represents a dense feature gradient vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L X F, L: #features, F: #features.
     *      biasVectorDenseValueArray:
     *          A bias vector, each element is for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     *  input:
     *      instanceGroundTruthPositiveLabelIndexes:
     *          Each element is a label index.
     *          Dimension: N, N: #instances.
     *      instanceFeatureVectorSparseIndexArrays:
     *          Each row represents a sparse feature, one-hot-encoder vector for an input instance.
     *          #rows is the number of input instances
     *          #columns is the number of space feature index for that row/instance.
     *              There is no limit to the length of each row, as long as the elements, feature indexes,
     *              fall in the feature range [0, #features).
     *          Dimension: N X iF, N: #instances, iF: indefinite #features.
     *      matrixWeightDenseArrays:
     *          Each row represents a dense feature, float weigh vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L X F, L: #features, F: #features.
     *      biasVectorDenseValueArray:
     *          A bias vector, each element is for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     *      learningRate:
     *          learning rate for SGD.
     *      l1Regularization:
     *          l1 regularization coefficient.
     *      l2Regularization:
     *          l2 regularization coefficient.
     *      instanceFeatureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      instanceFeatureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public static softmaxLogLossGradientUpdate(
        instanceGroundTruthPositiveLabelIndexes: number[],
        instanceFeatureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        learningRate: number = 0.1,
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01,
        instanceFeatureVectorIndexBegin: number = 0,
        instanceFeatureVectorIndexEnd: number = 0): number[][] {
        // Utility.debuggingLog(
        //     `instanceFeatureVectorIndexBegin=${instanceFeatureVectorIndexBegin}`);
        // Utility.debuggingLog(
        //     `instanceFeatureVectorIndexEnd=${instanceFeatureVectorIndexEnd}`);
        if ((!instanceGroundTruthPositiveLabelIndexes) || (instanceGroundTruthPositiveLabelIndexes.length <= 0)) {
            Utility.debuggingThrow(
                `instanceGroundTruthPositiveLabelIndexes is empty`);
        }
        if ((!instanceFeatureVectorSparseIndexArrays) || (instanceFeatureVectorSparseIndexArrays.length <= 0)) {
            Utility.debuggingThrow(
                `instanceFeatureVectorSparseIndexArrays is empty`);
        }
        if ((!matrixWeightDenseArrays) || (matrixWeightDenseArrays.length <= 0)) {
            Utility.debuggingThrow(
                `matrixWeightDenseArrays is empty`);
        }
        if ((!biasVectorDenseValueArray) || (biasVectorDenseValueArray.length <= 0)) {
            Utility.debuggingThrow(
                `biasVectorDenseValueArray is empty`);
        }
        const softmaxVectors: number[][] = MathematicsHelper.matrixVectorProductSoftmaxSparseIndexes(
            instanceFeatureVectorSparseIndexArrays,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray,
            instanceFeatureVectorIndexBegin,
            instanceFeatureVectorIndexEnd);
        const numberInstances: number = softmaxVectors.length;
        const numberLabels: number = matrixWeightDenseArrays.length;
        // const numberFeatures: number = matrixWeightDenseArrays[0].length;
        const matrixWeightGradientDenseArrays: number[][] =
            MathematicsHelper.matrixNewLikeWithZeroCells(matrixWeightDenseArrays);
        const biasVectorGradientDenseValueArray: number[] =
            MathematicsHelper.vectorNewLikeWithZeroElements(biasVectorDenseValueArray);
        let instanceFeatureVectorIndex =
            instanceFeatureVectorIndexBegin;
        for (let instance: number = 0; instance < numberInstances; instance++) {
            const instanceFeatureVectorSparseIndexArray: number[] =
                instanceFeatureVectorSparseIndexArrays[instanceFeatureVectorIndex];
            const instanceLabel: number =
                instanceGroundTruthPositiveLabelIndexes[instanceFeatureVectorIndex];
            const softmaxVector: number[] =
                softmaxVectors[instance];
            /* ---- NOTE-FOR-REFERENCE ---- the loop for calculating gradients.
            for (let label = 0; label < numberLabels; label++) {
                const probability: number = softmaxVector[label];
                const labelWeightGradientDenseArray: number[] =
                    matrixWeightGradientDenseArrays[label];
                {
                    const gradient: number = probability;
                    if (label == instanceLabel) {
                        gradient = probability - 1;
                    }
                    {
                        for (let featureIndex of instanceFeatureVectorSparseIndexArray) {
                            labelWeightGradientDenseArray[featureIndex] += gradient;
                        }
                        {
                            biasVectorGradientDenseValueArray[label] += gradient;
                        }
                    }
                }
            }
            */
            {
                { // ---- NOTE: un-looping for optimizing the gradient computation process.
                    const probability: number = softmaxVector[instanceLabel];
                    const labelWeightGradientDenseArray: number[] =
                        matrixWeightGradientDenseArrays[instanceLabel];
                    {
                        const gradient: number = probability - 1;
                        // ---- NOTE-FOR-REFERENCE ---- if (label == instanceLabel) {
                        // ---- NOTE-FOR-REFERENCE ----     gradient = probability - 1;
                        // ---- NOTE-FOR-REFERENCE ---- }
                        {
                            for (const featureIndex of instanceFeatureVectorSparseIndexArray) {
                                labelWeightGradientDenseArray[featureIndex] += gradient;
                            }
                            {
                                biasVectorGradientDenseValueArray[instanceLabel] += gradient;
                            }
                        }
                    }
                }
                for (let label = 0; label < instanceLabel; label++) {
                    // ---- NOTE: un-looping for optimizing the gradient computation process.
                    const probability: number = softmaxVector[label];
                    const labelWeightGradientDenseArray: number[] =
                        matrixWeightGradientDenseArrays[label];
                    {
                        const gradient: number = probability;
                        // ---- NOTE-FOR-REFERENCE ---- if (label == instanceLabel) {
                        // ---- NOTE-FOR-REFERENCE ----     gradient = probability - 1;
                        // ---- NOTE-FOR-REFERENCE ---- }
                        {
                            for (const featureIndex of instanceFeatureVectorSparseIndexArray) {
                                labelWeightGradientDenseArray[featureIndex] += gradient;
                            }
                            {
                                biasVectorGradientDenseValueArray[label] += gradient;
                            }
                        }
                    }
                }
                for (let label = instanceLabel + 1; label < numberLabels; label++) {
                    // ---- NOTE: un-looping for optimizing the gradient computation process.
                    const probability: number = softmaxVector[label];
                    const labelWeightGradientDenseArray: number[] =
                        matrixWeightGradientDenseArrays[label];
                    {
                        const gradient: number = probability;
                        // ---- NOTE-FOR-REFERENCE ---- if (label == instanceLabel) {
                        // ---- NOTE-FOR-REFERENCE ----     gradient = probability - 1;
                        // ---- NOTE-FOR-REFERENCE ---- }
                        {
                            for (const featureIndex of instanceFeatureVectorSparseIndexArray) {
                                labelWeightGradientDenseArray[featureIndex] += gradient;
                            }
                            {
                                biasVectorGradientDenseValueArray[label] += gradient;
                            }
                        }
                    }
                }
            }
            instanceFeatureVectorIndex++;
        }
        const factorConstant: number =
            learningRate / numberInstances;
        if ((l1Regularization > 0) || (l2Regularization > 0)) {
            MathematicsHelper.matrixDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
                matrixWeightDenseArrays,
                matrixWeightGradientDenseArrays,
                factorConstant,
                l1Regularization,
                l2Regularization);
            MathematicsHelper.vectorDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
                biasVectorDenseValueArray,
                biasVectorGradientDenseValueArray,
                factorConstant,
                l1Regularization,
                l2Regularization);
        } else {
            MathematicsHelper.matrixDenseSubtractScaledFrom(
                matrixWeightDenseArrays,
                matrixWeightGradientDenseArrays,
                factorConstant);
            MathematicsHelper.vectorDenseSubtractScaledFrom(
                biasVectorDenseValueArray,
                biasVectorGradientDenseValueArray,
                factorConstant);
        }
        return softmaxVectors;
    }

    public static logLoss(
        probabilityVector: number[],
        instanceGroundTruthPositiveLabelIndex: number): number {
        let probability = probabilityVector[instanceGroundTruthPositiveLabelIndex];
        probability = MathematicsHelper.clipValue(probability);
        if (!probability || (probability <= 0)) {
            Utility.debuggingThrow(
                `probability=${probability}, instanceGroundTruthPositiveLabelIndex=${instanceGroundTruthPositiveLabelIndex}`);
        }
        const loss: number = Math.log(probability);
        return -loss;
    }
    public static logLossGeneric(
        probabilityVector: number[],
        labelVector: number[]): number {
        let loss: number = 0;
        for (let i: number = 0; i < labelVector.length; i++) {
            const label = labelVector[i];
            let probability = probabilityVector[i];
            probability = MathematicsHelper.clipValue(probability);
            if (!probability || (probability <= 0)) {
                Utility.debuggingThrow(
                    `probability=${probability}, labelVector=${labelVector}, probabilityVector=${probabilityVector}`);
            }
            if (label > 0) {
                loss += label * Math.log(probability);
            }
        }
        return -loss;
    }

    public static softmaxLogLoss(
        softmaxVectors: number[][],
        instanceGroundTruthPositiveLabelIndexes: number[]): number {
        let softmaxLogLossSum: number = 0;
        for (let i: number = 0; i < softmaxVectors.length; i++) {
            softmaxLogLossSum +=
                MathematicsHelper.logLoss(softmaxVectors[i], instanceGroundTruthPositiveLabelIndexes[i]);
        }
        return softmaxLogLossSum / softmaxVectors.length;
    }
    public static softmaxLogLossGeneric(
        softmaxVectors: number[][],
        labelVectors: number[][]): number {
        let softmaxLogLossSum: number = 0;
        for (let i: number = 0; i < softmaxVectors.length; i++) {
            softmaxLogLossSum +=
                MathematicsHelper.logLossGeneric(softmaxVectors[i], labelVectors[i]);
        }
        return softmaxLogLossSum / softmaxVectors.length;
    }

    public static matrixVectorProductSoftmaxSparseIndexesValues(
        instanceFeatureVectorSparseIndexArrays: number[][],
        instanceFeatureVectorSparseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number = 0,
        instanceFeatureVectorIndexEnd: number=  0): number[][] {
        if (Utility.isEmptyNumberArrays(instanceFeatureVectorSparseIndexArrays)) {
            Utility.debuggingThrow(
                "instanceFeatureVectorSparseIndexArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(instanceFeatureVectorSparseValueArrays)) {
            Utility.debuggingThrow(
                "instanceFeatureVectorSparseValueArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            instanceFeatureVectorSparseIndexArrays.length;
        if (Utility.isEmptyNumberArrays(instanceFeatureVectorSparseValueArrays)
            || (numberVectors > instanceFeatureVectorSparseValueArrays.length)) {
            Utility.debuggingThrow(
                "instanceFeatureVectorSparseValueArrays is empty or " +
                "does not have enough entries to match instanceFeatureVectorSparseIndexArrays.");
        }
        if (numberVectors <= 0) {
            Utility.debuggingThrow(
                `numberVectors is empty`);
        }
        if (instanceFeatureVectorIndexBegin < 0) {
            instanceFeatureVectorIndexBegin = 0;
        }
        if (instanceFeatureVectorIndexEnd <= 0) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        if (instanceFeatureVectorIndexEnd > numberVectors) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            instanceFeatureVectorIndexEnd - instanceFeatureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = instanceFeatureVectorIndexBegin; i < instanceFeatureVectorIndexEnd; i++) {
            const instanceFeatureVectorSparseIndexArray: number[] =
                instanceFeatureVectorSparseIndexArrays[i];
            const instanceFeatureVectorSparseValueArray: number[] =
                instanceFeatureVectorSparseValueArrays[i];
            const matrixVectorProduct: number[] =
                MathematicsHelper.matrixVectorProductSparseIndexesValues(
                    instanceFeatureVectorSparseIndexArray,
                    instanceFeatureVectorSparseValueArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            Utility.debuggingLog(
                `i=${i}, instanceFeatureVectorSparseIndexArray=${instanceFeatureVectorSparseIndexArray}`);
            Utility.debuggingLog(
                `i=${i}, instanceFeatureVectorSparseValueArray=${instanceFeatureVectorSparseValueArray}`);
            Utility.debuggingLog(
                `i=${i}, matrixWeightDenseArrays=${matrixWeightDenseArrays}`);
            Utility.debuggingLog(
                `i=${i}, biasVectorDenseValueArray=${biasVectorDenseValueArray}`);
            Utility.debuggingLog(
                `i=${i}, matrixVectorProduct=${matrixVectorProduct}`);
            const softmaxVector: number[] =
                MathematicsHelper.softmaxFunction(matrixVectorProduct);
            softmaxVectors[indexSoftmaxVectors++] =
                softmaxVector;
        }
        return softmaxVectors;
    }
    /*
     *  return:
     *      softmaxVectors:
     *          Each row is a softmax vector for an input instance.
     *          #rows is equivalent to #labels.
     *          Dimension: N X L, N: #instances, L: #labels.
     *  inputs:
     *      instanceFeatureVectorSparseIndexArrays:
     *          Each row represents a sparse feature, one-hot-encoder vector for an input instance.
     *          #rows is the number of input instances
     *          #columns is the number of space feature index for that row/instance.
     *              There is no limit to the length of each row, as long as the elements, feature indexes,
     *              fall in the feature range [0, #features).
     *          Dimension: N X iF, N: #instances, iF: indefinite #features.
     *      matrixWeightDenseArrays:
     *          Each row represents a dense feature, float weigh vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L X F, L: #features, F: #features.
     *      biasVectorDenseValueArray:
     *          A bias vector, each element is for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     *      instanceFeatureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      instanceFeatureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public static matrixVectorProductSoftmaxSparseIndexes(
        instanceFeatureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number = 0,
        instanceFeatureVectorIndexEnd: number = 0): number[][] {
        if (Utility.isEmptyNumberArrays(instanceFeatureVectorSparseIndexArrays)) {
            Utility.debuggingThrow(
                "instanceFeatureVectorSparseIndexArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            instanceFeatureVectorSparseIndexArrays.length;
        if (numberVectors <= 0) {
            Utility.debuggingThrow(
                `numberVectors is empty`);
        }
        if (instanceFeatureVectorIndexBegin < 0) {
            instanceFeatureVectorIndexBegin = 0;
        }
        if (instanceFeatureVectorIndexEnd <= 0) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        if (instanceFeatureVectorIndexEnd > numberVectors) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            instanceFeatureVectorIndexEnd - instanceFeatureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = instanceFeatureVectorIndexBegin; i < instanceFeatureVectorIndexEnd; i++) {
            const instanceFeatureVectorSparseIndexArray: number[] =
                instanceFeatureVectorSparseIndexArrays[i];
            const matrixVectorProduct: number[] =
                MathematicsHelper.matrixVectorProductSparseIndexes(
                    instanceFeatureVectorSparseIndexArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            const softmaxVector: number[] =
                MathematicsHelper.softmaxFunction(matrixVectorProduct);
            softmaxVectors[indexSoftmaxVectors++] =
                softmaxVector;
        }
        return softmaxVectors;
    }
    public static matrixVectorProductSoftmaxDenseValues(
        vectorDenseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number = 0,
        instanceFeatureVectorIndexEnd: number = 0): number[][] {
        if (Utility.isEmptyNumberArrays(vectorDenseValueArrays)) {
            Utility.debuggingThrow(
                "vectorDenseValueArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            vectorDenseValueArrays.length;
        if (numberVectors <= 0) {
            Utility.debuggingThrow(
                `numberVectors is empty`);
        }
        if (instanceFeatureVectorIndexBegin < 0) {
            instanceFeatureVectorIndexBegin = 0;
        }
        if (instanceFeatureVectorIndexEnd <= 0) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        if (instanceFeatureVectorIndexEnd > numberVectors) {
            instanceFeatureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            instanceFeatureVectorIndexEnd - instanceFeatureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = instanceFeatureVectorIndexBegin; i < instanceFeatureVectorIndexEnd; i++) {
            const vectorDenseValueArray: number[] =
                vectorDenseValueArrays[i];
            const matrixVectorProduct: number[] =
                MathematicsHelper.matrixVectorProductDenseValues(
                    vectorDenseValueArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            const softmaxVector: number[] =
                MathematicsHelper.softmaxFunction(matrixVectorProduct);
            softmaxVectors[indexSoftmaxVectors++] =
                softmaxVector;
        }
        return softmaxVectors;
    }

    public static matrixVectorProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthRowMatrix);
        return MathematicsHelper.matrixVectorProductSparseIndexesValuesTo(
            matrixVectorProduct,
            instanceFeatureVectorSparseIndexArray,
            instanceFeatureVectorSparseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public static matrixVectorProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthRowMatrix);
        return MathematicsHelper.matrixVectorProductSparseIndexesTo(
            matrixVectorProduct,
            instanceFeatureVectorSparseIndexArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public static matrixVectorProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthRowMatrix);
        return MathematicsHelper.matrixVectorProductDenseValuesTo(
            matrixVectorProduct,
            vectorDenseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }

    public static matrixVectorProductSparseIndexesValuesTo(
        matrixVectorProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        for (let row: number = 0; row < lengthRowMatrix; row++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[row];
            let biasVectorDenseValue: number =
                0;
            if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
                biasVectorDenseValue = biasVectorDenseValueArray[row];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductSparseIndexesValues(
                    instanceFeatureVectorSparseIndexArray,
                    instanceFeatureVectorSparseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public static matrixVectorProductSparseIndexesTo(
        matrixVectorProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        for (let row: number = 0; row < lengthRowMatrix; row++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[row];
            let biasVectorDenseValue: number =
                0;
            if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
                biasVectorDenseValue = biasVectorDenseValueArray[row];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductSparseIndexes(
                    instanceFeatureVectorSparseIndexArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public static matrixVectorProductDenseValuesTo(
        matrixVectorProduct: number[],
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        for (let row: number = 0; row < lengthRowMatrix; row++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[row];
            let biasVectorDenseValue: number =
                0;
            if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
                biasVectorDenseValue = biasVectorDenseValueArray[row];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductDenseValues(
                    vectorDenseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }

    public static vectorMatrixProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthColumnMatrix);
        return MathematicsHelper.vectorMatrixProductSparseIndexesValuesTo(
            vectorMatrixProduct,
            instanceFeatureVectorSparseIndexArray,
            instanceFeatureVectorSparseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public static vectorMatrixProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthColumnMatrix);
        return MathematicsHelper.vectorMatrixProductSparseIndexesTo(
            vectorMatrixProduct,
            instanceFeatureVectorSparseIndexArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public static vectorMatrixProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            MathematicsHelper.vectorNewWithZeroElements(lengthColumnMatrix);
        return MathematicsHelper.vectorMatrixProductDenseValuesTo(
            vectorMatrixProduct,
            vectorDenseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }

    public static vectorMatrixProductSparseIndexesValuesTo(
        vectorMatrixProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        // const lengthColumnMatrix: number =
        //     matrixWeightDenseArrays[0].length;
        for (let i: number = 0; i < instanceFeatureVectorSparseIndexArray.length; i++) {
            const vectorSparseIndex: number = instanceFeatureVectorSparseIndexArray[i];
            const vectorSparseValue: number = instanceFeatureVectorSparseValueArray[i];
            const matrixWeightDenseArray: number[] = matrixWeightDenseArrays[vectorSparseIndex];
            MathematicsHelper.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorSparseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            MathematicsHelper.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }
    public static vectorMatrixProductSparseIndexesTo(
        vectorMatrixProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        // const lengthColumnMatrix: number =
        //     matrixWeightDenseArrays[0].length;
        for (const vectorSparseIndex of instanceFeatureVectorSparseIndexArray) {
            const vectorSparseValue: number = 1;
            const matrixWeightDenseArray: number[] = matrixWeightDenseArrays[vectorSparseIndex];
            MathematicsHelper.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorSparseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            MathematicsHelper.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }
    public static vectorMatrixProductDenseValuesTo(
        vectorMatrixProduct: number[],
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        // const lengthColumnMatrix: number =
        //     matrixWeightDenseArrays[0].length;
        for (let row: number = 0; row < lengthRowMatrix; row++) {
            const vectorDenseValue: number = vectorDenseValueArray[row];
            const matrixWeightDenseArray: number[] = matrixWeightDenseArrays[row];
            MathematicsHelper.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorDenseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            MathematicsHelper.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }

    public static dotProductSparseIndexesValues(
        sparseIndexArray: number[],
        sparseValueArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        const dotProduct: number =
            sparseIndexArray.reduce(
                (accumulation: number, entry: number, index: number) =>
                accumulation + sparseValueArray[index] * weights[entry],
                0);
        return (dotProduct + weightBias);
    }
    public static dotProductSparseIndexes(
        sparseIndexArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        const dotProduct: number =
            sparseIndexArray.reduce(
                (accumulation: number, entry: number) =>
                accumulation + weights[entry],
                0);
        return (dotProduct + weightBias);
    }
    public static dotProductDenseValues(
        denseValueArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        let dotProduct: number = 0;
        for (let i: number = 0; i < weights.length; i++) {
            dotProduct += denseValueArray[i] * weights[i];
        }
        return (dotProduct + weightBias);
    }

    public static matrixDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                const adjustment: number = denseValueArray1[row][column];
                denseValueArray0[row][column] -= (constant * adjustment);
                if (adjustment !== 0) {
                    denseValueArray0[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                        denseValueArray0[row][column],
                        l1Regularization,
                        l2Regularization);
                }
            }
        }
        return denseValueArray0;
    }
    public static matrixDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                const adjustment: number = denseValueArray1[row][column];
                denseValueArray0[row][column] -= (constant * adjustment);
                if (adjustment !== 0) {
                    denseValueArray0[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                        denseValueArray0[row][column],
                        l1Regularization,
                        l2Regularization);
                }
            }
        }
        return denseValueArray0;
    }
    public static vectorDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            const adjustment: number = denseValueArray1[i];
            denseValueArray0[i] -= (constant * adjustment);
            if (adjustment !== 0) {
                denseValueArray0[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                    denseValueArray0[i],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray0;
    }
    public static vectorDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            const adjustment: number = denseValueArray1[i];
            denseValueArray0[i] -= (constant * adjustment);
            if (adjustment !== 0) {
                denseValueArray0[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                    denseValueArray0[i],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray0;
    }

    public static matrixDenseL1l2RegularizedSparseTo(
        denseValueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = denseValueArray.length;
        const columns: number = denseValueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                denseValueArray[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                    denseValueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray;
    }
    public static matrixDenseL1l2RegularizedDenseTo(
        denseValueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = denseValueArray.length;
        const columns: number = denseValueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                denseValueArray[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                    denseValueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray;
    }

    public static vectorDenseL1l2RegularizedSparseTo(
        denseValueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < denseValueArray.length; i++) {
            denseValueArray[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                denseValueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return denseValueArray;
    }
    public static vectorDenseL1l2RegularizedDenseTo(
        denseValueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < denseValueArray.length; i++) {
            denseValueArray[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                denseValueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return denseValueArray;
    }

    public static tensor4dDenseAssignRandomTo(
        denseValueArray0: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public static tensor4dDenseAssignConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseAddConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseMultiplyConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseSubtractConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseDivideConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public static tensor4dDenseAssignTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseAddTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseMultiplyTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseSubtractFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseDivideFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public static tensor4dDenseAssignScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseAddScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseMultiplyScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseSubtractScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor4dDenseDivideScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.tensor3dDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public static tensor3dDenseAssignRandomTo(
        denseValueArray0: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public static tensor3dDenseAssignConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseAddConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseMultiplyConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseSubtractConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseDivideConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public static tensor3dDenseAssignTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseAddTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseMultiplyTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseSubtractFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseDivideFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public static tensor3dDenseAssignScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseAddScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseMultiplyScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseSubtractScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static tensor3dDenseDivideScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.matrixDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public static matrixDenseAssignRandomTo(
        denseValueArray0: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public static matrixDenseAssignConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseAddConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseMultiplyConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseSubtractConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseDivideConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public static matrixDenseAssignTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static matrixDenseAddTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static matrixDenseMultiplyTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static matrixDenseSubtractFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public static matrixDenseDivideFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public static matrixDenseAssignScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseAddScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseMultiplyScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseSubtractScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public static matrixDenseDivideScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            MathematicsHelper.vectorDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public static vectorDenseAssignRandomTo(
        denseValueArray0: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] =  Utility.getRandomNumber();
        }
        return denseValueArray0;
    }

    public static vectorDenseAssignConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = constant;
        }
        return denseValueArray0;
    }
    public static vectorDenseAddConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += constant;
        }
        return denseValueArray0;
    }
    public static vectorDenseMultiplyConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= constant;
        }
        return denseValueArray0;
    }
    public static vectorDenseSubtractConstantFrom(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= constant;
        }
        return denseValueArray0;
    }
    public static vectorDenseDivideConstantFrom(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= constant;
        }
        return denseValueArray0;
    }

    public static vectorDenseAssignTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public static vectorDenseAddTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public static vectorDenseMultiplyTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public static vectorDenseSubtractFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public static vectorDenseDivideFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= denseValueArray1[i];
        }
        return denseValueArray0;
    }

    public static vectorDenseAssignScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public static vectorDenseAddScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public static vectorDenseMultiplyScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public static vectorDenseSubtractScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public static vectorDenseDivideScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }

    public static vectorSparseAssignRandomTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = Utility.getRandomNumber();
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public static vectorSparseAssignConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseAddConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] += constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseMultiplyConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] *= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseSubtractConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] -= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseDivideConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] /= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public static vectorSparseAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = sparseValueArray1[i];
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] += sparseValueArray1[i];
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] *= sparseValueArray1[i];
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseSubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] -= sparseValueArray1[i];
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] /= sparseValueArray1[i];
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public static vectorSparseAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = (constant * sparseValueArray1[i]);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] += (constant * sparseValueArray1[i]);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] *= (constant * sparseValueArray1[i]);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseSubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] -= (constant * sparseValueArray1[i]);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public static vectorSparseDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] /= (constant * sparseValueArray1[i]);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public static vectorSparseIndexDenseArrayAssignRandomTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = Utility.getRandomNumber();
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static vectorSparseIndexDenseArrayAssignConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayAddConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayMultiplyConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArraySubtractConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayDivideConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static vectorSparseIndexDenseArrayAssignTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayAddTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static vectorSparseIndexDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorSparseIndexDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static vectorIndependentSparseIndexDenseArrayAssignTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] = denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayAddTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] += denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] *= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] -= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] /= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static vectorIndependentSparseIndexDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] = (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] += (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] *= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] -= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public static vectorIndependentSparseIndexDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] /= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public static tensor4dNewLikeWithRandomCells(
        tensor4d: number[][][][]): number[][][][] {
        return MathematicsHelper.tensor4dNewWithRandomCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length);
    }
    public static tensor4dNewLikeWithRandomCellsScaled(
        tensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        return MathematicsHelper.tensor4dNewWithRandomCellsScaled(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length,
            scale);
    }
    public static tensor4dNewLikeWithZeroCells(
        tensor4d: number[][][][]): number[][][][] {
        return MathematicsHelper.tensor4dNewWithZeroCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length);
    }
    public static tensor4dNewLikeWithConstantCells(
        tensor4d: number[][][][],
        constant: number = 1): number[][][][] {
        return MathematicsHelper.tensor4dNewWithConstantCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length,
            constant);
    }
    public static tensor4dNewLikeWithScaledCells(
        tensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        return MathematicsHelper.tensor4dNewWithScaledCells(tensor4d, scale);
    }
    public static tensor4dNewLikeWithL1l2RegularizedSparseCells(
        tensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        return MathematicsHelper.tensor4dNewWithL1l2RegularizedSparseCells(
            tensor4d,
            l1Regularization,
            l2Regularization);
    }
    public static tensor4dNewLikeWithL1l2RegularizedDenseCells(
        tensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        return MathematicsHelper.tensor4dNewWithL1l2RegularizedDenseCells(
            tensor4d,
            l1Regularization,
            l2Regularization);
    }

    public static tensor3dNewLikeWithRandomCells(
        tensor3d: number[][][]): number[][][] {
        return MathematicsHelper.tensor3dNewWithRandomCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length);
    }
    public static tensor3dNewLikeWithRandomCellsScaled(
        tensor3d: number[][][],
        scale: number = 1): number[][][] {
        return MathematicsHelper.tensor3dNewWithRandomCellsScaled(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length,
            scale);
    }
    public static tensor3dNewLikeWithZeroCells(
        tensor3d: number[][][]): number[][][] {
        return MathematicsHelper.tensor3dNewWithZeroCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length);
    }
    public static tensor3dNewLikeWithConstantCells(
        tensor3d: number[][][],
        constant: number = 1): number[][][] {
        return MathematicsHelper.tensor3dNewWithConstantCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length,
            constant);
    }
    public static tensor3dNewLikeWithScaledCells(
        tensor3d: number[][][],
        scale: number = 1): number[][][] {
        return MathematicsHelper.tensor3dNewWithScaledCells(tensor3d, scale);
    }
    public static tensor3dNewLikeWithL1l2RegularizedSparseCells(
        tensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        return MathematicsHelper.tensor3dNewWithL1l2RegularizedSparseCells(
            tensor3d,
            l1Regularization,
            l2Regularization);
    }
    public static tensor3dNewLikeWithL1l2RegularizedDenseCells(
        tensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        return MathematicsHelper.tensor3dNewWithL1l2RegularizedDenseCells(
            tensor3d,
            l1Regularization,
            l2Regularization);
    }

    public static matrixNewLikeWithRandomCells(
        matrix: number[][]): number[][] {
        return MathematicsHelper.matrixNewWithRandomCells(matrix.length, matrix[0].length);
    }
    public static matrixNewLikeWithRandomCellsScaled(
        matrix: number[][],
        scale: number = 1): number[][] {
        return MathematicsHelper.matrixNewWithRandomCellsScaled(matrix.length, matrix[0].length, scale);
    }
    public static matrixNewLikeWithZeroCells(
        matrix: number[][]): number[][] {
        return MathematicsHelper.matrixNewWithZeroCells(matrix.length, matrix[0].length);
    }
    public static matrixNewLikeWithConstantCells(
        matrix: number[][],
        constant: number = 1): number[][] {
        return MathematicsHelper.matrixNewWithConstantCells(matrix.length, matrix[0].length, constant);
    }
    public static matrixNewLikeWithScaledCells(
        matrix: number[][],
        scale: number = 1): number[][] {
        return MathematicsHelper.matrixNewWithScaledCells(matrix, scale);
    }
    public static matrixNewLikeWithL1l2RegularizedSparseCells(
        matrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        return MathematicsHelper.matrixNewWithL1l2RegularizedSparseCells(
            matrix,
            l1Regularization,
            l2Regularization);
    }
    public static matrixNewLikeWithL1l2RegularizedDenseCells(
        matrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        return MathematicsHelper.matrixNewWithL1l2RegularizedDenseCells(
            matrix,
            l1Regularization,
            l2Regularization);
    }

    public static vectorNewLikeWithRandomElements(
        vector: number[]): number[] {
        return MathematicsHelper.vectorNewWithRandomElements(vector.length);
    }
    public static vectorNewLikeWithRandomElementsScaled(
        vector: number[],
        scale: number = 1): number[] {
        return MathematicsHelper.vectorNewWithRandomElementsScaled(vector.length, scale);
    }
    public static vectorNewLikeWithZeroElements(
        vector: number[]): number[] {
        return MathematicsHelper.vectorNewWithZeroElements(vector.length);
    }
    public static vectorNewLikeWithConstantElements(
        vector: number[],
        constant: number = 1): number[] {
        return MathematicsHelper.vectorNewWithConstantElements(vector.length, constant);
    }
    public static vectorNewLikeWithScaledElements(
        vector: number[],
        scale: number = 1): number[] {
        return MathematicsHelper.vectorNewWithScaledElements(vector, scale);
    }
    public static vectorNewLikeWithL1l2RegularizedSparseElements(
        vector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        return MathematicsHelper.vectorNewWithL1l2RegularizedSparseElements(
            vector,
            l1Regularization,
            l2Regularization);
    }
    public static vectorNewLikeWithL1l2RegularizedDenseElements(
        vector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        return MathematicsHelper.vectorNewWithL1l2RegularizedDenseElements(
            vector,
            l1Regularization,
            l2Regularization);
    }

    public static tensor4dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithRandomCells(
                columns,
                dimension3ds,
                dimension4ds);
        }
        return tensor4d;
    }
    public static tensor4dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        scale: number = 1): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithRandomCellsScaled(
                columns,
                dimension3ds,
                dimension4ds,
                scale);
        }
        return tensor4d;
    }
    public static tensor4dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithZeroCells(
                columns,
                dimension3ds,
                dimension4ds);
        }
        return tensor4d;
    }
    public static tensor4dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        constant: number = 1): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithConstantCells(
                columns,
                dimension3ds,
                dimension4ds,
                constant);
        }
        return tensor4d;
    }
    public static tensor4dNewWithScaledCells(
        existingTensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithScaledCells(existingTensor4d[row], scale);
        }
        return tensor4d;
    }
    public static tensor4dNewWithL1l2RegularizedSparseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithL1l2RegularizedSparseCells(
                existingTensor4d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor4d;
    }
    public static tensor4dNewWithL1l2RegularizedDenseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor4d[row] = MathematicsHelper.tensor3dNewWithL1l2RegularizedDenseCells(
                existingTensor4d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor4d;
    }

    public static tensor3dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithRandomCells(columns, dimension3ds);
        }
        return tensor3d;
    }
    public static tensor3dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        scale: number = 1): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithRandomCellsScaled(columns, dimension3ds, scale);
        }
        return tensor3d;
    }
    public static tensor3dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithZeroCells(columns, dimension3ds);
        }
        return tensor3d;
    }
    public static tensor3dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        constant: number = 1): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithConstantCells(columns, dimension3ds, constant);
        }
        return tensor3d;
    }
    public static tensor3dNewWithScaledCells(
        existingTensor3d: number[][][],
        scale: number = 1): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithScaledCells(existingTensor3d[row], scale);
        }
        return tensor3d;
    }
    public static tensor3dNewWithL1l2RegularizedSparseCells(
        existingTensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithL1l2RegularizedSparseCells(
                existingTensor3d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor3d;
    }
    public static tensor3dNewWithL1l2RegularizedDenseCells(
        existingTensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row = 0; row < rows; row++) {
            tensor3d[row] = MathematicsHelper.matrixNewWithL1l2RegularizedDenseCells(
                existingTensor3d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor3d;
    }

    public static matrixNewWithRandomCells(
        rows: number,
        columns: number): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithRandomElements(columns);
        }
        return matrix;
    }
    public static matrixNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        scale: number = 1): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithRandomElementsScaled(columns, scale);
        }
        return matrix;
    }
    public static matrixNewWithZeroCells(
        rows: number,
        columns: number): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithZeroElements(columns);
        }
        return matrix;
    }
    public static matrixNewWithConstantCells(
        rows: number,
        columns: number,
        constant: number = 1): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithConstantElements(columns, constant);
        }
        return matrix;
    }
    public static matrixNewWithScaledCells(
        existingMatrix: number[][],
        scale: number = 1): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithScaledElements(existingMatrix[row], scale);
        }
        return matrix;
    }
    public static matrixNewWithL1l2RegularizedSparseCells(
        existingMatrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithL1l2RegularizedSparseElements(
                existingMatrix[row],
                l1Regularization,
                l2Regularization);
        }
        return matrix;
    }
    public static matrixNewWithL1l2RegularizedDenseCells(
        existingMatrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row = 0; row < rows; row++) {
            matrix[row] = MathematicsHelper.vectorNewWithL1l2RegularizedDenseElements(
                existingMatrix[row],
                l1Regularization,
                l2Regularization);
        }
        return matrix;
    }

    public static vectorNewWithRandomElements(
        length: number): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = Utility.getRandomNumber();
        }
        return vector;
    }
    public static vectorNewWithRandomElementsScaled(
        length: number,
        scale: number = 1): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = Utility.getRandomNumber() *  scale;
        }
        return vector;
    }
    public static vectorNewWithZeroElements(
        length: number): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = 0;
        }
        return vector;
    }
    public static vectorNewWithConstantElements(
        length: number,
        constant: number = 1): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = constant;
        }
        return vector;
    }
    public static vectorNewWithScaledElements(
        existingVector: number[],
        scale: number = 1): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = existingVector[i] * scale;
        }
        return vector;
    }
    public static vectorNewWithL1l2RegularizedSparseElements(
        existingVector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            const regularized: number = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                existingVector[i],
                l1Regularization,
                l2Regularization);
            vector[i] = regularized;
        }
        return vector;
    }
    public static vectorNewWithL1l2RegularizedDenseElements(
        existingVector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            const regularized: number = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                existingVector[i],
                l1Regularization,
                l2Regularization);
            vector[i] = regularized;
        }
        return vector;
    }

    public static getIndexOnFirstMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax,  max };
    }
    public static getIndexOnLastMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent >= max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }
    public static getIndexOnFirstMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }
    public static getIndexOnLastMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent >= max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }

    public static getIndexOnFirstMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public static getIndexOnLastMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent <= min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public static getIndexOnFirstMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public static getIndexOnLastMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent <= min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }

    public static safeDivide(numerator: number, denominator: number): number {
        if (numerator === 0) {
            return 0;
        }
        return numerator / denominator;
    }
    public static safeLog(value: number): number {
        if (value < 0) {
            return Number.NaN;
        }
        if (value === 0) {
            return Number.MIN_VALUE;
        }
        return Math.log(value);
    }

    public static clipValue(value: number): number {
        if (value <= 0) {
            return MathematicsHelper.epsilon;
        }
        if (value >= 1) {
            return MathematicsHelper.epsilonUp;
        }
        return value;
    }
}
