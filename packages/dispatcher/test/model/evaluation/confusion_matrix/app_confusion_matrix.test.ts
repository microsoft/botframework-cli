/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/app_confusion_matrix";

// import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/confusion_matrix";

import { Utility } from "../../../../src/utility/utility";

describe("Test Suite - model/evaluation/confusion_matrix/app_confusion_matrix", () => {
    it("Test.0000 exampleFunctionConfusionMatrix()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionConfusionMatrix();
    });
});
