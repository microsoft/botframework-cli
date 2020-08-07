/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import * as fs from 'fs';

import {} from 'mocha';

import {OrchestratorPredict} from '../src/predict';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - predict', () => {
  it('Test.0000 OrchestratorPredict - constructor()', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email.blu';
    const outputPath: string = './resources/data/Columnar/OrchestratorPredict_Email';
    const nlrPath: string = '';
    const ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const orchestratorPredict: OrchestratorPredict = new OrchestratorPredict(
      nlrPath,
      inputPath,
      outputPath,
      ambiguousClosenessParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
    const predictingSetScoreOutputFilename: string = orchestratorPredict.getPredictingSetScoreOutputFilename();
    const predictingSetSummaryOutputFilename: string = orchestratorPredict.getPredictingSetSummaryOutputFilename();
    const predictingLabelsOutputFilename: string = orchestratorPredict.getPredictingLabelsOutputFilename();
    const predictingSetSnapshotFilename: string = orchestratorPredict.getPredictingSetSnapshotFilename();
    // ---- NOTE ---- create a LabelResolver object.
    await orchestratorPredict.buildLabelResolver();
    // ---- NOTE-FOR-REFERENCE ---- enter the command loop.
    // ---- NOTE-FOR-REFERENCE ---- orchestratorPredict.commandLetLoop();
    orchestratorPredict.commandLetH();
    orchestratorPredict.commandLetUwithEntry('hi');
    orchestratorPredict.commandLetIwithEntry('greeting');
    orchestratorPredict.commandLetS();
    orchestratorPredict.commandLetF();
    orchestratorPredict.commandLetV();
    orchestratorPredict.commandLetS();
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(predictingSetScoreOutputFilename);
        Utility.deleteFile(predictingSetSummaryOutputFilename);
        Utility.deleteFile(predictingLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`error for deleting output files ('v' vommandlet): ${error}`);
      }
      try {
        Utility.deleteFile(predictingSetSnapshotFilename);
      } catch (error) {
        Utility.debuggingLog(`error for deleting output files ('s' commandlet): ${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`error for deleting output directory: ${error}`);
      }
    }
    Utility.debuggingLog('THE END - OrchestratorPredict - constructor()');
  });
});

