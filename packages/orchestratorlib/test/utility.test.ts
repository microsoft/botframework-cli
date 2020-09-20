/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {Utility} from '../src/utility';

export class UnitTestHelper {
  public static getDefaultUnitTestTimeout(): number {
    return 80000;
  }

  public static getDefaultUnitTestDebuggingLogFlag(): boolean {
    return false;
  }

  public static getDefaultUnitTestCleanUpFlag(): boolean {
    return true;
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
      `utteranceLabelsMap-B=${Utility.jsonStringify(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-B=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
    Utility.processUnknownLabelsInUtteranceLabelsMap(
      utteranceLabels);
    Utility.debuggingLog(
      `utteranceLabelsMap=A=${Utility.jsonStringify(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-A=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
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
      `utteranceLabelsMap-B=${Utility.jsonStringify(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-B=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
    Utility.processUnknownLabelsInUtteranceLabelsMapUsingLabelSet(
      utteranceLabels,
      labelSet);
    Utility.debuggingLog(
      `utteranceLabelsMap=A=${Utility.jsonStringify(utteranceLabelsMap)}`);
    Utility.debuggingLog(
      `utteranceLabelDuplicateMap-A=${Utility.jsonStringify(utteranceLabelDuplicateMap)}`);
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

