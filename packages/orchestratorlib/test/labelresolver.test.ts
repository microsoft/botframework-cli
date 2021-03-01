/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';

import {LabelResolver} from '../src/labelresolver';

import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorHelper} from '../src/orchestratorhelper';

import {Utility} from '../src/utility';
import {LabelType, Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - LabelResolver', () => {
  it('Test.0000 LabelResolver.scoreBatch()', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    // -----------------------------------------------------------------------
    const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_bert.blu';
    // -----------------------------------------------------------------------
    // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
    Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath, '');
    Utility.debuggingLog('LabelResolver.scoreBatch(), after calling LabelResolver.createAsync()');
    // Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    // UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    // Utility.debuggingLog('LabelResolver.scoreBatch(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call OrchestratorHelper.getSnapshotFromFile()');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(inputPath);
    Utility.debuggingLog(`LabelResolver.scoreBatch(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.scoreBatch(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('LabelResolver.scoreBatch(), after calling OrchestratorHelper.getSnapshotFromFile()');
    Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call LabelResolver.addSnapshot()');
    await LabelResolver.addSnapshot(snapshot);
    Utility.debuggingLog('LabelResolver.scoreBatch(), after calling LabelResolver.addSnapshot()');
    // -----------------------------------------------------------------------
    const utterances: string[] = [
      'add a flag to it',
      'add some more info',
    ];
    // -----------------------------------------------------------------------
    const results: any = LabelResolver.scoreBatch(utterances, LabelType.Intent);
    UtilityDispatcher.debuggingNamedLog1('LabelResolver.scoreBatch(utterances, LabelType.Intent)', results, 'results');
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingLog('THE END - Test.0000 LabelResolver.runAsync()');
  });
});
