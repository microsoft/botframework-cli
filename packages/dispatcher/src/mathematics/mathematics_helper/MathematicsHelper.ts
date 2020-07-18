/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMathematicsHelper } from "./IMathematicsHelper";

import { Utility } from "../../utility/Utility";

export class MathematicsHelper implements IMathematicsHelper {

    public static epsilon: number = Utility.epsilon;
    public static epsilonUp: number = 1 - MathematicsHelper.epsilon;

    public static readonly mathematicsHelperObject: IMathematicsHelper = new MathematicsHelper();

    public static GetMathematicsHelperObject(): IMathematicsHelper {
        return MathematicsHelper.mathematicsHelperObject;
    }

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    public softmaxSingleFunction(inputs: number[], index: number): number {
        const max: number =
            this.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return inputShiftExps[index] / inputShiftExpsSum;
    }
    public smoothArgmaxApproximationSingleFunction(inputs: number[], index: number): number {
        return this.softmaxSingleFunction(inputs, index);
    }
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    public softmaxFunction(inputs: number[]): number[] {
        const max: number =
            this.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return inputShiftExps.map((entry: number) => entry / inputShiftExpsSum);
    }
    public smoothArgmaxApproximationFunction(inputs: number[]): number[] {
        return this.softmaxFunction(inputs);
    }

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    public logsumexpStrictConvexSingleFunction(inputs: number[]): number {
        let max: number =
            this.getIndexOnFirstMaxEntry(inputs).max;
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
        return max + this.safeLog(inputShiftExpsSum);
    }
    public smoothMaxApproximationStrictConvexFunction(inputs: number[]): number {
        return this.logsumexpStrictConvexSingleFunction(inputs);
    }
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    public logsumexpSingleFunction(inputs: number[]): number {
        const max: number =
            this.getIndexOnFirstMaxEntry(inputs).max;
        const inputShifts: number[] =
            inputs.map((entry: number) => entry - max);
        const inputShiftExps: number[] =
            inputShifts.map((entry: number) => Math.exp(entry));
        const inputShiftExpsSum: number =
            inputShiftExps.reduce(
                (accumulation: number, entry: number) => accumulation + entry, 0);
        return max + this.safeLog(inputShiftExpsSum);
    }
    public smoothMaxApproximationFunction(inputs: number[]): number {
        return this.logsumexpSingleFunction(inputs);
    }

    public sigmoidLogisticGradientFunction(input: number): number {
        const logisticValue: number = this.sigmoidLogisticFunction(input);
        return logisticValue * (1 - logisticValue);
    }

    public sigmoidLogisticFunction(input: number): number {
        return 1 / (1 + Math.exp(-input));
    }
    public sigmoidHyperbolicTangentFunction(input: number): number {
        const exponent: number = Math.exp(input);
        const exponentNegative: number = Math.exp(-input);
        return (exponent - exponentNegative) / (exponent + exponentNegative);
    }
    public sigmoidArctangentFunction(input: number): number {
        return Math.atan(input);
    }
    public sigmoidGudermannianFunction(input: number): number {
        return 2 * Math.atan(Math.tanh(input / 2));
    }
    public sigmoidGeneralizedLogisticFunction(input: number, alpha: number = 1): number {
        return Math.pow(1 + Math.exp(-input), -alpha);
    }
    public sigmoidAlgebraicFunction(input: number): number {
        return input / Math.sqrt(1 + input * input);
    }

    public getL1Regularized(weight: number, l1Regularization: number): number {
        if (weight > 0) { return l1Regularization }
        if (weight < 0) { return -l1Regularization }
        return 0;
    }
    public getL2Regularized(weight: number, l2Regularization: number): number {
        return (weight * l2Regularization);
    }
    public getL1l2RegularizedWeightOptimizedSparse(
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
    public getL1l2RegularizedWeightOptimizedDense(
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
     *      softmaxVectors: number[][]
     *  update:
     *      matrixWeightDenseArrays
     *      biasVectorDenseValueArray
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
     *          Each row represents a dense feature, floating-point weight vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L x F, L: #labels, F: #features.
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
     *  internal data structure:
     *      matrixWeightGradientDenseArrays:
     *          Each row represents a dense feature gradient vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L x F, L: #labels, F: #features.
     *      biasVectorGradientDenseValueArray:
     *          Each element represents a bias-term gradient for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     */
    public softmaxLogLossGradientUpdate(
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
        const softmaxVectors: number[][] = this.matrixVectorProductSoftmaxSparseIndexes(
            instanceFeatureVectorSparseIndexArrays,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray,
            instanceFeatureVectorIndexBegin,
            instanceFeatureVectorIndexEnd);
        const numberInstances: number = softmaxVectors.length;
        const numberLabels: number = matrixWeightDenseArrays.length;
        // const numberFeatures: number = matrixWeightDenseArrays[0].length;
        const matrixWeightGradientDenseArrays: number[][] =
            this.matrixNewLikeWithZeroCells(matrixWeightDenseArrays);
        const biasVectorGradientDenseValueArray: number[] =
            this.vectorNewLikeWithZeroElements(biasVectorDenseValueArray);
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
            for (let label: number = 0; label < numberLabels; label++) {
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
                for (let label: number = 0; label < instanceLabel; label++) {
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
                for (let label: number = instanceLabel + 1; label < numberLabels; label++) {
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
            this.matrixDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
                matrixWeightDenseArrays,
                matrixWeightGradientDenseArrays,
                factorConstant,
                l1Regularization,
                l2Regularization);
            this.vectorDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
                biasVectorDenseValueArray,
                biasVectorGradientDenseValueArray,
                factorConstant,
                l1Regularization,
                l2Regularization);
        } else {
            this.matrixDenseSubtractScaledFrom(
                matrixWeightDenseArrays,
                matrixWeightGradientDenseArrays,
                factorConstant);
            this.vectorDenseSubtractScaledFrom(
                biasVectorDenseValueArray,
                biasVectorGradientDenseValueArray,
                factorConstant);
        }
        return softmaxVectors;
    }

    public logLoss(
        probabilityVector: number[],
        instanceGroundTruthPositiveLabelIndex: number): number {
        let probability = probabilityVector[instanceGroundTruthPositiveLabelIndex];
        probability = this.clipValue(probability);
        if (!probability || (probability <= 0)) {
            Utility.debuggingThrow(
                `probability=${probability}, instanceGroundTruthPositiveLabelIndex=${instanceGroundTruthPositiveLabelIndex}`);
        }
        const loss: number = Math.log(probability);
        return -loss;
    }
    public logLossGeneric(
        probabilityVector: number[],
        labelVector: number[]): number {
        let loss: number = 0;
        for (let i: number = 0; i < labelVector.length; i++) {
            const label = labelVector[i];
            let probability = probabilityVector[i];
            probability = this.clipValue(probability);
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

    public softmaxLogLoss(
        softmaxVectors: number[][],
        instanceGroundTruthPositiveLabelIndexes: number[]): number {
        let softmaxLogLossSum: number = 0;
        for (let i: number = 0; i < softmaxVectors.length; i++) {
            softmaxLogLossSum +=
                this.logLoss(softmaxVectors[i], instanceGroundTruthPositiveLabelIndexes[i]);
        }
        return softmaxLogLossSum / softmaxVectors.length;
    }
    public softmaxLogLossGeneric(
        softmaxVectors: number[][],
        labelVectors: number[][]): number {
        let softmaxLogLossSum: number = 0;
        for (let i: number = 0; i < softmaxVectors.length; i++) {
            softmaxLogLossSum +=
                this.logLossGeneric(softmaxVectors[i], labelVectors[i]);
        }
        return softmaxLogLossSum / softmaxVectors.length;
    }

    public matrixVectorProductSoftmaxSparseIndexesValues(
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
                this.matrixVectorProductSparseIndexesValues(
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
                this.softmaxFunction(matrixVectorProduct);
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
     *          Each row represents a dense feature, floating-point weight vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L x F, L: #labels, F: #features.
     *      biasVectorDenseValueArray:
     *          A bias vector, each element is for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     *      instanceFeatureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      instanceFeatureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public matrixVectorProductSoftmaxSparseIndexes(
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
                this.matrixVectorProductSparseIndexes(
                    instanceFeatureVectorSparseIndexArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            const softmaxVector: number[] =
                this.softmaxFunction(matrixVectorProduct);
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
     *      instanceFeatureVectorDenseValueArrays:
     *          Each row represents a dense feature value vector for an input instance.
     *          #rows is the number of input instances
     *          #columns is the number of dense features for that row/instance.
     *              There is no limit to the length of each row should be equal to the number of features.
     *          Dimension: N X F, N: #instances, F: #features.
     *      matrixWeightDenseArrays:
     *          Each row represents a dense feature, floating-point weight vector for a label.
     *          Row length is equal to #features.
     *          Dimension: L x F, L: #labels, F: #features.
     *      biasVectorDenseValueArray:
     *          A bias vector, each element is for a label.
     *          #biases is equal to #labels.
     *          Dimension: L, L: #labels.
     *      instanceFeatureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      instanceFeatureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public matrixVectorProductSoftmaxDenseValues(
        instanceFeatureVectorDenseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number = 0,
        instanceFeatureVectorIndexEnd: number = 0): number[][] {
        if (Utility.isEmptyNumberArrays(instanceFeatureVectorDenseValueArrays)) {
            Utility.debuggingThrow(
                "instanceFeatureVectorDenseValueArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            instanceFeatureVectorDenseValueArrays.length;
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
            const instanceFeatureVectorDenseValueArray: number[] =
                instanceFeatureVectorDenseValueArrays[i];
            const matrixVectorProduct: number[] =
                this.matrixVectorProductDenseValues(
                    instanceFeatureVectorDenseValueArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            const softmaxVector: number[] =
                this.softmaxFunction(matrixVectorProduct);
            softmaxVectors[indexSoftmaxVectors++] =
                softmaxVector;
        }
        return softmaxVectors;
    }

    public matrixVectorProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            this.vectorNewWithZeroElements(lengthRowMatrix);
        return this.matrixVectorProductSparseIndexesValuesTo(
            matrixVectorProduct,
            instanceFeatureVectorSparseIndexArray,
            instanceFeatureVectorSparseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public matrixVectorProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            this.vectorNewWithZeroElements(lengthRowMatrix);
        return this.matrixVectorProductSparseIndexesTo(
            matrixVectorProduct,
            instanceFeatureVectorSparseIndexArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public matrixVectorProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct: number[] =
            this.vectorNewWithZeroElements(lengthRowMatrix);
        return this.matrixVectorProductDenseValuesTo(
            matrixVectorProduct,
            vectorDenseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }

    public matrixVectorProductSparseIndexesValuesTo(
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
                this.dotProductSparseIndexesValues(
                    instanceFeatureVectorSparseIndexArray,
                    instanceFeatureVectorSparseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public matrixVectorProductSparseIndexesTo(
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
                this.dotProductSparseIndexes(
                    instanceFeatureVectorSparseIndexArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public matrixVectorProductDenseValuesTo(
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
                this.dotProductDenseValues(
                    vectorDenseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[row] =
                dotProduct;
        }
        return matrixVectorProduct;
    }

    public vectorMatrixProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            this.vectorNewWithZeroElements(lengthColumnMatrix);
        return this.vectorMatrixProductSparseIndexesValuesTo(
            vectorMatrixProduct,
            instanceFeatureVectorSparseIndexArray,
            instanceFeatureVectorSparseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public vectorMatrixProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        // const lengthRowMatrix: number =
        //     matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            this.vectorNewWithZeroElements(lengthColumnMatrix);
        return this.vectorMatrixProductSparseIndexesTo(
            vectorMatrixProduct,
            instanceFeatureVectorSparseIndexArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }
    public vectorMatrixProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const lengthColumnMatrix: number =
            matrixWeightDenseArrays[0].length;
        const vectorMatrixProduct: number[] =
            this.vectorNewWithZeroElements(lengthColumnMatrix);
        return this.vectorMatrixProductDenseValuesTo(
            vectorMatrixProduct,
            vectorDenseValueArray,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray);
    }

    public vectorMatrixProductSparseIndexesValuesTo(
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
            this.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorSparseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            this.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }
    public vectorMatrixProductSparseIndexesTo(
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
            this.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorSparseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            this.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }
    public vectorMatrixProductDenseValuesTo(
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
            this.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorDenseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            this.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }
    public vectorMatrixProductPartialDenseValuesTo( // ---- TODO
        vectorMatrixProduct: number[],
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        offsetDenseValueArray: number = 0,
        offsetMatrixWeightDenseArrays: number = 0,
        length: number = 0,
        biasVectorDenseValueArray: number[] = []): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        // const lengthColumnMatrix: number =
        //     matrixWeightDenseArrays[0].length;
        for (let row: number = 0; row < lengthRowMatrix; row++) {
            const vectorDenseValue: number = vectorDenseValueArray[row];
            const matrixWeightDenseArray: number[] = matrixWeightDenseArrays[row];
            this.vectorDenseAddScaledTo(
                vectorMatrixProduct,
                matrixWeightDenseArray,
                vectorDenseValue);
        }
        if (!Utility.isEmptyNumberArray(biasVectorDenseValueArray)) {
            this.vectorDenseAddTo(
                vectorMatrixProduct,
                biasVectorDenseValueArray);
        }
        return vectorMatrixProduct;
    }

    public dotProductSparseIndexesValues(
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
    public dotProductSparseIndexes(
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
    public dotProductDenseValues(
        denseValueArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        let dotProduct: number = 0;
        for (let i: number = 0; i < weights.length; i++) {
            dotProduct += denseValueArray[i] * weights[i];
        }
        return (dotProduct + weightBias);
    }
    public dotProductPartialDenseValues( // ---- TODO
        denseValueArray: number[],
        weights: number[],
        offsetDenseValueArray: number = 0,
        offsetWeights: number = 0,
        length: number = 0,
        weightBias: number = 0): number {
        if (length === 0) {
            length = denseValueArray.length;
        }
        let dotProduct: number = 0;
        let indexDenseValueArray: number = offsetDenseValueArray;
        let indexWeights: number = offsetWeights;
        for (let i: number = 0; i < length; i++) {
            dotProduct += denseValueArray[indexDenseValueArray] * weights[indexWeights];
            indexDenseValueArray++;
            indexWeights++;
        }
        return (dotProduct + weightBias);
    }

    public matrixDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
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
                    denseValueArray0[row][column] = this.getL1l2RegularizedWeightOptimizedSparse(
                        denseValueArray0[row][column],
                        l1Regularization,
                        l2Regularization);
                }
            }
        }
        return denseValueArray0;
    }
    public matrixDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
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
                    denseValueArray0[row][column] = this.getL1l2RegularizedWeightOptimizedDense(
                        denseValueArray0[row][column],
                        l1Regularization,
                        l2Regularization);
                }
            }
        }
        return denseValueArray0;
    }
    public vectorDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            const adjustment: number = denseValueArray1[i];
            denseValueArray0[i] -= (constant * adjustment);
            if (adjustment !== 0) {
                denseValueArray0[i] = this.getL1l2RegularizedWeightOptimizedSparse(
                    denseValueArray0[i],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray0;
    }
    public vectorDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            const adjustment: number = denseValueArray1[i];
            denseValueArray0[i] -= (constant * adjustment);
            if (adjustment !== 0) {
                denseValueArray0[i] = this.getL1l2RegularizedWeightOptimizedDense(
                    denseValueArray0[i],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray0;
    }

    public matrixDenseL1l2RegularizedSparseTo(
        denseValueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = denseValueArray.length;
        const columns: number = denseValueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                denseValueArray[row][column] = this.getL1l2RegularizedWeightOptimizedSparse(
                    denseValueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray;
    }
    public matrixDenseL1l2RegularizedDenseTo(
        denseValueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = denseValueArray.length;
        const columns: number = denseValueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                denseValueArray[row][column] = this.getL1l2RegularizedWeightOptimizedDense(
                    denseValueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return denseValueArray;
    }

    public vectorDenseL1l2RegularizedSparseTo(
        denseValueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < denseValueArray.length; i++) {
            denseValueArray[i] = this.getL1l2RegularizedWeightOptimizedSparse(
                denseValueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return denseValueArray;
    }
    public vectorDenseL1l2RegularizedDenseTo(
        denseValueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < denseValueArray.length; i++) {
            denseValueArray[i] = this.getL1l2RegularizedWeightOptimizedDense(
                denseValueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return denseValueArray;
    }

    public tensor4dDenseAssignRandomTo(
        denseValueArray0: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public tensor4dDenseAssignConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseAddConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseMultiplyConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseSubtractConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseDivideConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public tensor4dDenseAssignTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor4dDenseAddTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor4dDenseMultiplyTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor4dDenseSubtractFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor4dDenseDivideFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public tensor4dDenseAssignScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseAddScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseMultiplyScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseSubtractScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor4dDenseDivideScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.tensor3dDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public tensor3dDenseAssignRandomTo(
        denseValueArray0: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public tensor3dDenseAssignConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseAddConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseMultiplyConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseSubtractConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseDivideConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public tensor3dDenseAssignTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        const columns: number = denseValueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor3dDenseAddTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor3dDenseMultiplyTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor3dDenseSubtractFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public tensor3dDenseDivideFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public tensor3dDenseAssignScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseAddScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseMultiplyScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseSubtractScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public tensor3dDenseDivideScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.matrixDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public matrixDenseAssignRandomTo(
        denseValueArray0: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAssignRandomTo(
                denseValueArray0[row]);
        }
        return denseValueArray0;
    }

    public matrixDenseAssignConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAssignConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseAddConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAddConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseMultiplyConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseMultiplyConstantTo(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseSubtractConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseSubtractConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseDivideConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseDivideConstantFrom(
                denseValueArray0[row],
                constant);
        }
        return denseValueArray0;
    }

    public matrixDenseAssignTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAssignTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public matrixDenseAddTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAddTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public matrixDenseMultiplyTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseMultiplyTo(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public matrixDenseSubtractFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseSubtractFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }
    public matrixDenseDivideFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseDivideFrom(
                denseValueArray0[row],
                denseValueArray1[row]);
        }
        return denseValueArray0;
    }

    public matrixDenseAssignScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAssignScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseAddScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseAddScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseMultiplyScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseMultiplyScaledTo(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseSubtractScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseSubtractScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }
    public matrixDenseDivideScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][] {
        const rows: number = denseValueArray0.length;
        for (let row: number = 0; row < rows; row++) {
            this.vectorDenseDivideScaledFrom(
                denseValueArray0[row],
                denseValueArray1[row],
                constant);
        }
        return denseValueArray0;
    }

    public vectorDenseAssignRandomTo(
        denseValueArray0: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] =  Utility.getRandomNumber();
        }
        return denseValueArray0;
    }

    public vectorDenseAssignConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = constant;
        }
        return denseValueArray0;
    }
    public vectorDenseAddConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += constant;
        }
        return denseValueArray0;
    }
    public vectorDenseMultiplyConstantTo(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= constant;
        }
        return denseValueArray0;
    }
    public vectorDenseSubtractConstantFrom(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= constant;
        }
        return denseValueArray0;
    }
    public vectorDenseDivideConstantFrom(
        denseValueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= constant;
        }
        return denseValueArray0;
    }

    public vectorDenseAssignTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public vectorDenseAddTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public vectorDenseMultiplyTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public vectorDenseSubtractFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= denseValueArray1[i];
        }
        return denseValueArray0;
    }
    public vectorDenseDivideFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= denseValueArray1[i];
        }
        return denseValueArray0;
    }

    public vectorDenseAssignScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] = (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public vectorDenseAddScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] += (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public vectorDenseMultiplyScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] *= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public vectorDenseSubtractScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] -= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }
    public vectorDenseDivideScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < denseValueArray0.length; i++) {
            denseValueArray0[i] /= (constant * denseValueArray1[i]);
        }
        return denseValueArray0;
    }

    public vectorSparseAssignRandomTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = Utility.getRandomNumber();
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public vectorSparseAssignConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] = constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseAddConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] += constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseMultiplyConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] *= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseSubtractConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] -= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseDivideConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseValueArray0.length; i++) {
            sparseValueArray0[i] /= constant;
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public vectorSparseAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseIndexArray1) {
            sparseIndexArray0.push(x);
        }
        for (const x of sparseValueArray1) {
            sparseValueArray0.push(x);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) + value);
                } else {
                    sparseArrayMap.set(index, value);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (sparseArrayMap.has(index)) {
                sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) * value);
            // ---- NOTE ---- multiply to 0 is still 0 ---- } else {
            // ---- NOTE ---- multiply to 0 is still 0 ----     sparseArrayMap.set(index, value);
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseSubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) - value);
                } else {
                    sparseArrayMap.set(index, -value);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]] {
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) / value);
                // ---- NOTE ---- 0 divided is still 0 ---- } else {
                // ---- NOTE ---- 0 divided is still 0 ----     sparseArrayMap.set(index, value);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public vectorSparseAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseIndexArray1) {
            sparseIndexArray0.push(x);
        }
        for (const x of sparseValueArray1) {
            sparseValueArray0.push(constant * x);
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        if (constant === 0) { // ---- NOTE ---- no effect if constant is zero
            return [sparseIndexArray0, sparseValueArray0];
        }
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                const scaledValue: number = constant * value;
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) + scaledValue);
                } else {
                    sparseArrayMap.set(index, scaledValue);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            const scaledValue: number = constant * value;
            if (sparseArrayMap.has(index)) {
                sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) * scaledValue);
            // ---- NOTE ---- multiply to 0 is still 0 ---- } else {
            // ---- NOTE ---- multiply to 0 is still 0 ----     sparseArrayMap.set(index, scaledValue);
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseSubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        if (constant === 0) { // ---- NOTE ---- no effect if constant is zero
            return [sparseIndexArray0, sparseValueArray0];
        }
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                const scaledValue: number = constant * value;
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) - scaledValue);
                } else {
                    sparseArrayMap.set(index, -scaledValue);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }
    public vectorSparseDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]] {
        if (constant === 0) { // ---- NOTE ---- divided by 0 is not a good idea ----
            return [sparseIndexArray0, sparseValueArray0];
        }
        const sparseArrayMap: Map<number, number> =
            Utility.sparseArrayPairToMap(sparseIndexArray0, sparseValueArray0);
        for (let i: number = 0; i < sparseIndexArray1.length; i++) {
            const index: number = sparseIndexArray1[i];
            const value: number = sparseValueArray1[i];
            if (value !== 0) { // ---- NOTE ---- should not be zero anyway as it's sparse structure!
                const scaledValue: number = constant * value;
                if (sparseArrayMap.has(index)) {
                    sparseArrayMap.set(index, (sparseArrayMap.get(index) as number) / scaledValue);
                // ---- NOTE ---- 0 divided is still 0 ---- } else {
                // ---- NOTE ---- 0 divided is still 0 ----      sparseArrayMap.set(index, scaledValue);
                }
            }
        }
        sparseIndexArray0.length = 0;
        sparseValueArray0.length = 0;
        for (const x of sparseArrayMap.entries()) {
            const key: number = x[0];
            const value: number = x[1];
            if (value !== 0) {
                sparseIndexArray0.push(key);
                sparseValueArray0.push(value);
            }
        }
        return [sparseIndexArray0, sparseValueArray0];
    }

    public vectorSparseIndexDenseArrayAssignRandomTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = Utility.getRandomNumber();
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseIndexDenseArrayAssignConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayAddConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayMultiplyConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArraySubtractConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayDivideConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseIndexDenseArrayAssignTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayAddTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseIndexDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseIndexDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorIndependentSparseIndexDenseArrayAssignTo(
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
    public vectorIndependentSparseIndexDenseArrayAddTo(
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
    public vectorIndependentSparseIndexDenseArrayMultiplyTo(
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
    public vectorIndependentSparseIndexDenseArraySubtractFrom(
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
    public vectorIndependentSparseIndexDenseArrayDivideFrom(
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

    public vectorIndependentSparseIndexDenseArrayAssignScaledTo(
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
    public vectorIndependentSparseIndexDenseArrayAddScaledTo(
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
    public vectorIndependentSparseIndexDenseArrayMultiplyScaledTo(
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
    public vectorIndependentSparseIndexDenseArraySubtractScaledFrom(
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
    public vectorIndependentSparseIndexDenseArrayDivideScaledFrom(
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

    public vectorSparseMapDenseArrayAssignRandomTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = Utility.getRandomNumber();
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseMapDenseArrayAssignConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayAddConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayMultiplyConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArraySubtractConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayDivideConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= constant;
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseMapDenseArrayAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= denseValueArray1[index];
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorSparseMapDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] = (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] += (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] *= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] -= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorSparseMapDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (const index of sparseIndexArray0) {
            denseValueArray0[index] /= (constant * denseValueArray1[index]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorIndependentSparseMapDenseArrayAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] = denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] += denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] *= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] -= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] /= denseValueArray1[index1];
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public vectorIndependentSparseMapDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] = (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] += (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] *= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] -= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }
    public vectorIndependentSparseMapDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]] {
        for (let i: number = 0; i < sparseIndexArray0.length; i++) {
            const index0 = sparseIndexArray0[i];
            const index1 = sparseIndexArray1[i];
            denseValueArray0[index0] /= (constant * denseValueArray1[index1]);
        }
        return [sparseIndexArray0, denseValueArray0];
    }

    public tensor4dNewLikeWithRandomCells(
        tensor4d: number[][][][]): number[][][][] {
        return this.tensor4dNewWithRandomCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length);
    }
    public tensor4dNewLikeWithRandomCellsScaled(
        tensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        return this.tensor4dNewWithRandomCellsScaled(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length,
            scale);
    }
    public tensor4dNewLikeWithZeroCells(
        tensor4d: number[][][][]): number[][][][] {
        return this.tensor4dNewWithZeroCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length);
    }
    public tensor4dNewLikeWithConstantCells(
        tensor4d: number[][][][],
        constant: number = 1): number[][][][] {
        return this.tensor4dNewWithConstantCells(
            tensor4d.length,
            tensor4d[0].length,
            tensor4d[0][0].length,
            tensor4d[0][0][0].length,
            constant);
    }
    public tensor4dNewLikeWithScaledCells(
        tensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        return this.tensor4dNewWithScaledCells(tensor4d, scale);
    }
    public tensor4dNewLikeWithL1l2RegularizedSparseCells(
        tensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        return this.tensor4dNewWithL1l2RegularizedSparseCells(
            tensor4d,
            l1Regularization,
            l2Regularization);
    }
    public tensor4dNewLikeWithL1l2RegularizedDenseCells(
        tensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        return this.tensor4dNewWithL1l2RegularizedDenseCells(
            tensor4d,
            l1Regularization,
            l2Regularization);
    }

    public tensor3dNewLikeWithRandomCells(
        tensor3d: number[][][]): number[][][] {
        return this.tensor3dNewWithRandomCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length);
    }
    public tensor3dNewLikeWithRandomCellsScaled(
        tensor3d: number[][][],
        scale: number = 1): number[][][] {
        return this.tensor3dNewWithRandomCellsScaled(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length,
            scale);
    }
    public tensor3dNewLikeWithZeroCells(
        tensor3d: number[][][]): number[][][] {
        return this.tensor3dNewWithZeroCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length);
    }
    public tensor3dNewLikeWithConstantCells(
        tensor3d: number[][][],
        constant: number = 1): number[][][] {
        return this.tensor3dNewWithConstantCells(
            tensor3d.length,
            tensor3d[0].length,
            tensor3d[0][0].length,
            constant);
    }
    public tensor3dNewLikeWithScaledCells(
        tensor3d: number[][][],
        scale: number = 1): number[][][] {
        return this.tensor3dNewWithScaledCells(tensor3d, scale);
    }
    public tensor3dNewLikeWithL1l2RegularizedSparseCells(
        tensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        return this.tensor3dNewWithL1l2RegularizedSparseCells(
            tensor3d,
            l1Regularization,
            l2Regularization);
    }
    public tensor3dNewLikeWithL1l2RegularizedDenseCells(
        tensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        return this.tensor3dNewWithL1l2RegularizedDenseCells(
            tensor3d,
            l1Regularization,
            l2Regularization);
    }

    public matrixNewLikeWithRandomCells(
        matrix: number[][]): number[][] {
        return this.matrixNewWithRandomCells(matrix.length, matrix[0].length);
    }
    public matrixNewLikeWithRandomCellsScaled(
        matrix: number[][],
        scale: number = 1): number[][] {
        return this.matrixNewWithRandomCellsScaled(matrix.length, matrix[0].length, scale);
    }
    public matrixNewLikeWithZeroCells(
        matrix: number[][]): number[][] {
        return this.matrixNewWithZeroCells(matrix.length, matrix[0].length);
    }
    public matrixNewLikeWithConstantCells(
        matrix: number[][],
        constant: number = 1): number[][] {
        return this.matrixNewWithConstantCells(matrix.length, matrix[0].length, constant);
    }
    public matrixNewLikeWithScaledCells(
        matrix: number[][],
        scale: number = 1): number[][] {
        return this.matrixNewWithScaledCells(matrix, scale);
    }
    public matrixNewLikeWithL1l2RegularizedSparseCells(
        matrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        return this.matrixNewWithL1l2RegularizedSparseCells(
            matrix,
            l1Regularization,
            l2Regularization);
    }
    public matrixNewLikeWithL1l2RegularizedDenseCells(
        matrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        return this.matrixNewWithL1l2RegularizedDenseCells(
            matrix,
            l1Regularization,
            l2Regularization);
    }

    public vectorNewLikeWithRandomElements(
        vector: number[]): number[] {
        return this.vectorNewWithRandomElements(vector.length);
    }
    public vectorNewLikeWithRandomElementsScaled(
        vector: number[],
        scale: number = 1): number[] {
        return this.vectorNewWithRandomElementsScaled(vector.length, scale);
    }
    public vectorNewLikeWithZeroElements(
        vector: number[]): number[] {
        return this.vectorNewWithZeroElements(vector.length);
    }
    public vectorNewLikeWithConstantElements(
        vector: number[],
        constant: number = 1): number[] {
        return this.vectorNewWithConstantElements(vector.length, constant);
    }
    public vectorNewLikeWithScaledElements(
        vector: number[],
        scale: number = 1): number[] {
        return this.vectorNewWithScaledElements(vector, scale);
    }
    public vectorNewLikeWithL1l2RegularizedSparseElements(
        vector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        return this.vectorNewWithL1l2RegularizedSparseElements(
            vector,
            l1Regularization,
            l2Regularization);
    }
    public vectorNewLikeWithL1l2RegularizedDenseElements(
        vector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        return this.vectorNewWithL1l2RegularizedDenseElements(
            vector,
            l1Regularization,
            l2Regularization);
    }

    public tensor4dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithRandomCells(
                columns,
                dimension3ds,
                dimension4ds);
        }
        return tensor4d;
    }
    public tensor4dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        scale: number = 1): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithRandomCellsScaled(
                columns,
                dimension3ds,
                dimension4ds,
                scale);
        }
        return tensor4d;
    }
    public tensor4dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithZeroCells(
                columns,
                dimension3ds,
                dimension4ds);
        }
        return tensor4d;
    }
    public tensor4dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        constant: number = 1): number[][][][] {
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithConstantCells(
                columns,
                dimension3ds,
                dimension4ds,
                constant);
        }
        return tensor4d;
    }
    public tensor4dNewWithScaledCells(
        existingTensor4d: number[][][][],
        scale: number = 1): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithScaledCells(existingTensor4d[row], scale);
        }
        return tensor4d;
    }
    public tensor4dNewWithL1l2RegularizedSparseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithL1l2RegularizedSparseCells(
                existingTensor4d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor4d;
    }
    public tensor4dNewWithL1l2RegularizedDenseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][][] {
        const rows: number = existingTensor4d.length;
        const tensor4d: number[][][][] = new Array<number[][][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor4d[row] = this.tensor3dNewWithL1l2RegularizedDenseCells(
                existingTensor4d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor4d;
    }

    public tensor3dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithRandomCells(columns, dimension3ds);
        }
        return tensor3d;
    }
    public tensor3dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        scale: number = 1): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithRandomCellsScaled(columns, dimension3ds, scale);
        }
        return tensor3d;
    }
    public tensor3dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithZeroCells(columns, dimension3ds);
        }
        return tensor3d;
    }
    public tensor3dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        constant: number = 1): number[][][] {
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithConstantCells(columns, dimension3ds, constant);
        }
        return tensor3d;
    }
    public tensor3dNewWithScaledCells(
        existingTensor3d: number[][][],
        scale: number = 1): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithScaledCells(existingTensor3d[row], scale);
        }
        return tensor3d;
    }
    public tensor3dNewWithL1l2RegularizedSparseCells(
        existingTensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithL1l2RegularizedSparseCells(
                existingTensor3d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor3d;
    }
    public tensor3dNewWithL1l2RegularizedDenseCells(
        existingTensor3d: number[][][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][][] {
        const rows: number = existingTensor3d.length;
        const tensor3d: number[][][] = new Array<number[][]>(rows);
        for (let row: number = 0; row < rows; row++) {
            tensor3d[row] = this.matrixNewWithL1l2RegularizedDenseCells(
                existingTensor3d[row],
                l1Regularization,
                l2Regularization);
        }
        return tensor3d;
    }

    public matrixNewWithRandomCells(
        rows: number,
        columns: number): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithRandomElements(columns);
        }
        return matrix;
    }
    public matrixNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        scale: number = 1): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithRandomElementsScaled(columns, scale);
        }
        return matrix;
    }
    public matrixNewWithZeroCells(
        rows: number,
        columns: number): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithZeroElements(columns);
        }
        return matrix;
    }
    public matrixNewWithConstantCells(
        rows: number,
        columns: number,
        constant: number = 1): number[][] {
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithConstantElements(columns, constant);
        }
        return matrix;
    }
    public matrixNewWithScaledCells(
        existingMatrix: number[][],
        scale: number = 1): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithScaledElements(existingMatrix[row], scale);
        }
        return matrix;
    }
    public matrixNewWithL1l2RegularizedSparseCells(
        existingMatrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithL1l2RegularizedSparseElements(
                existingMatrix[row],
                l1Regularization,
                l2Regularization);
        }
        return matrix;
    }
    public matrixNewWithL1l2RegularizedDenseCells(
        existingMatrix: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = existingMatrix.length;
        const matrix: number[][] = new Array<number[]>(rows);
        for (let row: number = 0; row < rows; row++) {
            matrix[row] = this.vectorNewWithL1l2RegularizedDenseElements(
                existingMatrix[row],
                l1Regularization,
                l2Regularization);
        }
        return matrix;
    }

    public vectorNewWithRandomElements(
        length: number): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = Utility.getRandomNumber();
        }
        return vector;
    }
    public vectorNewWithRandomElementsScaled(
        length: number,
        scale: number = 1): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = Utility.getRandomNumber() *  scale;
        }
        return vector;
    }
    public vectorNewWithZeroElements(
        length: number): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = 0;
        }
        return vector;
    }
    public vectorNewWithConstantElements(
        length: number,
        constant: number = 1): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = constant;
        }
        return vector;
    }
    public vectorNewWithScaledElements(
        existingVector: number[],
        scale: number = 1): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = existingVector[i] * scale;
        }
        return vector;
    }
    public vectorNewWithL1l2RegularizedSparseElements(
        existingVector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            const regularized: number = this.getL1l2RegularizedWeightOptimizedSparse(
                existingVector[i],
                l1Regularization,
                l2Regularization);
            vector[i] = regularized;
        }
        return vector;
    }
    public vectorNewWithL1l2RegularizedDenseElements(
        existingVector: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        const length: number = existingVector.length;
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            const regularized: number = this.getL1l2RegularizedWeightOptimizedDense(
                existingVector[i],
                l1Regularization,
                l2Regularization);
            vector[i] = regularized;
        }
        return vector;
    }

    public getIndexesOnMaxEntriesOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexesMax": number[], "max": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexesMax: number[] = [0];
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexesMax = [i];
                continue;
            }
            if (inputCurrent === max) {
                indexesMax.push(i);
            }
        }
        return { indexesMax, max };
    }
    public getIndexesOnMaxEntries(
        inputArray: number[]):
        { "indexesMax": number[], "max": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexesMax: number[] = [0];
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexesMax = [i];
                continue;
            }
            if (inputCurrent === max) {
                indexesMax.push(i);
            }
        }
        return { indexesMax, max };
    }

    public getIndexOnFirstMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax,  max };
    }
    public getIndexOnLastMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent >= max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }
    public getIndexOnFirstMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent > max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }
    public getIndexOnLastMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMax: number = 0;
        let max: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent >= max) {
                max = inputCurrent;
                indexMax = i;
            }
        }
        return { indexMax, max };
    }

    public getIndexesOnMinEntriesOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexesMin": number[], "min": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexesMin: number[] = [0];
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexesMin = [i];
                continue;
            }
            if (inputCurrent === min) {
                indexesMin.push(i);
            }
        }
        return { indexesMin, min };
    }
    public getIndexesOnMinEntries(
        inputArray: number[]):
        { "indexesMin": number[], "min": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexesMin: number[] = [0];
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexesMin = [i];
                continue;
            }
            if (inputCurrent === min) {
                indexesMin.push(i);
            }
        }
        return { indexesMin, min };
    }

    public getIndexOnFirstMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public getIndexOnLastMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberF32I32U8Array(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent <= min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public getIndexOnFirstMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent < min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }
    public getIndexOnLastMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number } {
        if (Utility.isEmptyNumberArray(inputArray)) {
            Utility.debuggingThrow("inputArray is empty");
        }
        let indexMin: number = 0;
        let min: number = inputArray[0];
        for (let i: number = 1; i < inputArray.length; i++) {
            const inputCurrent: number = inputArray[i];
            if (inputCurrent <= min) {
                min = inputCurrent;
                indexMin = i;
            }
        }
        return { indexMin, min };
    }

    public safeDivide(numerator: number, denominator: number): number {
        if (numerator === 0) {
            return 0;
        }
        return (numerator / denominator);
    }
    public safeLog(value: number): number {
        if (value < 0) {
            return Number.NaN;
        }
        if (value === 0) {
            return Number.MIN_VALUE;
        }
        return Math.log(value);
    }

    public clipValue(value: number): number {
        if (value <= 0) {
            return MathematicsHelper.epsilon;
        }
        if (value >= 1) {
            return MathematicsHelper.epsilonUp;
        }
        return value;
    }
}
