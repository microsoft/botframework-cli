/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionReservoirSampler } from "../../../src/mathematics/sampler/AppSampler";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/sampler/app_sampler", () => {
    it("Test.0000 exampleFunctionReservoirSampler", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionReservoirSampler();
    });
});
