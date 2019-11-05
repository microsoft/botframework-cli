/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { BinaryConfusionMatrixMetrics } from "../../../src/mathematics/confusion_matrix/binary_confusion_matrix";

import { Utility } from "../../../src/utility/utility";

describe("Test Suite - mathematics/confusion_matrix/binary_confusion_matrix", () => {

    const cell11: number = 1;
    const row1: number = 2;
    const column1: number = 2;
    const total: number = 4;
    const binaryConfusionMatrixMetrics = new BinaryConfusionMatrixMetrics(
        total,
        cell11,
        row1,
        column1);

    it("Test.0000 constructor()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting = new BinaryConfusionMatrixMetrics(
            totalTesting,
            cell11Testing,
            row1Testing,
            column1Testing);
    });
    it("Test.0001 getTotal()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getTotal() === 4,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });
    it("Test.0002 getCell11()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getCell11() === 1,
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}`);
    });
    it("Test.0003 getRow1()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getRow1() === 2,
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}`);
    });
    it("Test.0004 getColumn1()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getColumn1() === 2,
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0005 getRow2()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getRow2() === 2,
            `binaryConfusionMatrixMetrics.getRow2()=${binaryConfusionMatrixMetrics.getRow2()}`);
    });
    it("Test.0006 getColumn2()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getColumn2() === 2,
            `binaryConfusionMatrixMetrics.getColumn2()=${binaryConfusionMatrixMetrics.getColumn2()}`);
    });
    it("Test.0007 getCell12()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getCell12() === 1,
            `binaryConfusionMatrixMetrics.getCell12()=${binaryConfusionMatrixMetrics.getCell12()}`);
    });
    it("Test.0008 getCell21()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getCell21() === 1,
            `binaryConfusionMatrixMetrics.getCell21()=${binaryConfusionMatrixMetrics.getCell21()}`);
    });
    it("Test.0009 getCell22()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getCell22() === 1,
            `binaryConfusionMatrixMetrics.getCell22()=${binaryConfusionMatrixMetrics.getCell22()}`);
    });
    it("Test.0010 getExpectedCell11()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getExpectedCell11(), 1),
            `binaryConfusionMatrixMetrics.getExpectedCell11()=${binaryConfusionMatrixMetrics.getExpectedCell11()}`);
    });
    it("Test.0011 getExpectedCell12()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getExpectedCell12(), 1),
            `binaryConfusionMatrixMetrics.getExpectedCell12()=${binaryConfusionMatrixMetrics.getExpectedCell12()}`);
    });
    it("Test.0012 getExpectedCell21()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getExpectedCell21(), 1),
            `binaryConfusionMatrixMetrics.getExpectedCell21()=${binaryConfusionMatrixMetrics.getExpectedCell21()}`);
    });
    it("Test.0013 getExpectedCell22()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getExpectedCell22(), 1),
            `binaryConfusionMatrixMetrics.getExpectedCell22()=${binaryConfusionMatrixMetrics.getExpectedCell22()}`);
    });
    it("Test.0014 getIsProper()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getIsProper(),
            `binaryConfusionMatrixMetrics.getIsProper()=${binaryConfusionMatrixMetrics.getIsProper()}`);
    });
    it("Test.0015 getRatioCell11()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioCell11(), 0.25),
            `binaryConfusionMatrixMetrics.getRatioCell11()=${binaryConfusionMatrixMetrics.getRatioCell11()}`);
    });
    it("Test.0016 getRatioRow1()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioRow1(), 0.5),
            `binaryConfusionMatrixMetrics.getRatioRow1()=${binaryConfusionMatrixMetrics.getRatioRow1()}`);
    });
    it("Test.0017 getRatioColumn1()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioColumn1(), 0.5),
            `binaryConfusionMatrixMetrics.getRatioColumn1()=${binaryConfusionMatrixMetrics.getRatioColumn1()}`);
    });
    it("Test.0018 getRatioRow2()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioRow2(), 0.5),
            `binaryConfusionMatrixMetrics.getRatioRow2()=${binaryConfusionMatrixMetrics.getRatioRow2()}`);
    });
    it("Test.0019 getRatioColumn2()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioColumn2(), 0.5),
            `binaryConfusionMatrixMetrics.getRatioColumn2()=${binaryConfusionMatrixMetrics.getRatioColumn2()}`);
    });
    it("Test.0020 getRatioCell12()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioCell12(), 0.25),
            `binaryConfusionMatrixMetrics.getRatioCell12()=${binaryConfusionMatrixMetrics.getRatioCell12()}`);
    });
    it("Test.0021 getRatioCell21()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioCell21(), 0.25),
            `binaryConfusionMatrixMetrics.getRatioCell21()=${binaryConfusionMatrixMetrics.getRatioCell21()}`);
    });
    it("Test.0022 getRatioCell22()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrixMetrics.getRatioCell22(), 0.25),
            `binaryConfusionMatrixMetrics.getRatioCell22()=${binaryConfusionMatrixMetrics.getRatioCell22()}`);
    });

    it("Test.0100 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.validate(),
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0101 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = -1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
                new BinaryConfusionMatrixMetrics(
                    totalTesting,
                    cell11Testing,
                    row1Testing,
                    column1Testing);
            },
            `cell11Testing=${cell11Testing}` +
            `row1Testing=${row1Testing}` +
            `column1Testing=${column1Testing}` +
            `totalTesting=${totalTesting}`);
    });
    it("Test.0102 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = -2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
                new BinaryConfusionMatrixMetrics(
                    totalTesting,
                    cell11Testing,
                    row1Testing,
                    column1Testing);
            },
            `cell11Testing=${cell11Testing}` +
            `row1Testing=${row1Testing}` +
            `column1Testing=${column1Testing}` +
            `totalTesting=${totalTesting}`);
    });
    it("Test.0103 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = -2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
                new BinaryConfusionMatrixMetrics(
                    totalTesting,
                    cell11Testing,
                    row1Testing,
                    column1Testing);
            },
            `cell11Testing=${cell11Testing}` +
            `row1Testing=${row1Testing}` +
            `column1Testing=${column1Testing}` +
            `totalTesting=${totalTesting}`);
    });
    it("Test.0104 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = -4;
        assert.throws(() => {
            const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
                new BinaryConfusionMatrixMetrics(
                    totalTesting,
                    cell11Testing,
                    row1Testing,
                    column1Testing);
            },
            `cell11Testing=${cell11Testing}` +
            `row1Testing=${row1Testing}` +
            `column1Testing=${column1Testing}` +
            `totalTesting=${totalTesting}`);
    });
    it("Test.0105 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 5;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
            new BinaryConfusionMatrixMetrics(
                totalTesting,
                cell11Testing,
                row1Testing,
                    column1Testing,
            false);
        assert.throws(() => { binaryConfusionMatrixMetricsTesting.validate(true); },
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}` +
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });
    it("Test.0106 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 5;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
            new BinaryConfusionMatrixMetrics(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                false);
        assert.throws(() => { binaryConfusionMatrixMetricsTesting.validate(true); },
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}` +
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });
    it("Test.0107 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 3;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
            new BinaryConfusionMatrixMetrics(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                false);
        assert.throws(() => { binaryConfusionMatrixMetricsTesting.validate(true); },
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}` +
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });
    it("Test.0108 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 3;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
            new BinaryConfusionMatrixMetrics(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                false);
        assert.throws(() => { binaryConfusionMatrixMetricsTesting.validate(true); },
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}` +
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });
    it("Test.0109 validate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 3;
        const column1Testing: number = 3;
        const totalTesting: number = 4;
        const binaryConfusionMatrixMetricsTesting: BinaryConfusionMatrixMetrics =
            new BinaryConfusionMatrixMetrics(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                false);
        assert.throws(() => { binaryConfusionMatrixMetricsTesting.validate(true); },
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}` +
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}`);
    });

    it("Test.0200 getPositives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPositives() === 2,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0201 getNegatives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getNegatives() === 2,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0202 getPositiveRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPositiveRatio() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0203 getNegativeRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getNegativeRatio() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0204 getPredictedPositives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPredictedPositives() === 2,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0205 getPredictedNegatives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPredictedNegatives() === 2,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0206 getPredictedPositiveRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPredictedPositiveRatio() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0207 getPredictedNegativeRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPredictedNegativeRatio() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0208 getTruePositives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getTruePositives() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0209 getTruePositiveRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getTruePositiveRatio() === 0.25,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0210 getTrueNegatives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getTrueNegatives() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0211 getTrueNegativeRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getTrueNegativeRatio() === 0.25,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0212 getFalsePositives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getFalsePositives() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0213 getFalsePositiveRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getFalsePositiveRatio() === 0.25,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0214 getFalseNegatives()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getFalseNegatives() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0215 getFalseNegativeRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getFalseNegativeRatio() === 0.25,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0216 getPositiveNegativeRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPositiveNegativeRatio() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0217 getNegativePositiveRatio()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getNegativePositiveRatio() === 1,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });

    it("Test.0300 getPrecision()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getPrecision() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0301 getRecall()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getRecall() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
    it("Test.0302 getF1Score()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getF1Score() === 0.5,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });

    it("Test.0400 getSupport()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrixMetrics.getSupport() === 2,
            `binaryConfusionMatrixMetrics.getTotal()=${binaryConfusionMatrixMetrics.getTotal()}` +
            `binaryConfusionMatrixMetrics.getCell11()=${binaryConfusionMatrixMetrics.getCell11()}` +
            `binaryConfusionMatrixMetrics.getRow1()=${binaryConfusionMatrixMetrics.getRow1()}` +
            `binaryConfusionMatrixMetrics.getColumn1()=${binaryConfusionMatrixMetrics.getColumn1()}`);
    });
});
