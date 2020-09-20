/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { IConfusionMatrix } from "../../../src/mathematics/confusion_matrix/IConfusionMatrix";
import { ConfusionMatrix } from "../../../src/mathematics/confusion_matrix/ConfusionMatrix";
import { BinaryConfusionMatrix } from "../../../src/mathematics/confusion_matrix/BinaryConfusionMatrix";

import { DictionaryMapUtility } from "../../../src/data_structure/DictionaryMapUtility";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

function getTestingConfusionMatrix(): ConfusionMatrix {
    const labels: string[] = ["label0", "label1", "label2"];
    const labelMap: Map<string, number> = new  Map<string, number>();
    labelMap.set("label0", 0);
    labelMap.set("label1", 1);
    labelMap.set("label2", 2);
    const confusionMatrix: ConfusionMatrix = new ConfusionMatrix(labels, labelMap);
    confusionMatrix.addInstanceByLabel("label0", "label0");
    confusionMatrix.addInstanceByLabel("label0", "label1");
    confusionMatrix.addInstanceByLabel("label0", "label2");
    confusionMatrix.addInstanceByLabel("label1", "label0");
    confusionMatrix.addInstanceByLabel("label1", "label1");
    confusionMatrix.addInstanceByLabel("label1", "label2");
    confusionMatrix.addInstanceByLabel("label2", "label0");
    confusionMatrix.addInstanceByLabel("label2", "label1");
    confusionMatrix.addInstanceByLabel("label2", "label2");
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
    Utility.debuggingLog(
        Utility.jsonStringify(confusionMatrix.getLabelMap()));
    Utility.debuggingLog(
        "rows=" + confusionMatrix.getConfusionMatrixRows());
    Utility.debuggingLog(
        "columns=" + confusionMatrix.getConfusionMatrixColumns());
    Utility.debuggingLog(
        "total=" + confusionMatrix.getConfusionMatrixTotal());
    const binaryConfusionMatrices: BinaryConfusionMatrix[] =
        confusionMatrix.getBinaryConfusionMatrices();
    const confusionMatrixLabels: string[] = confusionMatrix.getLabels();
    for (let i = 0; i < binaryConfusionMatrices.length; i++) {
        const binaryConfusionMatrix: BinaryConfusionMatrix = binaryConfusionMatrices[i];
        const label: string = confusionMatrixLabels[i];
        Utility.debuggingLog(
            label + ":" + i + ", precision = " + binaryConfusionMatrix.getPrecision());
        Utility.debuggingLog(
            label + ":" + i + ", recall    = " + binaryConfusionMatrix.getRecall());
        Utility.debuggingLog(
            label + ":" + i + ", F1        = " + binaryConfusionMatrix.getF1Score());
        Utility.debuggingLog(
            label + ":" + i + ", Accuracy  = " + binaryConfusionMatrix.getAccuracy());
        Utility.debuggingLog(
            label + ":" + i + ", support   = " + binaryConfusionMatrix.getSupport());
        Utility.debuggingLog(
            label + ":" + i + ", total     = " + binaryConfusionMatrix.getTotal());
    }
    Utility.debuggingLog(
        "micro-quantile metrics = " + confusionMatrix.getMicroQuantileMetrics());
    Utility.debuggingLog(
        "macro-quantile metrics = " + confusionMatrix.getMacroQuantileMetrics());
    Utility.debuggingLog(
        "micro-average metrics = " + confusionMatrix.getMicroAverageMetrics());
    Utility.debuggingLog(
        "summation-micro-average metrics = " + confusionMatrix.getSummationMicroAverageMetrics());
    Utility.debuggingLog(
        "macro-average metrics = " + confusionMatrix.getMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-macro-average metrics = " + confusionMatrix.getSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-summation-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "weighted-macro-average metrics = " + confusionMatrix.getWeightedMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-weighted-macro-average metrics = " + confusionMatrix.getSummationWeightedMacroAverageMetrics());
    return confusionMatrix;
}

describe("Test Suite - model/evaluation/confusion_matrix/confusion_matrix", () => {

    it("Test.0000 constructor()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix = getTestingConfusionMatrix();
    });

    it("Test.0100 addFrom()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix = getTestingConfusionMatrix();
        confusionMatrix.addFrom(confusionMatrix);
        assert.ok(confusionMatrix.getConfusionMatrixTotal() === 18,
            `confusionMatrix.getConfusionMatrixTotal()=${confusionMatrix.getConfusionMatrixTotal()}`);
    });

    it("Test.0201 getNumberLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix = getTestingConfusionMatrix();
        const numberLabels: number = confusionMatrix.getNumberLabels();
        assert.ok(numberLabels === 3,
            `numberLabels=${numberLabels}`);
    });
    it("Test.0201 getLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const labels: string[] = confusionMatrix.getLabels();
        assert.ok(labels.length === 3,
            `labels.length=${labels.length}`);
    });
    it("Test.0202 getLabelMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const labelMap: Map<string, number> =
             confusionMatrix.getLabelMap();
        assert.ok(DictionaryMapUtility.getStringKeyGenericValueMapLength(labelMap) === 3,
            `DictionaryMapUtility.getStringKeyGenericValueMapLength(labelMap)=` +
            `${DictionaryMapUtility.getStringKeyGenericValueMapLength(labelMap)}`);
    });
    it("Test.0203 getConfusionMatrixRows()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixRows: number[] =
            confusionMatrix.getConfusionMatrixRows();
        assert.ok(confusionMatrixRows.length === 3,
            `confusionMatrixRows).length=${confusionMatrixRows.length}`);
    });
    it("Test.0204 getConfusionMatrixColumns()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixColumns: number[] =
            confusionMatrix.getConfusionMatrixColumns();
        assert.ok(confusionMatrixColumns.length === 3,
            `confusionMatrixColumns.length=${confusionMatrixColumns.length}`);
    });
    it("Test.0205 getConfusionMatrixTotal()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixTotal: number =
            confusionMatrix.getConfusionMatrixTotal();
        assert.ok(confusionMatrixTotal === 9,
            `confusionMatrixTotal=${confusionMatrixTotal}`);
    });
    it("Test.0206 getConfusionMatrix()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixCells: number[][] =
            confusionMatrix.getConfusionMatrix();
        assert.ok(confusionMatrixCells.length === 3,
            `confusionMatrixCells.length=${confusionMatrixCells.length}`);
        assert.ok(confusionMatrixCells[0].length === 3,
            `confusionMatrixCells[0].length=${confusionMatrixCells[0].length}`);
        assert.ok(confusionMatrixCells[1].length === 3,
            `confusionMatrixCells[1].length=${confusionMatrixCells[1].length}`);
        assert.ok(confusionMatrixCells[2].length === 3,
            `confusionMatrixCells[2].length=${confusionMatrixCells[2].length}`);
    });

    it("Test.0300 addInstanceByLabelIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        confusionMatrix.addInstanceByLabelIndex(
            0,
            0);
        const confusionMatrixCells: number[][] =
            confusionMatrix.getConfusionMatrix();
        assert.ok(confusionMatrixCells[0][0] === 2,
            `confusionMatrixCells[0][0]=${confusionMatrixCells[0][0]}`);
        assert.ok(confusionMatrix.getConfusionMatrixTotal() === 10,
            `confusionMatrix.getConfusionMatrixTotal()=${confusionMatrix.getConfusionMatrixTotal()}`);
    });

    it("Test.0400 addInstance()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        confusionMatrix.addInstanceByLabel(
            "label0",
            "label0");
        const confusionMatrixCells: number[][] =
            confusionMatrix.getConfusionMatrix();
        assert.ok(confusionMatrixCells[0][0] === 2,
            `confusionMatrixCells[0][0]=${confusionMatrixCells[0][0]}`);
        assert.ok(confusionMatrix.getConfusionMatrixTotal() === 10,
            `confusionMatrix.getConfusionMatrixTotal()=${confusionMatrix.getConfusionMatrixTotal()}`);
    });

    it("Test.0500 getBinaryConfusionMatrices()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix = getTestingConfusionMatrix();
        const binaryConfusionMatrices: BinaryConfusionMatrix[] =
            confusionMatrix.getBinaryConfusionMatrices();
        assert.ok(binaryConfusionMatrices.length === 3,
            `binaryConfusionMatrices.length=${binaryConfusionMatrices.length}`);
        assert.ok(confusionMatrix.getConfusionMatrixTotal() === 9,
            `confusionMatrix.getConfusionMatrixTotal()=${confusionMatrix.getConfusionMatrixTotal()}`);
    });

    it("Test.0600 getMicroAverageMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixMetrics: {
            "averagePrecisionRecallF1Accuracy": number,
            "truePositives": number,
            "falsePositives": number,
            "falseNegatives": number,
            "total": number } =
            confusionMatrix.getMicroAverageMetrics();
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averagePrecisionRecallF1Accuracy, 0.3333333333333333),
            `confusionMatrixMetrics.averagePrecisionRecallF1Accuracy=${confusionMatrixMetrics.averagePrecisionRecallF1Accuracy}`);
        assert.ok(
            confusionMatrixMetrics.truePositives === 3,
            `confusionMatrixMetrics.truePositives=${confusionMatrixMetrics.truePositives}`);
        assert.ok(
            confusionMatrixMetrics.falsePositives === 6,
            `confusionMatrixMetrics.falsePositives=${confusionMatrixMetrics.falsePositives}`);
        assert.ok(
            confusionMatrixMetrics.falseNegatives === 6,
            `confusionMatrixMetrics.falseNegatives=${confusionMatrixMetrics.falseNegatives}`);
        assert.ok(
            confusionMatrixMetrics.total === 9,
            `confusionMatrixMetrics.total=${confusionMatrixMetrics.total}`);
    });

    it("Test.0700 getMacroAverageMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getMacroAverageMetrics();
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averagePrecision, 0.3333333333333333),
            `confusionMatrixMetrics.averagePrecision=${confusionMatrixMetrics.averagePrecision}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageRecall, 0.3333333333333333),
            `confusionMatrixMetrics.averageRecall=${confusionMatrixMetrics.averageRecall}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageF1Score, 0.3333333333333333),
            `confusionMatrixMetrics.averageF1Score=${confusionMatrixMetrics.averageF1Score}`);
        assert.ok(
            confusionMatrixMetrics.total === 9,
            `confusionMatrixMetrics.total=${confusionMatrixMetrics.total}`);
    });

    it("Test.0800 getPositiveSupportLabelMacroAverageMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getPositiveSupportLabelMacroAverageMetrics();
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averagePrecision, 0.3333333333333333),
            `confusionMatrixMetrics.averagePrecision=${confusionMatrixMetrics.averagePrecision}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageRecall, 0.3333333333333333),
            `confusionMatrixMetrics.averageRecall=${confusionMatrixMetrics.averageRecall}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageF1Score, 0.3333333333333333),
            `confusionMatrixMetrics.averageF1Score=${confusionMatrixMetrics.averageF1Score}`);
        assert.ok(
            confusionMatrixMetrics.total === 9,
            `confusionMatrixMetrics.total=${confusionMatrixMetrics.total}`);
    });

    it("Test.0900 getWeightedMacroAverageMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getWeightedMacroAverageMetrics();
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averagePrecision, 0.3333333333333333),
            `confusionMatrixMetrics.averagePrecision=${
                confusionMatrixMetrics.averagePrecision}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageRecall, 0.3333333333333333),
            `confusionMatrixMetrics.averageRecall=${
                confusionMatrixMetrics.averageRecall}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageF1Score, 0.3333333333333333),
            `confusionMatrixMetrics.averageF1Score=${confusionMatrixMetrics.averageF1Score}`);
        assert.ok(
            confusionMatrixMetrics.total === 9,
            `confusionMatrixMetrics.total=${confusionMatrixMetrics.total}`);
    });

    it("Test.1000 getSummationWeightedMacroAverageMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const confusionMatrixMetrics: {
            "averagePrecision": number,
            "averageRecall": number,
            "averageF1Score": number,
            "averageTruePositives": number,
            "averageFalsePositives": number,
            "averageTrueNegatives": number,
            "averageFalseNegatives": number,
            "averageAccuracy": number,
            "averageSupport": number,
            "total": number } =
            confusionMatrix.getSummationWeightedMacroAverageMetrics();
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averagePrecision, 0.3333333333333333),
            `confusionMatrixMetrics.averagePrecision=${
                confusionMatrixMetrics.averagePrecision}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageRecall, 0.3333333333333333),
            `confusionMatrixMetrics.averageRecall=${
                confusionMatrixMetrics.averageRecall}`);
        assert.ok(Utility.almostEqual(
            confusionMatrixMetrics.averageF1Score, 0.3333333333333333),
            `confusionMatrixMetrics.averageF1Score=${confusionMatrixMetrics.averageF1Score}`);
        assert.ok(
            confusionMatrixMetrics.total === 9,
            `confusionMatrixMetrics.total=${confusionMatrixMetrics.total}`);
    });

    it("Test.1100 validateLabelId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const labelId: number = 0;
        const isValid: boolean = confusionMatrix.validateLabelId(labelId);
        assert.ok(isValid,
            `labelId=${labelId}`);
    });
    it("Test.1101 validateLabelId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const labelId: number = -1;
        assert.throws(() => { confusionMatrix.validateLabelId(labelId); },
            `labelId=${labelId}`);
    });
    it("Test.1102 validateLabelId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const labelId: number = -3;
        assert.throws(() => { confusionMatrix.validateLabelId(labelId); },
            `labelId=${labelId}`);
    });
    it("Test.1103 validateLabel()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const label: string = "label0";
        const isValid: boolean = confusionMatrix.validateLabel(label);
        assert.ok(isValid,
            `label=${label}`);
    });
    it("Test.1104 validateLabel()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix =  getTestingConfusionMatrix();
        const label: string = "label3";
        assert.throws(() => { confusionMatrix.validateLabel(label); },
            `label=${label}`);
    });

    it("Test.1200 generateConfusionMatrixMetricStructure()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const confusionMatrix: ConfusionMatrix = getTestingConfusionMatrix();
        const confusionMatrixMetricStructure: {
            "confusionMatrix": IConfusionMatrix,
            "labelBinaryConfusionMatrixBasicMetricMap": Map<string, Map<string, number>>,
            "labelBinaryConfusionMatrixMap": Map<string, BinaryConfusionMatrix>,
            "microQuantileMetrics": {
                "quantilesPrecisions": number[],
                "quantilesRecalls": number[],
                "quantilesF1Scores": number[],
                "quantilesTruePositives": number[],
                "quantilesFalsePositives": number[],
                "quantilesTrueNegatives": number[],
                "quantilesFalseNegatives": number[],
                "quantilesAccuracies": number[],
                "quantilesSupports": number[],
                "total": number },
            "macroQuantileMetrics": {
                "quantilesPrecisions": number[],
                "quantilesRecalls": number[],
                "quantilesF1Scores": number[],
                "quantilesTruePositives": number[],
                "quantilesFalsePositives": number[],
                "quantilesTrueNegatives": number[],
                "quantilesFalseNegatives": number[],
                "quantilesAccuracies": number[],
                "quantilesSupports": number[],
                "total": number },
            "microAverageMetrics": {
                "accuracy": number,
                "truePositives": number,
                "falsePositives": number,
                "falseNegatives": number,
                "total": number },
            "summationMicroAverageMetrics": {
                "summationPrecision": number,
                "summationRecall": number,
                "summationF1Score": number,
                "summationAccuracy": number,
                "summationTruePositives": number,
                "summationFalsePositives": number,
                "summationTrueNegatives": number,
                "summationFalseNegatives": number,
                "summationSupport": number,
                "total": number },
            "macroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "summationMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "positiveSupportLabelMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "positiveSupportLabelSummationMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number },
            "weightedMacroAverageMetrics": {
                "weightedAveragePrecision": number,
                "weightedAverageRecall": number,
                "weightedAverageF1Score": number,
                "weightedAverageAccuracy": number,
                "weightedAverageSupport": number,
                "total": number },
            "summationWeightedMacroAverageMetrics": {
                "averagePrecision": number,
                "averageRecall": number,
                "averageF1Score": number,
                "averageAccuracy": number,
                "averageTruePositives": number,
                "averageFalsePositives": number,
                "averageTrueNegatives": number,
                "averageFalseNegatives": number,
                "averageSupport": number,
                "total": number } } =
            confusionMatrix.generateConfusionMatrixMetricStructure();
        const confusionMatrixMetrics: [number, number, number, number, number] =
            [ confusionMatrixMetricStructure.macroAverageMetrics.averagePrecision,
              confusionMatrixMetricStructure.macroAverageMetrics.averageRecall,
              confusionMatrixMetricStructure.macroAverageMetrics.averageF1Score,
              confusionMatrixMetricStructure.macroAverageMetrics.averageAccuracy,
              confusionMatrixMetricStructure.macroAverageMetrics.total ];
        Utility.debuggingLog(
            `confusionMatrixMetricStructure=${Utility.jsonStringify(confusionMatrixMetricStructure)}`);
        assert.ok(Utility.almostEqual(confusionMatrixMetrics[0], 0.3333333333333333),
            `confusionMatrixMetrics[0]=${confusionMatrixMetrics[0]}`);
        assert.ok(Utility.almostEqual(confusionMatrixMetrics[1], 0.3333333333333333),
            `confusionMatrixMetrics[1]=${confusionMatrixMetrics[1]}`);
        assert.ok(Utility.almostEqual(confusionMatrixMetrics[2], 0.3333333333333333),
            `confusionMatrixMetrics[2]=${confusionMatrixMetrics[2]}`);
        assert.ok(Utility.almostEqual(confusionMatrixMetrics[3], 0.5555555555555556),
            `confusionMatrixMetrics[3]=${confusionMatrixMetrics[3]}`);
        assert.ok(confusionMatrixMetrics[4] === 9,
            `confusionMatrixMetrics[4]=${confusionMatrixMetrics[4]}`);
    });
});
