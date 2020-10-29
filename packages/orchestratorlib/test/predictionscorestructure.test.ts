/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {Span} from '@microsoft/bf-dispatcher';
import {Result} from '@microsoft/bf-dispatcher';
import {PredictionScoreStructure} from '../src/predictionscorestructure';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - scorestructure', () => {
  it('Test.0000 PredictionScoreStructure - constructor()', function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = 'utterance';
    const labelsPredictedEvaluation: number = 0;
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):TN
    // ---- NOTE ---- PredictionType.TrueNegative(8):FN
    const labels: string[] = ['label'];
    const labelsConcatenated: string = 'label';
    const labelsConcatenatedToHtmlTable: string = '<p><strong>Label</strong></p><table class="table"><tr><td>Label</td></tr></table>';
    const labelsIndexes: number[] = [0];
    const labelsPredicted: string[] = ['label'];
    const labelsPredictedConcatenated: string = 'label';
    const labelsPredictedConcatenatedToHtmlTable: string = '<p><strong>Label</strong></p><table class="table"><tr><td>Label</td></tr></table>';
    const labelsPredictedScore: number = 0.99;
    const labelsPredictedIndexes: number[] = [0];
    const labelsPredictedClosestText: string[] = ['utterance'];
    const scoreResultArray: Result[] = [new Result(new Label(LabelType.Intent, 'label', new Span(0, 0)), 0.99, 'utterance')];
    const scoreArray: number[] = [0.99];
    const predictedScoreStructureHtmlTable: string = 'nothing-for-now';
    const labelsScoreStructureHtmlTable: string = 'nothing-for-now';
    const scorestructure: PredictionScoreStructure = new PredictionScoreStructure(
      utterance,
      labelsPredictedEvaluation,
      labels,
      labelsConcatenated,
      labelsConcatenatedToHtmlTable,
      labelsIndexes,
      labelsPredicted,
      labelsPredictedConcatenated,
      labelsPredictedConcatenatedToHtmlTable,
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
      'labelsPredictedEvaluation': number;
      // ---- NOTE ---- PredictionType.TruePositive(1):TP
      // ---- NOTE ---- PredictionType.FalsePositive(2):FP
      // ---- NOTE ---- PredictionType.FalseNegative(4):FN
      // ---- NOTE ---- PredictionType.TrueNegative(8):TN
      'labels': string[];
      'labelsConcatenated': string;
      'labelsConcatenatedToHtmlTable': string;
      'labelsIndexes': number[];
      'labelsPredicted': string[];
      'labelsPredictedConcatenated': string;
      'labelsPredictedConcatenatedToHtmlTable': string;
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

