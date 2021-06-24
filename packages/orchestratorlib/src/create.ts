/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

// require('fast-text-encoding');

import {ITextUtteranceLabelMapDataStructure} from '@microsoft/bf-dispatcher';
// import {Label} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorBuild} from '.';
import {OrchestratorHelper} from './orchestratorhelper';
import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorCreate {
  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputPathConfiguration: string,
    outputPath: string,
    hierarchical: boolean = false,
    fullEmbeddings: boolean = false): Promise<string> {
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`inputPathConfiguration=${inputPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`hierarchical=${hierarchical}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    if (!baseModelPath || baseModelPath.length === 0) {
      throw new Error('Please provide path to Orchestrator model');
    }
    if (!inputPathConfiguration || inputPathConfiguration.length === 0) {
      throw new Error('Please provide path to input file/folder');
    }
    if (!outputPath || outputPath.length === 0) {
      throw new Error('Please provide output path');
    }

    baseModelPath = path.resolve(baseModelPath);
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    }
    outputPath = path.resolve(outputPath);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.createWithSnapshotFileAsync()');
    const labelResolver: LabelResolver = await LabelResolver.createWithSnapshotFileAsync(baseModelPath, outputPath, entityBaseModelPath);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.createWithSnapshotFileAsync()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    const processedUtteranceLabelsMap: ITextUtteranceLabelMapDataStructure =
      await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical);
    // Utility.debuggingLog(`OrchestratorCreate.runAsync(), processedUtteranceLabelsMap.utteranceLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceLabelsMap.keys()]}`);
    // Utility.debuggingLog(`OrchestratorCreate.runAsync(), processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()]}`);

    OrchestratorBuild.syncLabelResolverEx(labelResolver, processedUtteranceLabelsMap);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.createSnapshot()');
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.createSnapshot()');
    /** ---- NOTE-FOR-DEBUGGING ----
     *  Utility.debuggingLog(`OrchestratorCreate.runAsync(), snapshot=${snapshot}`);
     *  const snapshotInString: string = (new TextDecoder()).decode(snapshot);
     *  Utility.debuggingLog(`OrchestratorCreate.runAsync(), snapshotInString=${snapshotInString}`);
     */
    const outPath: string = OrchestratorHelper.getSnapshotFilePath(outputPath, inputPathConfiguration);
    const resolvedFilePath: string = OrchestratorHelper.writeToFile(outPath, snapshot);
    if (Utility.isEmptyString(resolvedFilePath)) {
      Utility.writeStringLineToConsoleStdout(`ERROR: failed writing the snapshot to file ${resolvedFilePath}`);
    } else {
      Utility.writeStringLineToConsoleStdout(`Snapshot written to ${resolvedFilePath}`);
    }

    return resolvedFilePath;
  }
}
