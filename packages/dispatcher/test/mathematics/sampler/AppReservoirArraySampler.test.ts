/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionReservoirArraySampler } from "../../../src/mathematics/sampler/AppReservoirArraySampler";

import { Utility } from "../../../src/utility/Utility";

import { UnitTestHelper } from "../../utility/Utility.test";

describe("Test Suite - mathematics/sampler/ReservoirArraySampler", () => {
    it("Test.0000 exampleFunctionReservoirArraySampler", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionReservoirArraySampler();
    });
});
