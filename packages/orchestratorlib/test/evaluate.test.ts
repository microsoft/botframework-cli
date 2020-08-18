/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import * as path from 'path';
import * as fs from 'fs';

import {} from 'mocha';

import {OrchestratorEvaluate} from '../src/evaluate';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - evaluate', () => {
  it('Test.0000 OrchestratorEvaluate.runAsync()', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email.blu';
    const outputPath: string = './resources/data/Columnar/OrchestratorEvaluate_Email';
    const nlrPath: string = '';
    const ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const trainingSetScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.trainingSetScoresOutputFilename);
    const trainingSetGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.trainingSetGroundTruthJsonContentOutputFilename);
    const trainingSetPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.trainingSetPredictionJsonContentOutputFilename);
    const trainingSetSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.trainingSetSummaryHtmlOutputFilename);
    const trainingSetLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.trainingSetLabelsOutputFilename);
    await OrchestratorEvaluate.runAsync(
      inputPath,
      outputPath,
      nlrPath,
      ambiguousClosenessParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(trainingSetScoresOutputFilename);
        Utility.deleteFile(trainingSetGroundTruthJsonContentOutputFilename);
        Utility.deleteFile(trainingSetPredictionJsonContentOutputFilename);
        Utility.deleteFile(trainingSetSummaryHtmlOutputFilename);
        Utility.deleteFile(trainingSetLabelsOutputFilename);
        fs.rmdirSync(outputPath);
      } catch (error) {
      }
    }
    Utility.debuggingLog('THE END - Test.0000 OrchestratorEvaluate.runAsync()');
  });
});

