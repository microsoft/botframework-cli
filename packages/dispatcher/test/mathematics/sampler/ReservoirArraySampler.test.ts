/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ReservoirArraySampler } from "../../../src/mathematics/sampler/ReservoirArraySampler";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/sampler/ReservoirArraySampler", () => {
    it("Test.0000 addInstance()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        sampler.addInstance(0);
        {
            assert.ok(sampler.getNumberInstances() === 1,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        }
        sampler.addInstance(1);
        {
            assert.ok(sampler.getNumberInstances() === 2,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        }
    });

    it("Test.0100 resetInstancesBeginEndIndex()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            sampler.getInstances());
        Utility.debuggingLog(
            Object.keys(sampler.getInstances()));
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        sampler.resetInstancesBeginEndIndex(10, 30);
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 20,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 10,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 30,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });

    it("Test.0200 getNumberInstances()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });
    it("Test.0201 getInstances()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        Utility.debuggingLog(
            "sampler.getInstances() = " + sampler.getInstances());
        const sampledInstances: number[] = [...sampler.getInstances()];
        assert.ok(sampledInstances.length === 100,
            `sampledInstances.length=${sampledInstances.length}`);
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });

    it("Test.0300 getNumberInstancesSampling()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        sampler.resetInstancesBeginEndIndex(10, 30);
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 20,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 10,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 30,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });
    it("Test.0301 getInstancesBeginIndex()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        sampler.resetInstancesBeginEndIndex(10, 30);
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 20,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 10,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 30,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });
    it("Test.0302 getInstancesEndIndex()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        sampler.resetInstancesBeginEndIndex(10, 30);
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 20,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 10,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 30,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
    });

    it("Test.0500 sampleInstances()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
        for (let index = 0; index < 100; index++) {
            sampler.addInstance(index);
        }
        sampler.resetInstancesBeginEndIndex();
        Utility.debuggingLog(
            sampler.getInstances());
        Utility.debuggingLog(
            Object.keys(sampler.getInstances()));
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 100,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 0,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 100,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        sampler.resetInstancesBeginEndIndex(10, 30);
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
        Utility.debuggingLog(
            "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
        Utility.debuggingLog(
            "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
        assert.ok(sampler.getNumberInstances() === 100,
            `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
        assert.ok(sampler.getNumberInstancesSampling() === 20,
            `sampler.getNumberInstancesSampling()=${sampler.getNumberInstancesSampling()}`);
        assert.ok(sampler.getInstancesBeginIndex() === 10,
            `sampler.getInstancesBeginIndex()=${sampler.getInstancesBeginIndex()}`);
        assert.ok(sampler.getInstancesEndIndex() === 30,
            `sampler.getInstancesEndIndex()=${sampler.getInstancesEndIndex()}`);
        const sampledInstanceGenerator = sampler.sampleInstances(10);
        for (const instance of sampledInstanceGenerator) {
            Utility.debuggingLog(
                instance);
        }
        const sampledInstances: number[] = [...sampler.sampleInstances(10)];
        Utility.debuggingLog(
            "sampledInstances.length = " + sampledInstances.length);
        assert.ok(sampledInstances.length === 10,
            `sampledInstances.length=${sampledInstances.length}`);
    });
});
