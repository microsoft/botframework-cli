/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Utility } from "../../utility/Utility";

export interface IMathematicsHelper {

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    softmaxSingleFunction(inputs: number[], index: number): number;
    smoothArgmaxApproximationSingleFunction(inputs: number[], index: number): number;
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/Softmax_function
    softmaxFunction(inputs: number[]): number[];
    smoothArgmaxApproximationFunction(inputs: number[]): number[];

    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    logsumexpStrictConvexSingleFunction(inputs: number[]): number;
    smoothMaxApproximationStrictConvexFunction(inputs: number[]): number;
    // ---- NOTE-REFERENCE ---- https://en.wikipedia.org/wiki/LogSumExp
    logsumexpSingleFunction(inputs: number[]): number;
    smoothMaxApproximationFunction(inputs: number[]): number;

    sigmoidLogisticGradientFunction(input: number): number;

    sigmoidLogisticFunction(input: number): number;
    sigmoidHyperbolicTangentFunction(input: number): number;
    sigmoidArctangentFunction(input: number): number;
    sigmoidGudermannianFunction(input: number): number;
    sigmoidGeneralizedLogisticFunction(input: number, alpha: number): number;
    sigmoidAlgebraicFunction(input: number): number;

    getL1Regularized(weight: number, l1Regularization: number): number;
    getL2Regularized(weight: number, l2Regularization: number): number;
    getL1l2RegularizedWeightOptimizedSparse(
        weight: number,
        l1Regularization: number,
        l2Regularization: number): number;
    getL1l2RegularizedWeightOptimizedDense(
        weight: number,
        l1Regularization: number,
        l2Regularization: number): number;

    /*
     *  return:
     *      softmaxVectors: number[][]:
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
    softmaxLogLossGradientUpdate(
        instanceGroundTruthPositiveLabelIndexes: number[],
        instanceFeatureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        learningRate: number,
        l1Regularization: number,
        l2Regularization: number,
        instanceFeatureVectorIndexBegin: number,
        instanceFeatureVectorIndexEnd: number): number[][];

    logLoss(
        probabilityVector: number[],
        instanceGroundTruthPositiveLabelIndex: number): number;
    logLossGeneric(
        probabilityVector: number[],
        labelVector: number[]): number;

    softmaxLogLoss(
        softmaxVectors: number[][],
        instanceGroundTruthPositiveLabelIndexes: number[]): number;
    softmaxLogLossGeneric(
        softmaxVectors: number[][],
        labelVectors: number[][]): number;

    matrixVectorProductSoftmaxSparseIndexesValues(
        instanceFeatureVectorSparseIndexArrays: number[][],
        instanceFeatureVectorSparseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number,
        instanceFeatureVectorIndexEnd: number): number[][];
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
    matrixVectorProductSoftmaxSparseIndexes(
        instanceFeatureVectorSparseIndexArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number,
        instanceFeatureVectorIndexEnd: number): number[][];
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
    matrixVectorProductSoftmaxDenseValues(
        instanceFeatureVectorDenseValueArrays: number[][],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[],
        instanceFeatureVectorIndexBegin: number,
        instanceFeatureVectorIndexEnd: number): number[][];

    matrixVectorProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    matrixVectorProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    matrixVectorProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];

    matrixVectorProductSparseIndexesValuesTo(
        matrixVectorProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    matrixVectorProductSparseIndexesTo(
        matrixVectorProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    matrixVectorProductDenseValuesTo(
        matrixVectorProduct: number[],
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];

    vectorMatrixProductSparseIndexesValues(
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    vectorMatrixProductSparseIndexes(
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    vectorMatrixProductDenseValues(
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];

    vectorMatrixProductSparseIndexesValuesTo(
        vectorMatrixProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        instanceFeatureVectorSparseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    vectorMatrixProductSparseIndexesTo(
        vectorMatrixProduct: number[],
        instanceFeatureVectorSparseIndexArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];
    vectorMatrixProductDenseValuesTo(
        vectorMatrixProduct: number[],
        vectorDenseValueArray: number[],
        matrixWeightDenseArrays: number[][],
        biasVectorDenseValueArray: number[]): number[];

    dotProductSparseIndexesValues(
        sparseIndexArray: number[],
        sparseValueArray: number[],
        weights: number[],
        weightBias: number): number;
    dotProductSparseIndexes(
        sparseIndexArray: number[],
        weights: number[],
        weightBias: number): number;
    dotProductDenseValues(
        denseValueArray: number[],
        weights: number[],
        weightBias: number): number;

    matrixDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[][];
    matrixDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[][];
    vectorDenseSubtractScaledFromAndL1l2RegularizedSparseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[];
    vectorDenseSubtractScaledFromAndL1l2RegularizedDenseTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number,
        l1Regularization: number,
        l2Regularization: number): number[];

    matrixDenseL1l2RegularizedSparseTo(
        denseValueArray: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];
    matrixDenseL1l2RegularizedDenseTo(
        denseValueArray: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];

    vectorDenseL1l2RegularizedSparseTo(
        denseValueArray: number[],
        l1Regularization: number,
        l2Regularization: number): number[];
    vectorDenseL1l2RegularizedDenseTo(
        denseValueArray: number[],
        l1Regularization: number,
        l2Regularization: number): number[];

    tensor4dDenseAssignRandomTo(
        denseValueArray0: number[][][][]): number[][][][];

    tensor4dDenseAssignConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseAddConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseMultiplyConstantTo(
        denseValueArray0: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseSubtractConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseDivideConstantFrom(
        denseValueArray0: number[][][][],
        constant: number): number[][][][];

    tensor4dDenseAssignTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][];
    tensor4dDenseAddTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][];
    tensor4dDenseMultiplyTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][];
    tensor4dDenseSubtractFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][];
    tensor4dDenseDivideFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][]): number[][][][];

    tensor4dDenseAssignScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseAddScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseMultiplyScaledTo(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseSubtractScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][];
    tensor4dDenseDivideScaledFrom(
        denseValueArray0: number[][][][],
        denseValueArray1: number[][][][],
        constant: number): number[][][][];

    tensor3dDenseAssignRandomTo(
        denseValueArray0: number[][][]): number[][][];

    tensor3dDenseAssignConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][];
    tensor3dDenseAddConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][];
    tensor3dDenseMultiplyConstantTo(
        denseValueArray0: number[][][],
        constant: number): number[][][];
    tensor3dDenseSubtractConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][];
    tensor3dDenseDivideConstantFrom(
        denseValueArray0: number[][][],
        constant: number): number[][][];

    tensor3dDenseAssignTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][];
    tensor3dDenseAddTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][];
    tensor3dDenseMultiplyTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][];
    tensor3dDenseSubtractFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][];
    tensor3dDenseDivideFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][]): number[][][];

    tensor3dDenseAssignScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][];
    tensor3dDenseAddScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][];
    tensor3dDenseMultiplyScaledTo(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][];
    tensor3dDenseSubtractScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][];
    tensor3dDenseDivideScaledFrom(
        denseValueArray0: number[][][],
        denseValueArray1: number[][][],
        constant: number): number[][][];

    matrixDenseAssignRandomTo(
        denseValueArray0: number[][]): number[][];

    matrixDenseAssignConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][];
    matrixDenseAddConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][];
    matrixDenseMultiplyConstantTo(
        denseValueArray0: number[][],
        constant: number): number[][];
    matrixDenseSubtractConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][];
    matrixDenseDivideConstantFrom(
        denseValueArray0: number[][],
        constant: number): number[][];

    matrixDenseAssignTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][];
    matrixDenseAddTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][];
    matrixDenseMultiplyTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][];
    matrixDenseSubtractFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][];
    matrixDenseDivideFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][]): number[][];

    matrixDenseAssignScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][];
    matrixDenseAddScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][];
    matrixDenseMultiplyScaledTo(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][];
    matrixDenseSubtractScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][];
    matrixDenseDivideScaledFrom(
        denseValueArray0: number[][],
        denseValueArray1: number[][],
        constant: number): number[][];

    vectorDenseAssignRandomTo(
        denseValueArray0: number[]): number[];

    vectorDenseAssignConstantTo(
        denseValueArray0: number[],
        constant: number): number[];
    vectorDenseAddConstantTo(
        denseValueArray0: number[],
        constant: number): number[];
    vectorDenseMultiplyConstantTo(
        denseValueArray0: number[],
        constant: number): number[];
    vectorDenseSubtractConstantFrom(
        denseValueArray0: number[],
        constant: number): number[];
    vectorDenseDivideConstantFrom(
        denseValueArray0: number[],
        constant: number): number[];

    vectorDenseAssignTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[];
    vectorDenseAddTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[];
    vectorDenseMultiplyTo(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[];
    vectorDenseSubtractFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[];
    vectorDenseDivideFrom(
        denseValueArray0: number[],
        denseValueArray1: number[]): number[];

    vectorDenseAssignScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[];
    vectorDenseAddScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[];
    vectorDenseMultiplyScaledTo(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[];
    vectorDenseSubtractScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[];
    vectorDenseDivideScaledFrom(
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): number[];

    vectorSparseAssignRandomTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[]): [number[], number[]];

    vectorSparseAssignConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseAddConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseMultiplyConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseSubtractConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseDivideConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        constant: number): [number[], number[]];

    vectorSparseAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]];
    vectorSparseAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]];
    vectorSparseMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]];
    vectorSparseSubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]];
    vectorSparseDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[]): [number[], number[]];

    vectorSparseAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseSubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        constant: number): [number[], number[]];

    vectorSparseIndexDenseArrayAssignRandomTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[]): [number[], number[]];

    vectorSparseIndexDenseArrayAssignConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayAddConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayMultiplyConstantTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArraySubtractConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayDivideConstantFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];

    vectorSparseIndexDenseArrayAssignTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseIndexDenseArrayAddTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseIndexDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseIndexDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseIndexDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];

    vectorSparseIndexDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseIndexDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];

    vectorIndependentSparseIndexDenseArrayAssignTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayAddTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseIndexDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[]): [number[], number[]];

    vectorIndependentSparseIndexDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseIndexDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseIndexDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];

    vectorSparseMapDenseArrayAssignRandomTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[]): [number[], number[]];

    vectorSparseMapDenseArrayAssignConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayAddConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayMultiplyConstantTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArraySubtractConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayDivideConstantFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        constant: number): [number[], number[]];

    vectorSparseMapDenseArrayAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseMapDenseArrayAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseMapDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseMapDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorSparseMapDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[]): [number[], number[]];

    vectorSparseMapDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorSparseMapDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];

    vectorIndependentSparseMapDenseArrayAssignTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseMapDenseArrayAddTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseMapDenseArrayMultiplyTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseMapDenseArraySubtractFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]];
    vectorIndependentSparseMapDenseArrayDivideFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[]): [number[], number[]];

    vectorIndependentSparseMapDenseArrayAssignScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseMapDenseArrayAddScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseMapDenseArrayMultiplyScaledTo(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseMapDenseArraySubtractScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];
    vectorIndependentSparseMapDenseArrayDivideScaledFrom(
        sparseIndexArray0: number[],
        sparseValueArray0: number[],
        denseValueArray0: number[],
        sparseIndexArray1: number[],
        sparseValueArray1: number[],
        denseValueArray1: number[],
        constant: number): [number[], number[]];

    tensor4dNewLikeWithRandomCells(
        tensor4d: number[][][][]): number[][][][];
    tensor4dNewLikeWithRandomCellsScaled(
        tensor4d: number[][][][],
        scale: number): number[][][][];
    tensor4dNewLikeWithZeroCells(
        tensor4d: number[][][][]): number[][][][];
    tensor4dNewLikeWithConstantCells(
        tensor4d: number[][][][],
        constant: number): number[][][][];
    tensor4dNewLikeWithScaledCells(
        tensor4d: number[][][][],
        scale: number): number[][][][];
    tensor4dNewLikeWithL1l2RegularizedSparseCells(
        tensor4d: number[][][][],
        l1Regularization: number,
        l2Regularization: number): number[][][][];
    tensor4dNewLikeWithL1l2RegularizedDenseCells(
        tensor4d: number[][][][],
        l1Regularization: number,
        l2Regularization: number): number[][][][];

    tensor3dNewLikeWithRandomCells(
        tensor3d: number[][][]): number[][][];
    tensor3dNewLikeWithRandomCellsScaled(
        tensor3d: number[][][],
        scale: number): number[][][];
    tensor3dNewLikeWithZeroCells(
        tensor3d: number[][][]): number[][][];
    tensor3dNewLikeWithConstantCells(
        tensor3d: number[][][],
        constant: number): number[][][];
    tensor3dNewLikeWithScaledCells(
        tensor3d: number[][][],
        scale: number): number[][][];
    tensor3dNewLikeWithL1l2RegularizedSparseCells(
        tensor3d: number[][][],
        l1Regularization: number,
        l2Regularization: number): number[][][];
    tensor3dNewLikeWithL1l2RegularizedDenseCells(
        tensor3d: number[][][],
        l1Regularization: number,
        l2Regularization: number): number[][][];

    matrixNewLikeWithRandomCells(
        matrix: number[][]): number[][];
    matrixNewLikeWithRandomCellsScaled(
        matrix: number[][],
        scale: number): number[][];
    matrixNewLikeWithZeroCells(
        matrix: number[][]): number[][];
    matrixNewLikeWithConstantCells(
        matrix: number[][],
        constant: number): number[][];
    matrixNewLikeWithScaledCells(
        matrix: number[][],
        scale: number): number[][];
    matrixNewLikeWithL1l2RegularizedSparseCells(
        matrix: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];
    matrixNewLikeWithL1l2RegularizedDenseCells(
        matrix: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];

    vectorNewLikeWithRandomElements(
        vector: number[]): number[];
    vectorNewLikeWithRandomElementsScaled(
        vector: number[],
        scale: number): number[];
    vectorNewLikeWithZeroElements(
        vector: number[]): number[];
    vectorNewLikeWithConstantElements(
        vector: number[],
        constant: number): number[];
    vectorNewLikeWithScaledElements(
        vector: number[],
        scale: number): number[];
    vectorNewLikeWithL1l2RegularizedSparseElements(
        vector: number[],
        l1Regularization: number,
        l2Regularization: number): number[];
    vectorNewLikeWithL1l2RegularizedDenseElements(
        vector: number[],
        l1Regularization: number,
        l2Regularization: number): number[];

    tensor4dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][];
    tensor4dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        scale: number): number[][][][];
    tensor4dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number): number[][][][];
    tensor4dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        dimension4ds: number,
        constant: number): number[][][][];
    tensor4dNewWithScaledCells(
        existingTensor4d: number[][][][],
        scale: number): number[][][][];
    tensor4dNewWithL1l2RegularizedSparseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number,
        l2Regularization: number): number[][][][];
    tensor4dNewWithL1l2RegularizedDenseCells(
        existingTensor4d: number[][][][],
        l1Regularization: number,
        l2Regularization: number): number[][][][];

    tensor3dNewWithRandomCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][];
    tensor3dNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        dimension3ds: number,
        scale: number): number[][][];
    tensor3dNewWithZeroCells(
        rows: number,
        columns: number,
        dimension3ds: number): number[][][];
    tensor3dNewWithConstantCells(
        rows: number,
        columns: number,
        dimension3ds: number,
        constant: number): number[][][];
    tensor3dNewWithScaledCells(
        existingTensor3d: number[][][],
        scale: number): number[][][];
    tensor3dNewWithL1l2RegularizedSparseCells(
        existingTensor3d: number[][][],
        l1Regularization: number,
        l2Regularization: number): number[][][];
    tensor3dNewWithL1l2RegularizedDenseCells(
        existingTensor3d: number[][][],
        l1Regularization: number,
        l2Regularization: number): number[][][];

    matrixNewWithRandomCells(
        rows: number,
        columns: number): number[][];
    matrixNewWithRandomCellsScaled(
        rows: number,
        columns: number,
        scale: number): number[][];
    matrixNewWithZeroCells(
        rows: number,
        columns: number): number[][];
    matrixNewWithConstantCells(
        rows: number,
        columns: number,
        constant: number): number[][];
    matrixNewWithScaledCells(
        existingMatrix: number[][],
        scale: number): number[][];
    matrixNewWithL1l2RegularizedSparseCells(
        existingMatrix: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];
    matrixNewWithL1l2RegularizedDenseCells(
        existingMatrix: number[][],
        l1Regularization: number,
        l2Regularization: number): number[][];

    vectorNewWithRandomElements(
        length: number): number[];
    vectorNewWithRandomElementsScaled(
        length: number,
        scale: number): number[];
    vectorNewWithZeroElements(
        length: number): number[];
    vectorNewWithConstantElements(
        length: number,
        constant: number): number[];
    vectorNewWithScaledElements(
        existingVector: number[],
        scale: number): number[];
    vectorNewWithL1l2RegularizedSparseElements(
        existingVector: number[],
        l1Regularization: number,
        l2Regularization: number): number[];
    vectorNewWithL1l2RegularizedDenseElements(
        existingVector: number[],
        l1Regularization: number,
        l2Regularization: number): number[];

    getIndexOnFirstMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number };
    getIndexOnLastMaxEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMax": number, "max": number };
    getIndexOnFirstMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number };
    getIndexOnLastMaxEntry(
        inputArray: number[]):
        { "indexMax": number, "max": number };

    getIndexOnFirstMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number };
    getIndexOnLastMinEntryOnArray(
        inputArray: Float32Array | Int32Array | Uint8Array):
        { "indexMin": number, "min": number };
    getIndexOnFirstMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number };
    getIndexOnLastMinEntry(
        inputArray: number[]):
        { "indexMin": number, "min": number };

    safeDivide(numerator: number, denominator: number): number;
    safeLog(value: number): number;

    clipValue(value: number): number;
}
