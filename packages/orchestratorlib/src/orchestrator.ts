/* eslint-disable @typescript-eslint/typedef */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {OrchestratorAdd} from './add';
import {OrchestratorBuild} from './build';
import {OrchestratorCreate} from './create';
import {OrchestratorEvaluate} from './evaluate';
import {OrchestratorFineTune} from './finetune';
import {OrchestratorNlr} from './nlr';
import {OrchestratorPredict} from './predict';
import {OrchestratorTest} from './test';

export class Orchestrator {
  public static LabelResolver: any;

  public static async createAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorCreate.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async addAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorAdd.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async buildAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorBuild.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async evaluateAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorEvaluate.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async fineTuneAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorFineTune.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async NlrAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorNlr.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async predictAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorPredict.runAsync(nlrPath, inputPath, outputPath, isDebug);
  }

  public static async testAsync(nlrPath: string, inputPath: string, outputPath: string, isDebug: boolean = false) {
    await OrchestratorTest.runAsync(nlrPath, inputPath, outputPath, isDebug);
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
