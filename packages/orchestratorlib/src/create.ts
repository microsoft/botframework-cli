/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {Label} from './label';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorCreate {
  // eslint-disable-next-line max-params
  public static async runAsync(nlrPath: string, inputPathConfiguration: string, outputPath: string,
    hierarchical: boolean = false,
    notToUseCompactEmbeddings: boolean = false) {
    Utility.debuggingLog(`nlrPath=${nlrPath}`);
    Utility.debuggingLog(`inputPathConfiguration=${inputPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`hierarchical=${hierarchical}`);
    Utility.debuggingLog(`notToUseCompactEmbeddings=${notToUseCompactEmbeddings}`);
    if (!nlrPath || nlrPath.length === 0) {
      throw new Error('Please provide path to Orchestrator model');
    }
    if (!inputPathConfiguration || inputPathConfiguration.length === 0) {
      throw new Error('Please provide path to input file/folder');
    }
    if (!outputPath || outputPath.length === 0) {
      throw new Error('Please provide output path');
    }

    nlrPath = path.resolve(nlrPath);
    outputPath = path.resolve(outputPath);

    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.createAsync()');
    await LabelResolver.createAsync(nlrPath);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.createAsync()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(notToUseCompactEmbeddings);
    const processedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical);
    LabelResolver.addExamples(processedUtteranceLabelsMap);

    const snapshot: any = LabelResolver.createSnapshot();

    const outPath: string = OrchestratorHelper.getOutputPath(outputPath, inputPathConfiguration);
    const resolvedFilePath: string = OrchestratorHelper.writeToFile(outPath, snapshot);
    if (Utility.isEmptyString(resolvedFilePath)) {
      Utility.writeToConsole(`ERROR: failed writing the snapshot to file ${resolvedFilePath}`);
    } else {
      Utility.writeToConsole(`Snapshot written to ${resolvedFilePath}`);
    }
  }
}
