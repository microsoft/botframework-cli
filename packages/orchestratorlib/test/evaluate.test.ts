/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';
import * as fs from 'fs';

import {OrchestratorEvaluate} from '../src/evaluate';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - the "evaluate" command', () => {
  it('Test.0000 OrchestratorEvaluate.runAsync()', async function (): Promise<void> {
    Utility.resetFlagToPrintDebuggingLogToConsole(
      UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_roberta.blu';
    const outputPath: string = './resources/data/Columnar/OrchestratorEvaluate_Email_roberta';
    const baseModelPath: string = '';
    const entityBaseModelPath: string = '';
    const ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const snapshotSetIntentScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentScoresOutputFilename);
    const snapshotSetIntentGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentGroundTruthJsonContentOutputFilename);
    const snapshotSetIntentPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentPredictionJsonContentOutputFilename);
    const snapshotSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentSummaryHtmlOutputFilename);
    const snapshotSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetIntentLabelsOutputFilename);
    const snapshotSetEntityScoresOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityScoresOutputFilename);
    const snapshotSetEntityGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityGroundTruthJsonContentOutputFilename);
    const snapshotSetEntityPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityPredictionJsonContentOutputFilename);
    const snapshotSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntitySummaryHtmlOutputFilename);
    const snapshotSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorEvaluate.snapshotSetEntityLabelsOutputFilename);
    await OrchestratorEvaluate.runAsync(
      inputPath,
      outputPath,
      baseModelPath,
      entityBaseModelPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(snapshotSetIntentScoresOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output score file="${snapshotSetIntentScoresOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetIntentGroundTruthJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output ground-truth json file="${snapshotSetIntentGroundTruthJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetIntentPredictionJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output prediction json file="${snapshotSetIntentPredictionJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetIntentSummaryHtmlOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output summary file="${snapshotSetIntentSummaryHtmlOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetIntentLabelsOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output labels file="${snapshotSetIntentLabelsOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetEntityScoresOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output score file="${snapshotSetEntityScoresOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetEntityGroundTruthJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output ground-truth json file="${snapshotSetEntityGroundTruthJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetEntityPredictionJsonContentOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output prediction json file="${snapshotSetEntityPredictionJsonContentOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetEntitySummaryHtmlOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output summary file="${snapshotSetEntitySummaryHtmlOutputFilename}"`,
          error,
          true);
      }
      try {
        Utility.deleteFile(snapshotSetEntityLabelsOutputFilename);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output labels file="${snapshotSetEntityLabelsOutputFilename}"`,
          error,
          true);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        UtilityDispatcher.debuggingLogWithCause(
          `Test.0000 OrchestratorEvaluate.runAsync(), FAILED deleting output folder=${outputPath}`,
          error,
          true);
      }
    }
    Utility.debuggingLog('THE END - Test.0000 OrchestratorEvaluate.runAsync()');
  });
});
