/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionData } from "../../src/data/AppColumnarData";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

describe("Test Suite - data/AppColumnarData", () => {
    it("Test.0000 exampleFunctionData", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
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
        exampleFunctionData();
    });
});
