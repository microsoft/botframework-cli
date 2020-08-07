/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {Span} from '../src/span';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - span', () => {
  it('Test.0000 Span - constructor()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const span: Span = new Span(3, 4);
    Utility.debuggingLog(`span=${Utility.jsonStringify(span)}`);
    const spanObject: {
      'offset': number;
      'length': number; } = span.toObject();
    assert.ok(span.offset === 3);
    assert.ok(span.length === 4);
    assert.ok(spanObject.offset === 3);
    assert.ok(spanObject.length === 4);
  });
});

