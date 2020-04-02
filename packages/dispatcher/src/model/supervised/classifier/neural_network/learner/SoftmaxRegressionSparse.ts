/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MathematicsHelper } from "../../../../../mathematics/mathematics_helper/MathematicsHelper";

import { Utility } from "../../../../../utility/Utility";

export class SoftmaxRegressionSparse {

    protected modelWeights: number[][] = [];
    protected modelBiases: number[] = [];

    protected l1Regularization: number = 0.01;
    protected l2Regularization: number = 0.01;

    protected lossEarlyStopRatio: number = 0.01;

    constructor(
        numberInputUnits: number = -1,
        numberOutputUnits: number = 2,
        l1Regularization: number = 0.01,
        l2Regularization: number = 0.01,
        lossEarlyStopRatio: number = 0.01) {
        if ((numberOutputUnits > 0) && (numberInputUnits > 0)) {
            this.modelWeights =
                new Array<number[]>(numberOutputUnits);
            this.modelBiases =
                MathematicsHelper.vectorNewWithConstantElements(numberOutputUnits, 0);
            for (let i = 0; i < numberOutputUnits; i++) {
                this.modelWeights[i] =
                    MathematicsHelper.vectorNewWithConstantElements(numberInputUnits, 0);
            }
        }
        this.l1Regularization = l1Regularization;
        this.l2Regularization = l2Regularization;
        this.lossEarlyStopRatio = lossEarlyStopRatio;
    }

    public getModelWeights(): number[][] {
        return this.modelWeights;
    }
    public getModelBiases(): number[] {
        return this.modelBiases;
    }

    public getNumberInputUnits(): number {
        if (this.modelWeights && (this.modelWeights.length > 0)) {
            return this.modelWeights[0].length;
        }
        return 0;
    }
    public getNumberOutputUnits(): number {
        if (this.modelWeights) {
            return this.modelWeights.length;
        }
        return 0;
    }

    public getL1Regularization(): number {
        return this.l1Regularization;
    }
    public getL2Regularization(): number {
        return this.l2Regularization;
    }

    public getLossEarlyStopRatio(): number {
        return this.lossEarlyStopRatio;
    }

    public fit(
        featureVectorSparseIndexArrays: number[][],
        groundTruthPositiveLabelIndexes: number[],
        epochs: number = 100,
        learningRate: number = 0.1,
        toCalculateOverallLossAfterEpoch: boolean = true,
        toCalculateOverallLossInGradientUpdate: boolean = false): {
            "logLossVectorAfterEpoch": number[],
            "logLossVectorInGradientUpdate": number[],
        } {
        const numberInstances: number = featureVectorSparseIndexArrays.length;
        const logLossVectorAfterEpoch: number[] = new Array<number>();
        const logLossVectorInGradientUpdate: number[] = new Array<number>();
        for (let epoch: number = 0; epoch < epochs; epoch++) {
            const softmaxVectors: number[][] = MathematicsHelper.softmaxLogLossGradientUpdate(
                groundTruthPositiveLabelIndexes,
                featureVectorSparseIndexArrays,
                this.modelWeights,
                this.modelBiases,
                learningRate,
                this.l1Regularization,
                this.l2Regularization);
            if (toCalculateOverallLossInGradientUpdate) {
                const logLossInGradientUpdate: number = MathematicsHelper.softmaxLogLoss(
                    softmaxVectors,
                    groundTruthPositiveLabelIndexes);
                Utility.debuggingLog(
                    `A-fit-epoch=${epoch}/${epochs}` +
                    `, numberInstances=${numberInstances}` +
                    `, logLossInGradientUpdate=${logLossInGradientUpdate}`);
                logLossVectorInGradientUpdate.push(logLossInGradientUpdate);
            }
            if (toCalculateOverallLossAfterEpoch) {
                // -----------------------------------------------------------
                const softmaxVectorsAfterGradientUpdate: number[][] =
                    MathematicsHelper.matrixVectorProductSoftmaxSparseIndexes(
                    featureVectorSparseIndexArrays,
                    this.modelWeights,
                    this.modelBiases);
                const logLossAfterEpoch: number = MathematicsHelper.softmaxLogLoss(
                    softmaxVectorsAfterGradientUpdate,
                    groundTruthPositiveLabelIndexes);
                Utility.debuggingLog(
                    `B-fit-epoch=${epoch}/${epochs}` +
                    `, numberInstances=${numberInstances}` +
                    `, logLossAfterEpoch=${logLossAfterEpoch}`);
                logLossVectorAfterEpoch.push(logLossAfterEpoch);
                // -----------------------------------------------------------
                if (this.lossEarlyStopRatio > 0) {
                    if (logLossVectorAfterEpoch.length <= 1) {
                        continue;
                    }
                    const previousLogLossAfterEpoch: number =
                        logLossVectorAfterEpoch[logLossVectorAfterEpoch.length - 2];
                    const logLossRatio: number =
                        (logLossAfterEpoch - previousLogLossAfterEpoch) / previousLogLossAfterEpoch;
                    if (Math.abs(logLossRatio) < this.lossEarlyStopRatio) {
                        Utility.debuggingLog(
                            `F-fit-epoch=${epoch}/${epochs}` +
                            `, numberInstances=${numberInstances}` +
                            `, logLossAfterEpoch=${logLossAfterEpoch}` +
                            `, logLossRatio=${logLossRatio}` +
                            `, this.lossEarlyStopRatio=${this.lossEarlyStopRatio}`);
                        break;
                    }
                }
                // -----------------------------------------------------------
            }
        }
        return { logLossVectorAfterEpoch, logLossVectorInGradientUpdate };
    }

    public fitMinibatching(
        featureVectorSparseIndexArrays: number[][],
        groundTruthPositiveLabelIndexes: number[],
        epochs: number = 100,
        miniBatchSize: number = 100,
        learningRate: number = 0.1,
        toCalculateOverallLossAfterEpoch: boolean = true,
        toCalculateOverallLossAfterGradientUpdate: boolean = false,
        toCalculateOverallLossInGradientUpdate: boolean = false): {
            "logLossVectorAfterEpoch": number[],
            "logLossVectorsAfterGradientUpdate": number[][],
            "logLossVectorsInGradientUpdate": number[][],
        } {
        const numberInstances: number = featureVectorSparseIndexArrays.length;
        Utility.debuggingLog(
            `epochs=${epochs}` +
            `, miniBatchSize=${miniBatchSize}` +
            `, numberInstances=${numberInstances}`);
        const logLossVectorAfterEpoch: number[] = new Array<number>();
        const logLossVectorsAfterGradientUpdate: number[][] = new Array<number[]>();
        const logLossVectorsInGradientUpdate: number[][] = new Array<number[]>();
        for (let epoch: number = 0; epoch < epochs; epoch++) {
            let miniBatchIndexBegin: number = 0;
            const logLossVectorAfterGradientUpdate: number[] = new Array<number>();
            const logLossVectorInGradientUpdate: number[] = new Array<number>();
            while (true) {
                if (miniBatchIndexBegin >= numberInstances) {
                    // Utility.debuggingLog(
                    //     `G-epoch=${epoch}/${epochs}` +
                    //     `, numberInstances=${numberInstances}` +
                    //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                    //     `, numberInstances=${numberInstances}`);
                    break;
                }
                // Utility.debuggingLog(
                //     `-1-epoch=${epoch}/${epochs}` +
                //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                //     `, miniBatchSize=${miniBatchSize}` +
                //     `, numberInstances=${numberInstances}`);
                let miniBatchIndexEnd: number =
                    miniBatchIndexBegin + miniBatchSize;
                // Utility.debuggingLog(
                //     `0-epoch=${epoch}/${epochs}` +
                //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                //     `, miniBatchIndexEnd=${miniBatchIndexEnd}` +
                //     `, miniBatchSize=${miniBatchSize}` +
                //     `, numberInstances=${numberInstances}`);
                if (miniBatchIndexEnd > numberInstances) {
                    miniBatchIndexEnd = numberInstances;
                }
                // Utility.debuggingLog(
                //     `A-epoch=${epoch}/${epochs}` +
                //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                //     `, miniBatchIndexEnd=${miniBatchIndexEnd}` +
                //     `, miniBatchSize=${miniBatchSize}` +
                //     `, numberInstances=${numberInstances}`);
                const softmaxVectors: number[][] = MathematicsHelper.softmaxLogLossGradientUpdate(
                    groundTruthPositiveLabelIndexes,
                    featureVectorSparseIndexArrays,
                    this.modelWeights,
                    this.modelBiases,
                    learningRate,
                    this.l1Regularization,
                    this.l2Regularization,
                    miniBatchIndexBegin,
                    miniBatchIndexEnd);
                if (toCalculateOverallLossInGradientUpdate) {
                    const logLossInGradientUpdate: number = MathematicsHelper.softmaxLogLoss(
                        softmaxVectors,
                        groundTruthPositiveLabelIndexes);
                    // Utility.debuggingLog(
                    //     `B-epoch=${epoch}/${epochs}` +
                    //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                    //     `, miniBatchIndexEnd=${miniBatchIndexEnd}` +
                    //     `, miniBatchSize=${miniBatchSize}` +
                    //     `, numberInstances=${numberInstances}` +
                    //     `, logLossInGradientUpdate=${logLossInGradientUpdate}`);
                    logLossVectorInGradientUpdate.push(logLossInGradientUpdate);
                }
                if (toCalculateOverallLossAfterGradientUpdate) {
                    const softmaxVectorsAfterGradientUpdate: number[][] =
                        MathematicsHelper.matrixVectorProductSoftmaxSparseIndexes(
                            featureVectorSparseIndexArrays,
                            this.modelWeights,
                            this.modelBiases);
                    const logLossAfterGradientUpdate: number = MathematicsHelper.softmaxLogLoss(
                        softmaxVectorsAfterGradientUpdate,
                        groundTruthPositiveLabelIndexes);
                    // Utility.debuggingLog(
                    //     `C-epoch=${epoch}/${epochs}` +
                    //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                    //     `, miniBatchIndexEnd=${miniBatchIndexEnd}` +
                    //     `, miniBatchSize=${miniBatchSize}` +
                    //     `, numberInstances=${numberInstances}` +
                    //     `, logLossAfterGradientUpdate=${logLossAfterGradientUpdate}`);
                    logLossVectorAfterGradientUpdate.push(logLossAfterGradientUpdate);
                }
                // Utility.debuggingLog(
                //     `D-epoch=${epoch}/${epochs}` +
                //     `, miniBatchIndexBegin=${miniBatchIndexBegin}` +
                //     `, miniBatchIndexEnd=${miniBatchIndexEnd}` +
                //     `, miniBatchSize=${miniBatchSize}` +
                //     `, numberInstances=${numberInstances}`);
                miniBatchIndexBegin = miniBatchIndexEnd;
            }
            if (toCalculateOverallLossInGradientUpdate) {
                logLossVectorsInGradientUpdate.push(
                    logLossVectorInGradientUpdate);
            }
            if (toCalculateOverallLossAfterGradientUpdate) {
                logLossVectorsAfterGradientUpdate.push(
                    logLossVectorAfterGradientUpdate);
            }
            if (toCalculateOverallLossAfterEpoch) {
                // -----------------------------------------------------------
                const softmaxVectorsAfterGradientUpdate: number[][] =
                    MathematicsHelper.matrixVectorProductSoftmaxSparseIndexes(
                        featureVectorSparseIndexArrays,
                        this.modelWeights,
                        this.modelBiases);
                const logLossAfterEpoch: number = MathematicsHelper.softmaxLogLoss(
                    softmaxVectorsAfterGradientUpdate,
                    groundTruthPositiveLabelIndexes);
                Utility.debuggingLog(
                    `E-epoch=${epoch}/${epochs}` +
                    `, numberInstances=${numberInstances}` +
                    `, logLossAfterEpoch=${logLossAfterEpoch}`);
                logLossVectorAfterEpoch.push(logLossAfterEpoch);
                // -----------------------------------------------------------
                if (this.lossEarlyStopRatio > 0) {
                    if (logLossVectorAfterEpoch.length <= 1) {
                        continue;
                    }
                    const previousLogLossAfterEpoch: number =
                        logLossVectorAfterEpoch[logLossVectorAfterEpoch.length - 2];
                    const logLossRatio: number =
                        (logLossAfterEpoch - previousLogLossAfterEpoch) / previousLogLossAfterEpoch;
                    if (Math.abs(logLossRatio) < this.lossEarlyStopRatio) {
                        Utility.debuggingLog(
                            `F-epoch=${epoch}/${epochs}` +
                            `, numberInstances=${numberInstances}` +
                            `, logLossAfterEpoch=${logLossAfterEpoch}` +
                            `, logLossRatio=${logLossRatio}` +
                            `, this.lossEarlyStopRatio=${this.lossEarlyStopRatio}`);
                        break;
                    }
                }
                // -----------------------------------------------------------
            }
        }
        return { logLossVectorAfterEpoch, logLossVectorsAfterGradientUpdate, logLossVectorsInGradientUpdate };
    }

    public predict(featureVectorSparseIndexArrays: number[][]): number[][] {
        const softmaxVectors: number[][] = MathematicsHelper.matrixVectorProductSoftmaxSparseIndexes(
            featureVectorSparseIndexArrays,
            this.modelWeights,
            this.modelBiases);
        return softmaxVectors;
    }

    public serializeToJsonString(
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        return JSON.stringify(this, replacer, space);
    }
    public deserializeFromJsonString(jsonString: string): void {
        const deserialized: SoftmaxRegressionSparse = JSON.parse(jsonString);
        this.modelWeights = deserialized.modelWeights;
        this.modelBiases = deserialized.modelBiases;
        this.l1Regularization = deserialized.l1Regularization;
        this.l2Regularization = deserialized.l2Regularization;
        this.lossEarlyStopRatio = deserialized.lossEarlyStopRatio;
    }
}
