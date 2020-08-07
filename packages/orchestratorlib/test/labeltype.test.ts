/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {LabelType} from '../src/labeltype';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - labeltype', () => {
  it('Test.0000 LabelType - constructor()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const labelType: LabelType = LabelType.Intent;
    Utility.debuggingLog(`labelType=${labelType}`);
    assert.ok(labelType === 1);
  });
});

