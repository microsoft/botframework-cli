/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

// import {Label} from './label';
import {LabelType} from './labeltype';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorQuery {
  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string, inputPathConfiguration: string, queryConfiguration: string, // outputPath: string,
    ambiguousClosenessThresholdParameter: number,
    lowConfidenceScoreThresholdParameter: number,
    multiLabelPredictionThresholdParameter: number,
    unknownLabelPredictionThresholdParameter: number,
    fullEmbeddings: boolean = false): Promise<void> {
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments
    if (Utility.isEmptyString(inputPathConfiguration)) {
      Utility.debuggingThrow(`Please provide path to an input .blu file, CWD=${process.cwd()}, called from OrchestratorQuery.runAsync()`);
    }
    if (Utility.isEmptyString(queryConfiguration)) {
      Utility.debuggingThrow(`Please provide a test file, CWD=${process.cwd()}, called from OrchestratorQuery.runAsync()`);
    }
    // if (Utility.isEmptyString(outputPath)) {
    //   Utility.debuggingThrow(`Please provide an output directory, CWD=${process.cwd()}, called from OrchestratorQuery.runAsync()`);
    // }
    if (Utility.isEmptyString(baseModelPath)) {
      Utility.debuggingThrow(`The baseModelPath argument is empty, CWD=${process.cwd()}, called from OrchestratorQuery.runAsync()`);
    }
    baseModelPath = path.resolve(baseModelPath);
    const ambiguousClosenessThreshold: number = ambiguousClosenessThresholdParameter;
    const lowConfidenceScoreThreshold: number = lowConfidenceScoreThresholdParameter;
    const multiLabelPredictionThreshold: number = multiLabelPredictionThresholdParameter;
    const unknownLabelPredictionThreshold: number = unknownLabelPredictionThresholdParameter;
    Utility.debuggingLog(`inputPath=${inputPathConfiguration}`);
    Utility.debuggingLog(`query=${queryConfiguration}`);
    // Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`ambiguousClosenessThreshold=${ambiguousClosenessThreshold}`);
    Utility.debuggingLog(`lowConfidenceScoreThreshold=${lowConfidenceScoreThreshold}`);
    Utility.debuggingLog(`multiLabelPredictionThreshold=${multiLabelPredictionThreshold}`);
    Utility.debuggingLog(`unknownLabelPredictionThreshold=${unknownLabelPredictionThreshold}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- load the snapshot set
    const snapshotFile: string = inputPathConfiguration;
    if (!Utility.exists(snapshotFile)) {
      Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${snapshotFile}`);
    }
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorQuery.runAsync(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(baseModelPath);
    Utility.debuggingLog('OrchestratorQuery.runAsync(), after calling LabelResolver.createAsync()');
    Utility.debuggingLog('OrchestratorQuery.runAsync(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    Utility.debuggingLog('OrchestratorQuery.runAsync(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    Utility.debuggingLog('OrchestratorQuery.runAsync(), ready to call OrchestratorHelper.getSnapshotFromFile()');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotFile);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('OrchestratorQuery.runAsync(), after calling OrchestratorHelper.getSnapshotFromFile()');
    Utility.debuggingLog('OrchestratorQuery.runAsync(), ready to call LabelResolver.addSnapshot()');
    await LabelResolver.addSnapshot(snapshot);
    Utility.debuggingLog('OrchestratorQuery.runAsync(), after calling LabelResolver.addSnapshot()');
    // ---- NOTE ---- retrieve labels
    // const snapshotSetLabels: string[] =
    //   LabelResolver.getLabels(LabelType.Intent);
    // const snapshotSetLabelSet: Set<string> =
    //   new Set<string>(snapshotSetLabels);
    // -----------------------------------------------------------------------
    const scoreResults: any = LabelResolver.score(queryConfiguration, LabelType.Intent);
    Utility.writeToConsole(scoreResults);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorQuery.runAsync(), THE END');
  }
}
