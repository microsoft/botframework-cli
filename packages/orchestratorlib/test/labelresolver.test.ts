/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';

import {LabelResolver} from '../src/labelresolver';

import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorHelper} from '../src/orchestratorhelper';

import {Utility} from '../src/utility';
import {LabelType, Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';
import {Example} from '@microsoft/bf-dispatcher';

import {UnitTestHelper} from './utility.test';

describe('Test Suite - LabelResolver', () => {
  it('Test.0000 LabelResolver.scoreBatch()', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(): downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch(): modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch(): process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_bert.blu';
    // -----------------------------------------------------------------------
    // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, '');
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), after calling LabelResolver.createAsync()');
    // Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    // UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    // Utility.debuggingLog('LabelResolver.scoreBatch(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), ready to call OrchestratorHelper.getSnapshotFromFile()');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(inputPath);
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), after calling OrchestratorHelper.getSnapshotFromFile()');
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), ready to call LabelResolver.addSnapshot()');
    await LabelResolver.addSnapshot(snapshot);
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch(), after calling LabelResolver.addSnapshot()');
    // -----------------------------------------------------------------------
    const utterances: string[] = [
      'add a flag to it',
      'add some more info',
    ];
    // -----------------------------------------------------------------------
    const results: any = LabelResolver.scoreBatch(utterances, LabelType.Intent);
    UtilityDispatcher.debuggingNamedLog1('Test.0000 LabelResolver.scoreBatch(utterances, LabelType.Intent)', results, 'results');
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingLog('THE END - Test.0000 LabelResolver.scoreBatch()');
  });

  it('Test.0001 LabelResolver.addExample()', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0001 LabelResolver.addExample(): downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler,
      'pretrained.20200924.microsoft.dte.00.06.en.onnx');
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): process.cwd()=${process.cwd()}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
    Utility.debuggingLog('Test.0001 LabelResolver.addExample(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, '');
    Utility.debuggingLog('Test.0001 LabelResolver.addExample(), after calling LabelResolver.createAsync()');
    // Utility.debuggingLog('LabelResolver.addExample(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    // UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    // Utility.debuggingLog('LabelResolver.addExample(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    const example: Example = Example.newIntentExample(
      'where is the news on agility',
      ['Keyword']);
    const exampleObject: any = example.toAlternateObject();
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): exampleObject=${Utility.jsonStringify(exampleObject)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObject);
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): rv=${rvAddExample}`);
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): snapshot=${snapshot}`);
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): snapshot.byteLength=${snapshot.byteLength}`);
    const snapshotInString: string = new TextDecoder().decode(snapshot);
    Utility.debuggingLog(`Test.0001 LabelResolver.addExample(): snapshotInString=${snapshotInString}`);
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingLog('THE END - Test.0001 LabelResolver.addExample()');
  });

  it('Test.0002 LabelResolver.removeExample()', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0002 LabelResolver.addExample(): downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler,
      'pretrained.20200924.microsoft.dte.00.06.en.onnx');
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): process.cwd()=${process.cwd()}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
    Utility.debuggingLog('Test.0002 LabelResolver.addExample(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, '');
    Utility.debuggingLog('Test.0002 LabelResolver.addExample(), after calling LabelResolver.createAsync()');
    // Utility.debuggingLog('LabelResolver.addExample(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    // UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    // Utility.debuggingLog('LabelResolver.addExample(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    const example: Example = Example.newIntentExample(
      'where is the news on agility',
      ['Keyword']);
    const exampleObject: any = example.toAlternateObject();
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): exampleObject=${Utility.jsonStringify(exampleObject)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObject);
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): rv=${rvAddExample}`);
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): snapshot=${snapshot}`);
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): snapshot.byteLength=${snapshot.byteLength}`);
    const snapshotInString: string = new TextDecoder().decode(snapshot);
    Utility.debuggingLog(`Test.0002 LabelResolver.addExample(): snapshotInString=${snapshotInString}`);
    // -----------------------------------------------------------------------
    const examples: any = LabelResolver.getExamples();
    assert.strictEqual(examples.length, 1);
    // -----------------------------------------------------------------------
    const rvRemoveExample: any = LabelResolver.removeExample(exampleObject);
    Utility.debuggingLog(`Test.0002 LabelResolver.removeExample(): rv=${rvRemoveExample}`);
    // -----------------------------------------------------------------------
    const examplesAfterRemoveExample: any = LabelResolver.getExamples();
    assert.strictEqual(examplesAfterRemoveExample.length, 0);
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingLog('THE END - Test.0002 LabelResolver.addExample()');
  });
});
