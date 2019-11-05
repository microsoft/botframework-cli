/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionBinaryConfusionMatrixMetrics } from "../../../src/mathematics/confusion_matrix/app_binary_confusion_matrix";

// import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/confusion_matrix";

import { Utility } from "../../../src/utility/utility";

describe("Test Suite - mathematics/confusion_matrix/app_binary_confusion_matrix", () => {
    it("Test.0000 exampleFunctionBinaryConfusionMatrixMetrics()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionBinaryConfusionMatrixMetrics();
    });
});
