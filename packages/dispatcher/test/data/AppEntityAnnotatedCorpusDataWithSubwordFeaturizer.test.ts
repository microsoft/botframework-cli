/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionDataWithSubwordFeaturizer } from "../../src/data/AppEntityAnnotatedCorpusDataWithSubwordFeaturizer";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

describe("Test Suite - data/AppEntityAnnotatedCorpusDataWithSubwordFeaturizer", () => {
    it("Test.0000 exampleFunctionDataWithSubwordFeaturizer", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/EntityAnnotatedCorpus/ner_dataset.eac";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        exampleFunctionDataWithSubwordFeaturizer();
    });
});
