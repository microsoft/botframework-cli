/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

// import {LabelType} from '../src/labeltype';
import {Label} from '../src/label';
// import {Span} from '../src/span';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - orchestratorhelper', () => {
  it('Test.0000 OrchestratorHelper.addNewLabelUtterance()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = 'hi';
    const label: string = 'greeting';
    const hierarchicalLabel: string = '';
    const utteranceLabelsMap: { [id: string]: string[] } = {};
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    OrchestratorHelper.addNewLabelUtterance(
      utterance,
      label,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceLabelsMap=${Utility.jsonStringify(utteranceLabelsMap)}`);
    assert.ok(Object.entries(utteranceLabelsMap).length === 1);
    assert.ok(utteranceLabelsMap[utterance].length === 1);
  });
  it('Test.0001 OrchestratorHelper.addNewLabelUtterance() empty label', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = 'hi';
    const label: string = '';
    const hierarchicalLabel: string = '';
    const utteranceLabelsMap: { [id: string]: string[] } = {};
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    OrchestratorHelper.addNewLabelUtterance(
      utterance,
      label,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceLabelsMap=${Utility.jsonStringify(utteranceLabelsMap)}`);
    assert.ok(Object.entries(utteranceLabelsMap).length === 1);
    assert.ok(utteranceLabelsMap[utterance].length === 1);
    assert.ok(utteranceLabelsMap[utterance][0] === '');
  });

  it('Test.0100 OrchestratorHelper.addNewEntityLabelUtterance()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utteranceEntityLabelsMap: { [id: string]: Label[] } = {};
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    let utterance: string = 'the destination is Seattle';
    let entityLabel: Label = Label.newEntityLabel('location', 19, 7);
    let entityObject: {
      'entity': string;
      'startPos': number;
      'endPos': number;
      'text': string; } = entityLabel.toEntityObjectWithText(utterance);
    OrchestratorHelper.addNewEntityLabelUtterance(
      utterance,
      [entityObject],
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceEntityLabelsMap=${Utility.jsonStringify(utteranceEntityLabelsMap)}`);
    assert.ok(entityObject.text === 'Seattle');
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 1);
    assert.ok(utteranceEntityLabelsMap[utterance].length === 1);
    assert.ok(utteranceEntityLabelDuplicateMap.size === 0);
    utterance = 'traveling from Paris to Berlin';
    entityLabel = Label.newEntityLabel('location', 15, 5);
    entityObject = entityLabel.toEntityObjectWithText(utterance);
    let entityLabelSecond: Label = Label.newEntityLabel('location', 24, 6);
    let entityObjectSecond: {
      'entity': string;
      'startPos': number;
      'endPos': number;
      'text': string; } = entityLabelSecond.toEntityObjectWithText(utterance);
    OrchestratorHelper.addNewEntityLabelUtterance(
      utterance,
      [entityObject, entityObjectSecond],
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceEntityLabelsMap=${Utility.jsonStringify(utteranceEntityLabelsMap)}`);
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2);
    assert.ok(utteranceEntityLabelsMap[utterance].length === 2);
    assert.ok(utteranceEntityLabelDuplicateMap.size === 0);
    utterance = 'traveling from Paris to Berlin';
    entityLabel = Label.newEntityLabel('location', 15, 5);
    entityObject = entityLabel.toEntityObjectWithText(utterance);
    entityLabelSecond = Label.newEntityLabel('location', 24, 6);
    entityObjectSecond = entityLabelSecond.toEntityObjectWithText(utterance);
    OrchestratorHelper.addNewEntityLabelUtterance(
      utterance,
      [entityObject, entityObjectSecond],
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceEntityLabelsMap=${Utility.jsonStringify(utteranceEntityLabelsMap)}`);
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2);
    assert.ok(utteranceEntityLabelsMap[utterance].length === 2);
    // assert.ok(utteranceEntityLabelDuplicateMap.size === 1);
    let duplicateEntityLabels: Label[] = utteranceEntityLabelDuplicateMap.get(utterance) as Label[];
    assert.ok(duplicateEntityLabels.length === 2);
    utterance = 'traveling from Paris to Berlin';
    entityLabel = Label.newEntityLabel('location', 15, 5);
    entityObject = entityLabel.toEntityObjectWithText(utterance);
    entityLabelSecond = Label.newEntityLabel('location', 24, 6);
    entityObjectSecond = entityLabelSecond.toEntityObjectWithText(utterance);
    OrchestratorHelper.addNewEntityLabelUtterance(
      utterance,
      [entityObject, entityObjectSecond],
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceEntityLabelsMap=${Utility.jsonStringify(utteranceEntityLabelsMap)}`);
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2);
    assert.ok(utteranceEntityLabelsMap[utterance].length === 2);
    // ---- NOTE-eslint-FAIL-TO-ACCEPT-THIS-assert ---- assert.ok(utteranceEntityLabelDuplicateMap.size === 1);
    duplicateEntityLabels = utteranceEntityLabelDuplicateMap.get(utterance) as Label[];
    assert.ok(duplicateEntityLabels.length === 2);
    const entityLabelThird: Label = Label.newEntityLabel('location', 24, 6);
    // const entityObjectThird: {
    //   'entity': string;
    //   'startPos': number;
    //   'endPos': number;
    //   'text': string; } = entityLabelThird.toEntityObjectWithText(utterance);
    assert.ok(entityLabelSecond.equals(entityLabelThird));
  });
});

