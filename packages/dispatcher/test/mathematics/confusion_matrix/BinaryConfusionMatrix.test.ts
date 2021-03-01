/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { BinaryConfusionMatrix } from "../../../src/mathematics/confusion_matrix/BinaryConfusionMatrix";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/confusion_matrix/binary_confusion_matrix", () => {

    const cell11: number = 1;
    const row1: number = 2;
    const column1: number = 2;
    const total: number = 4;
    const binaryConfusionMatrix = new BinaryConfusionMatrix(
        total,
        cell11,
        row1,
        column1);

    it("Test.0000 constructor()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting = new BinaryConfusionMatrix(
            totalTesting,
            cell11Testing,
            row1Testing,
            column1Testing);
    });
    it("Test.0001 getTotal()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getTotal() === 4,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });
    it("Test.0002 getCell11()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getCell11() === 1,
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}`);
    });
    it("Test.0003 getRow1()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getRow1() === 2,
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}`);
    });
    it("Test.0004 getColumn1()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getColumn1() === 2,
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0005 getRow2()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getRow2() === 2,
            `binaryConfusionMatrix.getRow2()=${binaryConfusionMatrix.getRow2()}`);
    });
    it("Test.0006 getColumn2()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getColumn2() === 2,
            `binaryConfusionMatrix.getColumn2()=${binaryConfusionMatrix.getColumn2()}`);
    });
    it("Test.0007 getCell12()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getCell12() === 1,
            `binaryConfusionMatrix.getCell12()=${binaryConfusionMatrix.getCell12()}`);
    });
    it("Test.0008 getCell21()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getCell21() === 1,
            `binaryConfusionMatrix.getCell21()=${binaryConfusionMatrix.getCell21()}`);
    });
    it("Test.0009 getCell22()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getCell22() === 1,
            `binaryConfusionMatrix.getCell22()=${binaryConfusionMatrix.getCell22()}`);
    });
    it("Test.0010 getExpectedCell11()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getExpectedCell11(), 1),
            `binaryConfusionMatrix.getExpectedCell11()=${binaryConfusionMatrix.getExpectedCell11()}`);
    });
    it("Test.0011 getExpectedCell12()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getExpectedCell12(), 1),
            `binaryConfusionMatrix.getExpectedCell12()=${binaryConfusionMatrix.getExpectedCell12()}`);
    });
    it("Test.0012 getExpectedCell21()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getExpectedCell21(), 1),
            `binaryConfusionMatrix.getExpectedCell21()=${binaryConfusionMatrix.getExpectedCell21()}`);
    });
    it("Test.0013 getExpectedCell22()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getExpectedCell22(), 1),
            `binaryConfusionMatrix.getExpectedCell22()=${binaryConfusionMatrix.getExpectedCell22()}`);
    });
    it("Test.0014 getIsProper()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getIsProper(),
            `binaryConfusionMatrix.getIsProper()=${binaryConfusionMatrix.getIsProper()}`);
    });
    it("Test.0015 getRatioCell11()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioCell11(), 0.25),
            `binaryConfusionMatrix.getRatioCell11()=${binaryConfusionMatrix.getRatioCell11()}`);
    });
    it("Test.0016 getRatioRow1()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioRow1(), 0.5),
            `binaryConfusionMatrix.getRatioRow1()=${binaryConfusionMatrix.getRatioRow1()}`);
    });
    it("Test.0017 getRatioColumn1()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioColumn1(), 0.5),
            `binaryConfusionMatrix.getRatioColumn1()=${binaryConfusionMatrix.getRatioColumn1()}`);
    });
    it("Test.0018 getRatioRow2()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioRow2(), 0.5),
            `binaryConfusionMatrix.getRatioRow2()=${binaryConfusionMatrix.getRatioRow2()}`);
    });
    it("Test.0019 getRatioColumn2()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioColumn2(), 0.5),
            `binaryConfusionMatrix.getRatioColumn2()=${binaryConfusionMatrix.getRatioColumn2()}`);
    });
    it("Test.0020 getRatioCell12()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioCell12(), 0.25),
            `binaryConfusionMatrix.getRatioCell12()=${binaryConfusionMatrix.getRatioCell12()}`);
    });
    it("Test.0021 getRatioCell21()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioCell21(), 0.25),
            `binaryConfusionMatrix.getRatioCell21()=${binaryConfusionMatrix.getRatioCell21()}`);
    });
    it("Test.0022 getRatioCell22()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.almostEqual(binaryConfusionMatrix.getRatioCell22(), 0.25),
            `binaryConfusionMatrix.getRatioCell22()=${binaryConfusionMatrix.getRatioCell22()}`);
    });

    it("Test.0100 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.validate(),
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0101 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = -1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
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
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = -2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
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
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = -2;
        const totalTesting: number = 4;
        assert.throws(() => {
            const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
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
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = -4;
        assert.throws(() => {
            const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
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
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 5;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                0,
                0,
                false);
        assert.throws(() => { binaryConfusionMatrixTesting.validate(true); },
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}` +
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });
    it("Test.0106 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 2;
        const column1Testing: number = 5;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                0,
                0,
                false);
        assert.throws(() => { binaryConfusionMatrixTesting.validate(true); },
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}` +
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });
    it("Test.0107 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 3;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                0,
                0,
                false);
        assert.throws(() => { binaryConfusionMatrixTesting.validate(true); },
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}` +
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });
    it("Test.0108 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 3;
        const row1Testing: number = 2;
        const column1Testing: number = 2;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                0,
                0,
                false);
        assert.throws(() => { binaryConfusionMatrixTesting.validate(true); },
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}` +
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });
    it("Test.0109 validate()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cell11Testing: number = 1;
        const row1Testing: number = 3;
        const column1Testing: number = 3;
        const totalTesting: number = 4;
        const binaryConfusionMatrixTesting: BinaryConfusionMatrix =
            new BinaryConfusionMatrix(
                totalTesting,
                cell11Testing,
                row1Testing,
                column1Testing,
                0,
                0,
                false);
        assert.throws(() => { binaryConfusionMatrixTesting.validate(true); },
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}` +
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}`);
    });

    it("Test.0200 getPositives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPositives() === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0201 getNegatives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getNegatives() === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0202 getPositiveRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPositiveRatio() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0203 getNegativeRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getNegativeRatio() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0204 getPredictedPositives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPredictedPositives() === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0205 getPredictedNegatives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPredictedNegatives() === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0206 getPredictedPositiveRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPredictedPositiveRatio() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0207 getPredictedNegativeRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPredictedNegativeRatio() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0208 getTruePositives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getTruePositives() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0209 getTruePositiveRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getTruePositiveRatio() === 0.25,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0210 getTrueNegatives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(onsole(onsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getTrueNegatives() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0211 getTrueNegativeRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getTrueNegativeRatio() === 0.25,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0212 getFalsePositives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getFalsePositives() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0213 getFalsePositiveRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getFalsePositiveRatio() === 0.25,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0214 getFalseNegatives()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(onsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getFalseNegatives() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0215 getFalseNegativeRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getFalseNegativeRatio() === 0.25,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0216 getPositiveNegativeRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPositiveNegativeRatio() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0217 getNegativePositiveRatio()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getNegativePositiveRatio() === 1,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });

    it("Test.0300 getPrecision()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getPrecision() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0301 getRecall()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getRecall() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
    it("Test.0302 getF1Score()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getF1Score() === 0.5,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });

    it("Test.0400 getSupport()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getSupport() === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });

    it("Test.0500 getBasicMetrics()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(binaryConfusionMatrix.getBasicMetrics().get("support") === 2,
            `binaryConfusionMatrix.getTotal()=${binaryConfusionMatrix.getTotal()}` +
            `binaryConfusionMatrix.getCell11()=${binaryConfusionMatrix.getCell11()}` +
            `binaryConfusionMatrix.getRow1()=${binaryConfusionMatrix.getRow1()}` +
            `binaryConfusionMatrix.getColumn1()=${binaryConfusionMatrix.getColumn1()}`);
    });
});
