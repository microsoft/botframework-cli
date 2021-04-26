/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

// import * as path from 'path';

import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';

import {ILabelArrayAndMap} from '@microsoft/bf-dispatcher';

import {OrchestratorBaseModel} from '../src/basemodel';
// import {OrchestratorHelper} from '../src/orchestratorhelper';
import {Utility} from '../src/utility';

// NOTE: "orchestrator_test_3_layer" is an aka.ms alias for the 3 layer model "pretrained.20200924.microsoft.dte.00.03.en.onnx"
// https://aka.ms/orchestrator_test_3_layer === https://aka.ms/pretrained.20200924.microsoft.dte.00.03.en.onnx
// We are using an alias so we don't count downloads of this model during unit test runs
const DefaultTestModelId: string = 'orchestrator_test_3_layer';

export class UnitTestHelper {
  public static getDefaultFunctionalTestTimeout(): number {
    return 3000000;
  }

  public static getDefaultUnitTestTimeout(): number {
    return 100000;
  }

  public static getDefaultUnitTestDebuggingLogFlag(): boolean {
    return false;
  }

  public static getDefaultUnitTestCleanUpFlag(): boolean {
    return true;
  }

  public static getIgnoreFlag(): boolean {
    return false;
  }

  public static async downloadModelFileForTest(
    baseModelPath: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler,
    basemodelId: string = ''): Promise<void> {
    if (basemodelId.length === 0) {
      basemodelId = DefaultTestModelId;
    }

    Utility.debuggingLog('UnitTestHelper.downloadModelFileForTest() entering');
    Utility.debuggingLog(`UnitTestHelper.downloadModelFileForTest(), basemodelId=${basemodelId}`);
    Utility.debuggingLog(`UnitTestHelper.downloadModelFileForTest(), baseModelPath=${baseModelPath}`);

    if (!Utility.exists(baseModelPath)) {
      Utility.debuggingLog('UnitTestHelper.downloadModelFileForTest(), ready to call OrchestratorBaseModel.getAsync()');
      await OrchestratorBaseModel.getAsync(
        baseModelPath,
        basemodelId,
        onProgress,
        onFinish);
      Utility.debuggingLog('UnitTestHelper.downloadModelFileForTest(), finished calling OrchestratorBaseModel.getAsync()');
    }
    Utility.debuggingLog('UnitTestHelper.downloadModelFile() leaving');
  }
}

describe('Test Suite - utility', () => {
  it('Test.0200 Utility.buildStringIdNumberValueDictionaryFromStringArray()', function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const labels: string[] = ['A', 'B', 'C'];
    const labelArrayAndMap: ILabelArrayAndMap =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
    Utility.debuggingLog(`labelArrayAndMap.stringArray=${labelArrayAndMap.stringArray}`);
    Utility.debuggingLog(`labelArrayAndMap.stringMap=${labelArrayAndMap.stringMap}`);
    const stringArrayLength: number = labelArrayAndMap.stringArray.length;
    assert.ok(stringArrayLength === 3);
    if (!(Utility.UnknownLabel in labelArrayAndMap.stringMap)) {
      labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
      labelArrayAndMap.stringMap.set(Utility.UnknownLabel, labelArrayAndMap.stringArray.length - 1);
      // ---- NOTE ---- Somehow the code below cannot compile, as the compiler or linter
      // ---- NOTE ---- thought that it's a contradiction against the '=== 3' assert.
      const stringArrayLengthNew: number = labelArrayAndMap.stringArray.length;
      assert.ok(stringArrayLengthNew === 4);
    }
  });

  it('Test.0100 Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap()', function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utterance0: string = 'hi';
    const labelArray0: string[] = ['greeting', 'chitchat'];
    const labelSet0: Set<string> = new Set<string>(labelArray0);
    utteranceLabelsMap.set(utterance0, labelSet0);
    utteranceLabelDuplicateMap.set(utterance0, labelSet0);
    const utterance1: string = 'A';
    const labelArray1: string[] = ['greeting', '', 'unknown', 'none'];
    const labelSet1: Set<string> = new Set<string>(labelArray1);
    utteranceLabelsMap.set(utterance1, labelSet1);
    utteranceLabelDuplicateMap.set(utterance1, labelSet1);
    const utterance2: string = 'B';
    const labelArray2: string[] = ['', 'unknown', 'none'];
    const labelSet2: Set<string> = new Set<string>(labelArray2);
    utteranceLabelsMap.set(utterance2, labelSet2);
    utteranceLabelDuplicateMap.set(utterance2, labelSet2);
    const utterance3: string = 'C';
    const labelArray3: string[] = [];
    const labelSet3: Set<string> = new Set<string>(labelArray3);
    utteranceLabelsMap.set(utterance3, labelSet3);
    utteranceLabelDuplicateMap.set(utterance3, labelSet3);
    const utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; } = {
        utteranceLabelsMap,
        utteranceLabelDuplicateMap};
    Utility.debuggingLog(
      `utteranceLabelsMap-B=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-B=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelDuplicateMap)}`);
    Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap(
      utteranceLabels);
    Utility.debuggingLog(
      `utteranceLabelsMap=A=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-A=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelDuplicateMap)}`);
    assert.ok((utteranceLabelsMap.get('hi') as Set<string>).size === 2);
    assert.ok((utteranceLabelsMap.get('A') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('A') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelsMap.get('B') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('B') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelsMap.get('C') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('C') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelDuplicateMap.get('hi') as Set<string>).size === 2);
    assert.ok((utteranceLabelDuplicateMap.get('A') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('A') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelDuplicateMap.get('B') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('B') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelDuplicateMap.get('C') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('C') as Set<string>).has(Utility.UnknownLabel));
  });
  it('Test.0101 Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet()', function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utterance0: string = 'hi';
    const labelArray0: string[] = ['greeting', 'chitchat'];
    const labelSet0: Set<string> = new Set<string>(labelArray0);
    utteranceLabelsMap.set(utterance0, labelSet0);
    utteranceLabelDuplicateMap.set(utterance0, labelSet0);
    const utterance1: string = 'A';
    const labelArray1: string[] = ['greeting', '', 'unknown', 'none'];
    const labelSet1: Set<string> = new Set<string>(labelArray1);
    utteranceLabelsMap.set(utterance1, labelSet1);
    utteranceLabelDuplicateMap.set(utterance1, labelSet1);
    const utterance2: string = 'B';
    const labelArray2: string[] = ['', 'unknown', 'none'];
    const labelSet2: Set<string> = new Set<string>(labelArray2);
    utteranceLabelsMap.set(utterance2, labelSet2);
    utteranceLabelDuplicateMap.set(utterance2, labelSet2);
    const utterance3: string = 'C';
    const labelArray3: string[] = [];
    const labelSet3: Set<string> = new Set<string>(labelArray3);
    utteranceLabelsMap.set(utterance3, labelSet3);
    utteranceLabelDuplicateMap.set(utterance3, labelSet3);
    const labelSet: Set<string> = new Set<string>(['greeting']);
    const utteranceLabels: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>; } = {
        utteranceLabelsMap,
        utteranceLabelDuplicateMap};
    Utility.debuggingLog(
      `utteranceLabelsMap-B=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-B=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelDuplicateMap)}`);
    Utility.processUnknownSpuriousLabelsInUtteranceLabelsMapUsingLabelSet(
      utteranceLabels,
      labelSet);
    Utility.debuggingLog(
      `utteranceLabelsMap=A=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-A=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelDuplicateMap)}`);
    assert.ok((utteranceLabelsMap.get('hi') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('hi') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelsMap.get('A') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('A') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelsMap.get('B') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('B') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelsMap.get('C') as Set<string>).size === 1);
    assert.ok((utteranceLabelsMap.get('C') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelDuplicateMap.get('hi') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('hi') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelDuplicateMap.get('A') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('A') as Set<string>).has('greeting'));
    assert.ok((utteranceLabelDuplicateMap.get('B') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('B') as Set<string>).has(Utility.UnknownLabel));
    assert.ok((utteranceLabelDuplicateMap.get('C') as Set<string>).size === 1);
    assert.ok((utteranceLabelDuplicateMap.get('C') as Set<string>).has(Utility.UnknownLabel));
  });

  it('Test.0000 Utility.exists()', function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const doesExist: boolean = Utility.exists('resources/data/Columnar/Email.txt');
    Utility.debuggingLog(`doesExist=${doesExist}`);
    assert.ok(doesExist);
  });
});

