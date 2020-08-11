/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorAdd} from './add';
import {OrchestratorBuild} from './build';
import {OrchestratorCreate} from './create';
import {OrchestratorEvaluate} from './evaluate';
import {OrchestratorFineTune} from './finetune';
import {OrchestratorNlr} from './nlr';
import {OrchestratorPredict} from './predict';
import {OrchestratorTest} from './test';
import {OrchestratorAssess} from './assess';
import {Utility} from '.';

export class Orchestrator {
  public static async createAsync(nlrPath: string, inputPath: string, outputPath: string, hierarchical: boolean = false): Promise<void> {
    await OrchestratorCreate.runAsync(nlrPath, inputPath, outputPath, hierarchical);
  }

  // eslint-disable-next-line max-params
  public static async addAsync(nlrPath: string, inputPath: string, outputPath: string, snapshotPath: string, labelPrefix: string = ''): Promise<void> {
    await OrchestratorAdd.runAsync(nlrPath, inputPath, outputPath, snapshotPath, labelPrefix);
  }

  // eslint-disable-next-line max-params
  public static async buildAsync(nlrPath: string, inputPath: string, outputPath: string, isDialog: boolean, luConfigPath: string = ''): Promise<void> {
    await OrchestratorBuild.runAsync(nlrPath, inputPath, outputPath, isDialog, luConfigPath);
  }

  // eslint-disable-next-line max-params
  public static async evaluateAsync(
    inputPath: string, outputPath: string, nlrPath: string = '',
    ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter): Promise<void> {
    await OrchestratorEvaluate.runAsync(
      inputPath, outputPath, nlrPath,
      ambiguousClosenessParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
  }

  public static async fineTuneAsync(nlrPath: string, inputPath: string, outputPath: string): Promise<void> {
    await OrchestratorFineTune.runAsync(nlrPath, inputPath, outputPath);
  }

  public static async nlrGetAsync(nlrPath: string, versionId: string, onProgress: any = null, onFinish: any = null): Promise<void> {
    await OrchestratorNlr.getAsync(nlrPath, versionId, onProgress, onFinish);
  }

  public static async nlrListAsync(): Promise<string> {
    return OrchestratorNlr.listAsync();
  }

  // eslint-disable-next-line max-params
  public static async predictAsync(
    nlrPath: string, inputPath: string, outputPath: string,
    ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter): Promise<void> {
    await OrchestratorPredict.runAsync(
      nlrPath, inputPath, outputPath,
      ambiguousClosenessParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
  }

  // eslint-disable-next-line max-params
  public static async testAsync(
    nlrPath: string, inputPath: string, testPath: string, outputPath: string,
    ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter): Promise<void> {
    await OrchestratorTest.runAsync(
      nlrPath, inputPath, testPath, outputPath,
      ambiguousClosenessParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter);
  }

  // eslint-disable-next-line max-params
  public static async assessAsync(
    inputPath: string, predictionPath: string, outputPath: string): Promise<void> {
    await OrchestratorAssess.runAsync(
      inputPath, predictionPath, outputPath);
  }
}
