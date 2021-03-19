/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import {
    exampleFunctionReservoirSampler,
    exampleFunctionReservoirSamplerWithArrayInput,
    } from "../../../src/mathematics/sampler/AppReservoirSampler";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/sampler/AppReservoirSampler", () => {
    it("Test.0000 exampleFunctionReservoirSampler", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionReservoirSampler();
    });
    it("Test.0001 exampleFunctionReservoirSamplerWithArrayInput", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionReservoirSamplerWithArrayInput();
    });
});
