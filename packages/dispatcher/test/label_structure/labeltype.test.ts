/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import {LabelType} from "../../src/label_structure/LabelType";
import {Utility} from "../../src/utility/Utility";
import {UnitTestHelper} from "../utility/Utility.test";

describe("Test Suite - labeltype", () => {
  it("Test.0000 LabelType - constructor()", function() {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const labelType: LabelType = LabelType.Intent;
    Utility.debuggingLog(`labelType=${labelType}`);
    assert.ok(labelType === 1);
  });
});
