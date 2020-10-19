/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionMathematicsHelper } from "../../../src/mathematics/mathematics_helper/AppMathematicsHelper";
import { exampleFunctionMathematicsHelperSoftmax } from "../../../src/mathematics/mathematics_helper/AppMathematicsHelper";

import { Utility } from "../../../src/Utility/Utility";

import { UnitTestHelper } from "../../Utility/Utility.test";

describe("Test Suite - mathematics/mathematics_helper/app_mathematics_helper", () => {
    it("Test.0000 exampleFunctionMathematicsHelper", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionMathematicsHelper();
    });
    it("Test.0001 exampleFunctionMathematicsHelperSoftmax", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        exampleFunctionMathematicsHelperSoftmax();
    });
});
