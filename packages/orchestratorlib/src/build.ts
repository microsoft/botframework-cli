/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';

export class OrchestratorBuild {
  public static Orchestrator: any;

  public static IsDialog: boolean;

  public static LuContents: any[];

  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputs: any[],
    isDialog: boolean = false,
    luConfig: any = null,
    fullEmbeddings: boolean = false): Promise<any> {
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`inputPath=${JSON.stringify(inputs, null, 2)}`);
    Utility.debuggingLog(`isDialog=${isDialog}`);
    Utility.debuggingLog(`luConfigFile=${JSON.stringify(luConfig, null, 2)}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    try {
      if (!baseModelPath || baseModelPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      let hasLuConfig: boolean = false;
      if (!inputs || inputs.length === 0) {
        if (!luConfig || !luConfig.models || luConfig.models.length === 0) {
          throw new Error('Please provide lu input');
        } else {
          hasLuConfig = true;
        }
      }

      baseModelPath = path.resolve(baseModelPath);

      const orchestrator: any = await LabelResolver.loadNlrAsync(baseModelPath);
      Utility.debuggingLog('Loaded nlr');

      OrchestratorBuild.Orchestrator = orchestrator;
      OrchestratorBuild.LuContents = inputs;
      OrchestratorBuild.IsDialog = isDialog;
      let buildOutputs: any[];
      if (hasLuConfig) {
        buildOutputs = await OrchestratorBuild.processLuConfig(luConfig, fullEmbeddings);
      } else {
        buildOutputs = await OrchestratorBuild.processInput(inputs, fullEmbeddings);
      }

      const settings: {
        'orchestrator': {
          'modelFolder': string;
          'snapshots': Map<string, string>;
        };
      } = {
        orchestrator: {
          modelFolder: baseModelPath,
          snapshots: new Map<string, string>(),
        },
      };
      return {outputs: buildOutputs, settings: settings};
    } catch (error) {
      throw new Error(error);
    }
  }

  private static async processLuConfig(luConfig: any, fullEmbeddings: boolean = false): Promise<any[]> {
    const luObjects: any[] = [];
    for (const file of (luConfig.models || [])) {
      const luObject: any = {
        content: OrchestratorHelper.readFile(file),
        id: path.basename(file, '.lu'),
      };
      luObjects.push(luObject);
    }
    return OrchestratorBuild.processInput(luObjects, fullEmbeddings);
  }

  private static async processInput(luObsjects: any[], fullEmbedding: boolean = false): Promise<any[]> {
    const retPayload: any[] = [];
    for (const luObject of (luObsjects || [])) {
      // eslint-disable-next-line no-await-in-loop
      const retVal: any = await OrchestratorHelper.processLuContent(luObject, '', OrchestratorBuild.IsDialog, fullEmbedding);
      retPayload.push(retVal);
    }
    return retPayload;
  }
}
