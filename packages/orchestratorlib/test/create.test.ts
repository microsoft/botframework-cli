/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {} from 'mocha';
import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorCreate} from '../src/create';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import * as path from 'path';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import assert = require('assert');

describe('OrchestratorCreateTests', () => {
  it('Create Dispatch Snapshot', async function (): Promise<void> {
    const outputPath: string = './test/fixtures/dispatch';
    Utility.toPrintDebuggingLogToConsole = true;
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);

    const snapshotPath: string = path.join(outputPath, OrchestratorHelper.SnapshotFileName);
    if (Utility.exists(snapshotPath)) {
      Utility.deleteFile(snapshotPath);
    }
    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      outputPath,
      outputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
  });
/*
  it('Create Snapshot with multiple intents', async function (): Promise<void> {
    const outputPath: string = './test/fixtures/output/multiintent';
    Utility.toPrintDebuggingLogToConsole = true;
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);

    const snapshotPath: string = path.join(outputPath, OrchestratorHelper.SnapshotFileName);
    if (Utility.exists(snapshotPath)) {
      Utility.deleteFile(snapshotPath);
    }
    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      outputPath,
      outputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
  });
  */
});
