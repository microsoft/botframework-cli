/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionData } from "../../src/data/AppLuData";

import { Utility } from "../../src/Utility/Utility";

import { UnitTestHelper } from "../Utility/Utility.test";

describe("Test Suite - data/AppLuData", () => {
    it("Test.0000 exampleFunctionData", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string =
            "resources/data/LU/skills/emailskill/en/Email.lu";
        const outputFilenamePrefix: string =
            "resources/data/LU/skills/emailskill/en/Email_AppLuDataUnitTest_0000";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputFilenamePrefix");
        process.argv.push(outputFilenamePrefix);
        const exampleFunctionDataOutputFilenames: string[] = await exampleFunctionData();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of exampleFunctionDataOutputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
});
