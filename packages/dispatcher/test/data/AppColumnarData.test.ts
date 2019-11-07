/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionData } from "../../src/data/AppColumnarData";

import { Utility } from "../../src/utility/Utility";

describe("Test Suite - data/app_columnar_data", () => {
    it("Test.0000 exampleFunctionData", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const filename: string = "data/Columnar/Email.tsv";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        exampleFunctionData();
    });
});
