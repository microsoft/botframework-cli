/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { IMathematicsHelper } from "../../../src/mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../src/mathematics/mathematics_helper/MathematicsHelper";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

const testArray: number[] = [0.4, 0.5, 0.3];

const MathematicsHelperObject: IMathematicsHelper = MathematicsHelper.GetMathematicsHelperObject();

describe("Test Suite - mathematics/mathematics_helper/mathematics_helper/MathematicsHelper", () => {
    it("Test.0000 softmaxSingleFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const softmax: number =
            MathematicsHelperObject.softmaxSingleFunction(testArray, 2);
        assert.ok(
            Utility.almostEqual(softmax, 0.3006096053557273),
            `softmax=${softmax}`);
    });
    it("Test.0001 smoothArgmaxApproximationSingleFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const smoothArgmax: number =
            MathematicsHelperObject.smoothArgmaxApproximationSingleFunction(testArray, 2);
        assert.ok(
            Utility.almostEqual(smoothArgmax, 0.3006096053557273),
            `smoothArgmax=${smoothArgmax}`);
    });
    it("Test.0002 softmaxFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const softmaxes: number[] =
            MathematicsHelperObject.softmaxFunction(testArray);
        assert.ok(
            Utility.almostEqual(softmaxes[0], 0.3322249935333473),
            `softmaxes=${softmaxes}`);
        assert.ok(
            Utility.almostEqual(softmaxes[1], 0.3671654011109255),
            `softmaxes=${softmaxes}`);
        assert.ok(
            Utility.almostEqual(softmaxes[2], 0.3006096053557273),
            `softmaxes=${softmaxes}`);
    });
    it("Test.0003 smoothArgmaxApproximationFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const smoothArgmaxes: number[] =
            MathematicsHelperObject.smoothArgmaxApproximationFunction(testArray);
        assert.ok(
            Utility.almostEqual(smoothArgmaxes[0], 0.3322249935333473),
            `smoothArgmaxes=${smoothArgmaxes}`);
        assert.ok(
            Utility.almostEqual(smoothArgmaxes[1], 0.3671654011109255),
            `smoothArgmaxes=${smoothArgmaxes}`);
        assert.ok(
            Utility.almostEqual(smoothArgmaxes[2], 0.3006096053557273),
            `smoothArgmaxes=${smoothArgmaxes}`);
    });

    it("Test.0100 logsumexpStrictConvexSingleFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const logsumexpStrictConvex: number =
            MathematicsHelperObject.logsumexpStrictConvexSingleFunction(testArray);
        assert.ok(
            Utility.almostEqual(logsumexpStrictConvex, 1.7030019824788412),
            `logsumexpStrictConvex=${logsumexpStrictConvex}`);
    });
    it("Test.0101 smoothMaxApproximationStrictConvexFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const smoothMaxApproximationStrict: number =
            MathematicsHelperObject.smoothMaxApproximationStrictConvexFunction(testArray);
        assert.ok(
            Utility.almostEqual(smoothMaxApproximationStrict, 1.7030019824788412),
            `smoothMaxApproximationStrict=${smoothMaxApproximationStrict}`);
    });
    it("Test.0102 logsumexpSingleFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const logsumexp: number =
            MathematicsHelperObject.logsumexpSingleFunction(testArray);
        assert.ok(
            Utility.almostEqual(logsumexp, 1.501942848229244),
            `logsumexp=${logsumexp}`);
    });
    it("Test.0103 smoothMaxApproximationFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const smoothMaxApproximation: number =
            MathematicsHelperObject.smoothMaxApproximationFunction(testArray);
        assert.ok(
            Utility.almostEqual(smoothMaxApproximation, 1.501942848229244),
            `smoothMaxApproximation=${smoothMaxApproximation}`);
    });

    it("Test.0201 sigmoidLogisticGradientFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoidLogisticGradient: number =
            MathematicsHelperObject.sigmoidLogisticGradientFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoidLogisticGradient, 0.2350037122015945),
            `sigmoidLogisticGradient=${sigmoidLogisticGradient}`);
    });

    it("Test.0300 sigmoidLogisticFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidLogisticFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.6224593312018546),
            `sigmoid=${sigmoid}`);
    });
    it("Test.0301 sigmoidHyperbolicTangentFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidHyperbolicTangentFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.4621171572600098),
            `sigmoid=${sigmoid}`);
    });
    it("Test.0302 sigmoidArctangentFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidArctangentFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.4636476090008061),
            `sigmoid=${sigmoid}`);
    });
    it("Test.0303 sigmoidGudermannianFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidGudermannianFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.48038107913372946),
            `sigmoid=${sigmoid}`);
    });
    it("Test.0304 sigmoidGeneralizedLogisticFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidGeneralizedLogisticFunction(testArray[1], 1);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.6224593312018546),
            `sigmoid=${sigmoid}`);
    });
    it("Test.0305 sigmoidAlgebraicFunction()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sigmoid: number =
            MathematicsHelperObject.sigmoidAlgebraicFunction(testArray[1]);
        assert.ok(
            Utility.almostEqual(sigmoid, 0.4472135954999579),
            `sigmoid=${sigmoid}`);
    });

    it("Test.0400 getL1Regularized()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 1;
        const value: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1Regularized(weight, value);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0.5),
            `regularization=${regularization}`);
    });
    it("Test.0401 getL1Regularized()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = -1;
        const value: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1Regularized(weight, value);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, -0.5),
            `regularization=${regularization}`);
    });
    it("Test.0402 getL1Regularized()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 0;
        const value: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1Regularized(weight, value);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0403 getL2Regularized()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 2;
        const value: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL2Regularized(weight, value);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 1),
            `regularization=${regularization}`);
    });
    it("Test.0404 getL1l2RegularizedWeightOptimizedSparse()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 1;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedSparse(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0405 getL1l2RegularizedWeightOptimizedSparse()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = -1;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedSparse(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0406 getL1l2RegularizedWeightOptimizedSparse()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 1;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedSparse(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0407 getL1l2RegularizedWeightOptimizedSparse()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 0;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedSparse(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0408 getL1l2RegularizedWeightOptimizedDense()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 1;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedDense(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0409 getL1l2RegularizedWeightOptimizedDense()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = -1;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedDense(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });
    it("Test.0410 getL1l2RegularizedWeightOptimizedDense()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const weight: number = 0;
        const valueL1: number = 0.5;
        const valueL2: number = 0.5;
        const regularization: number =
            MathematicsHelperObject.getL1l2RegularizedWeightOptimizedDense(weight, valueL1, valueL2);
        Utility.debuggingLog(
            `regularization=${regularization}`);
        assert.ok(
            Utility.almostEqual(regularization, 0),
            `regularization=${regularization}`);
    });

    it("Test.0500 softmaxLogLossGradientUpdate()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const groundTruthPositiveLabelIndexes: number[] = [0, 1];
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const learningRate: number = 0.1;
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmax: number[][] =
            MathematicsHelperObject.softmaxLogLossGradientUpdate(
                groundTruthPositiveLabelIndexes,
                featureVectorSparseIndexArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                learningRate,
                l1Regularization,
                l2Regularization,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmax[0][0], 0.401312339887548),
            `softmax=${softmax}`);
        assert.ok(
            Utility.almostEqual(softmax[0][1], 0.598687660112452),
            `softmax=${softmax}`);
        assert.ok(
            Utility.almostEqual(softmax[1][0], 0.4501660026875221),
            `softmax=${softmax}`);
        assert.ok(
            Utility.almostEqual(softmax[1][1], 0.549833997312478),
            `softmax=${softmax}`);
    });
    it("Test.0501 softmaxLogLossGradientUpdate()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const groundTruthPositiveLabelIndexes: number[] = [];
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const learningRate: number = 0.1;
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmax: number[][] =
                MathematicsHelperObject.softmaxLogLossGradientUpdate(
                    groundTruthPositiveLabelIndexes,
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    learningRate,
                    l1Regularization,
                    l2Regularization,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        }, "groundTruthPositiveLabelIndexes is empty");
    });
    it("Test.0502 softmaxLogLossGradientUpdate()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const groundTruthPositiveLabelIndexes: number[] = [0, 1];
        const featureVectorSparseIndexArrays: number[][] = [];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const learningRate: number = 0.1;
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmax: number[][] =
                MathematicsHelperObject.softmaxLogLossGradientUpdate(
                    groundTruthPositiveLabelIndexes,
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    learningRate,
                    l1Regularization,
                    l2Regularization,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        }, "featureVectorSparseIndexArrays is empty");
    });
    it("Test.0503 softmaxLogLossGradientUpdate()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const groundTruthPositiveLabelIndexes: number[] = [0, 1];
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const learningRate: number = 0.1;
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmax: number[][] =
                MathematicsHelperObject.softmaxLogLossGradientUpdate(
                    groundTruthPositiveLabelIndexes,
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    learningRate,
                    l1Regularization,
                    l2Regularization,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        }, "matrixWeightDenseArrays is empty");
    });
    it("Test.0504 softmaxLogLossGradientUpdate()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const groundTruthPositiveLabelIndexes: number[] = [0, 1];
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [];
        const learningRate: number = 0.1;
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmax: number[][] =
                MathematicsHelperObject.softmaxLogLossGradientUpdate(
                    groundTruthPositiveLabelIndexes,
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    learningRate,
                    l1Regularization,
                    l2Regularization,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        }, "biasVectorDenseValueArray is empty");
    });

    it("Test.0600 logLoss()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const probabilityVector: number[] = testArray;
        const groundTruthPositiveLabelIndex: number = 1;
        const logLossValue: number =
            MathematicsHelperObject.logLoss(probabilityVector, groundTruthPositiveLabelIndex);
        assert.ok(
            Utility.almostEqual(logLossValue, 0.6931471805599453),
            `logLossValue=${logLossValue}`);
    });
    it("Test.0601 logLossGeneric()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const probabilityVector: number[] = testArray;
        const labelArray: number[] = testArray;
        const logLossGenericValue: number =
            MathematicsHelperObject.logLossGeneric(probabilityVector, labelArray);
        assert.ok(
            Utility.almostEqual(logLossGenericValue, 1.0742817243274154),
            `logLossGenericValue=${logLossGenericValue}`);
    });

    it("Test.0700 softmaxLogLoss()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const softmaxVectors: number[][] = [testArray, testArray];
        const groundTruthPositiveLabelIndexes: number[] = [1, 1];
        const softmaxLogLossValue: number =
            MathematicsHelperObject.softmaxLogLoss(softmaxVectors, groundTruthPositiveLabelIndexes);
        assert.ok(
            Utility.almostEqual(softmaxLogLossValue, 0.6931471805599453),
            `softmaxLogLossValue=${softmaxLogLossValue}`);
    });
    it("Test.0701 softmaxLogLossGeneric()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const softmaxVectors: number[][] = [testArray, testArray];
        const labelVectors: number[][] = [testArray, testArray];
        const softmaxLogLossGenericValue: number =
            MathematicsHelperObject.softmaxLogLossGeneric(softmaxVectors, labelVectors);
        assert.ok(
            Utility.almostEqual(softmaxLogLossGenericValue, 1.0742817243274154),
            `softmaxLogLossGenericValue=${softmaxLogLossGenericValue}`);
    });

    it("Test.0800 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(0.5, 0.5, 0.5, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4501660
                [2,] 0.5498340
                [3,] 0.4750208
                [4,] 0.5249792
            `;
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const featureVectorSparseValueArrays: number[][] = [[0.5, 0.5], [0.5]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                featureVectorSparseIndexArrays,
                featureVectorSparseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0801 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [];
        const featureVectorSparseValueArrays: number[][] = [[0.5, 0.5], [0.5]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                    featureVectorSparseIndexArrays,
                    featureVectorSparseValueArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0802 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const featureVectorSparseValueArrays: number[][] = [];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                    featureVectorSparseIndexArrays,
                    featureVectorSparseValueArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0803 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const featureVectorSparseValueArrays: number[][] = [[0.5, 0.5], [0.5]];
        const matrixWeightDenseArrays: number[][] = [];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                    featureVectorSparseIndexArrays,
                    featureVectorSparseValueArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0804 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(0.5, 0.5, 0.5, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(1, 1)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4501660
                [2,] 0.5498340
                [3,] 0.4750208
                [4,] 0.5249792
            `;
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const featureVectorSparseValueArrays: number[][] = [[0.5, 0.5], [0.5]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                featureVectorSparseIndexArrays,
                featureVectorSparseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0805 matrixVectorProductSoftmaxSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const featureVectorSparseValueArrays: number[][] = [[0.5, 0.5], [0.5]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 0;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexesValues(
                featureVectorSparseIndexArrays,
                featureVectorSparseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0806 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(1, 1, 1, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4013123
                [2,] 0.5986877
                [3,] 0.4501660
                [4,] 0.5498340
            `;
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                featureVectorSparseIndexArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.401312339887548),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.598687660112452),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.549833997312478),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0807 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0808 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                featureVectorSparseIndexArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.401312339887548),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.598687660112452),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.549833997312478),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0809 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                    featureVectorSparseIndexArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0810 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(1, 1, 1, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(1, 1)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4013123
                [2,] 0.5986877
                [3,] 0.4501660
                [4,] 0.5498340
            `;
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                featureVectorSparseIndexArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.401312339887548),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.598687660112452),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.549833997312478),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0811 matrixVectorProductSoftmaxSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featureVectorSparseIndexArrays: number[][] = [[0, 1], [0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 0;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxSparseIndexes(
                featureVectorSparseIndexArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.401312339887548),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.598687660112452),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.549833997312478),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0812 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(0.5, 0.5, 0.5, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4501660
                [2,] 0.5498340
                [3,] 0.4750208
                [4,] 0.5249792
            `;
        const vectorDenseValueArrays: number[][] = [[0.5, 0.5], [0.5, 0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                vectorDenseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0813 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const vectorDenseValueArrays: number[][] = [];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                    vectorDenseValueArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0814 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const vectorDenseValueArrays: number[][] = [[0.5, 0.5], [0.5, 0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                vectorDenseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0815 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const vectorDenseValueArrays: number[][] = [[0.5, 0.5], [0.5, 0]];
        const matrixWeightDenseArrays: number[][] = [];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        assert.throws(() => {
            const softmaxVectors: number[][] =
                MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                    vectorDenseValueArrays,
                    matrixWeightDenseArrays,
                    biasVectorDenseValueArray,
                    featureVectorIndexBegin,
                    featureVectorIndexEnd);
        });
    });
    it("Test.0816 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureMatrix = matrix(c(0.5, 0.5, 0.5, 0), nrow=2, byrow=TRUE)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(1, 1)
            productVector1 = matrixWeightMatrix %*% featureMatrix[1,] + biasVector[1]
            softmaxVector1 = exp(productVector1)/sum(exp(productVector1))
            productVector2 = matrixWeightMatrix %*% featureMatrix[2,] + biasVector[2]
            softmaxVector2 = exp(productVector2)/sum(exp(productVector2))
            softmaxVector = rbind(softmaxVector1, softmaxVector2)
            softmaxVector
                          [,1]
                [1,] 0.4501660
                [2,] 0.5498340
                [3,] 0.4750208
                [4,] 0.5249792
            `;
        const vectorDenseValueArrays: number[][] = [[0.5, 0.5], [0.5, 0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 2;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                vectorDenseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });
    it("Test.0817 matrixVectorProductSoftmaxDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const vectorDenseValueArrays: number[][] = [[0.5, 0.5], [0.5, 0]];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const featureVectorIndexBegin: number = 0;
        const featureVectorIndexEnd: number = 0;
        const softmaxVectors: number[][] =
            MathematicsHelperObject.matrixVectorProductSoftmaxDenseValues(
                vectorDenseValueArrays,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray,
                featureVectorIndexBegin,
                featureVectorIndexEnd);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][0], 0.4501660026875221),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[0][1], 0.5498339973124778),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][0], 0.47502081252106),
            `softmaxVectors=${softmaxVectors}`);
        assert.ok(
            Utility.almostEqual(softmaxVectors[1][1], 0.5249791874789399),
            `softmaxVectors=${softmaxVectors}`);
    });

    it("Test.0900 matrixVectorProductSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(0.5, 0.5)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector = matrixWeightMatrix %*% featureVector + biasVector
            productVector
                     [,1]
                [1,] 0.65
                [2,] 0.85
            `;
        const featureVectorSparseIndexArray: number[] = [0, 1];
        const featureVectorSparseValueArray: number[] = [0.5, 0.5];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const matrixVectorProduct: number[] =
            MathematicsHelperObject.matrixVectorProductSparseIndexesValues(
                featureVectorSparseIndexArray,
                featureVectorSparseValueArray,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[0], 0.65),
            `matrixVectorProduct=${matrixVectorProduct}`);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[1], 0.85),
            `matrixVectorProduct=${matrixVectorProduct}`);
    });
    it("Test.0901 matrixVectorProductSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(1, 1)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector = matrixWeightMatrix %*% featureVector + biasVector
            productVector
                     [,1]
                [1,]  0.8
                [2,]  1.2
            `;
        const featureVectorSparseIndexArray: number[] = [0, 1];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const matrixVectorProduct: number[] =
            MathematicsHelperObject.matrixVectorProductSparseIndexes(
                featureVectorSparseIndexArray,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[0], 0.8),
            `matrixVectorProduct=${matrixVectorProduct}`);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[1], 1.2),
            `matrixVectorProduct=${matrixVectorProduct}`);
    });
    it("Test.0902 matrixVectorProductDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(0.5, 0.5)
            matrixWeightMatrix = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            biasVector = c(0.5, 0.5)
            productVector = matrixWeightMatrix %*% featureVector + biasVector
            productVector
                     [,1]
                [1,]  0.65
                [2,]  0.85
            `;
        const vectorDenseValueArray: number[] = [0.5, 0.5];
        const matrixWeightDenseArrays: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const biasVectorDenseValueArray: number[] = [0.5, 0.5];
        const matrixVectorProduct: number[] =
            MathematicsHelperObject.matrixVectorProductDenseValues(
                vectorDenseValueArray,
                matrixWeightDenseArrays,
                biasVectorDenseValueArray);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[0], 0.65),
            `matrixVectorProduct=${matrixVectorProduct}`);
        assert.ok(
            Utility.almostEqual(matrixVectorProduct[1], 0.85),
            `matrixVectorProduct=${matrixVectorProduct}`);
    });

    it("Test.1000 dotProductSparseIndexesValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(0.5, 0.5)
            weights = c(0.1, 0.2)
            bias = 0.5
            productVector = featureVector %*% weights + bias
            productVector
                     [,1]
                [1,] 0.65
            `;
        const indexArray: number[] = [0, 1];
        const valueArray: number[] = [0.5, 0.5];
        const weights: number[] = [0.1, 0.2];
        const weightBias: number = 0.5;
        const dotProduct: number =
            MathematicsHelperObject.dotProductSparseIndexesValues(
                indexArray,
                valueArray,
                weights,
                weightBias);
        assert.ok(
            Utility.almostEqual(dotProduct, 0.65),
            `dotProduct=${dotProduct}`);
    });
    it("Test.1001 dotProductSparseIndexes()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(1, 1)
            weights = c(0.1, 0.2)
            bias = 0.5
            productVector = featureVector %*% weights + bias
            productVector
                     [,1]
                [1,] 0.8
            `;
        const indexArray: number[] = [0, 1];
        const weights: number[] = [0.1, 0.2];
        const weightBias: number = 0.5;
        const dotProduct: number =
            MathematicsHelperObject.dotProductSparseIndexes(
                indexArray,
                weights,
                weightBias);
        assert.ok(
            Utility.almostEqual(dotProduct, 0.8),
            `dotProduct=${dotProduct}`);
    });
    it("Test.1002 dotProductDenseValues()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            featureVector = c(0.5, 0.5)
            weights = c(0.1, 0.2)
            bias = 0.5
            productVector = featureVector %*% weights + bias
            productVector
                     [,1]
                [1,] 0.65
            `;
        const valueArray: number[] = [0.5, 0.5];
        const weights: number[] = [0.1, 0.2];
        const weightBias: number = 0.5;
        const dotProduct: number =
            MathematicsHelperObject.dotProductDenseValues(
                valueArray,
                weights,
                weightBias);
        assert.ok(
            Utility.almostEqual(dotProduct, 0.65),
            `dotProduct=${dotProduct}`);
    });

    it("Test.1100 matrixDenseL1l2RegularizedSparseTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixDenseL1l2RegularizedSparseTo(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.1101 matrixDenseL1l2RegularizedDenseTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixDenseL1l2RegularizedDenseTo(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.1200 vectorDenseL1l2RegularizedSparseTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorDenseL1l2RegularizedSparseTo(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.1201 vectorDenseL1l2RegularizedDenseTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorDenseL1l2RegularizedDenseTo(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.1300 matrixDenseAddConstantTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray = valueArray + constant
            valueArray
                     [,1] [,2]
                [1,] 0.11 0.21
                [2,] 0.31 0.41
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 0.01;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseAddConstantTo(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.11),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.21),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.31),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.41),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1301 matrixDenseMultiplyConstantTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray = valueArray * constant
            valueArray
                      [,1]  [,2]
                [1,] 0.001 0.002
                [2,] 0.003 0.004
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 0.01;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseMultiplyConstantTo(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.001),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.002),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.003),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.004),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1302 matrixDenseSubtractConstantFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray = valueArray - constant
            valueArray
                     [,1] [,2]
                [1,] 0.09 0.19
                [2,] 0.29 0.39
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 0.01;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseSubtractConstantFrom(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.09),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.19),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.29),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.39),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1303 matrixDenseDivideConstantFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray = valueArray / constant
            valueArray
                     [,1] [,2]
                [1,]   10   20
                [2,]   30   40
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 0.01;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseDivideConstantFrom(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 10),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 20),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 30),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 40),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });

    it("Test.1400 matrixDenseAddTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray0 = valueArray0 + valueArray1
            valueArray0
                     [,1] [,2]
                [1,]  0.2  0.4
                [2,]  0.6  0.8
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseAddTo(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.2),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.4),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.6),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.8),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1401 matrixDenseMultiplyTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray0 = valueArray0 * valueArray1
            valueArray0
                     [,1] [,2]
                [1,] 0.01 0.04
                [2,] 0.09 0.16
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseMultiplyTo(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.01),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.04),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.09),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.16),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1402 matrixDenseSubtractFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray0 = valueArray0 - valueArray1
            valueArray0
                     [,1] [,2]
                [1,]    0    0
                [2,]    0    0
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseSubtractFrom(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1403 matrixDenseDivideFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray0 = valueArray0 / valueArray1
            valueArray0
                     [,1] [,2]
                [1,]    1    1
                [2,]    1    1
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseDivideFrom(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 1),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 1),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 1),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 1),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });

    it("Test.1500 matrixDenseAddScaledTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            constant = 2
            valueArray0 = valueArray0 + valueArray1 * 2
            valueArray0
                     [,1] [,2]
                [1,]  0.3  0.6
                [2,]  0.9  1.2
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 2;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseAddScaledTo(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.3),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.6),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.9),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 1.2),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1501 matrixDenseMultiplyScaledTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            constant = 2
            valueArray0 = valueArray0 * valueArray1 * 2
            valueArray0
                     [,1] [,2]
                [1,] 0.02 0.08
                [2,] 0.18 0.32
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 2;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseMultiplyScaledTo(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.02),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.08),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.18),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.32),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1502 matrixDenseSubtractScaledFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            constant = 2
            valueArray0 = valueArray0 - valueArray1 * 2
            valueArray0
                     [,1] [,2]
                [1,] -0.1 -0.2
                [2,] -0.3 -0.4
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 2;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseSubtractScaledFrom(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], -0.1),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], -0.2),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], -0.3),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], -0.4),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1503 matrixDenseDivideScaledFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray0 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            valueArray1 = matrix(c(0.1, 0.2, 0.3, 0.4), nrow=2, byrow=TRUE)
            constant = 2
            valueArray0 = valueArray0 / (valueArray1 * 2)
            valueArray0
                     [,1] [,2]
                [1,]  0.5  0.5
                [2,]  0.5  0.5
            `;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const constant: number = 2;
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixDenseDivideScaledFrom(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][0], 0.5),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0][1], 0.5),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][0], 0.5),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1][1], 0.5),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });

    it("Test.1600 vectorDenseAddConstantTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray + constant
            valueArray
                [1] 0.11 0.21 0.31 0.41
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseAddConstantTo(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.11),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.21),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.31),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.41),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1601 vectorDenseMultiplyConstantTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray * constant
            valueArray
                [1] 0.001 0.002 0.003 0.004
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseMultiplyConstantTo(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.001),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.002),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.003),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.004),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1602 vectorDenseSubtractConstantFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray - constant
            valueArray
                [1] 0.09 0.19 0.29 0.39
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseSubtractConstantFrom(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.09),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.19),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.29),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.39),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1603 vectorDenseDivideConstantFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray / constant
            valueArray
                [1] 10 20 30 40
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseDivideConstantFrom(
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 10),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 20),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 30),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 40),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });

    it("Test.1700 vectorDenseAddTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray + valueArray
            valueArray
                [1] 0.2 0.4 0.6 0.8
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseAddTo(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.2),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.4),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.6),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.8),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1701 vectorDenseMultiplyTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray * valueArray
            valueArray
                [1] 0.01 0.04 0.09 0.16
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseMultiplyTo(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.01),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.04),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.09),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.16),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1702 vectorDenseSubtractFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray - valueArray
            valueArray
                [1] 0 0 0 0
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseSubtractFrom(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1703 vectorDenseDivideFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray / valueArray
            valueArray
                [1] 1 1 1 1
            `;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const constant: number = 0.01;
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseDivideFrom(
                valueArray,
                valueArray);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 1),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 1),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 1),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 1),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });

    it("Test.1800 vectorDenseAddScaledTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray + (valueArray * constant)
            valueArray
                [1] 0.101 0.202 0.303 0.404
            `;
        const constant: number = 0.01;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseAddScaledTo(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.101),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.202),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.303),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.404),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1801 vectorDenseMultiplyScaledTo()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray * (valueArray * constant)
            valueArray
                [1] 0.0001 0.0004 0.0009 0.0016
            `;
        const constant: number = 0.01;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseMultiplyScaledTo(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.0001),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.0004),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.0009),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.0016),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1802 vectorDenseSubtractScaledFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray - (valueArray * constant)
            valueArray
                [1] 0.099 0.198 0.297 0.396
            `;
        const constant: number = 0.01;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseSubtractScaledFrom(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 0.099),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 0.198),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 0.297),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 0.396),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.1803 vectorDenseDivideScaledFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            constant = 0.01;
            valueArray = c(0.1, 0.2, 0.3, 0.4)
            valueArray = valueArray / (valueArray * constant)
            valueArray
                [1] 100 100 100 100
            `;
        const constant: number = 0.01;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorDenseDivideScaledFrom(
                valueArray,
                valueArray,
                constant);
        assert.ok(
            Utility.almostEqual(valueArrayResult[0], 100),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[1], 100),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[2], 100),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            Utility.almostEqual(valueArrayResult[3], 100),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });

    it("Test.1900 matrixNewLikeWithRandomCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewLikeWithRandomCells(
                valueArray);
        assert.ok(
            ((valueArrayResult[0][0] >= 0) && (valueArrayResult[0][0] <= 1)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] >= 0) && (valueArrayResult[0][1] <= 1)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] >= 0) && (valueArrayResult[1][0] <= 1)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] >= 0) && (valueArrayResult[1][1] <= 1)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1901 matrixNewLikeWithRandomCellsScaled()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewLikeWithRandomCellsScaled(
                valueArray,
                scale);
        assert.ok(
            ((valueArrayResult[0][0] >= 0) && (valueArrayResult[0][0] <= scale)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] >= 0) && (valueArrayResult[0][1] <= scale)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] >= 0) && (valueArrayResult[1][0] <= scale)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] >= 0) && (valueArrayResult[1][1] <= scale)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1902 matrixNewLikeWithZeroCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewLikeWithZeroCells(
                valueArray);
        assert.ok(
            ((valueArrayResult[0][0] === 0)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === 0)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === 0)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === 0)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1903 matrixNewLikeWithConstantCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const constant: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewLikeWithConstantCells(
                valueArray,
                constant);
        assert.ok(
            ((valueArrayResult[0][0] === constant)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === constant)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === constant)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === constant)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1904 matrixNewLikeWithScaledCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewLikeWithScaledCells(
                valueArray,
                scale);
        assert.ok(
            ((valueArrayResult[0][0] === 0.2)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === 0.4)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === 0.6)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === 0.8)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.1905 matrixNewLikeWithL1l2RegularizedSparseCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixNewLikeWithL1l2RegularizedSparseCells(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.1906 matrixNewLikeWithL1l2RegularizedDenseCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixNewLikeWithL1l2RegularizedDenseCells(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.2000 vectorNewLikeWithRandomElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewLikeWithRandomElements(
                valueArray);
        assert.ok(
            ((valueArrayResult[0] >= 0) && (valueArrayResult[0] <= 1)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] >= 0) && (valueArrayResult[1] <= 1)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] >= 0) && (valueArrayResult[2] <= 1)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] >= 0) && (valueArrayResult[3] <= 1)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2001 vectorNewLikeWithRandomElementsScaled()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewLikeWithRandomElementsScaled(
                valueArray,
            scale);
        assert.ok(
            ((valueArrayResult[0] >= 0) && (valueArrayResult[0] <= scale)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] >= 0) && (valueArrayResult[1] <= scale)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] >= 0) && (valueArrayResult[2] <= scale)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] >= 0) && (valueArrayResult[3] <= scale)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2002 vectorNewLikeWithZeroElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewLikeWithZeroElements(
                valueArray);
        assert.ok(
            ((valueArrayResult[0] === 0)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === 0)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === 0)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === 0)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2003 vectorNewLikeWithConstantElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const constant: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewLikeWithConstantElements(
                valueArray,
                constant);
        assert.ok(
            ((valueArrayResult[0] === constant)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === constant)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === constant)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === constant)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2004 vectorNewLikeWithScaledElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewLikeWithScaledElements(
                valueArray,
                scale);
        assert.ok(
            ((valueArrayResult[0] === 0.2)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === 0.4)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === 0.6)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === 0.8)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2005 vectorNewLikeWithL1l2RegularizedSparseElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorNewLikeWithL1l2RegularizedSparseElements(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.2006 vectorNewLikeWithL1l2RegularizedDenseElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorNewLikeWithL1l2RegularizedDenseElements(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.2100 matrixNewWithRandomCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewWithRandomCells(
                valueArray.length,
                valueArray[0].length);
        assert.ok(
            ((valueArrayResult[0][0] >= 0) && (valueArrayResult[0][0] <= 1)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] >= 0) && (valueArrayResult[0][1] <= 1)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] >= 0) && (valueArrayResult[1][0] <= 1)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] >= 0) && (valueArrayResult[1][1] <= 1)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.2101 matrixNewWithRandomCellsScaled()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewWithRandomCellsScaled(
                valueArray.length,
                valueArray[0].length,
                scale);
        assert.ok(
            ((valueArrayResult[0][0] >= 0) && (valueArrayResult[0][0] <= scale)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] >= 0) && (valueArrayResult[0][1] <= scale)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] >= 0) && (valueArrayResult[1][0] <= scale)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] >= 0) && (valueArrayResult[1][1] <= scale)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.2102 matrixNewWithZeroCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewWithZeroCells(
                valueArray.length,
                valueArray[0].length);
        assert.ok(
            ((valueArrayResult[0][0] === 0)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === 0)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === 0)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === 0)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.2103 matrixNewWithConstantCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const constant: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewWithConstantCells(
                valueArray.length,
                valueArray[0].length,
                constant);
        assert.ok(
            ((valueArrayResult[0][0] === constant)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === constant)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === constant)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === constant)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.2104 matrixNewWithScaledCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[][] = [[0.1, 0.2], [0.3, 0.4]];
        const valueArrayResult: number[][] =
            MathematicsHelperObject.matrixNewWithScaledCells(
                valueArray,
                scale);
        assert.ok(
            ((valueArrayResult[0][0] === 0.2)),
            `valueArrayResult[0][0]=${valueArrayResult[0][0]}`);
        assert.ok(
            ((valueArrayResult[0][1] === 0.4)),
            `valueArrayResult[0][1]=${valueArrayResult[0][1]}`);
        assert.ok(
            ((valueArrayResult[1][0] === 0.6)),
            `valueArrayResult[1][0]=${valueArrayResult[1][0]}`);
        assert.ok(
            ((valueArrayResult[1][1] === 0.8)),
            `valueArrayResult[1][1]=${valueArrayResult[1][1]}`);
    });
    it("Test.2105 matrixNewWithL1l2RegularizedSparseCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixNewWithL1l2RegularizedSparseCells(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.2106 matrixNewWithL1l2RegularizedDenseCells()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = matrix(c(0.1, -0.2, 0.3, -0.4), nrow=2, byrow=TRUE);
            valueArrayL1Regularized = apply(valueArray, 1:2, getL1Regularized);
            valueArrayL2Regularized = apply(valueArray, 1:2, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                      [,1]   [,2]
                [1,] 0.089 -0.188
                [2,] 0.287 -0.386
            `;
        const valueArray: number[][] = [[0.1, -0.2], [0.3, -0.4]];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[][] =
            MathematicsHelperObject.matrixNewWithL1l2RegularizedDenseCells(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0][1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][0], 0.287),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1][1], -0.386),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.2200 vectorNewWithRandomElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewWithRandomElements(
                valueArray.length);
        assert.ok(
            ((valueArrayResult[0] >= 0) && (valueArrayResult[0] <= 1)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] >= 0) && (valueArrayResult[1] <= 1)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] >= 0) && (valueArrayResult[2] <= 1)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] >= 0) && (valueArrayResult[3] <= 1)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2201 vectorNewWithRandomElementsScaled()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewWithRandomElementsScaled(
                valueArray.length,
                scale);
        assert.ok(
            ((valueArrayResult[0] >= 0) && (valueArrayResult[0] <= scale)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] >= 0) && (valueArrayResult[1] <= scale)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] >= 0) && (valueArrayResult[2] <= scale)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] >= 0) && (valueArrayResult[3] <= scale)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2202 vectorNewWithZeroElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewWithZeroElements(
                valueArray.length);
        assert.ok(
            ((valueArrayResult[0] === 0)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === 0)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === 0)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === 0)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2203 vectorNewWithConstantElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const constant: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewWithConstantElements(
                valueArray.length,
                constant);
        assert.ok(
            ((valueArrayResult[0] === constant)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === constant)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === constant)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === constant)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2204 vectorNewWithScaledElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const scale: number = 2;
        const valueArray: number[] = [0.1, 0.2, 0.3, 0.4];
        const valueArrayResult: number[] =
            MathematicsHelperObject.vectorNewWithScaledElements(
                valueArray,
                scale);
        assert.ok(
            ((valueArrayResult[0] === 0.2)),
            `valueArrayResult[0]=${valueArrayResult[0]}`);
        assert.ok(
            ((valueArrayResult[1] === 0.4)),
            `valueArrayResult[1]=${valueArrayResult[1]}`);
        assert.ok(
            ((valueArrayResult[2] === 0.6)),
            `valueArrayResult[2]=${valueArrayResult[2]}`);
        assert.ok(
            ((valueArrayResult[3] === 0.8)),
            `valueArrayResult[3]=${valueArrayResult[3]}`);
    });
    it("Test.2205 vectorNewWithL1l2RegularizedSparseElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorNewWithL1l2RegularizedSparseElements(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });
    it("Test.2206 vectorNewWithL1l2RegularizedDenseElements()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const rTestCode: string = `
            l1RegularizationValue = 0.01;
            l2RegularizationValue = 0.01;
            getL1RegularizedGeneric <- function(weight, l1Regularization) {
                if (weight > 0) { return (l1Regularization); }
                if (weight < 0) { return (-l1Regularization); }
                return (0);
            }
            getL1Regularized <- function(weight) {
                getL1RegularizedGeneric(weight, l1RegularizationValue)
            }
            getL2RegularizedGeneric<- function(weight, l2Regularization) {
                return (weight * l2Regularization);
            }
            getL2Regularized <- function(weight) {
                getL2RegularizedGeneric(weight, l2RegularizationValue)
            }
            valueArray = c(0.1, -0.2);
            valueArrayL1Regularized = sapply(valueArray, getL1Regularized);
            valueArrayL2Regularized = sapply(valueArray, getL2Regularized);
            valueArrayRegularized = valueArrayL1Regularized + valueArrayL2Regularized
            valueArrayRegularized = valueArray - valueArrayRegularized
            valueArrayRegularized
                [1]  0.089 -0.188
            `;
        const valueArray: number[] = [0.1, -0.2];
        const l1Regularization: number = 0.01;
        const l2Regularization: number = 0.01;
        const valueArrayRegularized: number[] =
            MathematicsHelperObject.vectorNewWithL1l2RegularizedDenseElements(
                valueArray,
                l1Regularization,
                l2Regularization);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[0], 0.089),
            `valueArrayRegularized=${valueArrayRegularized}`);
        assert.ok(
            Utility.almostEqual(valueArrayRegularized[1], -0.188),
            `valueArrayRegularized=${valueArrayRegularized}`);
    });

    it("Test.2300 getIndexOnFirstMaxEntryOnArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: Int32Array = new Int32Array([1, 4, 5, 3, 5, 3, 2]);
        const maxResult: { "indexMax": number, "max": number } =
            MathematicsHelperObject.getIndexOnFirstMaxEntryOnArray(valueArray);
        assert.ok(
            maxResult.indexMax === 2,
            `maxResult.indexMax=${maxResult.indexMax}`);
        assert.ok(
            maxResult.max === 5,
            `maxResult.max=${maxResult.max}`);
    });
    it("Test.2301 getIndexOnLastMaxEntryOnArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: Int32Array = new Int32Array([1, 4, 5, 3, 5, 3, 2]);
        const maxResult: { "indexMax": number, "max": number } =
            MathematicsHelperObject.getIndexOnLastMaxEntryOnArray(valueArray);
        assert.ok(
            maxResult.indexMax === 4,
            `maxResult.indexMax=${maxResult.indexMax}`);
        assert.ok(
            maxResult.max === 5,
            `maxResult.max=${maxResult.max}`);
    });
    it("Test.2302 getIndexOnFirstMaxEntry()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [1, 4, 5, 3, 5, 3, 2];
        const maxResult: { "indexMax": number, "max": number } =
            MathematicsHelperObject.getIndexOnFirstMaxEntry(valueArray);
        assert.ok(
            maxResult.indexMax === 2,
            `maxResult.indexMax=${maxResult.indexMax}`);
        assert.ok(
            maxResult.max === 5,
            `maxResult.max=${maxResult.max}`);
    });
    it("Test.2303 getIndexOnLastMaxEntry()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [1, 4, 5, 3, 5, 3, 2];
        const maxResult: { "indexMax": number, "max": number } =
            MathematicsHelperObject.getIndexOnLastMaxEntry(valueArray);
        assert.ok(
            maxResult.indexMax === 4,
            `maxResult.indexMax=${maxResult.indexMax}`);
        assert.ok(
            maxResult.max === 5,
            `maxResult.max=${maxResult.max}`);
    });

    it("Test.2400 getIndexOnFirstMinEntryOnArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: Int32Array = new Int32Array([6, 4, 5, 3, 5, 3, 6]);
        const minResult: { "indexMin": number, "min": number } =
            MathematicsHelperObject.getIndexOnFirstMinEntryOnArray(valueArray);
        assert.ok(
            minResult.indexMin === 3,
            `minResult.indexMin=${minResult.indexMin}`);
        assert.ok(
            minResult.min === 3,
            `minResult.min=${minResult.min}`);
    });
    it("Test.2401 getIndexOnLastMinEntryOnArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: Int32Array = new Int32Array([6, 4, 5, 3, 5, 3, 6]);
        const minResult: { "indexMin": number, "min": number } =
            MathematicsHelperObject.getIndexOnLastMinEntryOnArray(valueArray);
        assert.ok(
            minResult.indexMin === 5,
            `minResult.indexMin=${minResult.indexMin}`);
        assert.ok(
            minResult.min === 3,
            `minResult.min=${minResult.min}`);
    });
    it("Test.2402 getIndexOnFirstMinEntry()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [6, 4, 5, 3, 5, 3, 6];
        const minResult: { "indexMin": number, "min": number } =
            MathematicsHelperObject.getIndexOnFirstMinEntry(valueArray);
        assert.ok(
            minResult.indexMin === 3,
            `minResult.indexMin=${minResult.indexMin}`);
        assert.ok(
            minResult.min === 3,
            `minResult.min=${minResult.min}`);
    });
    it("Test.2403 getIndexOnLastMinEntry()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const valueArray: number[] = [6, 4, 5, 3, 5, 3, 6];
        const minResult: { "indexMin": number, "min": number } =
            MathematicsHelperObject.getIndexOnLastMinEntry(valueArray);
        assert.ok(
            minResult.indexMin === 5,
            `minResult.indexMin=${minResult.indexMin}`);
        assert.ok(
            minResult.min === 3,
            `minResult.min=${minResult.min}`);
    });

    it("Test.2500 safeDivide()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const numerator: number = 0;
        const denominator: number = 0;
        const result: number =
            MathematicsHelperObject.safeDivide(numerator, denominator);
        assert.ok(
            Utility.almostEqual(result, 0),
            `result=${result}`);
    });
    it("Test.2501 safeDivide()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const numerator: number = 0;
        const denominator: number = 1;
        const result: number =
            MathematicsHelperObject.safeDivide(numerator, denominator);
        assert.ok(
            Utility.almostEqual(result, 0),
            `result=${result}`);
    });
    it("Test.2502 safeDivide()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const numerator: number = 1;
        const denominator: number = 1;
        const result: number =
            MathematicsHelperObject.safeDivide(numerator, denominator);
        assert.ok(
            Utility.almostEqual(result, 1),
            `result=${result}`);
    });
    it("Test.2503 safeLog()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = 0;
        const result: number =
            MathematicsHelperObject.safeLog(value);
        assert.ok(
            Utility.almostEqual(result, Number.MIN_VALUE),
            `result=${result}`);
    });
    it("Test.2504 safeLog()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = -1;
        const result: number =
            MathematicsHelperObject.safeLog(value);
        assert.ok(
            Number.isNaN(result),
            `result=${result}`);
    });
    it("Test.2505 safeLog()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = 1;
        const result: number =
            MathematicsHelperObject.safeLog(value);
        assert.ok(
            result === 0,
            `result=${result}`);
    });

    it("Test.2600 clipValue()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = 0;
        const result: number =
            MathematicsHelperObject.clipValue(value);
        assert.ok(
            Utility.almostEqual(result, MathematicsHelper.epsilon),
            `result=${result}`);
    });
    it("Test.2601 clipValue()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = 1;
        const result: number =
            MathematicsHelperObject.clipValue(value);
        assert.ok(
            Utility.almostEqual(result, MathematicsHelper.epsilonUp),
            `result=${result}`);
    });
    it("Test.2602 clipValue()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const value: number = 0.5;
        const result: number =
            MathematicsHelperObject.clipValue(value);
        assert.ok(
            Utility.almostEqual(result, value),
            `result=${result}`);
    });
});
