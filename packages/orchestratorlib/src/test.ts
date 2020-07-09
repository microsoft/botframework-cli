/* eslint-disable @typescript-eslint/typedef */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

export class OrchestratorTest {
  public static async runAsync(nlrPath: string, inputPath: string, outputPath: string, debug: boolean = false) {
    try {
      if (nlrPath) {
        nlrPath = path.resolve(nlrPath);
      }

      if (nlrPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      var labelResolver = await LabelResolver.createAsync(nlrPath);
    } catch (error) {
      throw new Error(error);
    }
  }
}
