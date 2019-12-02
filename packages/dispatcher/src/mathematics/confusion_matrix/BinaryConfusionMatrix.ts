/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MathematicsHelper } from "../mathematics_helper/MathematicsHelper";

// tslint:disable: max-line-length
export class BinaryConfusionMatrixMetrics {
    //
    // Initialize an BinaryConfusionMatrixMetrics object.
    //
    protected total: number;
    protected cell11: number;
    protected row1: number;
    protected column1: number;
    protected throwIfNotProper: boolean;
    protected row2: number;
    protected column2: number;
    protected cell12: number;
    protected cell21: number;
    protected cell22: number;
    protected expectedCell11: number;
    protected expectedCell12: number;
    protected expectedCell21: number;
    protected expectedCell22: number;
    protected isProper: boolean;
    protected ratioCell11: number;
    protected ratioRow1: number;
    protected ratioColumn1: number;
    protected ratioRow2: number;
    protected ratioColumn2: number;
    protected ratioCell12: number;
    protected ratioCell21: number;
    protected ratioCell22: number;

    protected potentialRow1: number;
    protected potentialRow2: number;

    constructor(
        total: number,
        cell11: number,
        row1: number,
        column1: number,
        potentialRow1: number = 0,
        potentialRow2: number = 0,
        throwIfNotProper: boolean = true) {
            //
            // A binary confusion matrix can be represented as a 2X2 table with
            // cells defined below:
            //
            //                            || Predicted Positive | Predicted Negative |
            // ----------------------------------------------------------------------------------
            // ----------------------------------------------------------------------------------
            //     Ground - True Positive || True Positive      | False Nagative     | Ground - True Positive
            // ----------------------------------------------------------------------------------
            //     Ground - True Negative || False Positive     | True Nagative      | Ground - True Negative
            // ----------------------------------------------------------------------------------
            //                            || Predicted Positive | Predicted Negative | Total
            //
            this.total = total;
            this.cell11 = cell11;
            this.row1 = row1;
            this.column1 = column1;
            this.throwIfNotProper = throwIfNotProper;
            this.row2 = this.total - this.row1;
            this.column2 = this.total - this.column1;
            this.cell12 = this.row1 - this.cell11;
            this.cell21 = this.column1 - this.cell11;
            this.cell22 = this.total - this.cell11 - this.cell12 - this.cell21;
            this.expectedCell11 = MathematicsHelper.safeDivide(this.row1 * this.column1, this.total);
            this.expectedCell12 = MathematicsHelper.safeDivide(this.row1 * this.column2, this.total);
            this.expectedCell21 = MathematicsHelper.safeDivide(this.row2 * this.column1, this.total);
            this.expectedCell22 = MathematicsHelper.safeDivide(this.row2 * this.column2, this.total);
            this.isProper = this.validate(this.throwIfNotProper);
            this.ratioCell11 = MathematicsHelper.safeDivide(this.cell11, this.total);
            this.ratioRow1 = MathematicsHelper.safeDivide(this.row1, this.total);
            this.ratioColumn1 = MathematicsHelper.safeDivide(this.column1, this.total);
            this.ratioRow2 = MathematicsHelper.safeDivide(this.row2, this.total);
            this.ratioColumn2 = MathematicsHelper.safeDivide(this.column2, this.total);
            this.ratioCell12 = MathematicsHelper.safeDivide(this.cell12, this.total);
            this.ratioCell21 = MathematicsHelper.safeDivide(this.cell21, this.total);
            this.ratioCell22 = MathematicsHelper.safeDivide(this.cell22, this.total);
            this.potentialRow1 = potentialRow1;
            this.potentialRow2 = potentialRow2;
        }

    public getTotal(): number {
        //
        // getTotal().
        //
        return this.total;
    }
    public getCell11(): number {
        //
        // getCell11().
        //
        return this.cell11;
    }
    public getRow1(): number {
        //
        // getRow1().
        //
        return this.row1;
    }
    public getColumn1(): number {
        //
        // getColumn1().
        //
        return this.column1;
    }
    public getRow2(): number {
        //
        // getRow2().
        //
        return this.row2;
    }
    public getColumn2(): number {
        //
        // getColumn2().
        //
        return this.column2;
    }
    public getCell12(): number {
        //
        // getCell12().
        //
        return this.cell12;
    }
    public getCell21(): number {
        //
        // getCell21().
        //
        return this.cell21;
    }
    public getCell22(): number {
        //
        // getCell22().
        //
        return this.cell22;
    }
    public getExpectedCell11(): number {
        //
        // getExpectedCell11().
        //
        return this.expectedCell11;
    }
    public getExpectedCell12(): number {
        //
        // getExpectedCell12().
        //
        return this.expectedCell12;
    }
    public getExpectedCell21(): number {
        //
        // getExpectedCell21().
        //
        return this.expectedCell21;
    }
    public getExpectedCell22(): number {
        //
        // getExpectedCell22().
        //
        return this.expectedCell22;
    }
    public getIsProper(): boolean {
        //
        // getIsProper().
        //
        return this.isProper;
    }
    public getRatioCell11(): number {
        //
        // getRatioCell11().
        //
        return this.ratioCell11;
    }
    public getRatioRow1(): number {
        //
        // getRatioRow1().
        //
        return this.ratioRow1;
    }
    public getRatioColumn1(): number {
        //
        // getRatioColumn1().
        //
        return this.ratioColumn1;
    }
    public getRatioRow2(): number {
        //
        // getRatioRow2().
        //
        return this.ratioRow2;
    }
    public getRatioColumn2(): number {
        //
        // getRatioColumn2().
        //
        return this.ratioColumn2;
    }
    public getRatioCell12(): number {
        //
        // getRatioCell12().
        //
        return this.ratioCell12;
    }
    public getRatioCell21(): number {
        //
        // getRatioCell21().
        //
        return this.ratioCell21;
    }
    public getRatioCell22(): number {
        //
        // getRatioCell22().
        //
        return this.ratioCell22;
    }

    public getPotentialRow1(): number {
        //
        // getPotentialRow1().
        //
        return this.potentialRow1;
    }
    public getPotentialRow2(): number {
        //
        // getPotentialRow2().
        //
        return this.potentialRow2;
    }

    public validate(throwIfNotProper: boolean = true) {
        let isProper: boolean;
        isProper = false;
        if (this.cell11 < 0) {
            throw new Error("this.cell11 < 0");
        }
        if (this.row1 < 0) {
            throw new Error("this.row1 < 0");
        }
        if (this.column1 < 0) {
            throw new Error("this.column1 < 0");
        }
        if (this.total < 0) {
            throw new Error("this.total < 0");
        }
        if (this.row2 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.row2 < 0");
            }
            return isProper;
        }
        if (this.column2 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.column2 < 0");
            }
            return isProper;
        }
        if (this.cell12 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.cell12 < 0");
            }
            return isProper;
        }
        if (this.cell21 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.cell21 < 0");
            }
            return isProper;
        }
        if (this.cell22 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.cell22 < 0");
            }
            return isProper;
        }
        if (this.expectedCell11 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.expectedCell11 < 0");
            }
            return isProper;
        }
        if (this.expectedCell12 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.expectedCell12 < 0");
            }
            return isProper;
        }
        if (this.expectedCell21 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.expectedCell21 < 0");
            }
            return isProper;
        }
        if (this.expectedCell22 < 0) {
            if (throwIfNotProper) {
                throw new Error("this.expectedCell22 < 0");
            }
            return isProper;
        }
        isProper = true;
        return isProper;
    }

    public getPositives(): number {
        //
        // Retrieve positives in the confusion matrix.
        //
        return this.row1;
    }
    public getNegatives(): number {
        //
        // Retrieve negatives in the confusion matrix.
        //
        return this.row2;
    }
    public getPositiveRatio(): number {
        //
        // Retrieve positive ratio in the confusion matrix.
        //
        return this.ratioRow1;
    }
    public getNegativeRatio(): number {
        //
        // Retrieve negative ratio in the confusion matrix.
        //
        return this.ratioRow2;
    }
    public getPredictedPositives(): number {
        //
        // Retrieve predicted positives in the confusion matrix.
        //
        return this.column1;
    }
    public getPredictedNegatives(): number {
        //
        // Retrieve predicted negatives in the confusion matrix.
        //
        return this.column2;
    }
    public getPredictedPositiveRatio(): number {
        //
        // Retrieve predicted positive ratio in the confusion matrix.
        //
        return this.ratioColumn1;
    }
    public getPredictedNegativeRatio(): number {
        //
        // Retrieve predicted negative ratio in the confusion matrix.
        //
        return this.ratioColumn2;
    }
    public getTruePositives(): number {
        //
        // Retrieve true positives in the confusion matrix.
        //
        return this.cell11;
    }
    public getTruePositiveRatio(): number {
        //
        // Retrieve true positive ratio in the confusion matrix.
        //
        return this.ratioCell11;
    }
    public getTrueNegatives(): number {
        //
        // Retrieve true negatives in the confusion matrix.
        //
        return this.cell22;
    }
    public getTrueNegativeRatio(): number {
        //
        // Retrieve true negative ratio in the confusion matrix.
        //
        return this.ratioCell22;
    }
    public getFalsePositives(): number {
        //
        // Retrieve false positives in the confusion matrix.
        //
        return this.cell21;
    }
    public getFalsePositiveRatio(): number {
        //
        // Retrieve false positive ratio in the confusion matrix.
        //
        return this.ratioCell21;
    }
    public getFalseNegatives(): number {
        //
        // Retrieve false negatives in the confusion matrix.
        //
        return this.cell12;
    }
    public getFalseNegativeRatio(): number {
        //
        // Retrieve false negative ratio in the confusion matrix.
        //
        return this.ratioCell12;
    }
    public getPositiveNegativeRatio(): number {
        //
        // Retrieve the ratio of positives vs. negatives in the confusion matrix.
        //
        return MathematicsHelper.safeDivide(
            this.getPositives(),
            this.getNegatives());
    }
    public getNegativePositiveRatio(): number {
        //
        // Retrieve the ratio of negatives vs. positives in the confusion matrix.
        //
        return MathematicsHelper.safeDivide(
            this.getNegatives(),
            this.getPositives());
    }

    public getPotentialPositives(): number {
        //
        // Retrieve potential positives in the confusion matrix.
        //
        return this.getPotentialRow1();
    }
    public getPotentialNegatives(): number {
        //
        // Retrieve potential negatives in the confusion matrix.
        //
        return this.getPotentialRow2();
    }

    public getPrecision(): number {
        //
        // Retrieve the precision in the confusion matrix.
        //
        return MathematicsHelper.safeDivide(
            this.getTruePositives(),
            this.getTruePositives() + this.getFalsePositives());
    }
    public getRecall(): number {
        //
        // Retrieve the precision in the confusion matrix.
        //
        return MathematicsHelper.safeDivide(
            this.getTruePositives(),
            this.getPositives());
    }
    public getF1Score(): number {
        //
        // Retrieve the precision in the confusion matrix.
        //
        return 2 * MathematicsHelper.safeDivide(
            this.getPrecision() * this.getRecall(),
            this.getPrecision() + this.getRecall());
    }

    public getSupport(): number {
        //
        // Retrieve the support in the confusion matrix.
        //
        return this.getPositives();
    }

    public getBasicMetrics(): { [id: string]: number; } {
        const metrics: { [id: string]: number; } = {};
        metrics.positives = this.getPositives();
        metrics.negatives = this.getNegatives();
        metrics.positiveRatio = this.getPositiveRatio();
        metrics.negativeRatio = this.getNegativeRatio();
        metrics.predictedPositives = this.getPredictedPositives();
        metrics.predictedNegatives = this.getPredictedNegatives();
        metrics.predictedPositiveRatio = this.getPredictedPositiveRatio();
        metrics.predictedNegativeRatio = this.getPredictedNegativeRatio();
        metrics.truePositives = this.getTruePositives();
        metrics.truePositiveRatio = this.getTruePositiveRatio();
        metrics.trueNegatives = this.getTrueNegatives();
        metrics.trueNegativeRatio = this.getTrueNegativeRatio();
        metrics.falsePositives = this.getFalsePositives();
        metrics.falsePositiveRatio = this.getFalsePositiveRatio();
        metrics.falseNegatives = this.getFalseNegatives();
        metrics.falseNegativeRatio = this.getFalseNegativeRatio();
        metrics.positiveNegativeRatio = this.getPositiveNegativeRatio();
        metrics.negativePositiveRatio = this.getNegativePositiveRatio();
        metrics.precision = this.getPrecision();
        metrics.recall = this.getRecall();
        metrics.f1Score = this.getF1Score();
        metrics.support = this.getSupport();
        return metrics;
    }

    public getHits(): number {
        return this.getTruePositives();
    }
    public getCorrectRejections(): number {
        return this.getTrueNegatives();
    }
    public getFalseAlarms(): number {
        return this.getFalsePositives();
    }
    public getMisses(): number {
        return this.getFalseNegatives();
    }
    public getTypeOneErrors(): number {
        return this.getFalsePositives();
    }
    public getTypeTwoErrors(): number {
        return this.getFalseNegatives();
    }

    public getTruePositiveRate(): number {
        return MathematicsHelper.safeDivide(
            this.getTruePositives(), this.getPositives());
    }
    public getTrueNegativeRate(): number {
        return MathematicsHelper.safeDivide(
            this.getTrueNegatives(), this.getNegatives());
    }
    public getPositivePredictiveValue(): number {
        return MathematicsHelper.safeDivide(
            this.getTruePositives(), (this.getTruePositives() + this.getFalsePositives()));
    }
    public getNegativePredictiveValue(): number {
        return MathematicsHelper.safeDivide(
            this.getTrueNegatives(), (this.getTrueNegatives() + this.getFalseNegatives()));
    }
    public getFalsePositiveRate(): number {
        return MathematicsHelper.safeDivide(
            this.getFalsePositives(), this.getNegatives());
    }
    public getFalseDiscoveryRate(): number {
        return MathematicsHelper.safeDivide(
            this.getFalsePositives(), (this.getFalsePositives() + this.getTruePositives()));
    }
    public getFalseNegativeRate(): number {
        return MathematicsHelper.safeDivide(
            this.getFalseNegatives(), this.getPositives());
    }

    public getTruePositiveOverTotalRate(): number {
        return MathematicsHelper.safeDivide(this.getTruePositives(), this.getTotal());
    }
    public getTrueNegativeOverTotalRate(): number {
        return MathematicsHelper.safeDivide(this.getTrueNegatives(), this.getTotal());
    }
    public getFalsePositiveOverTotalRate(): number {
        return MathematicsHelper.safeDivide(this.getFalsePositives(), this.getTotal());
    }
    public getFalseNegativeOverTotalRate(): number {
        return MathematicsHelper.safeDivide(this.getFalseNegatives(), this.getTotal());
    }

    public getTruePositiveOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getTruePositives(), explicitTotal);
    }
    public getTrueNegativeOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getTrueNegatives(), explicitTotal);
    }
    public getFalsePositiveOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getFalsePositives(), explicitTotal);
    }
    public getFalseNegativeOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getFalseNegatives(), explicitTotal);
    }

    public getConditionPositiveRate(): number {
        return MathematicsHelper.safeDivide(this.getPositives(), this.getTotal());
    }
    public getConditionNegativeRate(): number {
        return MathematicsHelper.safeDivide(this.getNegatives(), this.getTotal());
    }
    public getPredictedPositiveRate(): number {
        return MathematicsHelper.safeDivide(this.getPredictedPositives(), this.getTotal());
    }
    public getPredictedNegativeRate(): number {
        return MathematicsHelper.safeDivide(this.getPredictedNegatives(), this.getTotal());
    }

    public getConditionPositiveCaughtRate(explicitTotalPositives: number = -1): number {
        if (explicitTotalPositives <= 0) {
            explicitTotalPositives = this.getPositives();
        }
        return MathematicsHelper.safeDivide(this.getTruePositives(), explicitTotalPositives);
    }
    public getConditionPositiveMissedRate(explicitTotalPositives: number = -1): number {
        if (explicitTotalPositives <= 0) {
            explicitTotalPositives = this.getPositives();
        }
        return MathematicsHelper.safeDivide(this.getFalseNegatives(), explicitTotalPositives);
    }
    public getConditionNegativeCaughtRate(explicitTotalNegatives: number = -1): number {
        if (explicitTotalNegatives <= 0) {
            explicitTotalNegatives = this.getNegatives();
        }
        return MathematicsHelper.safeDivide(this.getTrueNegatives(), explicitTotalNegatives);
    }
    public getConditionNegativeMissedRate(explicitTotalNegatives: number = -1): number {
        if (explicitTotalNegatives <= 0) {
            explicitTotalNegatives = this.getNegatives();
        }
        return MathematicsHelper.safeDivide(this.getFalsePositives(), explicitTotalNegatives);
    }

    public getConditionPositiveDecidedRate(explicitTotalPositives: number = -1): number {
        return (this.getConditionPositiveCaughtRate(explicitTotalPositives) + this.getConditionPositiveMissedRate(explicitTotalPositives));
    }
    public getConditionNegativeDecidedRate(explicitTotalNegatives: number = -1): number {
        return (this.getConditionNegativeCaughtRate(explicitTotalNegatives) + this.getConditionNegativeMissedRate(explicitTotalNegatives));
    }
    public getConditionPositiveUndecidedRate(explicitTotalPositives: number = -1): number {
        return 1 - this.getConditionPositiveDecidedRate(explicitTotalPositives);
    }
    public getConditionNegativeUndecidedRate(explicitTotalNegatives: number = -1): number {
        return 1 - this.getConditionNegativeDecidedRate(explicitTotalNegatives);
    }

    public getPredictedPositiveDecidedRate(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getPredictedPositives(), explicitTotal);
    }
    public getPredictedNegativeDecidedRate(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide(this.getPredictedNegatives(), explicitTotal);
    }
    public getTotalDecidedRate(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return MathematicsHelper.safeDivide((this.getPredictedPositives() + this.getPredictedNegatives()), explicitTotal);
    }
    public getTotalUnDecidedRate(explicitTotal: number = -1): number {
        return (1 - this.getTotalDecidedRate(explicitTotal));
    }

    public getConditionPositivesUndecided(explicitTotalPositives: number = -1): number {
        if (explicitTotalPositives <= 0) {
            explicitTotalPositives = this.getPositives();
        }
        return explicitTotalPositives - (this.getPositives());
    }
    public getConditionNegativesUndecided(explicitTotalNegatives: number = -1): number {
        if (explicitTotalNegatives <= 0) {
            explicitTotalNegatives = this.getNegatives();
        }
        return explicitTotalNegatives - (this.getNegatives());
    }
    public getTotalUnDecided(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return (explicitTotal - this.getTotal());
    }

    public getHitRate(): number {
        return this.getTruePositiveRate();
    }
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- public getRecall(): number {
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     return this.getTruePositiveRate();
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- }
    public getProbabilityOfDetection(): number {
        return this.getTruePositiveRate();
    }
    public getSensitivity(): number {
        return this.getTruePositiveRate();
    }
    public getSpecificity(): number {
        return this.getTrueNegativeRate();
    }
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- public getPrecision(): number {
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     return this.getPositivePredictiveValue();
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- }
    public getFallOut(): number {
        return this.getFalsePositiveRate();
    }
    public getProbabilityOfFalseAlarm(): number {
        return this.getFalsePositiveRate();
    }
    public getMissRate(): number {
        return this.getFalseNegativeRate();
    }

    public getAccuracy(): number {
        return MathematicsHelper.safeDivide((this.getTruePositives() + this.getTrueNegatives()), this.getTotal());
    }
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- public getF1Score(): number {
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     double truePositiveFactor = (2 * this.getTruePositives());
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     return
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----         MathematicsHelper.safeDivide(
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----             truePositiveFactor,
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----             (truePositiveFactor + this.getFalsePositives() + this.getFalseNegatives()));
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- }
    public getGMeasure(): number {
        return Math.sqrt(this.getPrecision() *  this.getRecall());
    }
    public getMatthewsCorrelationCoefficient(): number {
        return ((this.getTruePositives() * this.getTrueNegatives()) -
            (this.getFalsePositives() * this.getFalseNegatives())) /
            Math.sqrt(
            (this.getTruePositives() + this.getFalsePositives()) *
            (this.getTruePositives() + this.getFalseNegatives()) *
            (this.getTrueNegatives() + this.getFalsePositives()) *
            (this.getTrueNegatives() + this.getFalseNegatives()));
    }
    public getInformedness(): number {
        return ((this.getSensitivity() + this.getSpecificity()) - 1);
    }
    public getBookmakerInformedness(): number {
        return this.getInformedness();
    }
    public getMarkedness(): number {
        return ((this.getPrecision() + this.getNegativePredictiveValue()) - 1);
    }

    public getFalseOmissionRate(): number {
        return MathematicsHelper.safeDivide(this.getFalseNegatives(), (this.getFalseNegatives() + this.getTrueNegatives()));
    }
    public getPrevalence(): number {
        return MathematicsHelper.safeDivide(this.getPositives(), this.getTotal());
    }
    public getTruePositiveRateOverFalsePositiveRate(): number {
        return MathematicsHelper.safeDivide(this.getTruePositiveRate(), this.getFalsePositiveRate());
    }
    public getPositiveLikelihoodRatio(): number {
        return this.getTruePositiveRateOverFalsePositiveRate();
    }
    public getFalseNegativeRateOverTrueNegativeRate(): number {
        return MathematicsHelper.safeDivide(this.getFalseNegativeRate(), this.getTrueNegativeRate());
    }
    public getNegativeLikelihoodRatio(): number {
        return this.getFalseNegativeRateOverTrueNegativeRate();
    }
    public getDiagnosticOddsRatio(): number {
        return MathematicsHelper.safeDivide(this.getPositiveLikelihoodRatio(), this.getNegativeLikelihoodRatio());
    }

    public getFMeasure(beta: number = 1): number {
        const beta2: number = beta * beta;
        const precision: number = this.getPrecision();
        const recall: number = this.getRecall();
        return MathematicsHelper.safeDivide(((1 + beta2) * (precision * recall)), ((beta2 * precision) + recall));
    }
    public getF1Measure(): number {
        return this.getFMeasure(1);
    }
    public getF2Measure(): number { // ---- emphasize recall more than precision
        return this.getFMeasure(2);
    }
    public getF05Measure(): number { // ---- emphasize precision more than recall
        return this.getFMeasure(0.5);
    }
    public getEffectivenessMeasure(alpha: number = 0.5): number {
        const beta: number = Math.sqrt((1 / alpha) - 1);
        return (1 - this.getFMeasure(beta));
    }
    public getEffectivenessMeasure05(): number { // ---- NOTE: equivalent to F1
        return this.getEffectivenessMeasure(0.5);
    }
    public getEffectivenessMeasure02(): number { // ---- NOTE: equivalent to F2
        return this.getEffectivenessMeasure(0.2);
    }
    public getEffectivenessMeasure08(): number { // ---- NOTE: equivalent to F0.5
        return this.getEffectivenessMeasure(0.8);
    }

    public getRisk(): number {
        return MathematicsHelper.safeDivide(this.getTruePositives(), this.getPredictedPositives());
    }
    public getRiskPredictedNegative(): number {
        return MathematicsHelper.safeDivide(this.getFalseNegatives(), this.getPredictedNegatives());
    }
    public getOdds(): number {
        return MathematicsHelper.safeDivide(this.getTruePositives(), this.getFalsePositives());
    }
    public getOddsRatio(): number {
        return MathematicsHelper.safeDivide(MathematicsHelper.safeDivide(this.getTruePositives(), this.getFalsePositives()), MathematicsHelper.safeDivide(this.getTrueNegatives(), this.getFalseNegatives()));
    }
    public getRelativeRisk(): number {
        return MathematicsHelper.safeDivide((this.getRisk()), (this.getRiskPredictedNegative()));
    }

    public getWeightOfEvidence(): number {
        return MathematicsHelper.safeLog(this.getOdds()) * 100;
    }

    public getPositiveNegativePotentialRatio(): number {
        const negativePotential: number = this.getPotentialNegatives();
        const positivePotential: number = this.getPotentialPositives();
        const R: number = ((negativePotential === 0) ? 1 : MathematicsHelper.safeDivide(positivePotential, negativePotential));
        return R;
    }

    public getChargeBackRate(): number {
        return this.getFalseOmissionRate();
    }
    public getFraudRate(): number {
        return this.getConditionPositiveRate();
    }
    public getRejectRate(): number {
        return this.getPredictedPositiveRate();
    }

    public getPE(): number {
        const trueNegatives: number = this.getTrueNegatives();
        return MathematicsHelper.safeDivide((trueNegatives - this.getFalseNegatives()), (this.getFalsePositives() + trueNegatives));
    }
    public getPETruePositiveExtreme(): number {
        return 1;
    }
    public getPEFalsePositiveExtreme(): number {
        return 0;
    }
    public getPEFalseNegativeExtreme(): number {
        return Number.NEGATIVE_INFINITY;
    }
    public getPETrueNegativeExtreme(): number {
        return 1;
    }
    public getPEPerfect(): number {
        return 1;
    }
    public getPEWorst(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return MathematicsHelper.safeDivide(-(fraudRate * R), (1 - fraudRate));
    }
    public getPEAlwaysReject(): number {
        return 0;
    }
    public getPEAlwaysApprove(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return MathematicsHelper.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate));
    }
    public getPERandomBaseline(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return (1 - fraudRate - (fraudRate * R));
    }
    public getPEGenericRandomBaseline(
        rejectRate: number = -1): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        if ((rejectRate < 0) || (rejectRate > 1)) {
            rejectRate = fraudRate;
        }
        return ((1 - rejectRate) * (1 - (MathematicsHelper.safeDivide(fraudRate, (1 - fraudRate) * R))));
    }

    public getOPE(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOPETruePositiveExtreme(): number {
        return 1;
    }
    public getOPEFalsePositiveExtreme(): number {
        return -1;
    }
    public getOPEFalseNegativeExtreme(): number {
        return -1;
    }
    public getOPETrueNegativeExtreme(): number {
        return 1;
    }
    public getOPEPerfect(): number {
        return 1;
    }
    public getOPEWorst(): number {
        return -1;
    }
    public getOPEAlwaysReject(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return MathematicsHelper.safeDivide(-(1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
    }
    public getOPEAlwaysApprove(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return MathematicsHelper.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
    }
    public getOPERandomBaseline(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        const term: number = MathematicsHelper.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
        return (-((2 * fraudRate) - 1) * term);
    }
    public getOPEGenericRandomBaseline(
        rejectRate: number = -1): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        if ((rejectRate < 0) || (rejectRate > 1)) {
            rejectRate = fraudRate;
        }
        const term: number = MathematicsHelper.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
        return (-((2 * rejectRate) - 1) * term);
    }

    public getOPEsharp(
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1): number {
        let truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        let falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const chargeBackRate: number = MathematicsHelper.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = MathematicsHelper.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (MathematicsHelper.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * MathematicsHelper.safeDivide((falsePositiveRate), (1 - falsePositiveRate)));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOPEsharpRandomBaseline(
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        let truePositives: number = R * (fraudRate * fraudRate); // ---- this.getDiagonalCellsSum();
        const trueNegatives: number = (1 - fraudRate) * (1 - fraudRate); // ---- this.getTrueNegatives();
        let falsePositives: number = fraudRate * (1 - fraudRate); // ---- this.getFalsePositives();
        const falseNegatives: number = R * (fraudRate * (1 - fraudRate)); // ---- this.getFalseNegatives();
        const chargeBackRate: number = MathematicsHelper.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- MathematicsHelper.safeDivide((R * fraudRate), (1 - fraudRate - (R * fraudRate))); // ---- MathematicsHelper.safeDivide((R * (fraudRate * (1 - fraudRate))), ((R * (fraudRate * (1 - fraudRate))) + ((1-fraudRate) * (1-fraudRate)))); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = MathematicsHelper.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- fraudRate; // ---- MathematicsHelper.safeDivide(((fraudRate * (1 - fraudRate))), (((fraudRate * (1 - fraudRate))) + ((1 - fraudRate) * (1 - fraudRate)))); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (MathematicsHelper.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * (MathematicsHelper.safeDivide((falsePositiveRate), (1 - falsePositiveRate))));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOPEsharpGenericRandomBaseline(
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        if ((rejectRate < 0) || (rejectRate > 1)) {
            rejectRate = fraudRate;
        }
        let truePositives: number = R * (rejectRate * fraudRate); // ---- R * (fraudRate * fraudRate); // ---- this.getDiagonalCellsSum();
        const trueNegatives: number = (1 - rejectRate) * (1 - fraudRate); // ---- (1 - fraudRate) * (1 - fraudRate); // ---- this.getTrueNegatives();
        let falsePositives: number = rejectRate * (1 - fraudRate); // ---- fraudRate * (1 - fraudRate); // ---- this.getFalsePositives();
        const falseNegatives: number = R * (fraudRate * (1 - rejectRate)); // ---- R * (fraudRate * (1 - fraudRate)); // ---- this.getFalseNegatives();
        const chargeBackRate: number = MathematicsHelper.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- MathematicsHelper.safeDivide((R * fraudRate), (1 - fraudRate - (R * fraudRate))); // ---- MathematicsHelper.safeDivide((R * (fraudRate * (1 - fraudRate))), ((R * (fraudRate * (1 - fraudRate))) + ((1-fraudRate) * (1-fraudRate)))); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = MathematicsHelper.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- fraudRate; // ---- MathematicsHelper.safeDivide(((fraudRate * (1 - fraudRate))), (((fraudRate * (1 - fraudRate))) + ((1 - fraudRate) * (1 - fraudRate)))); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (MathematicsHelper.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * (MathematicsHelper.safeDivide((falsePositiveRate), (1 - falsePositiveRate))));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }

    public getNetPE(): number {
        return this.getPE() - this.getPERandomBaseline();
    }
    public getNetOPE(): number {
        return this.getOPE() - this.getOPERandomBaseline();
    }
    public getNetOPEsharp(
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1): number {
        return this.getOPEsharp(alpha, beta, A, B) - this.getOPEsharpRandomBaseline(alpha, beta, A, B);
    }

    public getGenericNetPE(
        rejectRate: number = -1): number {
        return this.getPE() - this.getPEGenericRandomBaseline(rejectRate);
    }
    public getGenericNetOPE(
        rejectRate: number = -1): number {
        return this.getOPE() - this.getOPEGenericRandomBaseline(rejectRate);
    }
    public getGenericNetOPEsharp(
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1): number {
        return this.getOPEsharp() - this.getOPEsharpGenericRandomBaseline(rejectRate, alpha, beta, A, B);
    }

    public getdOPE(): number {
        const truePositives: number = 0; // ----  this.getDiagonalCellsSum();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOPEPrime(): number {
        const truePositives: number = 0; // ----  this.getDiagonalCellsSum();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = 0; // ---- this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOLR(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((falsePositives) + (falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getOGR(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives) + (truePositives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return MathematicsHelper.safeDivide(numerator, denominator);
    }

    public getInverseDocumentFrequencyRaw(): number {
        const numerator: number = this.getTotal();
        const denominator: number = this.getPositives();
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getInverseDocumentFrequency(): number {
        return MathematicsHelper.safeLog(this.getInverseDocumentFrequencyRaw()); // ---- NOTE: better to use the smooth version as it's possible that positives can be zero!
    }
    public getInverseDocumentFrequencyUnary(): number {
        return ((this.getPositives() > 0) && (this.getTotal() > 0)) ? 1 : 0;
    }
    public getInverseDocumentFrequencySmooth(): number {
        const inverseDocumentFrequencyRaw: number =
            this.getInverseDocumentFrequencyRaw();
        return MathematicsHelper.safeLog(1 + inverseDocumentFrequencyRaw);
    }
    public getInverseDocumentFrequencyMax(explicitMaxPositives: number): number {
        if (explicitMaxPositives <= 0) {
            return this.getInverseDocumentFrequency();
        }
        return MathematicsHelper.safeLog(MathematicsHelper.safeDivide(explicitMaxPositives, (1 + this.getPositives())));
    }
    public getInverseDocumentFrequencyProbabilistic(): number {
        const denominator: number = this.getPositives();
        const numerator: number = this.getTotal() - denominator;
        return MathematicsHelper.safeLog(MathematicsHelper.safeDivide(numerator, denominator));
    }

    public getJaccardCoefficient(): number {
        const denominator: number = this.getTruePositives() + this.getFalsePositives() + this.getFalseNegatives();
        const numerator: number = this.getTruePositives();
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getSimpleMatchingCoefficient(): number {
        const denominator: number = this.getTotal();
        const numerator: number = this.getTruePositives();
        return MathematicsHelper.safeDivide(numerator, denominator);
    }
    public getJaccardDenominatorMinCoefficient(): number {
        const positives: number = this.getPositives();
        const predictedPositives: number = this.getPredictedPositives();
        let denominator: number = positives;
        if (denominator > predictedPositives) {
            denominator = predictedPositives;
        }
        const numerator: number = this.getTruePositives();
        return MathematicsHelper.safeLog(MathematicsHelper.safeDivide(numerator, denominator));
    }
    public getJaccardDenominatorMaxCoefficient(): number {
        const positives: number = this.getPositives();
        const predictedPositives: number = this.getPredictedPositives();
        let denominator: number = positives;
        if (denominator < predictedPositives) {
            denominator = predictedPositives;
        }
        const numerator: number = this.getTruePositives();
        return MathematicsHelper.safeLog(MathematicsHelper.safeDivide(numerator, denominator));
    }
}
