/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';

import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';

import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {Utility} from '../src/utility';

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
    nlrId: string,
    baseModelPath: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onTest: any = OrchestratorBaseModel.defaultHandler): Promise<void> {
    Utility.debuggingLog('Entering UnitTestHelper.downloadModelFileForTest()');
    Utility.debuggingLog(`UnitTestHelper.downloadModelFileForTest(), nlrId=${nlrId}`);
    Utility.debuggingLog(`UnitTestHelper.downloadModelFileForTest(), baseModelPath=${baseModelPath}`);
    if (!Utility.exists(baseModelPath)) {
      const nlrVersions: string = OrchestratorHelper.readFile(path.resolve('./test/fixtures/nlr_versions.json'));
      const nlrModels: any = JSON.parse(nlrVersions);
      const modelInfo: any = nlrModels.models[nlrId];
      if (!modelInfo) {
        throw new Error(`Model info for model ${nlrId} not found`);
      }
      const modelUrl: string = modelInfo.modelUri;
      Utility.debuggingLog('Ready to call OrchestratorNlr.getModelAsync()');
      await OrchestratorBaseModel.getModelAsync(
        baseModelPath,
        modelUrl,
        onProgress,
        onTest);
      Utility.debuggingLog('Finished calling OrchestratorNlr.getModelAsync()');
    }
    Utility.debuggingLog('Leaving UnitTestHelper.downloadModelFile()');
  }
}

describe('Test Suite - utility', () => {
  it('Test.0200 Utility.buildStringIdNumberValueDictionaryFromStringArray()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const labels: string[] = ['A', 'B', 'C'];
    const labelArrayAndMap: {
      'stringArray': string[];
      'stringMap': Map<string, number>;} =
      Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
    Utility.debuggingLog(`labelArrayAndMap.stringArray=${labelArrayAndMap.stringArray}`);
    Utility.debuggingLog(`labelArrayAndMap.stringMap=${labelArrayAndMap.stringMap}`);
    assert.ok(labelArrayAndMap.stringArray.length === 3);
    if (!(Utility.UnknownLabel in labelArrayAndMap.stringMap)) {
      labelArrayAndMap.stringArray.push(Utility.UnknownLabel);
      labelArrayAndMap.stringMap[Utility.UnknownLabel] = labelArrayAndMap.stringArray.length - 1;
      // ---- NOTE ---- Somehow the code below cannot compile, as the compiler or linter
      // ---- NOTE ---- thought that it's a contradiction against the '=== 3' assert.
      // ---- NOTE ---- assert.ok(labelArrayAndMap.stringArray.length === 4);
    }
  });

  it('Test.0100 Utility.processUnknownLabelsInUtteranceLabelsMap()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    Utility.processUnknownLabelsInUtteranceLabelsMap(
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
  it('Test.0101 Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(
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
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const doesExist: boolean = Utility.exists('resources/data/Columnar/Email.txt');
    Utility.debuggingLog(`doesExist=${doesExist}`);
    assert.ok(doesExist);
  });
});

