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
import * as fs from 'fs-extra';
import * as path from 'path';

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
    let entityObjectArray: {
      'entity': string;
      'startPos': number;
      'endPos': number;
      'text': string; }[] = [entityObject];
    entityObjectArray.forEach((entityObject: any) => {
      OrchestratorHelper.addNewEntityLabelUtterance(
        utterance,
        entityObject,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    });
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
    entityObjectArray = [entityObject, entityObjectSecond];
    entityObjectArray.forEach((entityObject: any) => {
      OrchestratorHelper.addNewEntityLabelUtterance(
        utterance,
        entityObject,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    });
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
    entityObjectArray = [entityObject, entityObjectSecond];
    entityObjectArray.forEach((entityObject: any) => {
      OrchestratorHelper.addNewEntityLabelUtterance(
        utterance,
        entityObject,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    });
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
    entityObjectArray = [entityObject, entityObjectSecond];
    entityObjectArray.forEach((entityObject: any) => {
      OrchestratorHelper.addNewEntityLabelUtterance(
        utterance,
        entityObject,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    });
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

  it('Test.0200 OrchestratorHelper.getJsonIntentsEntitiesUtterances()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance0: string = 'I want to see Medal for the General';
    const utterance1: string = 'Play the top music from The Railway Children off Last Fm .';
    const jsonObjectArray: {
      'text': string;
      'intents': string[];
      'entities': {
        'entity': string;
        'startPos': number;
        'endPos': number;
        'text': string;
      }[];
    }[] = [
      {
        text: utterance0,
        intents: ['Label0'],
        entities: [
          {
            entity: 'movie_name',
            startPos: 14,
            endPos: 34,
            text: 'Medal for the General',
          },
        ],
      },
      {
        text: utterance1,
        intents: ['Label0', 'Label1'],
        entities: [
          {
            entity: 'sort',
            startPos: 9,
            endPos: 11,
            text: 'top',
          },
          {
            entity: 'artist',
            startPos: 24,
            endPos: 43,
            text: 'The Railway Children',
          },
          {
            entity: 'service',
            startPos: 49,
            endPos: 55,
            text: 'Last Fm',
          },
        ],
      },
    ];
    const utteranceLabelsMap: { [id: string]: string[] } = {};
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceEntityLabelsMap: { [id: string]: Label[] } = {};
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    OrchestratorHelper.getJsonIntentsEntitiesUtterances(
      jsonObjectArray,
      '',
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    let utteranceLabelDuplicateMapSize: number = utteranceLabelDuplicateMap.size;
    let utteranceEntityLabelDuplicateMapSize: number = utteranceEntityLabelDuplicateMap.size;
    assert.ok(Object.entries(utteranceLabelsMap).length === 2,
      `Object.entries(utteranceLabelsMap).length=${Object.entries(utteranceLabelsMap).length}`);
    assert.ok(utteranceLabelDuplicateMapSize === 0,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2,
      `Object.entries(utteranceEntityLabelsMap).length=${Object.entries(utteranceEntityLabelsMap).length}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 0,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok(utteranceLabelsMap[utterance0].length === 1,
      `utteranceLabelsMap[utterance0].length=${utteranceLabelsMap[utterance0].length}`);
    assert.ok(utteranceLabelsMap[utterance1].length === 2,
      `utteranceLabelsMap[utterance1].length=${utteranceLabelsMap[utterance1].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance0].length === 1,
      `utteranceEntityLabelsMap[utterance0].length=${utteranceEntityLabelsMap[utterance0].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance1].length === 3,
      `utteranceEntityLabelsMap[utterance1].length=${utteranceEntityLabelsMap[utterance1].length}`);
    OrchestratorHelper.getJsonIntentsEntitiesUtterances(
      jsonObjectArray,
      '',
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    utteranceLabelDuplicateMapSize = utteranceLabelDuplicateMap.size;
    utteranceEntityLabelDuplicateMapSize = utteranceEntityLabelDuplicateMap.size;
    assert.ok(Object.entries(utteranceLabelsMap).length === 2,
      `Object.entries(utteranceLabelsMap).length=${Object.entries(utteranceLabelsMap).length}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2,
      `Object.entries(utteranceEntityLabelsMap).length=${Object.entries(utteranceEntityLabelsMap).length}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok(utteranceLabelsMap[utterance0].length === 1,
      `utteranceLabelsMap[utterance0].length=${utteranceLabelsMap[utterance0].length}`);
    assert.ok(utteranceLabelsMap[utterance1].length === 2,
      `utteranceLabelsMap[utterance1].length=${utteranceLabelsMap[utterance1].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance0].length === 1,
      `utteranceEntityLabelsMap[utterance0].length=${utteranceEntityLabelsMap[utterance0].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance1].length === 3,
      `utteranceEntityLabelsMap[utterance1].length=${utteranceEntityLabelsMap[utterance1].length}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length}`);
    OrchestratorHelper.getJsonIntentsEntitiesUtterances(
      jsonObjectArray,
      '',
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    utteranceLabelDuplicateMapSize = utteranceLabelDuplicateMap.size;
    utteranceEntityLabelDuplicateMapSize = utteranceEntityLabelDuplicateMap.size;
    assert.ok(Object.entries(utteranceLabelsMap).length === 2,
      `Object.entries(utteranceLabelsMap).length=${Object.entries(utteranceLabelsMap).length}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2,
      `Object.entries(utteranceEntityLabelsMap).length=${Object.entries(utteranceEntityLabelsMap).length}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok(utteranceLabelsMap[utterance0].length === 1,
      `utteranceLabelsMap[utterance0].length=${utteranceLabelsMap[utterance0].length}`);
    assert.ok(utteranceLabelsMap[utterance1].length === 2,
      `utteranceLabelsMap[utterance1].length=${utteranceLabelsMap[utterance1].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance0].length === 1,
      `utteranceEntityLabelsMap[utterance0].length=${utteranceEntityLabelsMap[utterance0].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance1].length === 3,
      `utteranceEntityLabelsMap[utterance1].length=${utteranceEntityLabelsMap[utterance1].length}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length}`);
    OrchestratorHelper.getJsonIntentsEntitiesUtterances(
      jsonObjectArray,
      '',
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    utteranceLabelDuplicateMapSize = utteranceLabelDuplicateMap.size;
    utteranceEntityLabelDuplicateMapSize = utteranceEntityLabelDuplicateMap.size;
    assert.ok(Object.entries(utteranceLabelsMap).length === 2,
      `Object.entries(utteranceLabelsMap).length=${Object.entries(utteranceLabelsMap).length}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(Object.entries(utteranceEntityLabelsMap).length === 2,
      `Object.entries(utteranceEntityLabelsMap).length=${Object.entries(utteranceEntityLabelsMap).length}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok(utteranceLabelsMap[utterance0].length === 1,
      `utteranceLabelsMap[utterance0].length=${utteranceLabelsMap[utterance0].length}`);
    assert.ok(utteranceLabelsMap[utterance1].length === 2,
      `utteranceLabelsMap[utterance1].length=${utteranceLabelsMap[utterance1].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance0].length === 1,
      `utteranceEntityLabelsMap[utterance0].length=${utteranceEntityLabelsMap[utterance0].length}`);
    assert.ok(utteranceEntityLabelsMap[utterance1].length === 3,
      `utteranceEntityLabelsMap[utterance1].length=${utteranceEntityLabelsMap[utterance1].length}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length}`);
  });

  it('Test.0300 OrchestratorHelper.getOutputPath()', () => {
    const baseOutputDir: string = './test/fixtures/output';
    const baseInputDir: string = './test/fixtures/dispatch/';

    // output is folder, input is folder
    let output: string = baseOutputDir;
    let input: string = baseInputDir;

    if (!OrchestratorHelper.exists(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, {recursive: true});
    }

    let snapshotPath: string = OrchestratorHelper.getOutputPath(output, input);
    let expected: string = path.join(output, OrchestratorHelper.SnapshotFileName);
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is folder, input is file
    input = path.join(input, 'Weather.json');
    snapshotPath = OrchestratorHelper.getOutputPath(output, input);
    expected = path.join(output, 'Weather.blu');
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is orchestrator.blu, input is file
    output = expected;
    snapshotPath = OrchestratorHelper.getOutputPath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is file <> orchestrator.blu, input is file
    output = path.join(baseOutputDir, 'test.blu');
    snapshotPath = OrchestratorHelper.getOutputPath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is file <> orchestrator.blu, input is folder
    input = baseInputDir;
    snapshotPath = OrchestratorHelper.getOutputPath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    if (OrchestratorHelper.exists(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, {recursive: true});
    }
  });
});

