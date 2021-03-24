/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require('assert');

import {} from 'mocha';

import * as path from 'path';
import * as fs from 'fs';

import {OrchestratorBaseModel} from '../src/basemodel';
import {OrchestratorTest} from '../src/test';

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('Test Suite - test', () => {
  it('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_bert.blu';
    const testPath: string = './resources/data/Columnar/EmailTest.txt';
    const outputPath: string = './resources/data/Columnar/OrchestratorTest_Email_bert_3l';
    const ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const testingSetIntentScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentScoresOutputFilename);
    const testingSetIntentGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentGroundTruthJsonContentOutputFilename);
    const testingSetIntentPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentPredictionJsonContentOutputFilename);
    const testingSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentSummaryHtmlOutputFilename);
    const testingSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetIntentLabelsOutputFilename);
    const testingSetEntityScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityScoresOutputFilename);
    const testingSetEntityGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityGroundTruthJsonContentOutputFilename);
    const testingSetEntityPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityPredictionJsonContentOutputFilename);
    const testingSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntitySummaryHtmlOutputFilename);
    const testingSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetEntityLabelsOutputFilename);
    await OrchestratorTest.runAsync(
      baseModelPath,
      '', // ---- entityBaseModelPath
      inputPath,
      testPath,
      outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
    // ---- NOTE ---- clean up after unit tests.
    const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
    if (toCleanUpAfterUnitTest) {
      try {
        Utility.deleteFile(testingSetIntentScoresOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output score file="${testingSetIntentScoresOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetIntentGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output ground-truth json file="${testingSetIntentGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetIntentPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output prediction json file="${testingSetIntentPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetIntentSummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output summary file="${testingSetIntentSummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetIntentLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output labels file="${testingSetIntentLabelsOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetEntityScoresOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output score file="${testingSetEntityScoresOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetEntityGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output ground-truth json file="${testingSetEntityGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetEntityPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output prediction json file="${testingSetEntityPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetEntitySummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output summary file="${testingSetEntitySummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetEntityLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output labels file="${testingSetEntityLabelsOutputFilename}", error=${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output folder=${outputPath}, error=${error}`);
      }
    }
    Utility.debuggingLog('Finishing Test.0100 OrchestratorTest.runAsync()-Bert-3-layer');
    Utility.debuggingLog('THE END - Test.0100 OrchestratorTest.runAsync()-Bert-3-layer');
  });
});
