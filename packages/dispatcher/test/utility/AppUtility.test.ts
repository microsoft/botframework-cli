/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionUtilityWithFilename } from "../../src/utility/AppUtility";
import { exampleFunctionUtility } from "../../src/utility/AppUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "./Utility.test";

describe("Test Suite - utility/AppUtility", () => {
    it("Test.0000 exampleFunctionUtilityWithFilename()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/Columnar/Email.tsv";
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const weightColumnIndex: number = 1;
        const linesToSkip: number = 1;
        exampleFunctionUtilityWithFilename(
            filename,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip);
    });
    it("Test.0001 exampleFunctionUtility()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        Utility.debuggingLog(
            `process.argv=${process.argv}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--weightColumnIndex");
        process.argv.push("1");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        exampleFunctionUtility();
    });
});
