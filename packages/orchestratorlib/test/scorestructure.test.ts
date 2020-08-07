/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {Label} from '../src/label';
import {LabelType} from '../src/labeltype';
import {Span} from '../src/span';
import {Result} from '../src/result';
import {ScoreStructure} from '../src/scorestructure';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - scorestructure', () => {
  it('Test.0000 ScoreStructure - constructor()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = 'utterance';
    const labelsPredictedEvaluation: number = 0; // ---- 0: TP, 1, FN, 2: FP, 3: TN
    const labels: string[] = ['label'];
    const labelsConcatenated: string = 'label';
    const labelsIndexes: number[] = [0];
    const labelsPredicted: string[] = ['label'];
    const labelsPredictedConcatenated: string = 'label';
    const labelsPredictedScore: number = 0.99;
    const labelsPredictedIndexes: number[] = [0];
    const labelsPredictedClosestText: string[] = ['utterance'];
    const scoreResultArray: Result[] = [new Result(new Label(LabelType.Intent, 'label', new Span(0, 0)), 0.99, 'utterance')];
    const scoreArray: number[] = [0.99];
    const predictedScoreStructureHtmlTable: string = 'nothing-for-now';
    const labelsScoreStructureHtmlTable: string = 'nothing-for-now';
    const scorestructure: ScoreStructure = new ScoreStructure(
      utterance,
      labelsPredictedEvaluation,
      labels,
      labelsConcatenated,
      labelsIndexes,
      labelsPredicted,
      labelsPredictedConcatenated,
      labelsPredictedScore,
      labelsPredictedIndexes,
      labelsPredictedClosestText,
      scoreResultArray,
      scoreArray,
      predictedScoreStructureHtmlTable,
      labelsScoreStructureHtmlTable);
    Utility.debuggingLog(`scorestructure=${Utility.jsonStringify(scorestructure)}`);
    const scorestructureObject: {
      'utterance': string;
      'labelsPredictedEvaluation': number; // ---- 0: TP, 1, FN, 2: FP, 3: TN
      'labels': string[];
      'labelsConcatenated': string;
      'labelsIndexes': number[];
      'labelsPredicted': string[];
      'labelsPredictedConcatenated': string;
      'labelsPredictedScore': number;
      'labelsPredictedIndexes': number[];
      'labelsPredictedClosestText': string[];
      'scoreResultArray': Result[];
      'scoreArray': number[];
      'predictedScoreStructureHtmlTable': string;
      'labelsScoreStructureHtmlTable': string; } = scorestructure.toObject();
    assert.ok(scorestructureObject.utterance === 'utterance');
  });
});

