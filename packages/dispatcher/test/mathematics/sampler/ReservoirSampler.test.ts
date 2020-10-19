/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ReservoirSampler } from "../../../src/mathematics/sampler/ReservoirSampler";

import { DictionaryMapUtility } from "../../../src/data_structure/DictionaryMapUtility";

import { Utility } from "../../../src/Utility/Utility";

import { UnitTestHelper } from "../../Utility/Utility.test";

describe("Test Suite - mathematics/sampler/ReservoirSampler", () => {
    it("Test.0000 addInstance()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 1,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 1,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 1,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 1,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 1");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 1,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 1,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 2,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 2,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 2");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 1,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 1,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 3,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 3,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 3");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 1,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 1,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 4,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label1", "label1 - utterance 0");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 2,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 2,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 5,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 1,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
        }
        sampler.addInstance("label1", "label1 - utterance 1");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 2,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 2,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 6,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 0");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 7,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 1,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 1");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 8,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 2,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 2");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 9,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 3,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 3");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 10,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 4,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 4");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 11,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 5,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 5");
        {
            // ==== assert.ok(sampler.getNumberLabels() === 3,
            // ====     `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            // ==== assert.ok(Utility.getMapLength(sampler.getLabelMap()) === 3,
            // ====     `Utility.getMapLength(sampler.getLabelMap())=${Utility.getMapLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 12,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 6,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
    });

    it("Test.0100 resetLabelsAndMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 1,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 1,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 1,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 1,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 1");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 1,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 1,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 2,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 2,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 2");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 1,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 1,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 3,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 3,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label0", "label0 - utterance 3");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 1,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 1,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 4,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
        }
        sampler.addInstance("label1", "label1 - utterance 0");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 2,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 2,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 5,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 1,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
        }
        sampler.addInstance("label1", "label1 - utterance 1");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 2,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 2,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 6,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 0");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 7,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 1,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 1");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 8,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 2,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 2");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 9,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 3,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 3");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 10,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 4,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 4");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 11,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 5,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
        sampler.addInstance("label2", "label2 - utterance 5");
        sampler.resetLabelsAndMap();
        {
            assert.ok(sampler.getNumberLabels() === 3,
                `sampler.getNumberLabels()=${sampler.getNumberLabels()}`);
            assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap()) === 3,
                `DictionaryMapUtility.getMapLength(sampler.getLabelMap())=${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(sampler.getLabelMap())}`);
            assert.ok(sampler.getNumberInstances() === 12,
                `sampler.getNumberInstances()=${sampler.getNumberInstances()}`);
            assert.ok(sampler.getInstances().label0.length === 4,
                `sampler.getInstances()["label0"].length=${sampler.getInstances().label0.length}`);
            assert.ok(sampler.getInstances().label1.length === 2,
                `sampler.getInstances()["label1"].length=${sampler.getInstances().label1.length}`);
            assert.ok(sampler.getInstances().label2.length === 6,
                `sampler.getInstances()["label2"].length=${sampler.getInstances().label2.length}`);
        }
    });

    it("Test.0200 getNumberLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        const numberLabels: number = sampler.getNumberLabels();
        Utility.debuggingLog(
            `numberLabels=${numberLabels}`);
    });
    it("Test.0201 getLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        const labels: string[] = sampler.getLabels();
        Utility.debuggingLog(
            `labels=${labels}`);
    });
    it("Test.0202 getLabelMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        const labelMap: { [id: string]: number } = sampler.getLabelMap();
        Utility.debuggingLog(
            `labelMap=${labelMap}`);
    });
    it("Test.0203 getInstances()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        const instances: { [id: string]: string[] } = sampler.getInstances();
        Utility.debuggingLog(
            `instances=${instances}`);
    });

    it("Test.0300 getNumberInstances()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        const numberInstances: number = sampler.getNumberInstances();
        Utility.debuggingLog(
            `numberInstances=${numberInstances}`);
    });

    it("Test.0500 sampleInstances()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampler: ReservoirSampler<string> = new ReservoirSampler<string>();
        sampler.addInstance("label0", "label0 - utterance 0");
        sampler.addInstance("label0", "label0 - utterance 1");
        sampler.addInstance("label0", "label0 - utterance 2");
        sampler.addInstance("label0", "label0 - utterance 3");
        sampler.addInstance("label1", "label1 - utterance 0");
        sampler.addInstance("label1", "label1 - utterance 1");
        sampler.addInstance("label2", "label2 - utterance 0");
        sampler.addInstance("label2", "label2 - utterance 1");
        sampler.addInstance("label2", "label2 - utterance 2");
        sampler.addInstance("label2", "label2 - utterance 3");
        sampler.addInstance("label2", "label2 - utterance 4");
        sampler.addInstance("label2", "label2 - utterance 5");
        sampler.resetLabelsAndMap();
        Utility.debuggingLog(
            sampler.getInstances());
        Utility.debuggingLog(
            Object.keys(sampler.getInstances()));
        Utility.debuggingLog(
            "sampler.getNumberInstances() = " + sampler.getNumberInstances());
        Utility.debuggingLog(
            "sampler.getNumberLabels() = " + sampler.getNumberLabels());
        Utility.debuggingLog(
            sampler.getLabels());
        Utility.debuggingLog(
            sampler.getLabelMap());
        Utility.debuggingLog(
            sampler.getInstances());
        const sampledInstances = sampler.sampleInstances(6, 2);
        for (const instance of sampledInstances) {
            Utility.debuggingLog(
                instance);
        }
    });
});
