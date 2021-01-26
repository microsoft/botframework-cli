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
  /*
  it('Test.0000 OrchestratorTest.runAsync()-Roberta', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.toPrintDebuggingLogToConsole = true; // UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.12.roberta.en.onnx';
    const baseModelPath: string = path.resolve('./resources/model/model_dte_roberta_12l');
    Utility.debuggingLog('Test.0000 OrchestratorTest.runAsync()-Roberta: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
    const modelConfig: string = Utility.loadFile(path.resolve(baseModelPath, 'config.json'));
    Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: modelConfig=${modelConfig}`);
    Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: process.cwd()=${process.cwd()}`);
    const inputPath: string = './resources/data/Columnar/Email_roberta.blu';
    const testPath: string = './resources/data/Columnar/EmailTest.txt';
    const outputPath: string = './resources/data/Columnar/OrchestratorTest_Email_roberta_12l';
    const ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
    const lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    const testingSetScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetScoresOutputFilename);
    const testingSetGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetGroundTruthJsonContentOutputFilename);
    const testingSetPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetPredictionJsonContentOutputFilename);
    const testingSetSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetSummaryHtmlOutputFilename);
    const testingSetLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetLabelsOutputFilename);
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
        Utility.deleteFile(testingSetScoresOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output score file="${testingSetScoresOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output ground-truth json file="${testingSetGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output prediction json file="${testingSetPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetSummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output summary file="${testingSetSummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output labels file="${testingSetLabelsOutputFilename}", error=${error}`);
      }
      try {
        fs.rmdirSync(outputPath);
      } catch (error) {
        Utility.debuggingLog(`Test.0000 OrchestratorTest.runAsync()-Roberta: FAILED deleting output folder=${outputPath}, error=${error}`);
      }
    }
    Utility.debuggingLog('Finishing Test.0000 OrchestratorTest.runAsync()-Roberta');
    Utility.debuggingLog('THE END - Test.0000 OrchestratorTest.runAsync()-Roberta');
  });
  */
  it('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer', async function (): Promise<void> {
    const ignore: boolean = UnitTestHelper.getIgnoreFlag();
    if (ignore) {
      return;
    }
    Utility.toPrintDebuggingLogToConsole = true; // UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
    const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');
    Utility.debuggingLog('Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: downloading a base nerual network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
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
    const testingSetScoresOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetScoresOutputFilename);
    const testingSetGroundTruthJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetGroundTruthJsonContentOutputFilename);
    const testingSetPredictionJsonContentOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetPredictionJsonContentOutputFilename);
    const testingSetSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetSummaryHtmlOutputFilename);
    const testingSetLabelsOutputFilename: string = path.join(outputPath, OrchestratorTest.testingSetLabelsOutputFilename);
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
        Utility.deleteFile(testingSetScoresOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output score file="${testingSetScoresOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetGroundTruthJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output ground-truth json file="${testingSetGroundTruthJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetPredictionJsonContentOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output prediction json file="${testingSetPredictionJsonContentOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetSummaryHtmlOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output summary file="${testingSetSummaryHtmlOutputFilename}", error=${error}`);
      }
      try {
        Utility.deleteFile(testingSetLabelsOutputFilename);
      } catch (error) {
        Utility.debuggingLog(`Test.0100 OrchestratorTest.runAsync()-Bert-3-layer: FAILED deleting output labels file="${testingSetLabelsOutputFilename}", error=${error}`);
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

