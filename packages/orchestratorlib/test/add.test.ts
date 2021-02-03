/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorBaseModel} from '../src/basemodel';
import {Orchestrator} from '../src/orchestrator';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

import assert = require('assert');
import * as path from 'path';
const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve('./test/fixtures/output/RootDialog.blu'));

describe('OrchestratorAddTests', () => {
  beforeEach(async () => {
    Utility.debuggingLog('Downloading a base neural network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
  });

  it('runAsync default', async () => {
    const luInputs: any = OrchestratorHelper.getLuInputs('./test/fixtures/skills/');
    const retPayload: any = await Orchestrator.addAsync(
      baseModelPath,
      snapshot,
      luInputs,
      true);

    assert.ok(retPayload !== null);
    assert.ok(retPayload.snapshot !== null);
    assert.ok(retPayload.outputs !== null);
    assert.ok(retPayload.outputs.length === 2);

    const snapshotFile: string = path.join('./test/fixtures/output', 'RootDialog1.blu');
    OrchestratorHelper.writeToFile(snapshotFile, retPayload.snapshot);
    assert.ok(Utility.exists(snapshotFile));

    const snapshotContent: string = OrchestratorHelper.readFile(snapshotFile);
    for (const luInput of luInputs) {
      assert.ok(snapshotContent.indexOf(luInput.id) > 0);
    }
    Utility.deleteFile(snapshotFile);
  });

  it('runAsync with routing names', async () => {
    const luInputs: any = OrchestratorHelper.getLuInputs('./test/fixtures/skills/');
    for (const luInput of luInputs) {
      luInput.routingName = luInput.id + 'Ex';
    }

    const retPayload: any = await Orchestrator.addAsync(
      baseModelPath,
      snapshot,
      luInputs,
      true);

    assert.ok(retPayload !== null);
    assert.ok(retPayload.snapshot !== null);
    assert.ok(retPayload.outputs !== null);
    assert.ok(retPayload.outputs.length === 2);

    const snapshotFile: string = path.join('./test/fixtures/output', 'RootDialog2.blu');
    OrchestratorHelper.writeToFile(snapshotFile, retPayload.snapshot);
    assert.ok(Utility.exists(snapshotFile));

    const snapshotContent: string = OrchestratorHelper.readFile(snapshotFile);
    for (const luInput of luInputs) {
      assert.ok(snapshotContent.indexOf(luInput.routingName) > 0);
    }
    Utility.deleteFile(snapshotFile);
  });
});

