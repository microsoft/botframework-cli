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
import {OrchestratorAssess} from './assess';
import {Utility} from '.';

export class Orchestrator {
  // eslint-disable-next-line max-params
  public static async createAsync(nlrPath: string, inputPathConfiguration: string, outputPath: string,
    hierarchical: boolean = false,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorCreate.runAsync(
      nlrPath,
      inputPathConfiguration,
      outputPath,
      hierarchical,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async buildAsync(
    nlrPath: string,
    inputs: any[],
    isDialog: boolean,
    luConfig: any = null,
    fullEmbedding: boolean = false): Promise<any> {
    return OrchestratorBuild.runAsync(nlrPath, inputs, isDialog, luConfig, fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async evaluateAsync(
    inputPath: string, outputPath: string, nlrPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorEvaluate.runAsync(
      inputPath, outputPath, nlrPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  /*
  public static async fineTuneAsync(nlrPath: string, inputPath: string, outputPath: string): Promise<void> {
    await OrchestratorFineTune.runAsync(nlrPath, inputPath, outputPath);
  }
  */
  public static async baseModelGetAsync(
    nlrPath: string,
    nlrId: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler): Promise<void> {
    try {
      await OrchestratorBaseModel.getAsync(nlrPath, nlrId, onProgress, onFinish);
    } catch (error) {
      onProgress(`Error in downloading model ${error.toString()}`);
      onFinish(`Error in downloading model ${error.toString()}`);
    }
  }

  public static async baseModelListAsync(): Promise<string> {
    return OrchestratorBaseModel.listAsync();
  }

  public static async baseModelGetVersionsAsync(): Promise<any> {
    return OrchestratorBaseModel.getVersionsAsync();
  }

  // eslint-disable-next-line max-params
  public static async predictAsync(
    nlrPath: string, inputPath: string, outputPath: string,
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorPredict.runAsync(
      nlrPath, inputPath, outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async testAsync(
    nlrPath: string, inputPathConfiguration: string, testPathConfiguration: string, outputPath: string,
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false): Promise<void> {
    await OrchestratorTest.runAsync(
      nlrPath, inputPathConfiguration, testPathConfiguration, outputPath,
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
