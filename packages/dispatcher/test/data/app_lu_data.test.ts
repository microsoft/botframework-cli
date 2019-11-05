/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionData } from "../../src/data/app_lu_data";

import { Utility } from "../../src/utility/utility";

describe("Test Suite - data/app_lu_data", () => {
    it("Test.0000 exampleFunctionData", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const filename: string = "../data/LU/skills/emailskill/en/Email.lu";
        process.argv.push("--filename");
        process.argv.push(filename);
        exampleFunctionData();
    });
});
