/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {OrchestratorBuild} from './build';
import {OrchestratorCreate} from './create';
import {OrchestratorEvaluate} from './evaluate';
import {OrchestratorBaseModel} from './basemodel';
import {OrchestratorPredict} from './predict';
import {OrchestratorTest} from './test';
import {OrchestratorQuery} from './query';
import {OrchestratorAssess} from './assess';
import {Utility} from '.';

export class Orchestrator {
  // eslint-disable-next-line max-params
  public static async createAsync(baseModelPath: string, inputPathConfiguration: string, outputPath: string,
    hierarchical: boolean = false,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorCreate.runAsync(
      baseModelPath,
      inputPathConfiguration,
      outputPath,
      hierarchical,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async buildAsync(
    baseModelPath: string,
    inputs: any[],
    isDialog: boolean,
    luConfig: any = null,
    fullEmbedding: boolean = false): Promise<any> {
    return OrchestratorBuild.runAsync(baseModelPath, inputs, isDialog, luConfig, fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async evaluateAsync(
    inputPath: string, outputPath: string, baseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorEvaluate.runAsync(
      inputPath, outputPath, baseModelPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  /*
  public static async fineTuneAsync(baseModelPath: string, inputPath: string, outputPath: string): Promise<void> {
    await OrchestratorFineTune.runAsync(baseModelPath, inputPath, outputPath);
  }
  */
  public static async baseModelGetAsync(
    baseModelPath: string,
    nlrId: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler): Promise<void> {
    await OrchestratorBaseModel.getAsync(baseModelPath, nlrId, onProgress, onFinish);
  }

  public static async baseModelListAsync(): Promise<string> {
    return OrchestratorBaseModel.listAsync();
  }

  public static async baseModelGetVersionsAsync(): Promise<any> {
    return OrchestratorBaseModel.getVersionsAsync();
  }

  // eslint-disable-next-line max-params
  public static async predictAsync(
    baseModelPath: string, inputPath: string, outputPath: string,
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorPredict.runAsync(
      baseModelPath, inputPath, outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async testAsync(
    baseModelPath: string, inputPathConfiguration: string, testPathConfiguration: string, outputPath: string,
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorTest.runAsync(
      baseModelPath, inputPathConfiguration, testPathConfiguration, outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async queryAsync(
    baseModelPath: string, inputPathConfiguration: string, queryConfiguration: string, // outputPath: string,
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorQuery.runAsync(
      baseModelPath, inputPathConfiguration, queryConfiguration, // outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async assessAsync(
    inputPathConfiguration: string, predictionPathConfiguration: string, outputPath: string): Promise<void> {
    await OrchestratorAssess.runAsync(
      inputPathConfiguration, predictionPathConfiguration, outputPath);
  }
}
