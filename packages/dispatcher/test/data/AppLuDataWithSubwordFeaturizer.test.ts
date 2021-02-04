/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionDataWithSubwordFeaturizer } from "../../src/data/AppLuDataWithSubwordFeaturizer";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

describe("Test Suite - data/AppLuDataWithSubwordFeaturizer", () => {
    it("Test.0000 exampleFunctionDataWithSubwordFeaturizer", async function() {
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
        const exampleFunctionDataWithSubwordFeaturizerOutputFilenames: string[] =
            await exampleFunctionDataWithSubwordFeaturizer();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of exampleFunctionDataWithSubwordFeaturizerOutputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
});
