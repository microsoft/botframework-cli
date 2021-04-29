/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as fs from 'fs';

import {OrchestratorPredict} from '../src/predict';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

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
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output score file="${predictingSetIntentScoreOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetIntentGroundTruthJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output ground-truth json file="${predictingSetIntentGroundTruthJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetIntentPredictionJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output prediction json file="${predictingSetIntentPredictionJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetIntentSummaryOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output summary file="${predictingSetIntentSummaryOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetIntentLabelsOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output labels file="${predictingSetIntentLabelsOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetIntentSnapshotFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('s' commandlet), FAILED deleting output snapshot file="${predictingSetIntentSnapshotFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntityScoreOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output score file="${predictingSetEntityScoreOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntityGroundTruthJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output ground-truth json file="${predictingSetEntityGroundTruthJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntityPredictionJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output prediction json file="${predictingSetEntityPredictionJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntitySummaryOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output summary file="${predictingSetEntitySummaryOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntityLabelsOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output labels file="${predictingSetEntityLabelsOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(predictingSetEntitySnapshotFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('s' commandlet), FAILED deleting output snapshot file="${predictingSetEntitySnapshotFilename}"`,
          error,
          true);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorPredict ('v' vommandlet), FAILED deleting output folder=${outputPath}`,
          error,
          true);
      }
    }
    Utility.debuggingLog('THE END - OrchestratorPredict');
  });
});
