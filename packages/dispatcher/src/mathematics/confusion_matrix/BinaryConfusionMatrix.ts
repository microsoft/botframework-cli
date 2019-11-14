/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MathematicsHelper } from "../mathematics_helper/MathematicsHelper";

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

    constructor(
        total: number,
        cell11: number,
        row1: number,
        column1: number,
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

    public getDerivedMetrics(): { [id: string]: number; } {
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
}
