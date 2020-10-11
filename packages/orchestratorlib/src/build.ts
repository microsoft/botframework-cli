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

export class OrchestratorBuild {
  public static Orchestrator: any;

  public static IsDialog: boolean;

  public static LuContents: any[];

  // eslint-disable-next-line max-params
  public static async runAsync(
    nlrPath: string,
    inputs: any[],
    isDialog: boolean = false,
    luConfig: any = null,
    fullEmbeddings: boolean = false): Promise<any> {
    Utility.debuggingLog(`nlrPath=${nlrPath}`);
    Utility.debuggingLog(`inputPath=${JSON.stringify(inputs, null, 2)}`);
    Utility.debuggingLog(`isDialog=${isDialog}`);
    Utility.debuggingLog(`luConfigFile=${JSON.stringify(luConfig, null, 2)}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    try {
      if (!nlrPath || nlrPath.length === 0) {
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

      nlrPath = path.resolve(nlrPath);

      const orchestrator: any = await LabelResolver.loadNlrAsync(nlrPath);
      Utility.debuggingLog('Loaded nlr');

      OrchestratorBuild.Orchestrator = orchestrator;
      OrchestratorBuild.LuContents = inputs;
      OrchestratorBuild.IsDialog = isDialog;
      const bluPaths: any = {};
      let buildOutputs: any[];
      if (hasLuConfig) {
        buildOutputs = await OrchestratorBuild.processLuConfig(luConfig, bluPaths, fullEmbeddings);
      } else {
        buildOutputs = await OrchestratorBuild.processInput(inputs, bluPaths, fullEmbeddings);
      }
   
      const settings: {
        'orchestrator': {
          'modelPath': string;
          'snapshots': string;
        };
      } = {
        orchestrator: {
          modelPath: nlrPath,
          snapshots: bluPaths,
        },
      };
      return {outputs: buildOutputs, settings: settings};
    } catch (error) {
      throw new Error(error);
    }
  }

  private static async processLuConfig(luConfig: any, bluPaths: any, fullEmbeddings: boolean = false): Promise<any[]> {
    const luObjects: any[] = [];
    for (const file of (luConfig.models || [])) {
      const luObject: any = {
        content: OrchestratorHelper.readFile(file),
        id: file,
      };
      luObjects.push(luObject);
    }
    return OrchestratorBuild.processInput(luObjects, bluPaths, fullEmbeddings);
  }

  private static async processInput(luObsjects: any[], bluPaths: any, fullEmbedding: boolean = false): Promise<any[]> {
    const retPayload: any[] = [];
    for (const luObject of (luObsjects || [])) {
      // eslint-disable-next-line no-await-in-loop
      const retVal: any = await OrchestratorBuild.processLuContent(luObject, bluPaths, fullEmbedding);
      retPayload.push(retVal);
    }
    return retPayload;
  }

  private static async processLuContent(luObject: any, bluPaths: any, fullEmbedding: boolean = false) {
    Utility.debuggingLog('OrchestratorBuild.processLuFile(), ready to call LabelResolver.createLabelResolver()');
    const labelResolver: any = LabelResolver.createLabelResolver();
    Utility.debuggingLog('OrchestratorBuild.processLuFile(), after calling LabelResolver.createLabelResolver()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbedding);
    Utility.debuggingLog('Created label resolver');

    const baseName: string = luObject.id;

    const result: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = {
        utteranceLabelsMap: new Map<string, Set<string>>(),
        utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
        utteranceEntityLabelsMap: new Map<string, Label[]>(),
        utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};

    await OrchestratorHelper.parseLuContent(
      luObject.id,
      luObject.content,
      '',
      result.utteranceLabelsMap,
      result.utteranceLabelDuplicateMap,
      result.utteranceEntityLabelsMap,
      result.utteranceEntityLabelDuplicateMap);

    Utility.debuggingLog(`Processed ${luObject.id}`);
    LabelResolver.addExamples(result, labelResolver);
    const snapshot: any = labelResolver.createSnapshot();
    const entities: any = await OrchestratorHelper.getEntitiesInLu(luObject);
    const recognizer: any = OrchestratorHelper.getDialogFilesContent(OrchestratorBuild.IsDialog, baseName, entities);
    if (recognizer !== undefined) bluPaths[baseName] = snapshot;
    return {id: baseName, snapshot: snapshot, recognizer: recognizer};
  }
}
