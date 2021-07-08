/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

 import assert = require('assert');

import {} from 'mocha';
import * as path from 'path';
import * as fs from 'fs-extra';

import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorHelper} from '../src/orchestratorhelper';

import {OrchestratorCreate} from '../src/create';

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('OrchestratorCreateTests', () => {
  const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
  const inputPath: string = './test/fixtures/dispatch';
  const inputPath2: string = path.resolve('./test/fixtures/newDispatch');
  const snapshotPath: string = path.join(inputPath, OrchestratorHelper.SnapshotFileName);

  beforeEach(async () => {
    Utility.debuggingLog('OrchestratorCreateTests - downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);

    if (Utility.exists(snapshotPath)) {
      Utility.deleteFile(snapshotPath);
    }
  });

  afterEach(async () => {
    if (Utility.exists(inputPath2)) {
      Utility.deleteFolderRecursive(inputPath2);
    }
  });

  it('Create Dispatch Snapshot - no existing snapshot', async function (): Promise<void> {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());

    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath,
      inputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
    const snapshotContent: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent.indexOf('HomeAutomation') > 0);
    assert.ok(snapshotContent.indexOf('Weather') > 0);
  });

  it('Create Dispatch Snapshot - incremental', async function (): Promise<void> {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());

    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath,
      inputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
    const snapshotContent: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent.indexOf('HomeAutomation') > 0);
    assert.ok(snapshotContent.indexOf('Weather') > 0);

    // add another lu file to input and make sure new intent is added (snapshot updated incrementally)
    fs.ensureDirSync(inputPath2);
    fs.copySync(path.resolve(inputPath), inputPath2);
    fs.copySync(path.resolve('./test/fixtures/Gaming.lu'), path.join(inputPath2, 'Gaming.lu'));

    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath2,
      inputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
    const snapshotContent2: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent2.length > snapshotContent.length);
    assert.ok(snapshotContent2.indexOf('HomeAutomation') > 0);
    assert.ok(snapshotContent2.indexOf('Weather') > 0);
    assert.ok(snapshotContent2.indexOf('Gaming') > 0);

    // start clean and make sure file size is the same as previous run (snapshot created via addBatch)
    Utility.deleteFile(snapshotPath);
    await OrchestratorCreate.runAsync(
      baseModelPath,
      '',
      inputPath2,
      inputPath,
      true);

    assert.ok(Utility.exists(snapshotPath));
    const snapshotContent3: string = OrchestratorHelper.readFile(snapshotPath);
    assert.ok(snapshotContent3.length === snapshotContent2.length);
    assert.ok(snapshotContent2.indexOf('HomeAutomation') > 0);
    assert.ok(snapshotContent2.indexOf('Weather') > 0);
    assert.ok(snapshotContent2.indexOf('Gaming') > 0);
  });

  it('Create Snapshot - LU file with reference to other LU file', async function (): Promise<void> {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const outputPath: string = './test/fixtures/output/create';
    const inputFileName: string = 'RootDialogWithSkillRef';
    const inputPath: string = `./test/fixtures/${inputFileName}.lu`;
    if (!Utility.exists(outputPath)) {
      fs.mkdirSync(outputPath, {recursive: true});
    }

    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
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
