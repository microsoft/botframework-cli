/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionBinaryConfusionMatrixMetrics } from "../../../src/mathematics/confusion_matrix/AppBinaryConfusionMatrix";

// import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/ConfusionMatrix";

import { Utility } from "../../../src/utility/Utility";

describe("Test Suite - mathematics/confusion_matrix/app_binary_confusion_matrix", () => {
    it("Test.0000 exampleFunctionBinaryConfusionMatrixMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionBinaryConfusionMatrixMetrics();
    });
});
