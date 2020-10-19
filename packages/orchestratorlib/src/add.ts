/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';
/*
export class OrchestratorAdd {
  // eslint-disable-next-line max-params
  public static async runAsync(
    nlrPath: string,
    inputPath: string,
    outputPath: string,
    snapshotPath: string,
    labelPrefix: string = '',
    fullEmbeddings: boolean = false) {
    Utility.debuggingLog(`nlrPath=${nlrPath}`);
    Utility.debuggingLog(`inputPath=${inputPath}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`snapshotPath=${snapshotPath}`);
    Utility.debuggingLog(`labelPrefix=${labelPrefix}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    if (!nlrPath || nlrPath.length === 0) {
      throw new Error('Please provide path to Orchestrator model');
    }
    if (!inputPath || inputPath.length === 0) {
      throw new Error('Please provide input path');
    }
    if (!outputPath || outputPath.length === 0) {
      throw new Error('Please provide output path');
    }
    if (!snapshotPath || snapshotPath.length === 0) {
      throw new Error('Please provide snapshot path');
    }

    Utility.debuggingLog('OrchestratorAdd.runAsync(), ready to call LabelResolver.createWithSnapshotAsync()');
    await LabelResolver.createWithSnapshotAsync(nlrPath, snapshotPath);
    Utility.debuggingLog('OrchestratorAdd.runAsync(), after calling LabelResolver.createWithSnapshotAsync()');
    // ---- NOTE ---- Caller has to ensure all the embeddings are in the same format, otherwise
    // ---- NOTE ---- all the embeddings will be converted to compact for cosine similarity computation
    // ---- NOTE ---- and the following statement will not be effective for ensuing
    // ---- NOTE ---- floating-point embeddings.
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);

    const ext: string = OrchestratorHelper.isDirectory(inputPath) ? '' : path.extname(inputPath);
    if (ext === '.blu') {
      LabelResolver.addSnapshot(OrchestratorHelper.getSnapshotFromFile(inputPath), labelPrefix);
    } else {
      LabelResolver.addExamples((await OrchestratorHelper.getUtteranceLabelsMap(inputPath)));
    }

    const resolvedFilePath: string = OrchestratorHelper.writeToFile(OrchestratorHelper.getOutputPath(outputPath, inputPath), LabelResolver.createSnapshot());
    if (Utility.isEmptyString(resolvedFilePath)) {
      Utility.writeToConsole(`ERROR: failed writing the snapshot to file ${resolvedFilePath}`);
    } else {
      Utility.writeToConsole(`Snapshot written to ${resolvedFilePath}`);
    }
  }
}
*/
