/* eslint-disable @typescript-eslint/typedef */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

export class Orchestrator {
  public static LabelResolver: any;

  public static async createLabelResolverAsync(nlrPath: string) {
    try {
      if (nlrPath) {
        nlrPath = path.resolve(nlrPath);
      }

      if (nlrPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      Orchestrator.LabelResolver = await LabelResolver.createAsync(nlrPath);
      return Orchestrator.LabelResolver;
    } catch (error) {
      throw new Error(error);
    }
  }

  public static createSnapshot(input: string, output: string) {
    try {
      if (input) {
        input = path.resolve(input);
      }

      if (input.length > 0) {

      // iterate thru input and add example
      //val = Orchestrator.LabelResolver.addExample(example3);
      }

      var snapshot = Orchestrator.LabelResolver.createSnapshot();

      // save snapshot to .blu file
    } catch (error) {
      throw new Error(error);
    }
  }

  public static addSnapshot(snapshot: string) {
    try {
      Orchestrator.LabelResolver.addSnapshot(snapshot);

      // save snapshot to .blu file
    } catch (error) {
      throw new Error(error);
    }
  }
}
