/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBuild} from '../src/build';
import {OrchestratorBaseModel} from '../src/basemodel';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

import assert = require('assert');
import * as path from 'path';
const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');

describe('OrchestratorBuildTests', () => {
  beforeEach(async () => {
    Utility.debuggingLog('Downloading a base neural network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
  });

  it('runAsync with lu inputs', async () => {
    const retPayload: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      OrchestratorHelper.getLuInputs('./test/fixtures/adaptive/'),
      true,
      null);

    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);
  });

  it('runAsync with luconfig json', async () => {
    const retPayload: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      [],
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luconfig.json')));

    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);
    OrchestratorHelper.writeBuildOutputFiles('./test/fixtures/output', retPayload);
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.blu'));
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.en-us.lu.dialog'));
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.lu.dialog'));
  });
});

