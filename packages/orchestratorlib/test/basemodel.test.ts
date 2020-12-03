/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorBaseModel} from '../src/basemodel';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import assert = require('assert');

describe('OrchestratorBaseModelTests', async () => {
  const nlrVersions: any = await OrchestratorBaseModel.getVersionsAsync();

  it('listAsync', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const nlrVersionsJson: string = await OrchestratorBaseModel.listAsync();
    assert.ok(nlrVersionsJson.length > 0);
    Utility.debuggingLog(`nlrVersionsJson=${nlrVersionsJson}`);
  });

  it('getAsync', async function () {
    OrchestratorBaseModel.getAsync('./test/fixtures/output');
  });

  it('getDefaultModelId', () => {
    const defaultVersion: string = OrchestratorBaseModel.getDefaultModelId(nlrVersions);
    assert.ok(defaultVersion === 'pretrained.20200924.microsoft.dte.00.06.en.onnx', 'getDefaultModelId fails to return correct default version');
  });
});
