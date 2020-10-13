/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBuild} from '../src/build';
import {OrchestratorNlr} from '../src/nlr';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

import assert = require('assert');
import * as path from 'path';
const nlrId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
const nlrPath: string = path.resolve('./resources/model/model_dte_bert_3l');

describe('OrchestratorBuildTests', () => {
  beforeEach(async () => {
    Utility.debuggingLog('Downloading an NLR model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      nlrId,
      nlrPath,
      OrchestratorNlr.defaultHandler,
      OrchestratorNlr.defaultHandler);
  });

  it('runAsync', async () => {
    const retPayload: any = await OrchestratorBuild.runAsync(
      nlrPath,
      OrchestratorHelper.getLuInputs('./test/fixtures/adaptive/'),
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luConfig.json')));

    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);
  });
});
