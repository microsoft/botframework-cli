/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMathematicsHelper } from "../mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../mathematics_helper/MathematicsHelper";

import { IDictionaryStringIdGenericArray } from "../../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericValue } from "../../data_structure/IDictionaryStringIdGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

// tslint:disable: max-line-length
export class BinaryConfusionMatrix {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    //
    // Initialize an BinaryConfusionMatrix object.
    //
    protected total: number = 0;
    protected cell11: number = 0;
    protected row1: number = 0;
    protected column1: number = 0;

    protected throwIfNotProper: boolean = true;

    protected potentialRow1: number;
    protected potentialRow2: number;

    protected row2: number = 0;
    protected column2: number = 0;
    protected cell12: number = 0;
    protected cell21: number = 0;
    protected cell22: number = 0;
    protected expectedCell11: number = 0;
    protected expectedCell12: number = 0;
    protected expectedCell21: number = 0;
    protected expectedCell22: number = 0;
    protected isProper: boolean = false;
    protected ratioCell11: number = 0;
    protected ratioRow1: number = 0;
    protected ratioColumn1: number = 0;
    protected ratioRow2: number = 0;
    protected ratioColumn2: number = 0;
    protected ratioCell12: number = 0;
    protected ratioCell21: number = 0;
    protected ratioCell22: number = 0;

    constructor(
        total: number = 0,
        cell11: number = 0,
        row1: number = 0,
        column1: number = 0,
        potentialRow1: number = 0,
        potentialRow2: number = 0,
        throwIfNotProper: boolean = true) {
        //
        // A binary confusion matrix can be represented as a 2X2 table with
        // cells defined below:
        //
        //                            || Predicted Positive | Predicted Negative |
        // ----------------------------------------------------------------------------------------------
        // ----------------------------------------------------------------------------------------------
        //     Ground - True Positive || True Positive      | False Nagative     | Ground - True Positive
        // ----------------------------------------------------------------------------------------------
        //     Ground - True Negative || False Positive     | True Nagative      | Ground - True Negative
        // ----------------------------------------------------------------------------------------------
        //                            || Predicted Positive | Predicted Negative | Total
        //
        this.total = total;
        this.cell11 = cell11;
        this.row1 = row1;
        this.column1 = column1;
        this.throwIfNotProper = throwIfNotProper;
        this.potentialRow1 = potentialRow1;
        this.potentialRow2 = potentialRow2;
        this.calculateDerivedCells();
    }

    public clone(): BinaryConfusionMatrix {
        return new BinaryConfusionMatrix(
            this.getTotal(),
            this.getCell11(),
            this.getRow1(),
            this.getColumn1(),
            this.getPotentialRow1(),
            this.getPotentialRow2(),
            this.getThrowIfNotProper());
    }

    public addToTruePositives(value: number = 1, recalculate: boolean = true) {
        this.addToCell11(value, recalculate);
    }
    public addToFalseNegatives(value: number = 1, recalculate: boolean = true) {
        this.addToCell12(value, recalculate);
    }
    public addToFalsePositives(value: number = 1, recalculate: boolean = true) {
        this.addToCell21(value, recalculate);
    }
    public addToTrueNegatives(value: number = 1, recalculate: boolean = true) {
        this.addToCell22(value, recalculate);
    }

    public addToCell11(value: number = 1, recalculate: boolean = true) {
        this.total += value;
        this.cell11 += value;
        this.row1 += value;
        this.column1 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }
    public addToCell12(value: number = 1, recalculate: boolean = true) {
        this.total += value;
        this.row1 += value;
        this.column2 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }
    public addToCell21(value: number = 1, recalculate: boolean = true) {
        this.total += value;
        this.row2 += value;
        this.column1 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }
    public addToCell22(value: number = 1, recalculate: boolean = true) {
        this.total += value;
        this.row2 += value;
        this.column2 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }

    public addToPotentialRow1(value: number = 1, recalculate: boolean = true) {
        this.potentialRow1 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }
    public addToPotentialRow2(value: number = 1, recalculate: boolean = true) {
        this.potentialRow2 += value;
        if (recalculate) {
            this.calculateDerivedCells();
        }
    }

    public addFrom(other: BinaryConfusionMatrix) {
        this.total += other.total;
        this.cell11 += other.cell11;
        this.row1 += other.row1;
        this.column1 += other.column1;
        this.potentialRow1 += other.potentialRow1;
        this.potentialRow2 += other.potentialRow2;
        this.calculateDerivedCells();
    }

    public moveFromPredictedNegativeToPositive(
        groundTruthIsPositive: boolean,
        createNewBinaryConfusionMatrix: boolean = true,
        value: number = 1): BinaryConfusionMatrix {
        if (groundTruthIsPositive) {
            this.cell11 += value;
        }
        this.column1 += value;
        this.calculateDerivedCells();
        const binaryConfusionMatrix: BinaryConfusionMatrix =
            createNewBinaryConfusionMatrix ? this.clone() : this;
        return binaryConfusionMatrix;
    }

    public calculateDerivedCells(): void {
        this.row2 = BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(this.total, this.row1);
        this.column2 = BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(this.total, this.column1);
        this.cell12 = BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(this.row1, this.cell11);
        this.cell21 = BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(this.column1, this.cell11);
        this.cell22 = BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(
            BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(
            BinaryConfusionMatrix.MathematicsHelperObject.safeZeroSmallNegativeErrorSubtract(
                this.total,
                this.cell11),
                this.cell12),
                this.cell21);
        this.expectedCell11 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row1 * this.column1, this.total);
        this.expectedCell12 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row1 * this.column2, this.total);
        this.expectedCell21 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row2 * this.column1, this.total);
        this.expectedCell22 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row2 * this.column2, this.total);
        this.isProper = this.validate(this.throwIfNotProper);
        this.ratioCell11 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.cell11, this.total);
        this.ratioRow1 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row1, this.total);
        this.ratioColumn1 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.column1, this.total);
        this.ratioRow2 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.row2, this.total);
        this.ratioColumn2 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.column2, this.total);
        this.ratioCell12 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.cell12, this.total);
        this.ratioCell21 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.cell21, this.total);
        this.ratioCell22 = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.cell22, this.total);
    }

    public toSimpleString(): string {
        return `total=${this.getTotal()},cell11=${this.getCell11()},row1=${this.getRow1()},column1=${this.getColumn1()},row2=${this.getRow2()},column2=${this.getColumn2()},cell12=${this.getCell12()},cell21=${this.getCell21()},cell22=${this.getCell22()}`;
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

    public getThrowIfNotProper(): boolean {
        return this.throwIfNotProper;
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

    public validate(throwIfNotProper: boolean = true) {
        let isProper: boolean = false;
        if (this.cell11 < 0) {
            throw new Error(`this.cell11 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
        }
        if (this.row1 < 0) {
            throw new Error(`this.row1 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
        }
        if (this.column1 < 0) {
            throw new Error(`this.column1 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
        }
        if (this.total < 0) {
            throw new Error(`this.total < 0, confusion-matrix-cells:${this.toSimpleString()}`);
        }
        if (this.row2 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.row2 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.column2 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.column2 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.cell12 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.cell12 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.cell21 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.cell21 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.cell22 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.cell22 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.expectedCell11 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.expectedCell11 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.expectedCell12 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.expectedCell12 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.expectedCell21 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.expectedCell21 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
            }
            return isProper;
        }
        if (this.expectedCell22 < 0) {
            if (throwIfNotProper) {
                throw new Error(`this.expectedCell22 < 0, confusion-matrix-cells:${this.toSimpleString()}`);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getPositives(),
            this.getNegatives());
    }
    public getNegativePositiveRatio(): number {
        //
        // Retrieve the ratio of negatives vs. positives in the confusion matrix.
        //
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTruePositives(),
            this.getTruePositives() + this.getFalsePositives());
    }
    public getRecall(): number {
        //
        // Retrieve the precision in the confusion matrix.
        //
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTruePositives(),
            this.getPositives());
    }
    public getF1Score(): number {
        //
        // Retrieve the precision in the confusion matrix.
        //
        return 2 * BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getPrecision() * this.getRecall(),
            this.getPrecision() + this.getRecall());
    }

    public getSupport(): number {
        //
        // Retrieve the support in the confusion matrix.
        //
        return this.getPositives();
    }

    public getBasicMetrics(): { [id: string]: number } {
        const metrics: { [id: string]: number } = {};
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTruePositives(), this.getPositives());
    }
    public getTrueNegativeRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTrueNegatives(), this.getNegatives());
    }
    public getPositivePredictiveValue(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTruePositives(), (this.getTruePositives() + this.getFalsePositives()));
    }
    public getNegativePredictiveValue(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getTrueNegatives(), (this.getTrueNegatives() + this.getFalseNegatives()));
    }
    public getFalsePositiveRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getFalsePositives(), this.getNegatives());
    }
    public getFalseDiscoveryRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getFalsePositives(), (this.getFalsePositives() + this.getTruePositives()));
    }
    public getFalseNegativeRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
            this.getFalseNegatives(), this.getPositives());
    }

    public getTruePositiveOverTotalRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), this.getTotal());
    }
    public getTrueNegativeOverTotalRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTrueNegatives(), this.getTotal());
    }
    public getFalsePositiveOverTotalRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalsePositives(), this.getTotal());
    }
    public getFalseNegativeOverTotalRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegatives(), this.getTotal());
    }

    public getTruePositiveOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), explicitTotal);
    }
    public getTrueNegativeOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTrueNegatives(), explicitTotal);
    }
    public getFalsePositiveOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalsePositives(), explicitTotal);
    }
    public getFalseNegativeOverExplicitTotalRate(explicitTotal: number = 0): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegatives(), explicitTotal);
    }

    public getConditionPositiveRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPositives(), this.getTotal());
    }
    public getConditionNegativeRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getNegatives(), this.getTotal());
    }
    public getPredictedPositiveRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPredictedPositives(), this.getTotal());
    }
    public getPredictedNegativeRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPredictedNegatives(), this.getTotal());
    }

    public getConditionPositiveCaughtRate(explicitTotalPositives: number = -1): number {
        if (explicitTotalPositives <= 0) {
            explicitTotalPositives = this.getPositives();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), explicitTotalPositives);
    }
    public getConditionPositiveMissedRate(explicitTotalPositives: number = -1): number {
        if (explicitTotalPositives <= 0) {
            explicitTotalPositives = this.getPositives();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegatives(), explicitTotalPositives);
    }
    public getConditionNegativeCaughtRate(explicitTotalNegatives: number = -1): number {
        if (explicitTotalNegatives <= 0) {
            explicitTotalNegatives = this.getNegatives();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTrueNegatives(), explicitTotalNegatives);
    }
    public getConditionNegativeMissedRate(explicitTotalNegatives: number = -1): number {
        if (explicitTotalNegatives <= 0) {
            explicitTotalNegatives = this.getNegatives();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalsePositives(), explicitTotalNegatives);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPredictedPositives(), explicitTotal);
    }
    public getPredictedNegativeDecidedRate(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPredictedNegatives(), explicitTotal);
    }
    public getTotalDecidedRate(explicitTotal: number = -1): number {
        if (explicitTotal <= 0) {
            explicitTotal = this.getTotal();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((this.getPredictedPositives() + this.getPredictedNegatives()), explicitTotal);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((this.getTruePositives() + this.getTrueNegatives()), this.getTotal());
    }
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- public getF1Score(): number {
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     double truePositiveFactor = (2 * this.getTruePositives());
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----     return
    // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ----         BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegatives(), (this.getFalseNegatives() + this.getTrueNegatives()));
    }
    public getPrevalence(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPositives(), this.getTotal());
    }
    public getTruePositiveRateOverFalsePositiveRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositiveRate(), this.getFalsePositiveRate());
    }
    public getPositiveLikelihoodRatio(): number {
        return this.getTruePositiveRateOverFalsePositiveRate();
    }
    public getFalseNegativeRateOverTrueNegativeRate(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegativeRate(), this.getTrueNegativeRate());
    }
    public getNegativeLikelihoodRatio(): number {
        return this.getFalseNegativeRateOverTrueNegativeRate();
    }
    public getDiagnosticOddsRatio(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getPositiveLikelihoodRatio(), this.getNegativeLikelihoodRatio());
    }

    public getFMeasure(fMeasureBeta: number = 1): number {
        const beta2: number = fMeasureBeta * fMeasureBeta;
        const precision: number = this.getPrecision();
        const recall: number = this.getRecall();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(((1 + beta2) * (precision * recall)), ((beta2 * precision) + recall));
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
    public getEffectivenessMeasure(effectivenessMeasureAlpha: number = 0.5): number {
        const beta: number = Math.sqrt((1 / effectivenessMeasureAlpha) - 1);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), this.getPredictedPositives());
    }
    public getRiskPredictedNegative(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getFalseNegatives(), this.getPredictedNegatives());
    }
    public getOdds(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), this.getFalsePositives());
    }
    public getOddsRatio(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTruePositives(), this.getFalsePositives()), BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(this.getTrueNegatives(), this.getFalseNegatives()));
    }
    public getRelativeRisk(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((this.getRisk()), (this.getRiskPredictedNegative()));
    }

    public getWeightOfEvidence(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(this.getOdds()) * 100;
    }

    public getPositiveNegativePotentialRatio(): number {
        const negativePotential: number = this.getPotentialNegatives();
        const positivePotential: number = this.getPotentialPositives();
        const R: number = ((negativePotential === 0) ? 1 : BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(positivePotential, negativePotential));
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((trueNegatives - this.getFalseNegatives()), (this.getFalsePositives() + trueNegatives));
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(-(fraudRate * R), (1 - fraudRate));
    }
    public getPEAlwaysReject(): number {
        return 0;
    }
    public getPEAlwaysApprove(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate));
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
        return ((1 - rejectRate) * (1 - (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(fraudRate, (1 - fraudRate) * R))));
    }

    public getOPE(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(-(1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
    }
    public getOPEAlwaysApprove(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
    }
    public getOPERandomBaseline(): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        const term: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
        return (-((2 * fraudRate) - 1) * term);
    }
    public getOPEGenericRandomBaseline(
        rejectRate: number = -1): number {
        const R: number = this.getPositiveNegativePotentialRatio();
        const fraudRate: number = this.getFraudRate();
        if ((rejectRate < 0) || (rejectRate > 1)) {
            rejectRate = fraudRate;
        }
        const term: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((1 - fraudRate - (fraudRate * R)), (1 - fraudRate + (fraudRate * R)));
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
        const chargeBackRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((falsePositiveRate), (1 - falsePositiveRate)));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
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
        const chargeBackRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((R * fraudRate), (1 - fraudRate - (R * fraudRate))); // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((R * (fraudRate * (1 - fraudRate))), ((R * (fraudRate * (1 - fraudRate))) + ((1-fraudRate) * (1-fraudRate)))); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- fraudRate; // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(((fraudRate * (1 - fraudRate))), (((fraudRate * (1 - fraudRate))) + ((1 - fraudRate) * (1 - fraudRate)))); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((falsePositiveRate), (1 - falsePositiveRate))));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
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
        const chargeBackRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falseNegatives, (falseNegatives + trueNegatives)); // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((R * fraudRate), (1 - fraudRate - (R * fraudRate))); // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((R * (fraudRate * (1 - fraudRate))), ((R * (fraudRate * (1 - fraudRate))) + ((1-fraudRate) * (1-fraudRate)))); // ---- this.getChargeBackRate();
        const falsePositiveRate: number = BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(falsePositives, (falsePositives + trueNegatives)); // ---- fraudRate; // ---- BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(((fraudRate * (1 - fraudRate))), (((fraudRate * (1 - fraudRate))) + ((1 - fraudRate) * (1 - fraudRate)))); // ---- this.getFalsePositiveRate();
        const truePositiveDiminishingFactor: number = A * Math.exp(-alpha * (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((chargeBackRate), (1 - chargeBackRate))));
        const falsePositiveAmplifyingFactor: number = B * Math.exp(-beta * (BinaryConfusionMatrix.MathematicsHelperObject.safeDivide((falsePositiveRate), (1 - falsePositiveRate))));
        truePositives *= truePositiveDiminishingFactor;
        falsePositives *= falsePositiveAmplifyingFactor;
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
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
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getOPEPrime(): number {
        const truePositives: number = 0; // ----  this.getDiagonalCellsSum();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = 0; // ---- this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives - falsePositives) + (truePositives - falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getOLR(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((falsePositives) + (falseNegatives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getOGR(): number {
        const truePositives: number = this.getTruePositives();
        const trueNegatives: number = this.getTrueNegatives();
        const falsePositives: number = this.getFalsePositives();
        const falseNegatives: number = this.getFalseNegatives();
        const numerator: number = ((trueNegatives) + (truePositives));
        const denominator: number = ((trueNegatives + falsePositives) + (truePositives + falseNegatives));
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }

    public getInverseDocumentFrequencyRaw(): number {
        const numerator: number = this.getTotal();
        const denominator: number = this.getPositives();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getInverseDocumentFrequency(): number {
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(this.getInverseDocumentFrequencyRaw()); // ---- NOTE: better to use the smooth version as it's possible that positives can be zero!
    }
    public getInverseDocumentFrequencyUnary(): number {
        return ((this.getPositives() > 0) && (this.getTotal() > 0)) ? 1 : 0;
    }
    public getInverseDocumentFrequencySmooth(): number {
        const inverseDocumentFrequencyRaw: number =
            this.getInverseDocumentFrequencyRaw();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(1 + inverseDocumentFrequencyRaw);
    }
    public getInverseDocumentFrequencyMax(explicitMaxPositives: number = -1): number {
        if (explicitMaxPositives <= 0) {
            return this.getInverseDocumentFrequency();
        }
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(explicitMaxPositives, (1 + this.getPositives())));
    }
    public getInverseDocumentFrequencyProbabilistic(): number {
        const denominator: number = this.getPositives();
        const numerator: number = this.getTotal() - denominator;
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator));
    }

    public getJaccardCoefficient(): number {
        const denominator: number = this.getTruePositives() + this.getFalsePositives() + this.getFalseNegatives();
        const numerator: number = this.getTruePositives();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getSimpleMatchingCoefficient(): number {
        const denominator: number = this.getTotal();
        const numerator: number = this.getTruePositives();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator);
    }
    public getJaccardDenominatorMinCoefficient(): number {
        const positives: number = this.getPositives();
        const predictedPositives: number = this.getPredictedPositives();
        let denominator: number = positives;
        if (denominator > predictedPositives) {
            denominator = predictedPositives;
        }
        const numerator: number = this.getTruePositives();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator));
    }
    public getJaccardDenominatorMaxCoefficient(): number {
        const positives: number = this.getPositives();
        const predictedPositives: number = this.getPredictedPositives();
        let denominator: number = positives;
        if (denominator < predictedPositives) {
            denominator = predictedPositives;
        }
        const numerator: number = this.getTruePositives();
        return BinaryConfusionMatrix.MathematicsHelperObject.safeLog(BinaryConfusionMatrix.MathematicsHelperObject.safeDivide(numerator, denominator));
    }

    public getMetrics(
        explicitTotal: number = -1,
        explicitTotalPositives: number = -1,
        explicitTotalNegatives: number = -1,
        fMeasureBeta: number = 1,
        effectivenessMeasureAlpha: number = 0.5,
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1,
        explicitMaxPositives: number = -1): { [id: string]: number } {
        const metrics: { [id: string]: number } = {};
        const metricNames: string[] =
            this.getMetricNames();
        const metricValues: number[] =
            this.getMetricValues(
                explicitTotal,
                explicitTotalPositives,
                explicitTotalNegatives,
                fMeasureBeta,
                effectivenessMeasureAlpha,
                rejectRate,
                alpha,
                beta,
                A,
                B,
                explicitMaxPositives);
        for (let i = 0; i < metricNames.length; i++) {
            metrics[metricNames[i]] = metricValues[i];
        }
        return metrics;
    }
    public getMetricNameMap(): IDictionaryStringIdGenericValue<number> {
        const metricNames: string[] =
            this.getMetricNames();
        const metricNameMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(
            metricNames);
        return metricNameMap;
    }
    public getMetricNames(): string[] {
        const metricNames: string[] = [
            "Total",
            "Cell11",
            "Row1",
            "Column1",
            "PotentialRow1",
            "PotentialRow2",
            "Row2",
            "Column2",
            "Cell12",
            "Cell21",
            "Cell22",
            "ExpectedCell11",
            "ExpectedCell12",
            "ExpectedCell21",
            "ExpectedCell22",
            "RatioCell11",
            "RatioRow1",
            "RatioColumn1",
            "RatioRow2",
            "RatioColumn2",
            "RatioCell12",
            "RatioCell21",
            "RatioCell22",
            "Positives",
            "Negatives",
            "PositiveRatio",
            "NegativeRatio",
            "PredictedPositives",
            "PredictedNegatives",
            "PredictedPositiveRatio",
            "PredictedNegativeRatio",
            "TruePositives",
            "TruePositiveRatio",
            "TrueNegatives",
            "TrueNegativeRatio",
            "FalsePositives",
            "FalsePositiveRatio",
            "FalseNegatives",
            "FalseNegativeRatio",
            "PositiveNegativeRatio",
            "NegativePositiveRatio",
            "PotentialPositives",
            "PotentialNegatives",
            "Precision",
            "Recall",
            "F1Score",
            "Support",
            "Hits",
            "CorrectRejections",
            "FalseAlarms",
            "Misses",
            "TypeOneErrors",
            "TypeTwoErrors",
            "TruePositiveRate",
            "TrueNegativeRate",
            "PositivePredictiveValue",
            "NegativePredictiveValue",
            "FalsePositiveRate",
            "FalseDiscoveryRate",
            "FalseNegativeRate",
            "TruePositiveOverTotalRate",
            "TrueNegativeOverTotalRate",
            "FalsePositiveOverTotalRate",
            "FalseNegativeOverTotalRate",
            "TruePositiveOverExplicitTotalRate",
            "TrueNegativeOverExplicitTotalRate",
            "FalsePositiveOverExplicitTotalRate",
            "FalseNegativeOverExplicitTotalRate",
            "ConditionPositiveRate",
            "ConditionNegativeRate",
            "PredictedPositiveRate",
            "PredictedNegativeRate",
            "ConditionPositiveCaughtRate",
            "ConditionPositiveMissedRate",
            "ConditionNegativeCaughtRate",
            "ConditionNegativeMissedRate",
            "ConditionPositiveDecidedRate",
            "ConditionNegativeDecidedRate",
            "ConditionPositiveUndecidedRate",
            "ConditionNegativeUndecidedRate",
            "PredictedPositiveDecidedRate",
            "PredictedNegativeDecidedRate",
            "TotalDecidedRate",
            "TotalUnDecidedRate",
            "ConditionPositivesUndecided",
            "ConditionNegativesUndecided",
            "TotalUnDecided",
            "HitRate",
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- "Recall",
            "ProbabilityOfDetection",
            "Sensitivity",
            "Specificity",
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- "Precision",
            "FallOut",
            "ProbabilityOfFalseAlarm",
            "MissRate",
            "Accuracy",
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- "F1Score",
            "GMeasure",
            "MatthewsCorrelationCoefficient",
            "Informedness",
            "BookmakerInformedness",
            "Markedness",
            "FalseOmissionRate",
            "Prevalence",
            "TruePositiveRateOverFalsePositiveRate",
            "PositiveLikelihoodRatio",
            "FalseNegativeRateOverTrueNegativeRate",
            "NegativeLikelihoodRatio",
            "DiagnosticOddsRatio",
            "FMeasure",
            "F1Measure",
            "F2Measure",
            "F05Measure",
            "EffectivenessMeasure",
            "EffectivenessMeasure05",
            "EffectivenessMeasure02",
            "EffectivenessMeasure08",
            "Risk",
            "RiskPredictedNegative",
            "Odds",
            "OddsRatio",
            "RelativeRisk",
            "WeightOfEvidence",
            "PositiveNegativePotentialRatio",
            "ChargeBackRate",
            "FraudRate",
            "RejectRate",
            "PE",
            "PETruePositiveExtreme",
            "PEFalsePositiveExtreme",
            "PEFalseNegativeExtreme",
            "PETrueNegativeExtreme",
            "PEPerfect",
            "PEWorst",
            "PEAlwaysReject",
            "PEAlwaysApprove",
            "PERandomBaseline",
            "PEGenericRandomBaseline",
            "OPE",
            "OPETruePositiveExtreme",
            "OPEFalsePositiveExtreme",
            "OPEFalseNegativeExtreme",
            "OPETrueNegativeExtreme",
            "OPEPerfect",
            "OPEWorst",
            "OPEAlwaysReject",
            "OPEAlwaysApprove",
            "OPERandomBaseline",
            "OPEGenericRandomBaseline",
            "OPEsharp",
            "OPEsharpRandomBaseline",
            "OPEsharpGenericRandomBaseline",
            "NetPE",
            "NetOPE",
            "NetOPEsharp",
            "GenericNetPE",
            "GenericNetOPE",
            "GenericNetOPEsharp",
            "dOPE",
            "OPEPrime",
            "OLR",
            "OGR",
            "InverseDocumentFrequencyRaw",
            "InverseDocumentFrequency",
            "InverseDocumentFrequencyUnary",
            "InverseDocumentFrequencySmooth",
            "InverseDocumentFrequencyMax",
            "InverseDocumentFrequencyProbabilistic",
            "JaccardCoefficient",
            "SimpleMatchingCoefficient",
            "JaccardDenominatorMinCoefficient",
            "JaccardDenominatorMaxCoefficient",
            "explicitTotal",
            "explicitTotalPositives",
            "explicitTotalNegatives",
            "fMeasureBeta",
            "effectivenessMeasureAlpha",
            "rejectRate",
            "alpha",
            "beta",
            "A",
            "B",
            "explicitMaxPositives",
        ];

        return metricNames;
    }
    public getMetricValues(
        explicitTotal: number = -1,
        explicitTotalPositives: number = -1,
        explicitTotalNegatives: number = -1,
        fMeasureBeta: number = 1,
        effectivenessMeasureAlpha: number = 0.5,
        rejectRate: number = -1,
        alpha: number = 1,
        beta: number = 1,
        A: number = 1,
        B: number = 1,
        explicitMaxPositives: number = -1): number[] {
        const metricValues: number[] = [
            this.getTotal(),
            this.getCell11(),
            this.getRow1(),
            this.getColumn1(),
            this.getPotentialRow1(),
            this.getPotentialRow2(),
            this.getRow2(),
            this.getColumn2(),
            this.getCell12(),
            this.getCell21(),
            this.getCell22(),
            this.getExpectedCell11(),
            this.getExpectedCell12(),
            this.getExpectedCell21(),
            this.getExpectedCell22(),
            this.getRatioCell11(),
            this.getRatioRow1(),
            this.getRatioColumn1(),
            this.getRatioRow2(),
            this.getRatioColumn2(),
            this.getRatioCell12(),
            this.getRatioCell21(),
            this.getRatioCell22(),
            this.getPositives(),
            this.getNegatives(),
            this.getPositiveRatio(),
            this.getNegativeRatio(),
            this.getPredictedPositives(),
            this.getPredictedNegatives(),
            this.getPredictedPositiveRatio(),
            this.getPredictedNegativeRatio(),
            this.getTruePositives(),
            this.getTruePositiveRatio(),
            this.getTrueNegatives(),
            this.getTrueNegativeRatio(),
            this.getFalsePositives(),
            this.getFalsePositiveRatio(),
            this.getFalseNegatives(),
            this.getFalseNegativeRatio(),
            this.getPositiveNegativeRatio(),
            this.getNegativePositiveRatio(),
            this.getPotentialPositives(),
            this.getPotentialNegatives(),
            this.getPrecision(),
            this.getRecall(),
            this.getF1Score(),
            this.getSupport(),
            this.getHits(),
            this.getCorrectRejections(),
            this.getFalseAlarms(),
            this.getMisses(),
            this.getTypeOneErrors(),
            this.getTypeTwoErrors(),
            this.getTruePositiveRate(),
            this.getTrueNegativeRate(),
            this.getPositivePredictiveValue(),
            this.getNegativePredictiveValue(),
            this.getFalsePositiveRate(),
            this.getFalseDiscoveryRate(),
            this.getFalseNegativeRate(),
            this.getTruePositiveOverTotalRate(),
            this.getTrueNegativeOverTotalRate(),
            this.getFalsePositiveOverTotalRate(),
            this.getFalseNegativeOverTotalRate(),
            this.getTruePositiveOverExplicitTotalRate(explicitTotal),
            this.getTrueNegativeOverExplicitTotalRate(explicitTotal),
            this.getFalsePositiveOverExplicitTotalRate(explicitTotal),
            this.getFalseNegativeOverExplicitTotalRate(explicitTotal),
            this.getConditionPositiveRate(),
            this.getConditionNegativeRate(),
            this.getPredictedPositiveRate(),
            this.getPredictedNegativeRate(),
            this.getConditionPositiveCaughtRate(explicitTotalPositives),
            this.getConditionPositiveMissedRate(explicitTotalPositives),
            this.getConditionNegativeCaughtRate(explicitTotalNegatives),
            this.getConditionNegativeMissedRate(explicitTotalNegatives),
            this.getConditionPositiveDecidedRate(explicitTotalPositives),
            this.getConditionNegativeDecidedRate(explicitTotalNegatives),
            this.getConditionPositiveUndecidedRate(explicitTotalPositives),
            this.getConditionNegativeUndecidedRate(explicitTotalNegatives),
            this.getPredictedPositiveDecidedRate(explicitTotal),
            this.getPredictedNegativeDecidedRate(explicitTotal),
            this.getTotalDecidedRate(explicitTotal),
            this.getTotalUnDecidedRate(explicitTotal),
            this.getConditionPositivesUndecided(explicitTotalPositives),
            this.getConditionNegativesUndecided(explicitTotalNegatives),
            this.getTotalUnDecided(explicitTotal),
            this.getHitRate(),
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- this.getRecall(),
            this.getProbabilityOfDetection(),
            this.getSensitivity(),
            this.getSpecificity(),
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- this.getPrecision(),
            this.getFallOut(),
            this.getProbabilityOfFalseAlarm(),
            this.getMissRate(),
            this.getAccuracy(),
            // ---- NOTE-BASIC-METRIC-DEFINED-ALREADY-FOR-COMPLETENESS ---- this.getF1Score(),
            this.getGMeasure(),
            this.getMatthewsCorrelationCoefficient(),
            this.getInformedness(),
            this.getBookmakerInformedness(),
            this.getMarkedness(),
            this.getFalseOmissionRate(),
            this.getPrevalence(),
            this.getTruePositiveRateOverFalsePositiveRate(),
            this.getPositiveLikelihoodRatio(),
            this.getFalseNegativeRateOverTrueNegativeRate(),
            this.getNegativeLikelihoodRatio(),
            this.getDiagnosticOddsRatio(),
            this.getFMeasure(fMeasureBeta),
            this.getF1Measure(),
            this.getF2Measure(),
            this.getF05Measure(),
            this.getEffectivenessMeasure(effectivenessMeasureAlpha),
            this.getEffectivenessMeasure05(),
            this.getEffectivenessMeasure02(),
            this.getEffectivenessMeasure08(),
            this.getRisk(),
            this.getRiskPredictedNegative(),
            this.getOdds(),
            this.getOddsRatio(),
            this.getRelativeRisk(),
            this.getWeightOfEvidence(),
            this.getPositiveNegativePotentialRatio(),
            this.getChargeBackRate(),
            this.getFraudRate(),
            this.getRejectRate(),
            this.getPE(),
            this.getPETruePositiveExtreme(),
            this.getPEFalsePositiveExtreme(),
            this.getPEFalseNegativeExtreme(),
            this.getPETrueNegativeExtreme(),
            this.getPEPerfect(),
            this.getPEWorst(),
            this.getPEAlwaysReject(),
            this.getPEAlwaysApprove(),
            this.getPERandomBaseline(),
            this.getPEGenericRandomBaseline(rejectRate),
            this.getOPE(),
            this.getOPETruePositiveExtreme(),
            this.getOPEFalsePositiveExtreme(),
            this.getOPEFalseNegativeExtreme(),
            this.getOPETrueNegativeExtreme(),
            this.getOPEPerfect(),
            this.getOPEWorst(),
            this.getOPEAlwaysReject(),
            this.getOPEAlwaysApprove(),
            this.getOPERandomBaseline(),
            this.getOPEGenericRandomBaseline(rejectRate),
            this.getOPEsharp(alpha, beta, A, B),
            this.getOPEsharpRandomBaseline(alpha, beta, A, B),
            this.getOPEsharpGenericRandomBaseline(rejectRate, alpha, beta, A, B),
            this.getNetPE(),
            this.getNetOPE(),
            this.getNetOPEsharp(alpha, beta, A, B),
            this.getGenericNetPE(rejectRate),
            this.getGenericNetOPE(rejectRate),
            this.getGenericNetOPEsharp(rejectRate, alpha, beta, A, B),
            this.getdOPE(),
            this.getOPEPrime(),
            this.getOLR(),
            this.getOGR(),
            this.getInverseDocumentFrequencyRaw(),
            this.getInverseDocumentFrequency(),
            this.getInverseDocumentFrequencyUnary(),
            this.getInverseDocumentFrequencySmooth(),
            this.getInverseDocumentFrequencyMax(explicitMaxPositives),
            this.getInverseDocumentFrequencyProbabilistic(),
            this.getJaccardCoefficient(),
            this.getSimpleMatchingCoefficient(),
            this.getJaccardDenominatorMinCoefficient(),
            this.getJaccardDenominatorMaxCoefficient(),
            explicitTotal,
            explicitTotalPositives,
            explicitTotalNegatives,
            fMeasureBeta,
            effectivenessMeasureAlpha,
            rejectRate,
            alpha,
            beta,
            A,
            B,
            explicitMaxPositives,
        ];
        return metricValues;
    }
}
