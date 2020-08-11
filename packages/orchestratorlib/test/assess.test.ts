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
import {UnitTestHelper} from './utility.test';

describe('Test Suite - assess', () => {
  it('Test.0000 OrchestratorAssess.runAsync()', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/EvaluationJsonFormat/va_ground_truth.json';
    const prdictionPath: string = './resources/data/EvaluationJsonFormat/va_prediction.json';
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
        Utility.deleteFile(assessmentSetIntentLabelsOutputFilename);
        Utility.deleteFile(assessmentSetEntitySummaryHtmlOutputFilename);
        Utility.deleteFile(assessmentSetEntityLabelsOutputFilename);
        fs.rmdirSync(outputPath);
      } catch (error) {
      }
    }
    Utility.debuggingLog('THE END - Test.0000 OrchestratorAssess.runAsync()');
  });
});

