/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionNgramSubwordFeaturizer } from "../../../../src/model/language_understanding/featurizer/AppNgramSubwordFeaturizer";

import { Utility } from "../../../../src/Utility/Utility";

import { UnitTestHelper } from "../../../Utility/Utility.test";

describe("Test Suite - model/language_understanding/featurizer/app_ngram_subword_featurizer", () => {
    it("Test.0000 exampleFunctionNgramSubwordFeaturizer()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionNgramSubwordFeaturizer();
    });
});
