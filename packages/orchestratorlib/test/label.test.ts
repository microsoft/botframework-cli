/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {Label} from '../src/label';
import {LabelType} from '../src/labeltype';
import {Span} from '../src/span';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - label', () => {
  it('Test.0000 Label - constructor()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const label: Label = new Label(LabelType.Intent, 'label', new Span(0, 0));
    Utility.debuggingLog(`label=${Utility.jsonStringify(label)}`);
    const labelObject: {
      name: string;
      labeltype: number;
      span: {
          offset: number;
          length: number;
      };
    } = label.toObject();
    assert.ok(label.name === 'label');
    assert.ok(label.labeltype === LabelType.Intent);
    assert.ok(labelObject.span.offset === 0);
    assert.ok(labelObject.span.length === 0);
  });
});

