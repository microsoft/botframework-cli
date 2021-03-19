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

// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- describe('Test Suite - LabelResolver', () => {
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   it('Test.0000 LabelResolver.scoreBatch()', async function (): Promise<void> {
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const ignore: boolean = UnitTestHelper.getIgnoreFlag();
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     if (ignore) {
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       return;
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     }
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // -----------------------------------------------------------------------
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: downloading a base nerual network language model for unit test');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     await UnitTestHelper.downloadModelFileForTest(
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       basemodelId,
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       baseModelPath,
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       OrchestratorBaseModel.defaultHandler,
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       OrchestratorBaseModel.defaultHandler);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: modelConfig=${modelConfig}`);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`Test.0000 LabelResolver.scoreBatch()-Bert-3-layer: process.cwd()=${process.cwd()}`);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const inputPath: string = './resources/data/Columnar/Email_bert.blu';
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // -----------------------------------------------------------------------
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // ---- NOTE ---- create a LabelResolver object and load the snapshot set.
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call LabelResolver.createAsync()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     await LabelResolver.createAsync(baseModelPath, '');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), after calling LabelResolver.createAsync()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // Utility.debuggingLog('LabelResolver.scoreBatch(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call OrchestratorHelper.getSnapshotFromFile()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(inputPath);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`LabelResolver.scoreBatch(): typeof(snapshot)=${typeof snapshot}`);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog(`LabelResolver.scoreBatch(): snapshot.byteLength=${snapshot.byteLength}`);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), after calling OrchestratorHelper.getSnapshotFromFile()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), ready to call LabelResolver.addSnapshot()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     await LabelResolver.addSnapshot(snapshot);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     Utility.debuggingLog('LabelResolver.scoreBatch(), after calling LabelResolver.addSnapshot()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // -----------------------------------------------------------------------
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const utterances: string[] = [
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'add a flag to it',
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----       'add some more info',
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     ];
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // -----------------------------------------------------------------------
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     const results: any = LabelResolver.scoreBatch(utterances, LabelType.Intent);
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('LabelResolver.scoreBatch(utterances, LabelType.Intent)', results, 'results');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     // -----------------------------------------------------------------------
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingLog('THE END - Test.0000 LabelResolver.runAsync()');
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   });
// ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- });
