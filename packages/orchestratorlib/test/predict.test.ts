/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as fs from 'fs';

import {OrchestratorPredict} from '../src/predict';

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - the "predict" command', () => {
  it('Test.0000 OrchestratorPredict', async function (): Promise<void> {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_roberta.blu';
    const outputPath: string = './resources/data/Columnar/OrchestratorPredict_Email_roberta';
    const baseModelPath: string = '';
    const ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const orchestratorPredict: OrchestratorPredict = new OrchestratorPredict(
      baseModelPath,
      '', // ---- entityBaseModelPath
      inputPath,
      outputPath,
      'unit-test',
      null,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
    const predictingSetIntentScoreOutputFilename: string = orchestratorPredict.getPredictingSetIntentScoreOutputFilename();
    const predictingSetIntentGroundTruthJsonContentOutputFilename: string = orchestratorPredict.getPredictingSetIntentGroundTruthJsonContentOutputFilename();
    const predictingSetIntentPredictionJsonContentOutputFilename: string = orchestratorPredict.getPredictingSetIntentPredictionJsonContentOutputFilename();
    const predictingSetIntentSummaryOutputFilename: string = orchestratorPredict.getPredictingSetIntentSummaryOutputFilename();
    const predictingSetIntentLabelsOutputFilename: string = orchestratorPredict.getPredictingSetIntentLabelsOutputFilename();
    const predictingSetIntentSnapshotFilename: string = orchestratorPredict.getPredictingSetIntentSnapshotFilename();
    const predictingSetEntityScoreOutputFilename: string = orchestratorPredict.getPredictingSetEntityScoreOutputFilename();
    const predictingSetEntityGroundTruthJsonContentOutputFilename: string = orchestratorPredict.getPredictingSetEntityGroundTruthJsonContentOutputFilename();
    const predictingSetEntityPredictionJsonContentOutputFilename: string = orchestratorPredict.getPredictingSetEntityPredictionJsonContentOutputFilename();
    const predictingSetEntitySummaryOutputFilename: string = orchestratorPredict.getPredictingSetEntitySummaryOutputFilename();
    const predictingSetEntityLabelsOutputFilename: string = orchestratorPredict.getPredictingSetEntityLabelsOutputFilename();
    const predictingSetEntitySnapshotFilename: string = orchestratorPredict.getPredictingSetEntitySnapshotFilename();
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
        Utility.deleteFile(predictingSetIntentScoreOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output score file="${predictingSetIntentScoreOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetIntentGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output ground-truth json file="${predictingSetIntentGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetIntentPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output prediction json file="${predictingSetIntentPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetIntentSummaryOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output summary file="${predictingSetIntentSummaryOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetIntentLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output labels file="${predictingSetIntentLabelsOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetIntentSnapshotFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('s' commandlet), FAILED deleting output snapshot file="${predictingSetIntentSnapshotFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntityScoreOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output score file="${predictingSetEntityScoreOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntityGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output ground-truth json file="${predictingSetEntityGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntityPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output prediction json file="${predictingSetEntityPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntitySummaryOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output summary file="${predictingSetEntitySummaryOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntityLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output labels file="${predictingSetEntityLabelsOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(predictingSetEntitySnapshotFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('s' commandlet), FAILED deleting output snapshot file="${predictingSetEntitySnapshotFilename}", error=${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output folder=${outputPath}, error=${error}`);
      }
    }
    Utility.debuggingLog('THE END - OrchestratorPredict');
  });
});
