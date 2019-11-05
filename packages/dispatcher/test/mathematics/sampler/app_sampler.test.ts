/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionReservoirSampler } from "../../../src/mathematics/sampler/app_sampler";

import { Utility } from "../../../src/utility/utility";

describe("Test Suite - mathematics/sampler/app_sampler", () => {
    it("Test.0000 exampleFunctionReservoirSampler", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionReservoirSampler();
    });
});
