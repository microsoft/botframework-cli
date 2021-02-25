/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import * as path from 'path';
import * as fs from 'fs';

import {} from 'mocha';

import {OrchestratorAssess} from '../src/assess';

import {Utility} from '../src/utility';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - the "assess" command', () => {
  it('Test.0000 OrchestratorAssess.runAsync()', async function (): Promise<void> {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    UtilityDispatcher.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/EvaluationJsonFormat/va_ground_truth_instances.json';
    const prdictionPath: string = './resources/data/EvaluationJsonFormat/va_prediction_instances.json';
    const outputPath: string = './resources/data/EvaluationJsonFormat/OrchestratorAssess_VA';
    const assessmentSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentSummaryHtmlOutputFilename);
    const assessmentSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentLabelsOutputFilename);
    const assessmentSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntitySummaryHtmlOutputFilename);
    const assessmentSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntityLabelsOutputFilename);
    await OrchestratorAssess.runAsync(
      inputPath,
      prdictionPath,
      outputPath);
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(assessmentSetIntentSummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorAssess.runAsync(), FAILED deleting output intent-summary file="${assessmentSetIntentSummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetIntentLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorAssess.runAsync(), FAILED deleting output intent-labels file="${assessmentSetIntentLabelsOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetEntitySummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorAssess.runAsync(), FAILED deleting output entity-summary file="${assessmentSetEntitySummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetEntityLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorAssess.runAsync(), FAILED deleting output entity-labels file="${assessmentSetEntityLabelsOutputFilename}", error=${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorAssess.runAsync(), FAILED deleting output folder, error=${error}`);
      }
    }
    Utility.debuggingLog('THE END - Test.0000 OrchestratorAssess.runAsync()');
  });

  it('Test.0001 OrchestratorAssess.runAsync()', async function (): Promise<void> {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    UtilityDispatcher.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/EvaluationJsonFormat/orchestrator_testing_set_ground_truth_instances.json';
    const prdictionPath: string = './resources/data/EvaluationJsonFormat/orchestrator_testing_set_prediction_instances.json';
    const outputPath: string = './resources/data/EvaluationJsonFormat/OrchestratorAssess_VAtest';
    const assessmentSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentSummaryHtmlOutputFilename);
    const assessmentSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentLabelsOutputFilename);
    const assessmentSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntitySummaryHtmlOutputFilename);
    const assessmentSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntityLabelsOutputFilename);
    await OrchestratorAssess.runAsync(
      inputPath,
      prdictionPath,
      outputPath);
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(assessmentSetIntentSummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0001 OrchestratorAssess.runAsync(), FAILED deleting output intent-summary file="${assessmentSetIntentSummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetIntentLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0001 OrchestratorAssess.runAsync(), FAILED deleting output intent-labels file="${assessmentSetIntentLabelsOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetEntitySummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0001 OrchestratorAssess.runAsync(), FAILED deleting output entity-summary file="${assessmentSetEntitySummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(assessmentSetEntityLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0001 OrchestratorAssess.runAsync(), FAILED deleting output entity-labels file="${assessmentSetEntityLabelsOutputFilename}", error=${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`Test.0001 OrchestratorAssess.runAsync(), FAILED deleting output folder, error=${error}`);
      }
    }
    Utility.debuggingLog('THE END - Test.0001 OrchestratorAssess.runAsync()');
  });
});

