/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { IDictionaryNumberIdGenericArray } from "../../src/data_structure/IDictionaryNumberIdGenericArray";
import { DictionaryMapUtility } from "../../src/data_structure/DictionaryMapUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

describe("Test Suite - data_structure/IDictionaryNumberIdGenericArray", () => {
    it("Test.0000 IDictionaryNumberIdGenericArray", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const dataStructure: IDictionaryNumberIdGenericArray<string> = {};
        const dataStructureLength: number =
            DictionaryMapUtility.getNumberIdGenericArrayDictionaryLength(
                dataStructure);
        Utility.debuggingLog(
            `dataStructureLength=${dataStructureLength}`);
        assert.ok(dataStructureLength === 0);
    });
});
