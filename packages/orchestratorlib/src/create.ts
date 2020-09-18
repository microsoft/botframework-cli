/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {Label} from './label';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';

export class OrchestratorCreate {
  public static async runAsync(nlrPath: string, inputPathConfiguration: string, outputPath: string, hierarchical: boolean = false) {
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

    await LabelResolver.createAsync(nlrPath);
    const processedUtteranceLabelsMap: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': { [id: string]: Label[] };
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical);
    LabelResolver.addExamples(processedUtteranceLabelsMap);

    const snapshot: any = LabelResolver.createSnapshot();

    const outPath: string = OrchestratorHelper.getOutputPath(outputPath, inputPathConfiguration);
    OrchestratorHelper.writeToFile(outPath, snapshot);
    Utility.debuggingLog(`Snapshot written to ${outputPath}`);
  }
}
