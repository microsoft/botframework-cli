/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {DataSourceHelper} from './datasourcehelper';
import {OrchestratorAdd} from './add';
import {OrchestratorBuild} from './build';
import {OrchestratorCreate} from './create';
import {OrchestratorDataSource, OrchestratorSettings} from './settings';
import {OrchestratorEvaluate} from './evaluate';
import {OrchestratorBaseModel} from './basemodel';
import {OrchestratorPredict} from './predict';
import {OrchestratorTest} from './test';
import {OrchestratorQuery} from './query';
import {OrchestratorAssess} from './assess';
import {LabelResolver, Utility} from '.';

//
// Notice the following functions are used by Composer.
//   1) Orchestrator.baseModelGetVersionsAsync()
//   2) Orchestrator.baseModelGetAsync()
//   3) Orchestrator.buildAsync()
//   4) Orchestrator.addAsync() (starting in R12)
//   5) Orchestrator.getLabelResolversAsync()
//

export class Orchestrator {
  // eslint-disable-next-line max-params
  public static async baseModelGetAsync(
    baseModelPath: string,
    basemodelId: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler,
    modelType: string = 'intent',
    lang: string = 'en'): Promise<void> {
    await OrchestratorBaseModel.getAsync(baseModelPath, basemodelId, onProgress, onFinish, modelType, lang);
  }

  public static async baseModelListAsync(all: boolean = false): Promise<object> {
    return OrchestratorBaseModel.listAsync(all);
  }

  public static async baseModelGetVersionsAsync(): Promise<any> {
    return OrchestratorBaseModel.getVersionsAsync();
  }

  // eslint-disable-next-line max-params
  public static async buildAsync(
    baseModelPath: string,
    inputs: any[],
    labelResolvers: Map<string, LabelResolver>,
    isDialog: boolean,
    entityBaseModelPath: string = '',
    luConfig: any = null,
    fullEmbedding: boolean = false): Promise<any> {
    return OrchestratorBuild.runAsync(
      baseModelPath,
      entityBaseModelPath,
      inputs,
      labelResolvers,
      isDialog,
      luConfig,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async addAsync(
    baseModelPath: string,
    snapshot: Uint8Array,
    luObsjects: any[],
    isDialog: boolean = false,
    entityBaseModelPath: string = '',
    fullEmbeddings: boolean = false): Promise<any> {
    // eslint-disable-next-line no-return-await
    return await OrchestratorAdd.runAsync(
      baseModelPath,
      snapshot,
      luObsjects,
      isDialog,
      entityBaseModelPath,
      fullEmbeddings);
  }

  // eslint-disable-next-line max-params
  public static async createAsync(
    baseModelPath: string,
    inputPathConfiguration: string,
    outputPath: string,
    entityBaseModelPath: string = '',
    hierarchical: boolean = false,
    fullEmbedding: boolean = false): Promise<string> {
    return OrchestratorCreate.runAsync(
      baseModelPath,
      entityBaseModelPath,
      inputPathConfiguration,
      outputPath,
      hierarchical,
      fullEmbedding);
  }

  // eslint-disable-next-line max-params
  public static async evaluateAsync(
    inputPath: string,
    outputPath: string,
    baseModelPath: string = '',
    entityBaseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    await OrchestratorEvaluate.runAsync(
      inputPath,
      outputPath,
      baseModelPath,
      entityBaseModelPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding,
      obfuscateEvaluationReport);
  }

  /*
  public static async fineTuneAsync(baseModelPath: string, inputPath: string, outputPath: string): Promise<void> {
    await OrchestratorFineTune.runAsync(baseModelPath, inputPath, outputPath);
  }
  */

  // eslint-disable-next-line max-params
  public static async predictAsync(
    baseModelPath: string,
    inputPath: string,
    outputPath: string,
    cliCmmandId: string,
    trackEventFunction: any,
    entityBaseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    await OrchestratorPredict.runAsync(
      baseModelPath,
      entityBaseModelPath,
      inputPath,
      outputPath,
      cliCmmandId,
      trackEventFunction,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding,
      obfuscateEvaluationReport);
  }

  // eslint-disable-next-line max-params
  public static async testAsync(
    baseModelPath: string,
    inputPathConfiguration: string,
    testPathConfiguration: string,
    outputPath: string,
    entityBaseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    await OrchestratorTest.runAsync(
      baseModelPath,
      entityBaseModelPath,
      inputPathConfiguration,
      testPathConfiguration,
      outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding,
      obfuscateEvaluationReport);
  }

  // eslint-disable-next-line max-params
  public static async queryAsync(
    baseModelPath: string,
    inputPathConfiguration: string,
    queryConfiguration: string,
    // outputPath: string,
    entityBaseModelPath: string = '',
    ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter,
    lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter,
    multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter,
    unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter,
    fullEmbedding: boolean = false,
    limit: number = 0): Promise<void> {
    await OrchestratorQuery.runAsync(
      baseModelPath,
      entityBaseModelPath,
      inputPathConfiguration,
      queryConfiguration,
      // outputPath,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbedding,
      limit);
  }

  // eslint-disable-next-line max-params
  public static async assessAsync(
    inputPathConfiguration: string,
    predictionPathConfiguration: string,
    outputPath: string,
    obfuscateEvaluationReport: boolean = false): Promise<void> {
    await OrchestratorAssess.runAsync(
      inputPathConfiguration,
      predictionPathConfiguration,
      outputPath,
      obfuscateEvaluationReport);
  }

  public static async getLabelResolversAsync(baseModelPath: string, entityBaseModelPath: string, snapshots: Map<string, Uint8Array>, useLoadedNlr: boolean = true): Promise<Map<string, LabelResolver>> {
    const labelResolvers: Map<string, LabelResolver> = new Map<string, LabelResolver>();
    await LabelResolver.createAsync(baseModelPath, entityBaseModelPath, useLoadedNlr);
    for (const [key, value] of snapshots.entries()) {
      labelResolvers.set(key, LabelResolver.createLabelResolver(value));
    }
    return labelResolvers;
  }

  public static async addDataSource(dataSource: OrchestratorDataSource): Promise<void> {
    await DataSourceHelper.ensureDataSourceAsync(dataSource, OrchestratorSettings.getCurrent().DataSources.path);
  }

  public static removeDataSource(dataSource: OrchestratorDataSource): boolean {
    return OrchestratorSettings.getCurrent().DataSources.remove(dataSource);
  }
}
