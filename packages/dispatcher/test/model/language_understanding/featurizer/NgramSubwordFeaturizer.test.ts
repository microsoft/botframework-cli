/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ColumnarContentEmail } from "../../../data/ColumnarData.test";

import { ColumnarData } from "../../../../src/data/ColumnarData";

import { NgramSubwordFeaturizer } from "../../../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../utility/Utility.test";

function getNgramSubwordFeaturizerForUnitTests(
    subwordNgramBegin: number = 3,
    subwordNgramEnd: number = 4,
    toLowercase: boolean = true,
    toRemovePunctuations: boolean = false,
    toRemoveEmptyElements: boolean = true,
    splitDelimiter: string = " ",
    numberHashingFeaturesSetting: number = 0): NgramSubwordFeaturizer {
    const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
        subwordNgramBegin,
        subwordNgramEnd,
        toLowercase,
        toRemovePunctuations,
        toRemoveEmptyElements,
        splitDelimiter,
        numberHashingFeaturesSetting);
    const columnarData: ColumnarData = ColumnarData.createColumnarData(
        ColumnarContentEmail,
        featurizer,
        0,
        2,
        1,
        true);
    return featurizer;
}

function getHashingNgramSubwordFeaturizerForUnitTests(
    subwordNgramBegin: number = 3,
    subwordNgramEnd: number = 4,
    toLowercase: boolean = true,
    toRemovePunctuations: boolean = false,
    toRemoveEmptyElements: boolean  = true,
    splitDelimiter: string = " ",
    numberHashingFeaturesSetting: number = 1024): NgramSubwordFeaturizer {
    const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
        subwordNgramBegin,
        subwordNgramEnd,
        toLowercase,
        toRemovePunctuations,
        toRemoveEmptyElements,
        splitDelimiter,
        numberHashingFeaturesSetting);
    const columnarData: ColumnarData = ColumnarData.createColumnarData(
        ColumnarContentEmail,
        featurizer,
        0,
        2,
        1,
        true);
    return featurizer;
}

const featurizerColumnarContentEmail: NgramSubwordFeaturizer = getNgramSubwordFeaturizerForUnitTests();
const hashingFeaturizerColumnarContentEmail: NgramSubwordFeaturizer = getHashingNgramSubwordFeaturizerForUnitTests();

describe("Test Suite - model/language_understanding/featurizer/ngram_subword_featurizer", () => {
    it("Test.0000 constructor()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
        const input: string = "add flag to the email john just sent to me";
        const result: string[] = featurizer.featurize(input);
        Utility.debuggingLog(input);
        Utility.debuggingLog(result);
        Utility.debuggingLog("hashing code = " + Utility.getPositiveStringHashCode(input));
    });

    it("Test.0100 getIntentsUtterances()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentsUtterances: { "intents": string[], "utterances": string[] } =
            featurizer.getIntentsUtterances();
        Utility.debuggingLog(
            `intentsUtterances=${JSON.stringify(intentsUtterances)}`);
    });

    it("Test.0200 getLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const labels: string[] =
            featurizer.getLabels();
        const numberLabels: number =
            labels.length;
        Utility.debuggingLog(
            `numberHashingFeatures=${numberLabels}`);
        assert.ok(numberLabels === 15,
            `numberHashingFeatures=${numberLabels}`);
    });
    it("Test.0201 getLabelMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const labelMap: { [id: string]: number; } =
            featurizer.getLabelMap();
        const numberLabels: number =
            Utility.getMapLength(labelMap);
        Utility.debuggingLog(
            `numberHashingFeatures)=${numberLabels}`);
        assert.ok(Utility.getMapLength(labelMap) === 15,
            `numberHashingFeatures=${numberLabels}`);
    });
    it("Test.0202 getFeatures()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const features: string[] =
            featurizer.getFeatures();
        const numberFeatures: number =
            features.length;
        Utility.debuggingLog(
            `numberHashingFeatures=${numberFeatures}`);
        assert.ok(features.length === 5641,
            `numberHashingFeatures=${numberFeatures}`);
    });
    it("Test.0203 getFeatureMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureMap: { [id: string]: number; } =
            featurizer.getFeatureMap();
        const numberFeatures: number =
            Utility.getMapLength(featureMap);
        Utility.debuggingLog(
            `numberHashingFeatures)=${numberFeatures}`);
        assert.ok(Utility.getMapLength(featureMap) === 5641,
            `numberHashingFeatures=${numberFeatures}`);
    });
    it("Test.0204 getHashingFeatureArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const hashingFeatureArrays: Array<Set<string>> =
            featurizer.getHashingFeatureArrays();
        const numberHashingFeatures: number =
            hashingFeatureArrays.length;
        Utility.debuggingLog(
            `numberHashingFeaturesSetting=${numberHashingFeatures}`);
        assert.ok(numberHashingFeatures === 1024,
            `numberHashingFeaturesSetting=${numberHashingFeatures}`);
    });

    it("Test.0300 getNumberHashingFeaturesSetting()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const numberHashingFeaturesSetting: number =
            featurizer.getNumberHashingFeaturesSetting();
        Utility.debuggingLog(
            `numberHashingFeaturesSetting=${numberHashingFeaturesSetting}`);
        assert.ok(numberHashingFeaturesSetting === 1024,
            `numberHashingFeaturesSetting=${numberHashingFeaturesSetting}`);
    });

    it("Test.0400 getNumberLabels()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const numberLabels: number =
            featurizer.getNumberLabels();
        Utility.debuggingLog(
            `numberHashingFeatures=${numberLabels}`);
        assert.ok(numberLabels === 15,
            `numberHashingFeatures=${numberLabels}`);
    });
    it("Test.0401 getNumberFeatures()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const numberFeatures: number =
            featurizer.getNumberFeatures();
        Utility.debuggingLog(
            `numberHashingFeatures=${numberFeatures}`);
        assert.ok(numberFeatures === 5641,
            `numberHashingFeatures=${numberFeatures}`);
    });
    it("Test.0402 getNumberHashingFeatures()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const numberHashingFeatures: number =
            featurizer.getNumberHashingFeatures();
        Utility.debuggingLog(
            `numberHashingFeatures=${numberHashingFeatures}`);
        assert.ok(numberHashingFeatures === 1024,
            `numberHashingFeatures=${numberHashingFeatures}`);
    });

    it("Test.0500 getLabelIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const label: string = "AddFlag";
        const labelIndex: number =
            featurizer.getLabelIndex(label);
        Utility.debuggingLog(
            `labelIndex=${labelIndex}`);
        assert.ok(labelIndex === 0,
            `labelIndex=${labelIndex}`);
    });
    it("Test.0501 getLabelIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const label: string = "label";
        const labelIndex: number =
            featurizer.getLabelIndex(label, false);
        Utility.debuggingLog(
            `labelIndex=${labelIndex}`);
        assert.ok(labelIndex === -1,
            `labelIndex=${labelIndex}`);
    });
    it("Test.0502 getLabelIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const label: string = "label";
        assert.throws(() => {
            featurizer.getLabelIndex(label);
        },
            `label=${label}`);
    });
    it("Test.0503 getFeatureIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const feature: string = "flag";
        const featureIndex: number =
            featurizer.getFeatureIndex(feature);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureIndex === 1,
            `featureIndex=${featureIndex}`);
    });
    it("Test.0504 getFeatureIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const feature: string = " flag ";
        const featureIndex: number =
            featurizer.getFeatureIndex(feature, false);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureIndex === -1,
            `featureIndex=${featureIndex}`);
    });
    it("Test.0505 getFeatureIndex()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const feature: string = " flag ";
        assert.throws(() => {
            featurizer.getFeatureIndex(feature);
        },
            `feature=${feature}`);
    });

    it("Test.0600 createFeatureSparseIndexArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureText: string = "add flag to the email john just sent to me";
        const featureSparseIndexArray: number[] =
            featurizer.createFeatureSparseIndexArray(featureText);
        Utility.debuggingLog(
            `featureSparseIndexArray=${featureSparseIndexArray}`);
        assert.ok(featureSparseIndexArray.length === 87,
            `featureSparseIndexArray.length=${featureSparseIndexArray.length}`);
    });

    it("Test.0700 createFeatureSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged" ];
        const featureSparseIndexArrays: number[][] =
            featurizer.createFeatureSparseIndexArrays(featureTexts);
        Utility.debuggingLog(
            `featureSparseIndexArrays=${featureSparseIndexArrays}`);
        Utility.debuggingLog(
            `featureSparseIndexArrays[0].length=${featureSparseIndexArrays[0].length}`);
        Utility.debuggingLog(
            `featureSparseIndexArrays[1].length=${featureSparseIndexArrays[1].length}`);
        assert.ok(featureSparseIndexArrays.length === 2,
            `featureSparseIndexArrays.length=${featureSparseIndexArrays.length}`);
        assert.ok(featureSparseIndexArrays[0].length === 87,
            `featureSparseIndexArrays[0].length=${featureSparseIndexArrays[0].length}`);
        assert.ok(featureSparseIndexArrays[1].length === 26,
            `featureSparseIndexArrays[1].length=${featureSparseIndexArrays[1].length}`);
    });

    it("Test.0800 createIntentUtteranceSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const intentUtteranceSparseIndexArrays: {
            "intentLabelIndexArray": number[],
            "utteranceFeatureIndexArrays": number[][],
            } = featurizer.createIntentUtteranceSparseIndexArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceSparseIndexArrays=${intentUtteranceSparseIndexArrays}`);
        const intentLabelIndexArray: number[] =
            intentUtteranceSparseIndexArrays.intentLabelIndexArray;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceSparseIndexArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArray.length === 601,
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 87,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.0900 createFeatureMiniBatchingSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const intentUtteranceSparseIndexArrays: number[][] =
            featurizer.createFeatureMiniBatchingSparseIndexArrays(featureTexts);
        Utility.debuggingLog(
            `intentUtteranceSparseIndexArrays=${intentUtteranceSparseIndexArrays}`);
        Utility.debuggingLog(
            `intentUtteranceSparseIndexArrays.length=${intentUtteranceSparseIndexArrays.length}`);
        assert.ok(intentUtteranceSparseIndexArrays.length === 2,
            `intentUtteranceSparseIndexArrays.length=${intentUtteranceSparseIndexArrays.length}`);
    });

    it("Test.1000 createFeatureMiniBatchingSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentsUtterances: {
            "intents": string[],
            "utterances": string[],
            } = featurizer.getIntentsUtterances();
        const intentUtteranceMiniBatchingSparseIndexArrays: {
            "intentLabelIndexArray": number[],
            "utteranceFeatureIndexArrays": number[][],
            } = featurizer.createIntentUtteranceMiniBatchingSparseIndexArrays(
                intentsUtterances, 0, 2);
        Utility.debuggingLog(
            `intentUtteranceMiniBatchingSparseIndexArrays=${intentUtteranceMiniBatchingSparseIndexArrays}`);
        const intentLabelIndexArray: number[] =
            intentUtteranceMiniBatchingSparseIndexArrays.intentLabelIndexArray;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceMiniBatchingSparseIndexArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArray.length === 2,
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 2,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 87,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.1100 createFeatureHashingSparseIndexArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const featureText: string = "add flag to the email john just sent to me";
        const featureArray: number[] =
            featurizer.createFeatureHashingSparseIndexArray(featureText);
        Utility.debuggingLog(
            `featureArray=${featureArray}`);
        assert.ok(featureArray.length === 87,
            `featureArray.length=${featureArray.length}`);
    });

    it("Test.1200 createFeatureHashingSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const featureSparseIndexArrays: number[][] =
            featurizer.createFeatureHashingSparseIndexArrays(featureTexts);
        Utility.debuggingLog(
            `featureSparseIndexArrays=${featureSparseIndexArrays}`);
        Utility.debuggingLog(
            `featureSparseIndexArrays[0].length=${featureSparseIndexArrays[0].length}`);
        Utility.debuggingLog(
            `featureSparseIndexArrays[1].length=${featureSparseIndexArrays[1].length}`);
        assert.ok(featureSparseIndexArrays.length === 2,
            `featureSparseIndexArrays.length=${featureSparseIndexArrays.length}`);
        assert.ok(featureSparseIndexArrays[0].length === 87,
            `featureSparseIndexArrays[0].length=${featureSparseIndexArrays[0].length}`);
        assert.ok(featureSparseIndexArrays[1].length === 26,
            `featureSparseIndexArrays[1].length=${featureSparseIndexArrays[1].length}`);
    });

    it("Test.1300 createIntentUtteranceHashingSparseIndexArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const intentUtteranceSparseIndexArrays: {
            "intentLabelIndexArray": number[],
            "utteranceFeatureIndexArrays": number[][],
        } = featurizer.createIntentUtteranceHashingSparseIndexArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceSparseIndexArrays=${intentUtteranceSparseIndexArrays}`);
        const intentLabelIndexArray: number[] =
            intentUtteranceSparseIndexArrays.intentLabelIndexArray;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceSparseIndexArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArray.length === 601,
            `intentLabelIndexArray.length=${intentLabelIndexArray.length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 87,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.1400 createLabelOneHotEncoderBooleanArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const label: string = "AddFlag";
        const labelIndex: number =
            featurizer.getLabelIndex(label);
        const labelArray: boolean[] =
            featurizer.createLabelOneHotEncoderBooleanArray(label);
        Utility.debuggingLog(
            `labelArray=${labelArray}`);
        assert.ok(labelArray.length === 15,
            `labelArray=${labelArray}`);
        assert.ok(labelArray[labelIndex] === true,
            `labelArray=${labelArray}`);
    });
    it("Test.1401 createLabelOneHotEncoderNumberArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const label: string = "AddFlag";
        const labelIndex: number =
            featurizer.getLabelIndex(label);
        const labelArray: number[] =
            featurizer.createLabelOneHotEncoderNumberArray(label);
        Utility.debuggingLog(
            `labelArray=${labelArray}`);
        assert.ok(labelArray.length === 15,
            `labelArray=${labelArray}`);
        assert.ok(labelArray[labelIndex] === 1,
            `labelArray=${labelArray}`);
    });

    it("Test.1500 createFeatureOneHotEncoderBooleanArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const feature: string = "add flag to the email john just sent to me";
        const featureIndex: number =
            featurizer.getFeatureIndex("flag");
        const featureArray: boolean[] =
            featurizer.createFeatureOneHotEncoderBooleanArray(feature);
        Utility.debuggingLog(
            `featureArray=${featureArray}`);
        Utility.debuggingLog(
            `featureArray.length=${featureArray.length}`);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureArray.length === 5641,
            `featureArray=${featureArray}`);
        assert.ok(featureArray[featureIndex] === true,
            `featureArray=${featureArray}`);
    });
    it("Test.1501 createFeatureOneHotEncoderNumberArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const feature: string = "add flag to the email john just sent to me";
        const featureIndex: number =
            featurizer.getFeatureIndex("flag");
        const featureArray: number[] =
            featurizer.createFeatureOneHotEncoderNumberArray(feature);
        Utility.debuggingLog(
            `featureArray=${featureArray}`);
        Utility.debuggingLog(
            `featureArray.length=${featureArray.length}`);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureArray.length === 5641,
            `featureArray=${featureArray}`);
        assert.ok(featureArray[featureIndex] === 1,
            `featureArray=${featureArray}`);
    });

    it("Test.1600 createFeatureOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: boolean[][] = featurizer.createFeatureOneHotEncoderBooleanArrays(
            featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays[0].length === 5641,
            `inputArrays[0].length=${inputArrays[0].length}`);
        assert.ok(inputArrays[1].length === 5641,
            `inputArrays[1].length=${inputArrays[1].length}`);
    });
    it("Test.1601 createFeatureOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: number[][] = featurizer.createFeatureOneHotEncoderNumberArrays(
            featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays[0].length === 5641,
            `inputArrays[0].length=${inputArrays[0].length}`);
        assert.ok(inputArrays[1].length === 5641,
            `inputArrays[1].length=${inputArrays[1].length}`);
    });

    it("Test.1700 createIntentUtteranceOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": boolean[][],
            "utteranceFeatureIndexArrays": boolean[][],
        } = featurizer.createIntentUtteranceOneHotEncoderBooleanArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 601,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 5641,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });
    it("Test.1701 createIntentUtteranceOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": number[][],
            "utteranceFeatureIndexArrays": number[][],
        } = featurizer.createIntentUtteranceOneHotEncoderNumberArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 601,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 5641,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.1800 createFeatureMiniBatchingOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: boolean[][] =
            featurizer.createFeatureMiniBatchingOneHotEncoderBooleanArrays(featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        Utility.debuggingLog(
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
    });
    it("Test.1801 createFeatureMiniBatchingOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: number[][] =
            featurizer.createFeatureMiniBatchingOneHotEncoderNumberArrays(featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        Utility.debuggingLog(
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
    });

    it("Test.1900 createIntentUtteranceMiniBatchingOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": boolean[][],
            "utteranceFeatureIndexArrays": boolean[][],
        } = featurizer.createIntentUtteranceMiniBatchingOneHotEncoderBooleanArrays(
            featurizer.getIntentsUtterances(), 0, 2);
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 2,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 2,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 5641,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });
    it("Test.1901 createIntentUtteranceMiniBatchingOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            featurizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": number[][],
            "utteranceFeatureIndexArrays": number[][],
        } = featurizer.createIntentUtteranceMiniBatchingOneHotEncoderNumberArrays(
            featurizer.getIntentsUtterances(), 0, 2);
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 2,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 2,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 5641,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.2000 createFeatureHashingOneHotEncoderBooleanArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const feature: string = "add flag to the email john just sent to me";
        const featureIndex: number =
            featurizer.getHashingFeatureIndex("flag");
        const featureArray: boolean[] =
            featurizer.createFeatureHashingOneHotEncoderBooleanArray(feature);
        Utility.debuggingLog(
            `featureArray=${featureArray}`);
        Utility.debuggingLog(
            `featureArray.length=${featureArray.length}`);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureArray.length === 1024,
            `featureArray=${featureArray}`);
        assert.ok(featureArray[featureIndex] === true,
            `featureArray=${featureArray}`);
    });
    it("Test.2001 createFeatureHashingOneHotEncoderNumberArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const feature: string = "add flag to the email john just sent to me";
        const featureIndex: number =
            featurizer.getHashingFeatureIndex("flag");
        const featureArray: number[] =
            featurizer.createFeatureHashingOneHotEncoderNumberArray(feature);
        Utility.debuggingLog(
            `featureArray=${featureArray}`);
        Utility.debuggingLog(
            `featureArray.length=${featureArray.length}`);
        Utility.debuggingLog(
            `featureIndex=${featureIndex}`);
        assert.ok(featureArray.length === 1024,
            `featureArray=${featureArray}`);
        assert.ok(featureArray[featureIndex] === 1,
            `featureArray=${featureArray}`);
    });

    it("Test.2100 createFeatureHashingOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: boolean[][] = featurizer.createFeatureHashingOneHotEncoderBooleanArrays(
            featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays[0].length === 1024,
            `inputArrays[0].length=${inputArrays[0].length}`);
        assert.ok(inputArrays[1].length === 1024,
            `inputArrays[1].length=${inputArrays[1].length}`);
    });
    it("Test.2101 createFeatureHashingOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const featureTexts: string[] = [
            "add flag to the email john just sent to me",
            "make it flagged"];
        const inputArrays: number[][] = featurizer.createFeatureHashingOneHotEncoderNumberArrays(
            featureTexts);
        Utility.debuggingLog(
            `inputArrays=${inputArrays}`);
        assert.ok(inputArrays.length === 2,
            `inputArrays.length=${inputArrays.length}`);
        assert.ok(inputArrays[0].length === 1024,
            `inputArrays[0].length=${inputArrays[0].length}`);
        assert.ok(inputArrays[1].length === 1024,
            `inputArrays[1].length=${inputArrays[1].length}`);
    });

    it("Test.2200 createIntentUtteranceHashingOneHotEncoderBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": boolean[][],
            "utteranceFeatureIndexArrays": boolean[][],
        } = featurizer.createIntentUtteranceHashingOneHotEncoderBooleanArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: boolean[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 601,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 1024,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });
    it("Test.2201 createIntentUtteranceHashingOneHotEncoderNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer =
            hashingFeaturizerColumnarContentEmail;
        const intentUtteranceOneHotEncoderBooleanArrays: {
            "intentLabelIndexArrays": number[][],
            "utteranceFeatureIndexArrays": number[][],
        } = featurizer.createIntentUtteranceHashingOneHotEncoderNumberArrays(
            featurizer.getIntentsUtterances());
        Utility.debuggingLog(
            `intentUtteranceOneHotEncoderBooleanArrays=${intentUtteranceOneHotEncoderBooleanArrays}`);
        const intentLabelIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.intentLabelIndexArrays;
        const utteranceFeatureIndexArrays: number[][] =
            intentUtteranceOneHotEncoderBooleanArrays.utteranceFeatureIndexArrays;
        Utility.debuggingLog(
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        Utility.debuggingLog(
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays.length === 601,
            `intentLabelIndexArrays.length=${intentLabelIndexArrays.length}`);
        assert.ok(intentLabelIndexArrays[0].length === 15,
            `intentLabelIndexArrays[0].length=${intentLabelIndexArrays[0].length}`);
        assert.ok(utteranceFeatureIndexArrays.length === 601,
            `utteranceFeatureIndexArrays.length=${utteranceFeatureIndexArrays.length}`);
        assert.ok(utteranceFeatureIndexArrays[0].length === 1024,
            `utteranceFeatureIndexArrays[0].length=${utteranceFeatureIndexArrays[0].length}`);
    });

    it("Test.2300 featurize()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
        const input: string = "add flag to the email john just sent to me";
        const result: string[] = featurizer.featurize(input);
        Utility.debuggingLog(input);
        Utility.debuggingLog(result);
        Utility.debuggingLog("hashing code = " + Utility.getPositiveStringHashCode(input));
        assert.ok(result.length === 87,
            `result.length=${result.length}`);
    });

    it("Test.2400 split()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
        const input: string = "add flag to the email john just sent to me";
        const result: string[] = featurizer.split(input);
        Utility.debuggingLog(input);
        Utility.debuggingLog(result);
        Utility.debuggingLog("hashing code = " + Utility.getPositiveStringHashCode(input));
        assert.ok(result.length === 10,
            `result.length=${result.length}`);
    });

    it("Test.2500 generateSubwords()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
        const input: string = "add flag to the email john just sent to me";
        const result: string[] = featurizer.generateSubwords(input);
        Utility.debuggingLog(input);
        Utility.debuggingLog(result);
        Utility.debuggingLog("hashing code = " + Utility.getPositiveStringHashCode(input));
        assert.ok(result.length === 77,
            `result.length=${result.length}`);
    });

    it("Test.2600 generateSubwords()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const subwordNgramBegin: number = 3;
        const subwordNgramEnd: number = 4;
        const toLowercase: boolean = true;
        const toRemovePunctuations: boolean = false;
        const toRemoveEmptyElements: boolean = true;
        const splitDelimiter: string = " ";
        const numberHashingFeaturesSetting: number = 0;
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
            subwordNgramBegin,
            subwordNgramEnd,
            toLowercase,
            toRemovePunctuations,
            toRemoveEmptyElements,
            splitDelimiter,
            numberHashingFeaturesSetting);
        const columnarData: ColumnarData = ColumnarData.createColumnarData(
            ColumnarContentEmail,
            featurizer,
            0,
            2,
            1,
            true);
    });

    it("Test.2700 serializeToJsonString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const subwordNgramBegin: number = 3;
        const subwordNgramEnd: number = 4;
        const toLowercase: boolean = true;
        const toRemovePunctuations: boolean = false;
        const toRemoveEmptyElements: boolean = true;
        const splitDelimiter: string = " ";
        const numberHashingFeaturesSetting: number = 0;
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
            subwordNgramBegin,
            subwordNgramEnd,
            toLowercase,
            toRemovePunctuations,
            toRemoveEmptyElements,
            splitDelimiter,
            numberHashingFeaturesSetting);
        const columnarData: ColumnarData = ColumnarData.createColumnarData(
            ColumnarContentEmail,
            featurizer,
            0,
            2,
            1,
            true);
        const serializedJsonString: string = featurizer.serializeToJsonString(undefined, 4);
        Utility.debuggingLog(
            `serializedJsonString=${serializedJsonString}`);
    });

    it("Test.2800 deserializeFromJsonString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const subwordNgramBegin: number = 3;
        const subwordNgramEnd: number = 4;
        const toLowercase: boolean = true;
        const toRemovePunctuations: boolean = false;
        const toRemoveEmptyElements: boolean = true;
        const splitDelimiter: string = " ";
        const numberHashingFeaturesSetting: number = 0;
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
            subwordNgramBegin,
            subwordNgramEnd,
            toLowercase,
            toRemovePunctuations,
            toRemoveEmptyElements,
            splitDelimiter,
            numberHashingFeaturesSetting);
        const columnarData: ColumnarData = ColumnarData.createColumnarData(
            ColumnarContentEmail,
            featurizer,
            0,
            2,
            1,
            true);
        const serializedJsonString: string = featurizer.serializeToJsonString(undefined, 4);
        Utility.debuggingLog(
            `serializedJsonString=${serializedJsonString}`);
        const featurizerDeserialized: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
        featurizerDeserialized.deserializeFromJsonString(serializedJsonString);
        const labels: string[] = featurizer.getLabels();
        const labelsDeserialized: string[] = featurizerDeserialized.getLabels();
        assert.ok(labels.length === labelsDeserialized.length,
            `labels.length=${labels.length}` +
            `, labelsDeserialized.length=${labelsDeserialized.length}`);
        assert.ok(labels[0] === labelsDeserialized[0],
            `labels[0]=${labels[0]}` +
            `, labelsDeserialized[0]=${labelsDeserialized[0]}`);
        const features: string[] = featurizer.getFeatures();
        const featuresDeserialized: string[] = featurizerDeserialized.getFeatures();
        assert.ok(features.length === featuresDeserialized.length,
            `features.length=${features.length}` +
            `, featuresDeserialized.length=${featuresDeserialized.length}`);
        assert.ok(features[0] === featuresDeserialized[0],
            `features[0]=${features[0]}` +
            `, featuresDeserialized[0]=${featuresDeserialized[0]}`);
    });
});
