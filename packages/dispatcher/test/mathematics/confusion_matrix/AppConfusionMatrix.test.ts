/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionConfusionMatrix } from "../../../src/mathematics/confusion_matrix/AppConfusionMatrix";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - model/evaluation/confusion_matrix/app_confusion_matrix", () => {
    it("Test.0000 exampleFunctionConfusionMatrix()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionConfusionMatrix();
    });
});
