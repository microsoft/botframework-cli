/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {} from 'mocha';
import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorCreate} from '../src/create';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import * as path from 'path';
import * as fs from 'fs-extra';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import assert = require('assert');

describe('OrchestratorCreateTests', () => {
  const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
  const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');

  beforeEach(async () => {
    Utility.debuggingLog('OrchestratorCreateTests - downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
  });

  xit('Create Dispatch Snapshot', async function (): Promise<void> {
    const outputPath: string = './test/fixtures/dispatch';
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());

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
    const snapshotContent: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent.indexOf('HomeAutomation') > 0);
    assert.ok(snapshotContent.indexOf('Weather') > 0);
  });

  xit('Create Snapshot - LU file with reference to other LU file', async function (): Promise<void> {
    const outputPath: string = './test/fixtures/output/create';
    const inputFileName: string = 'RootDialogWithSkillRef';
    const inputPath: string = `./test/fixtures/${inputFileName}.lu`;
    if (!Utility.exists(outputPath)) {
      fs.mkdirSync(outputPath, {recursive: true});
    }

    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());

    const snapshotPath: string = path.join(outputPath, `${inputFileName}.blu`);
    if (Utility.exists(snapshotPath)) {
      Utility.deleteFile(snapshotPath);
    }

    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath,
      outputPath,
      false);

    assert.ok(Utility.exists(snapshotPath));
    let snapshotContent: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent.indexOf('Get Weather Condition') > 0);
    assert.ok(snapshotContent.indexOf('Get Weather Forecast') > 0);
    assert.ok(snapshotContent.indexOf('Greeting') > 0);
    assert.ok(snapshotContent.indexOf('AddItem') > 0);

    Utility.deleteFile(snapshotPath);

    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath,
      outputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
    snapshotContent = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent.indexOf('RootDialogWithSkillRef') > 0);
    assert.ok(snapshotContent.indexOf('Get Weather Forecast') < 0);
    assert.ok(snapshotContent.indexOf('AddItem') < 0);
  });
});
