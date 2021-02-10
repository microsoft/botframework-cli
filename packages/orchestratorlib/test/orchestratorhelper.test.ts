/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';

import {Label} from '@microsoft/bf-dispatcher';
import {ScoreEntity} from '@microsoft/bf-dispatcher';
import {ScoreIntent} from '@microsoft/bf-dispatcher';
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
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    OrchestratorHelper.addNewLabelUtterance(
      utterance,
      label,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    assert.ok(utteranceLabelsMap.size === 1);
    assert.ok((utteranceLabelsMap.get(utterance) as Set<string>).size === 1);
  });
  it('Test.0001 OrchestratorHelper.addNewLabelUtterance() empty label', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = 'hi';
    const label: string = '';
    const hierarchicalLabel: string = '';
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    OrchestratorHelper.addNewLabelUtterance(
      utterance,
      label,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    Utility.debuggingLog(
      `utteranceLabelsMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericSetNativeMapArrayValue(utteranceLabelsMap)}`);
    assert.ok(utteranceLabelsMap.size === 1);
    assert.ok((utteranceLabelsMap.get(utterance) as Set<string>).size === 1);
    assert.ok([...(utteranceLabelsMap.get(utterance) as Set<string>)][0] === '');
  });

  it('Test.0100 OrchestratorHelper.addNewEntityLabelUtterance()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
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
    let utteranceEntityLabelsMapSize: number = utteranceEntityLabelsMap.size;
    assert.ok(entityObject.text === 'Seattle');
    assert.ok(utteranceEntityLabelsMapSize === 1);
    assert.ok((utteranceEntityLabelsMap.get(utterance) as Label[]).length === 1);
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
    utteranceEntityLabelsMapSize = utteranceEntityLabelsMap.size;
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(utteranceEntityLabelsMapSize === 2);
    assert.ok((utteranceEntityLabelsMap.get(utterance) as Label[]).length === 2);
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
    utteranceEntityLabelsMapSize = utteranceEntityLabelsMap.size;
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(utteranceEntityLabelsMapSize === 2);
    assert.ok((utteranceEntityLabelsMap.get(utterance) as Label[]).length === 2);
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
    utteranceEntityLabelsMapSize = utteranceEntityLabelsMap.size;
    assert.ok(entityObject.text === 'Paris');
    assert.ok(entityObjectSecond.text === 'Berlin');
    assert.ok(utteranceEntityLabelsMapSize === 2);
    assert.ok((utteranceEntityLabelsMap.get(utterance) as Label[]).length === 2);
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
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
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
    assert.ok(utteranceLabelsMap.size === 2,
      `utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    assert.ok(utteranceLabelDuplicateMapSize === 0,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(utteranceEntityLabelsMap.size === 2,
      `utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 0,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok((utteranceLabelsMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelsMap.get(utterance0) as Set<string>).size=${(utteranceLabelsMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelsMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelsMap.get(utterance1) as Set<string>).size=${(utteranceLabelsMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelsMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelsMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance1) as Label[]).length}`);
    OrchestratorHelper.getJsonIntentsEntitiesUtterances(
      jsonObjectArray,
      '',
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    utteranceLabelDuplicateMapSize = utteranceLabelDuplicateMap.size;
    utteranceEntityLabelDuplicateMapSize = utteranceEntityLabelDuplicateMap.size;
    assert.ok(utteranceLabelsMap.size === 2,
      `utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(utteranceEntityLabelsMap.size === 2,
      `utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok((utteranceLabelsMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelsMap.get(utterance0) as Set<string>).size=${(utteranceLabelsMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelsMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelsMap.get(utterance1) as Set<string>).size=${(utteranceLabelsMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelsMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelsMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance1) as Label[]).length}`);
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
    assert.ok(utteranceLabelsMap.size === 2,
      `utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(utteranceEntityLabelsMap.size === 2,
      `utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok((utteranceLabelsMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelsMap.get(utterance0) as Set<string>).size=${(utteranceLabelsMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelsMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelsMap.get(utterance1) as Set<string>).size=${(utteranceLabelsMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelsMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelsMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance1) as Label[]).length}`);
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
    assert.ok(utteranceLabelsMap.size === 2,
      `utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    assert.ok(utteranceLabelDuplicateMapSize === 2,
      `utteranceLabelDuplicateMapSize=${utteranceLabelDuplicateMapSize}`);
    assert.ok(utteranceEntityLabelsMap.size === 2,
      `utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    assert.ok(utteranceEntityLabelDuplicateMapSize === 2,
      `utteranceEntityLabelDuplicateMapSize=${utteranceEntityLabelDuplicateMapSize}`);
    assert.ok((utteranceLabelsMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelsMap.get(utterance0) as Set<string>).size=${(utteranceLabelsMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelsMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelsMap.get(utterance1) as Set<string>).size=${(utteranceLabelsMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelsMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelsMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelsMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelsMap.get(utterance1) as Label[]).length}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size === 1,
      `(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance0) as Set<string>).size}`);
    assert.ok((utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size === 2,
      `(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size=${(utteranceLabelDuplicateMap.get(utterance1) as Set<string>).size}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length === 1,
      `(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance0) as Label[]).length}`);
    assert.ok((utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length === 3,
      `(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length=${(utteranceEntityLabelDuplicateMap.get(utterance1) as Label[]).length}`);
  });

  it('Test.0300 OrchestratorHelper.getJsonIntentEntityScoresUtterances()', function () {
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
      'intent_scores': {
        'intent': string;
        'score': number;
      }[];
      'entity_scores': {
        'entity': string;
        'startPos': number;
        'endPos': number;
        'score': number;
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
        intent_scores: [
          {
            intent: 'Label0',
            score: 0.8,
          },
          {
            intent: 'Label1',
            score: 0.6,
          },
        ],
        entity_scores: [
          {
            entity: 'movie_name',
            startPos: 14,
            endPos: 34,
            score: 0.7,
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
        intent_scores: [
          {
            intent: 'Label0',
            score: 0.8,
          },
          {
            intent: 'Label1',
            score: 0.6,
          },
        ],
        entity_scores: [
          {
            entity: 'movie_name',
            startPos: 14,
            endPos: 34,
            score: 0.7,
          },
        ],
      },
    ];
    const utteranceLabelScoresMap: Map<string, ScoreIntent[]> = new Map<string, ScoreIntent[]>();
    const utteranceEntityLabelScoresMap: Map<string, ScoreEntity[]> = new Map<string, ScoreEntity[]>();
    OrchestratorHelper.getJsonIntentEntityScoresUtterances(
      jsonObjectArray,
      utteranceLabelScoresMap,
      utteranceEntityLabelScoresMap);
    assert.ok(utteranceLabelScoresMap.size === 2,
      `utteranceLabelScoresMap.size=${utteranceLabelScoresMap.size}`);
    assert.ok(utteranceEntityLabelScoresMap.size === 2,
      `utteranceEntityLabelScoresMap.size=${utteranceEntityLabelScoresMap.size}`);
  });

  it('Test.0400 OrchestratorHelper.getSnapshotFilePath()', () => {
    const baseOutputDir: string = './test/fixtures/output';
    const baseInputDir: string = './test/fixtures/dispatch/';

    // output is folder, input is folder
    let output: string = baseOutputDir;
    let input: string = baseInputDir;

    if (!OrchestratorHelper.exists(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, {recursive: true});
    }

    let snapshotPath: string = OrchestratorHelper.getSnapshotFilePath(output, input);
    let expected: string = path.join(output, OrchestratorHelper.SnapshotFileName);
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is folder, input is file
    input = path.join(input, 'Weather.json');
    snapshotPath = OrchestratorHelper.getSnapshotFilePath(output, input);
    expected = path.join(output, 'Weather.blu');
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is orchestrator.blu, input is file
    output = expected;
    snapshotPath = OrchestratorHelper.getSnapshotFilePath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is file <> orchestrator.blu, input is file
    output = path.join(baseOutputDir, 'test.blu');
    snapshotPath = OrchestratorHelper.getSnapshotFilePath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    // output is file <> orchestrator.blu, input is folder
    input = baseInputDir;
    snapshotPath = OrchestratorHelper.getSnapshotFilePath(output, input);
    expected = output;
    assert.ok(snapshotPath === expected, `Incorrect output file, expected ${expected}, actual ${snapshotPath}`);

    if (OrchestratorHelper.exists(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, {recursive: true});
    }
  });

  it('Test.0500 OrchestratorHelper.getUtteranceLabelsMap()', async () => {
    const inputFile: string = './test/fixtures/adaptive/RootDialog.lu';
    const result: Map<string, Set<string>> = (await OrchestratorHelper.getUtteranceLabelsMap(inputFile)).utteranceLabelsMap;
    assert.ok(result.has('Hey'), 'Incorrect result from getUtteranceLabelsMap, missing Hey utterance');
    assert.ok(result.has('Add item'), 'Incorrect result from getUtteranceLabelsMap, missing Add item utterance');
    assert.ok(result.has('delete to do go shopping'), 'Incorrect result from getUtteranceLabelsMap, missing delete to do go shopping utterance');
  });
});
