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
            inputShiftExps.reduce((accumulation: number, entry: number) => accumulation + entry, 0);
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
            inputShiftExps.reduce((accumulation: number, entry: number) => accumulation + entry, 0);
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
            inputShiftExps.reduce((accumulation: number, entry: number) => accumulation + entry, 0);
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
            inputShiftExps.reduce((accumulation: number, entry: number) => accumulation + entry, 0);
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
        }
        else if (weight < 0) {
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
            }
            else if (weight < 0) {
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
     *      groundTruthPositiveLabelIndexes:
     *          Each element is a labe index.
     *          Dimension: N, N: #instances.
     *      featureVectorSparseIndexArrays:
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
     *      featureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      featureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public static softmaxLogLossGradientUpdate(
        groundTruthPositiveLabelIndexes: number[],
        featureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        learningRate: number = 0.1,
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01,
        featureVectorIndexBegin: number = 0,
        featureVectorIndexEnd: number = 0): number[][] {
        // Utility.debuggingLog(
        //     `featureVectorIndexBegin=${featureVectorIndexBegin}`);
        // Utility.debuggingLog(
        //     `featureVectorIndexEnd=${featureVectorIndexEnd}`);
        if ((!groundTruthPositiveLabelIndexes) || (groundTruthPositiveLabelIndexes.length <= 0)) {
            Utility.debuggingThrow(
                `groundTruthPositiveLabelIndexes is empty`);
        }
        if ((!featureVectorSparseIndexArrays) || (featureVectorSparseIndexArrays.length <= 0)) {
            Utility.debuggingThrow(
                `featureVectorSparseIndexArrays is empty`);
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
            featureVectorSparseIndexArrays,
            matrixWeightDenseArrays,
            biasVectorDenseValueArray,
            featureVectorIndexBegin,
            featureVectorIndexEnd);
        const numberInstances: number = softmaxVectors.length;
        const numberLabels: number = matrixWeightDenseArrays.length;
        // const numberFeatures: number = matrixWeightDenseArrays[0].length;
        const matrixWeightGradientDenseArrays: number[][] =
            MathematicsHelper.matrixNewLikeWithZeroCells(matrixWeightDenseArrays);
        const biasVectorGradientDenseValueArray: number[] =
            MathematicsHelper.vectorNewLikeWithZeroElements(biasVectorDenseValueArray);
        let featureVectorIndex =
            featureVectorIndexBegin;
        for (let instance: number = 0; instance < numberInstances; instance++) {
            const instanceFeatureVectorSparseIndexArray: number[] =
                featureVectorSparseIndexArrays[featureVectorIndex];
            const instanceLabel: number =
                groundTruthPositiveLabelIndexes[featureVectorIndex];
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
            featureVectorIndex++;
        }
        const factorConstant: number =
            learningRate / numberInstances;
        MathematicsHelper.matrixDenseSubtractScaledFrom(
            matrixWeightDenseArrays,
            matrixWeightGradientDenseArrays,
            factorConstant);
        MathematicsHelper.vectorDenseSubtractScaledFrom(
            biasVectorDenseValueArray,
            biasVectorGradientDenseValueArray,
            factorConstant);
        if ((l1Regularization > 0) || (l2Regularization > 0)) {
            MathematicsHelper.matrixDenseL1l2RegularizedSparseTo(
                matrixWeightDenseArrays,
                l1Regularization,
                l2Regularization);
            MathematicsHelper.vectorDenseL1l2RegularizedSparseTo(
                biasVectorDenseValueArray,
                l1Regularization,
                l2Regularization);
        }
        return softmaxVectors;
    }

    public static logLoss(
        probabilityVector: number[],
        groundTruthPositiveLabelIndex: number): number {
        let probability = probabilityVector[groundTruthPositiveLabelIndex];
        probability = MathematicsHelper.clipValue(probability);
        if (!probability || (probability <= 0)) {
            Utility.debuggingThrow(
                `probability=${probability}, groundTruthPositiveLabelIndex=${groundTruthPositiveLabelIndex}`);
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
        groundTruthPositiveLabelIndexes: number[]): number {
        let softmaxLogLossSum: number = 0;
        for (let i: number = 0; i < softmaxVectors.length; i++) {
            softmaxLogLossSum +=
                MathematicsHelper.logLoss(softmaxVectors[i], groundTruthPositiveLabelIndexes[i]);
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
        featureVectorSparseIndexArrays: number[][],
        featureVectorSparseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        featureVectorIndexBegin: number = 0,
        featureVectorIndexEnd: number=  0): number[][] {
        if (Utility.isEmptyNumberArrays(featureVectorSparseIndexArrays)) {
            Utility.debuggingThrow(
                "featureVectorSparseIndexArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(featureVectorSparseValueArrays)) {
            Utility.debuggingThrow(
                "featureVectorSparseValueArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            featureVectorSparseIndexArrays.length;
        if (Utility.isEmptyNumberArrays(featureVectorSparseValueArrays)
            || (numberVectors > featureVectorSparseValueArrays.length)) {
            Utility.debuggingThrow(
                "featureVectorSparseValueArrays is empty or " +
                "does not have enough entries to match featureVectorSparseIndexArrays.");
        }
        if (numberVectors <= 0) {
            Utility.debuggingThrow(
                `numberVectors is empty`);
        }
        if (featureVectorIndexBegin < 0) {
            featureVectorIndexBegin = 0;
        }
        if (featureVectorIndexEnd <= 0) {
            featureVectorIndexEnd = numberVectors;
        }
        if (featureVectorIndexEnd > numberVectors) {
            featureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            featureVectorIndexEnd - featureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = featureVectorIndexBegin; i < featureVectorIndexEnd; i++) {
            const featureVectorSparseIndexArray: number[] =
                featureVectorSparseIndexArrays[i];
            const featureVectorSparseValueArray: number[] =
                featureVectorSparseValueArrays[i];
            const matrixVectorProduct: number[] =
                MathematicsHelper.matrixVectorProductSparseIndexesValues(
                    featureVectorSparseIndexArray,
                    featureVectorSparseValueArray,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray);
            Utility.debuggingLog(
                `i=${i}, featureVectorSparseIndexArray=${featureVectorSparseIndexArray}`);
            Utility.debuggingLog(
                `i=${i}, featureVectorSparseValueArray=${featureVectorSparseValueArray}`);
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
     *      featureVectorSparseIndexArrays:
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
     *      featureVectorIndexBegin:
     *          The begin index for a mini batch.
     *      featureVectorIndexEnd:
     *          The end index for a mini batch.
     */
    public static matrixVectorProductSoftmaxSparseIndexes(
        featureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        featureVectorIndexBegin: number = 0,
        featureVectorIndexEnd: number = 0): number[][] {
        if (Utility.isEmptyNumberArrays(featureVectorSparseIndexArrays)) {
            Utility.debuggingThrow(
                "featureVectorSparseIndexArrays is empty.");
        }
        if (Utility.isEmptyNumberArrays(matrixWeightDenseArrays)) {
            Utility.debuggingThrow(
                "matrixWeightDenseArrays is empty.");
        }
        const numberVectors =
            featureVectorSparseIndexArrays.length;
        if (numberVectors <= 0) {
            Utility.debuggingThrow(
                `numberVectors is empty`);
        }
        if (featureVectorIndexBegin < 0) {
            featureVectorIndexBegin = 0;
        }
        if (featureVectorIndexEnd <= 0) {
            featureVectorIndexEnd = numberVectors;
        }
        if (featureVectorIndexEnd > numberVectors) {
            featureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            featureVectorIndexEnd - featureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = featureVectorIndexBegin; i < featureVectorIndexEnd; i++) {
            const featureVectorSparseIndexArray: number[] =
                featureVectorSparseIndexArrays[i];
            const matrixVectorProduct: number[] =
                MathematicsHelper.matrixVectorProductSparseIndexes(
                    featureVectorSparseIndexArray,
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
        featureVectorIndexBegin: number = 0,
        featureVectorIndexEnd: number = 0): number[][] {
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
        if (featureVectorIndexBegin < 0) {
            featureVectorIndexBegin = 0;
        }
        if (featureVectorIndexEnd <= 0) {
            featureVectorIndexEnd = numberVectors;
        }
        if (featureVectorIndexEnd > numberVectors) {
            featureVectorIndexEnd = numberVectors;
        }
        const numberSoftmaxVectors: number =
            featureVectorIndexEnd - featureVectorIndexBegin;
        if (numberSoftmaxVectors <= 0) {
            Utility.debuggingThrow(
                `numberSoftmaxVectors is empty`);
        }
        const softmaxVectors: number[][] =
            new Array<number[]>(numberSoftmaxVectors);
        let indexSoftmaxVectors: number = 0;
        for (let i: number = featureVectorIndexBegin; i < featureVectorIndexEnd; i++) {
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
        featureVectorSparseIndexArray: number[],
        featureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct =
            new Array<number>(lengthRowMatrix);
        for (let i: number = 0; i < lengthRowMatrix; i++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[i];
            let biasVectorDenseValue: number =
                0;
            if (biasVectorDenseValueArray !== null) {
                biasVectorDenseValue = biasVectorDenseValueArray[i];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductSparseIndexesValues(
                    featureVectorSparseIndexArray,
                    featureVectorSparseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[i] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public static matrixVectorProductSparseIndexes(
        featureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct =
            new Array<number>(lengthRowMatrix);
        for (let i: number = 0; i < lengthRowMatrix; i++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[i];
            let biasVectorDenseValue: number =
                0;
            if (biasVectorDenseValueArray !== null) {
                biasVectorDenseValue = biasVectorDenseValueArray[i];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductSparseIndexes(
                    featureVectorSparseIndexArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[i] =
                dotProduct;
        }
        return matrixVectorProduct;
    }
    public static matrixVectorProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[] {
        const lengthRowMatrix: number =
            matrixWeightDenseArrays.length;
        const matrixVectorProduct =
            new Array<number>(lengthRowMatrix);
        for (let i: number = 0; i < lengthRowMatrix; i++) {
            const matrixWeightDenseArray: number[] =
                matrixWeightDenseArrays[i];
            let biasVectorDenseValue: number =
                0;
            if (biasVectorDenseValueArray !== null) {
                biasVectorDenseValue = biasVectorDenseValueArray[i];
            }
            const dotProduct: number =
                MathematicsHelper.dotProductDenseValues(
                    vectorDenseValueArray,
                    matrixWeightDenseArray,
                    biasVectorDenseValue);
            matrixVectorProduct[i] =
                dotProduct;
        }
        return matrixVectorProduct;
    }

    public static dotProductSparseIndexesValues(
        indexArray: number[],
        valueArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        const dotProduct: number =
            indexArray.reduce(
                (accumulation: number, entry: number) => accumulation + valueArray[entry] * weights[entry], 0);
        return (dotProduct + weightBias);
    }
    public static dotProductSparseIndexes(
        indexArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        const dotProduct: number =
            indexArray.reduce((accumulation: number, entry: number) => accumulation + weights[entry], 0);
        return (dotProduct + weightBias);
    }
    public static dotProductDenseValues(
        valueArray: number[],
        weights: number[],
        weightBias: number = 0): number {
        let dotProduct: number = 0;
        for (let i: number = 0; i < weights.length; i++) {
            dotProduct += valueArray[i] * weights[i];
        }
        return (dotProduct + weightBias);
    }

    public static matrixDenseL1l2RegularizedSparseTo(
        valueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = valueArray.length;
        const columns: number = valueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                    valueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return valueArray;
    }
    public static matrixDenseL1l2RegularizedDenseTo(
        valueArray: number[][],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[][] {
        const rows: number = valueArray.length;
        const columns: number = valueArray[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray[row][column] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                    valueArray[row][column],
                    l1Regularization,
                    l2Regularization);
            }
        }
        return valueArray;
    }

    public static vectorDenseL1l2RegularizedSparseTo(
        valueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < valueArray.length; i++) {
            valueArray[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedSparse(
                valueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return valueArray;
    }
    public static vectorDenseL1l2RegularizedDenseTo(
        valueArray: number[],
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01): number[] {
        for (let i: number = 0; i < valueArray.length; i++) {
            valueArray[i] = MathematicsHelper.getL1l2RegularizedWeightOptimizedDense(
                valueArray[i],
                l1Regularization,
                l2Regularization);
        }
        return valueArray;
    }

    public static matrixDenseAddConstantTo(
        valueArray0: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] += constant;
            }
        }
        return valueArray0;
    }
    public static matrixDenseMultiplyConstantTo(
        valueArray0: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] *= constant;
            }
        }
        return valueArray0;
    }
    public static matrixDenseSubtractConstantFrom(
        valueArray0: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] -= constant;
            }
        }
        return valueArray0;
    }
    public static matrixDenseDivideConstantFrom(
        valueArray0: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] /= constant;
            }
        }
        return valueArray0;
    }

    public static matrixDenseAddTo(
        valueArray0: number[][],
        valueArray1: number[][]): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] += valueArray1[row][column];
            }
        }
        return valueArray0;
    }
    public static matrixDenseMultiplyTo(
        valueArray0: number[][],
        valueArray1: number[][]): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] *= valueArray1[row][column];
            }
        }
        return valueArray0;
    }
    public static matrixDenseSubtractFrom(
        valueArray0: number[][],
        valueArray1: number[][]): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] -= valueArray1[row][column];
            }
        }
        return valueArray0;
    }
    public static matrixDenseDivideFrom(
        valueArray0: number[][],
        valueArray1: number[][]): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] /= valueArray1[row][column];
            }
        }
        return valueArray0;
    }

    public static matrixDenseAddScaledTo(
        valueArray0: number[][],
        valueArray1: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] += (constant * valueArray1[row][column]);
            }
        }
        return valueArray0;
    }
    public static matrixDenseMultiplyScaledTo(
        valueArray0: number[][],
        valueArray1: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] *= (constant * valueArray1[row][column]);
            }
        }
        return valueArray0;
    }
    public static matrixDenseSubtractScaledFrom(
        valueArray0: number[][],
        valueArray1: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] -= (constant * valueArray1[row][column]);
            }
        }
        return valueArray0;
    }
    public static matrixDenseDivideScaledFrom(
        valueArray0: number[][],
        valueArray1: number[][],
        constant: number): number[][] {
        const rows: number = valueArray0.length;
        const columns: number = valueArray0[0].length;
        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                valueArray0[row][column] /= (constant * valueArray1[row][column]);
            }
        }
        return valueArray0;
    }

    public static vectorDenseAddConstantTo(
        valueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] += constant;
        }
        return valueArray0;
    }
    public static vectorDenseMultiplyConstantTo(
        valueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] *= constant;
        }
        return valueArray0;
    }
    public static vectorDenseSubtractConstantFrom(
        valueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] -= constant;
        }
        return valueArray0;
    }
    public static vectorDenseDivideConstantFrom(
        valueArray0: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] /= constant;
        }
        return valueArray0;
    }

    public static vectorDenseAddTo(
        valueArray0: number[],
        valueArray1: number[]): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] += valueArray1[i];
        }
        return valueArray0;
    }
    public static vectorDenseMultiplyTo(
        valueArray0: number[],
        valueArray1: number[]): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] *= valueArray1[i];
        }
        return valueArray0;
    }
    public static vectorDenseSubtractFrom(
        valueArray0: number[],
        valueArray1: number[]): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] -= valueArray1[i];
        }
        return valueArray0;
    }
    public static vectorDenseDivideFrom(
        valueArray0: number[],
        valueArray1: number[]): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] /= valueArray1[i];
        }
        return valueArray0;
    }

    public static vectorDenseAddScaledTo(
        valueArray0: number[],
        valueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] += (constant * valueArray1[i]);
        }
        return valueArray0;
    }
    public static vectorDenseMultiplyScaledTo(
        valueArray0: number[],
        valueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] *= (constant * valueArray1[i]);
        }
        return valueArray0;
    }
    public static vectorDenseSubtractScaledFrom(
        valueArray0: number[],
        valueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] -= (constant * valueArray1[i]);
        }
        return valueArray0;
    }
    public static vectorDenseDivideScaledFrom(
        valueArray0: number[],
        valueArray1: number[],
        constant: number): number[] {
        for (let i: number = 0; i < valueArray0.length; i++) {
            valueArray0[i] /= (constant * valueArray1[i]);
        }
        return valueArray0;
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
            vector[i] = Utility.rngNextXorshift128plusBigIntFloat();
        }
        return vector;
    }
    public static vectorNewWithRandomElementsScaled(
        length: number,
        scale: number = 1): number[] {
        const vector: number[] = new Array<number>(length);
        for (let i: number = 0; i < length; i++) {
            vector[i] = Utility.rngNextXorshift128plusBigIntFloat() *  scale;
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
