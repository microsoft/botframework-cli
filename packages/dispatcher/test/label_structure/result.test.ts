/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import {Label} from "../../src/label_structure/Label";
import {LabelType} from "../../src/label_structure/LabelType";
import {Span} from "../../src/label_structure/Span";
import {Result} from "../../src/label_structure/Result";
import {Utility} from "../../src/utility/Utility";
import {UnitTestHelper} from "../utility/Utility.test";

describe("Test Suite - result", () => {
  it("Test.0000 Result - constructor()", function() {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const result: Result = new Result(new Label(LabelType.Intent, "label", new Span(0, 0)), 0.99, "utterance");
    Utility.debuggingLog(`result=${Utility.jsonStringify(result)}`);
    const resultObject: {
      label: {
          name: string;
          labeltype: number;
          span: {
              offset: number;
              length: number;
          };
      };
      score: number;
      closesttext: string;
    } = result.toObject();
    assert.ok(resultObject.label.name === "label");
    assert.ok(resultObject.label.labeltype === 1);
    assert.ok(resultObject.label.span.offset === 0);
    assert.ok(resultObject.label.span.length === 0);
    assert.ok(resultObject.score === 0.99);
    assert.ok(resultObject.closesttext === "utterance");
  });
});
