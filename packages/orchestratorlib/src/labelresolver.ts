/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';
import {OrchestratorHelper} from './orchestratorhelper';
import {LabelType} from './labeltype';

const oc: any = require('orchestrator-core');

export class LabelResolver {
  public static Orchestrator: any;

  public static LabelResolver: any;

  public static async loadNlrAsync(nlrPath: string) {
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }
    // if (nlrPath.length === 0) {
    //   throw new Error('Please provide path to Orchestrator model');
    // }
    Utility.debuggingLog('LabelResolver.loadNlrAsync(): Creating Orchestrator..');
    LabelResolver.Orchestrator = new oc.Orchestrator();

    if (nlrPath) {
      Utility.debuggingLog('LabelResolver.loadNlrAsync(): Loading NLR..');
      if (await LabelResolver.Orchestrator.loadAsync(nlrPath) === false) {
        throw new Error(`Failed calling LabelResolver.Orchestrator.loadAsync("${nlrPath}")!`);
      }
    } else if (LabelResolver.Orchestrator.load() === false) {
      throw new Error('Failed calling LabelResolver.Orchestrator.load()!');
    }

    return LabelResolver.Orchestrator;
  }

  public static async createAsync(nlrPath: string) {
    await LabelResolver.loadNlrAsync(nlrPath);
    Utility.debuggingLog('LabelResolver.createAsync(): Creating labeler...');
    LabelResolver.LabelResolver = LabelResolver.Orchestrator.createLabelResolver();
    Utility.debuggingLog('LabelResolver.createAsync(): Finished creating labeler...');
    return LabelResolver.LabelResolver;
  }

  public static createLabelResolver() {
    return LabelResolver.Orchestrator.createLabelResolver();
  }

  public static async createWithSnapshotAsync(nlrPath: string, snapshotPath: string) {
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotPath);
    await LabelResolver.loadNlrAsync(nlrPath);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): nlrPath=${nlrPath}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): Creating labeler...');
    LabelResolver.LabelResolver = await LabelResolver.Orchestrator.createLabelResolver(snapshot);
    if (!LabelResolver.LabelResolver) {
      Utility.debuggingThrow('FAILED to create a LabelResolver object');
    }
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): Finished creating labeler...');
    return LabelResolver.LabelResolver;
  }

  public static createSnapshot(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.createSnapshot();
  }

  public static addSnapshot(snapshot: any, prefix: string = '', labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addSnapshot(snapshot, prefix);
  }

  public static addExample(example: any /* {label: label, text: utterance} */, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addExample();
  }

  public static removeExample(example: any /* {label: label, text: utterance} */, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeExample(example);
  }

  public static removeLabel(label: string, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeLabel(label);
  }

  public static getExamples(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getExamples();
  }

  public static getLabels(labelType: LabelType, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getLabels(labelType);
  }

  public static score(utterance: string, labelType: LabelType, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.score(utterance, labelType);
  }

  public static getConfigJson(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getConfigJson();
  }

  public static setRuntimeParams(config: string, resetAll: boolean, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.setRuntimeParams(config, resetAll);
  }

  public static addExamples(utteranceLabelsMap: {[id: string]: string[]}, labelResolver: any = null) {
    if (labelResolver === null) {
      labelResolver = LabelResolver.LabelResolver;
    }
    // eslint-disable-next-line guard-for-in
    for (const utterance in utteranceLabelsMap) {
      const labels: string[] = utteranceLabelsMap[utterance];
      for (const label of labels) {
        try {
          const success: any = labelResolver.addExample({label: label, text: utterance});
          if (success) {
            Utility.debuggingLog(`LabelResolver.addExamples(): Added { label: ${label}, text: ${utterance}}`);
          } else {
            Utility.debuggingLog(`LabelResolver.addExamples(): Failed adding { label: ${label}, text: ${utterance}}`);
          }
        } catch (error) {
          Utility.debuggingLog(`LabelResolver.addExamples(): Failed adding { label: ${label}, text: ${utterance}}\n${error}`);
        }
      }
    }
  }

  private static ensureLabelResolver(labelResolver: any) {
    if (labelResolver === null) {
      labelResolver = LabelResolver.LabelResolver;
    }
    if (labelResolver === null) {
      throw new Error('LabelResolver was not initialized');
    }
    return labelResolver;
  }
}
