/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorAdd {
  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    snapshot: Uint8Array,
    luObject: any,
    isDialog: boolean = false,
    routingName: string = '',
    entityBaseModelPath: string = '',
    fullEmbeddings: boolean = false) {
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`routingName=${routingName}`);

    if (!baseModelPath || baseModelPath.length === 0) {
      throw new Error('Please provide path to Orchestrator model');
    }

    Utility.debuggingLog('OrchestratorAdd.runAsync(), ready to call LabelResolver.createWithSnapshotAsync()');
    await LabelResolver.createWithSnapshotAsync(baseModelPath, snapshot);
    Utility.debuggingLog('OrchestratorAdd.runAsync(), after calling LabelResolver.createWithSnapshotAsync()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    return OrchestratorHelper.processLuContent(luObject, routingName, isDialog, fullEmbeddings);
  }
}
