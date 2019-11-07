/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { AppSoftmaxRegressionSparse } from "../../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

import { Utility } from "../../../../../../src/utility/Utility";

describe("Test Suite - model/supervised/classifier/neural_network/learner/app_softmax_regression_sparse", () => {
    it("Test.0000 exampleFunctionSoftmaxRegressionSparseMinibatching", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        AppSoftmaxRegressionSparse.exampleFunctionSoftmaxRegressionSparseMinibatching(
            "data/Columnar/Email.tsv",
            "data/Columnar/EmailTest.tsv",
            0,
            2,
            1,
            100,
            AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            0.00,
            0.00);
    });
});
