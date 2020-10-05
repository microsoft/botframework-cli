/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';

import {OrchestratorNlr} from '../src/nlr';
// import {OrchestratorTest} from '../src/test';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - test', () => {
  it('Test.0000 OrchestratorTest.runAsync()', async function () {
    Utility.toPrintDebuggingLogToConsole = true; // UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const nlrId: string = 'pretrained.20200924.microsoft.dte.00.12.roberta.en.onnx';
    const nlrPath: string = path.resolve('model_dte_roberta_for_test_command');
    await UnitTestHelper.downloadModelFileForTest(
      nlrId,
      nlrPath,
      OrchestratorNlr.defaultHandler,
      () => {
        Utility.debuggingLog('Test.0000 OrchestratorTest.runAsync()');
      });
    Utility.debuggingLog('THE END - OrchestratorTest.runAsync()');
  });
});
