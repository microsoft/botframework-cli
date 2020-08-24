/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

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
    LabelResolver.addExamples((await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical)).utteranceLabelsMap);

    const snapshot: any = LabelResolver.createSnapshot();

    const outPath: string = OrchestratorHelper.getOutputPath(outputPath, inputPathConfiguration);
    OrchestratorHelper.writeToFile(outPath, snapshot);
    Utility.debuggingLog(`Snapshot written to ${outputPath}`);
  }
}
