/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { IDictionaryStringIdGenericValue } from "../../src/data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../src/data_structure/DictionaryMapUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

describe("Test Suite - data_structure/DictionaryMapUtility", () => {
    it("Test.0000 buildStringIdNumberValueDictionaryFromUniqueStringArray", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const uniqueStringArray: string[] = [ "a", "b", "c" ];
        const stringIdNumberValueDictionary: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(
                uniqueStringArray);
        Utility.debuggingLog(
            `DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary)=` +
            `${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary)}`);
        Utility.debuggingLog(
            `stringIdNumberValueDictionary.a=${stringIdNumberValueDictionary.a}`);
        Utility.debuggingLog(
            `stringIdNumberValueDictionary.b=${stringIdNumberValueDictionary.b}`);
        Utility.debuggingLog(
            `stringIdNumberValueDictionary.c=${stringIdNumberValueDictionary.c}`);
        assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary) === 3);
        assert.ok(stringIdNumberValueDictionary.a === 0);
        assert.ok(stringIdNumberValueDictionary.b === 1);
        assert.ok(stringIdNumberValueDictionary.c === 2);
    });
    it("Test.0001 buildStringIdNumberValueDictionaryFromStringArray", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputStringArray: string[] = [ "a", "b", "a", "c" ];
        const stringIdNumberValueDictionary: {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArray(
                inputStringArray);
        const stringArray: string[] =
            stringIdNumberValueDictionary.stringArray;
        const stringMap: IDictionaryStringIdGenericValue<number> =
        stringIdNumberValueDictionary.stringMap;
        Utility.debuggingLog(
            `DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap)=` +
            `${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap)}`);
        Utility.debuggingLog(
            `stringArray.length=` +
            `${stringArray.length}`);
        Utility.debuggingLog(
            `stringMap.a=${stringMap.a}`);
        Utility.debuggingLog(
            `stringMap.b=${stringMap.b}`);
        Utility.debuggingLog(
            `stringMap.c=${stringMap.c}`);
        assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap) === 3);
        assert.ok(stringArray.length === 3);
        assert.ok(stringMap.a === 0);
        assert.ok(stringMap.b === 1);
        assert.ok(stringMap.c === 2);
    });
    it("Test.0002 buildStringIdNumberValueDictionaryFromStringArrays", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputStringArrays: string[][] = [ ["a", "b", "a", "c"], ["b", "c"] ];
        const stringIdNumberValueDictionary: {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArrays(
                inputStringArrays);
        const stringArray: string[] =
            stringIdNumberValueDictionary.stringArray;
        const stringMap: IDictionaryStringIdGenericValue<number> =
        stringIdNumberValueDictionary.stringMap;
        Utility.debuggingLog(
            `DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap)=` +
            `${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap)}`);
        Utility.debuggingLog(
            `stringArray.length=` +
            `${stringArray.length}`);
        Utility.debuggingLog(
            `stringMap.a=${stringMap.a}`);
        Utility.debuggingLog(
            `stringMap.b=${stringMap.b}`);
        Utility.debuggingLog(
            `stringMap.c=${stringMap.c}`);
        assert.ok(DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringMap) === 3);
        assert.ok(stringArray.length === 3);
        assert.ok(stringMap.a === 0);
        assert.ok(stringMap.b === 1);
        assert.ok(stringMap.c === 2);
    });

    it("Test.0100 Utility.processUnknownLabelsInUtteranceLabelsMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        const utterance0: string = "hi";
        const labelArray0: string[] = ["greeting", "chitchat"];
        const labelSet0: Set<string> = new Set<string>(labelArray0);
        utteranceLabelsMap.set(utterance0, labelSet0);
        utteranceLabelDuplicateMap.set(utterance0, labelSet0);
        const utterance1: string = "A";
        const labelArray1: string[] = ["greeting", "", "unknown", "none"];
        const labelSet1: Set<string> = new Set<string>(labelArray1);
        utteranceLabelsMap.set(utterance1, labelSet1);
        utteranceLabelDuplicateMap.set(utterance1, labelSet1);
        const utterance2: string = "B";
        const labelArray2: string[] = ["", "unknown", "none"];
        const labelSet2: Set<string> = new Set<string>(labelArray2);
        utteranceLabelsMap.set(utterance2, labelSet2);
        utteranceLabelDuplicateMap.set(utterance2, labelSet2);
        const utterance3: string = "C";
        const labelArray3: string[] = [];
        const labelSet3: Set<string> = new Set<string>(labelArray3);
        utteranceLabelsMap.set(utterance3, labelSet3);
        utteranceLabelDuplicateMap.set(utterance3, labelSet3);
        const utteranceLabels: {
          "utteranceLabelsMap": Map<string, Set<string>>;
          "utteranceLabelDuplicateMap": Map<string, Set<string>>; } = {
            utteranceLabelsMap,
            utteranceLabelDuplicateMap};
        Utility.debuggingLog(
          `utteranceLabelsMap-B=${Utility.jsonStringify(utteranceLabelsMap)}`);
        Utility.debuggingLog(
          `utteranceLabelDuplicateMap-B=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
        DictionaryMapUtility.processUnknownLabelsInUtteranceLabelsMap(
          utteranceLabels);
        Utility.debuggingLog(
          `utteranceLabelsMap=A=${Utility.jsonStringify(utteranceLabelsMap)}`);
        Utility.debuggingLog(
          `utteranceLabelDuplicateMap-A=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
        assert.ok((utteranceLabelsMap.get("hi") as Set<string>).size === 2);
        assert.ok((utteranceLabelsMap.get("A") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("A") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelsMap.get("B") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("B") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelsMap.get("C") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("C") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelDuplicateMap.get("hi") as Set<string>).size === 2);
        assert.ok((utteranceLabelDuplicateMap.get("A") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("A") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelDuplicateMap.get("B") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("B") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelDuplicateMap.get("C") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("C") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
    });
    it("Test.0101 Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        const utterance0: string = "hi";
        const labelArray0: string[] = ["greeting", "chitchat"];
        const labelSet0: Set<string> = new Set<string>(labelArray0);
        utteranceLabelsMap.set(utterance0, labelSet0);
        utteranceLabelDuplicateMap.set(utterance0, labelSet0);
        const utterance1: string = "A";
        const labelArray1: string[] = ["greeting", "", "unknown", "none"];
        const labelSet1: Set<string> = new Set<string>(labelArray1);
        utteranceLabelsMap.set(utterance1, labelSet1);
        utteranceLabelDuplicateMap.set(utterance1, labelSet1);
        const utterance2: string = "B";
        const labelArray2: string[] = ["", "unknown", "none"];
        const labelSet2: Set<string> = new Set<string>(labelArray2);
        utteranceLabelsMap.set(utterance2, labelSet2);
        utteranceLabelDuplicateMap.set(utterance2, labelSet2);
        const utterance3: string = "C";
        const labelArray3: string[] = [];
        const labelSet3: Set<string> = new Set<string>(labelArray3);
        utteranceLabelsMap.set(utterance3, labelSet3);
        utteranceLabelDuplicateMap.set(utterance3, labelSet3);
        const labelSet: Set<string> = new Set<string>(["greeting"]);
        const utteranceLabels: {
          "utteranceLabelsMap": Map<string, Set<string>>;
          "utteranceLabelDuplicateMap": Map<string, Set<string>>; } = {
            utteranceLabelsMap,
            utteranceLabelDuplicateMap};
        Utility.debuggingLog(
          `utteranceLabelsMap-B=${Utility.jsonStringify(utteranceLabelsMap)}`);
        Utility.debuggingLog(
          `utteranceLabelDuplicateMap-B=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
        DictionaryMapUtility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(
          utteranceLabels,
          labelSet);
        Utility.debuggingLog(
          `utteranceLabelsMap=A=${Utility.jsonStringify(utteranceLabelsMap)}`);
        Utility.debuggingLog(
          `utteranceLabelDuplicateMap-A=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
        assert.ok((utteranceLabelsMap.get("hi") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("hi") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelsMap.get("A") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("A") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelsMap.get("B") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("B") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelsMap.get("C") as Set<string>).size === 1);
        assert.ok((utteranceLabelsMap.get("C") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelDuplicateMap.get("hi") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("hi") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelDuplicateMap.get("A") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("A") as Set<string>).has("greeting"));
        assert.ok((utteranceLabelDuplicateMap.get("B") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("B") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
        assert.ok((utteranceLabelDuplicateMap.get("C") as Set<string>).size === 1);
        assert.ok((utteranceLabelDuplicateMap.get("C") as Set<string>).has(DictionaryMapUtility.UnknownLabel));
    });
});
