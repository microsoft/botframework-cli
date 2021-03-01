/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionBinaryConfusionMatrix } from "../../../src/mathematics/confusion_matrix/AppBinaryConfusionMatrix";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/confusion_matrix/app_binary_confusion_matrix", () => {
    it("Test.0000 exampleFunctionBinaryConfusionMatrix()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionBinaryConfusionMatrix();
    });
});
