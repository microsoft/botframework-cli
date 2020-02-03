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
});
