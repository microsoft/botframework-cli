/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';

import {Label} from './label';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';

export class OrchestratorBuild {
  public static Orchestrator: any;

  public static IsDialog: boolean;

  public static LuConfigFile: string;

  public static OutputPath: string;

  // eslint-disable-next-line max-params
  public static async runAsync(nlrPath: string, inputPath: string, outputPath: string, isDialog: boolean = false, luConfigFile: string = '') {
    try {
      if (!nlrPath || nlrPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      if (!inputPath || inputPath.length === 0) {
        if (!luConfigFile || luConfigFile.length === 0) {
          throw new Error('Please set either --in or --luconfig');
        }
      }

      if (!outputPath || outputPath.length === 0) {
        throw new Error('Please provide output path');
      }

      nlrPath = path.resolve(nlrPath);
      outputPath = path.resolve(outputPath);

      if (!OrchestratorHelper.isDirectory(outputPath)) {
        outputPath = path.dirname(outputPath);
      }

      const orchestrator: any = await LabelResolver.loadNlrAsync(nlrPath);
      Utility.debuggingLog('Loaded nlr');

      OrchestratorBuild.IsDialog = isDialog;
      OrchestratorBuild.LuConfigFile = luConfigFile;
      OrchestratorBuild.Orchestrator = orchestrator;
      OrchestratorBuild.OutputPath = outputPath;
      const bluPaths: any = {};
      if (Utility.isEmptyString(inputPath)) {
        await OrchestratorBuild.processConfigFile(luConfigFile, isDialog, bluPaths);
      } else if (OrchestratorHelper.isDirectory(inputPath)) {
        await OrchestratorBuild.iterateInputFolder(inputPath, isDialog, bluPaths);
      } else {
        await OrchestratorBuild.processLuFile(inputPath, isDialog, bluPaths);
      }
      if (Object.getOwnPropertyNames(bluPaths).length !== 0) {
        OrchestratorHelper.writeSettingsFile(nlrPath, bluPaths, OrchestratorBuild.OutputPath);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private static async processConfigFile(configFile: string, isDialog: boolean, bluPaths: any) {
    const configContent: any = JSON.parse(OrchestratorHelper.readFile(configFile));
    for (const file of (configContent.models || [])) {
      // eslint-disable-next-line no-await-in-loop
      await OrchestratorBuild.processLuFile(path.resolve(file), isDialog, bluPaths);
    }
  }

  private static async processLuFile(luFile: string, isDialog: boolean, bluPaths: any) {
    const labelResolver: any = LabelResolver.createLabelResolver();
    const baseName: string = path.basename(luFile, '.lu');
    Utility.debuggingLog('Created label resolver');
    const result: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': { [id: string]: Label[] };
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = await OrchestratorHelper.getUtteranceLabelsMap(luFile, false);
    Utility.debuggingLog(`Processed ${luFile}`);
    LabelResolver.addExamples(result, labelResolver);
    const snapshot: any = labelResolver.createSnapshot();
    const snapshotFile: any = path.join(OrchestratorBuild.OutputPath, baseName + '.blu');
    OrchestratorHelper.writeToFile(snapshotFile, snapshot);
    Utility.debuggingLog(`Snapshot written to ${snapshotFile}`);
    const entities: any = await OrchestratorHelper.getEntitiesInLu(luFile);
    const settingsKeyForBlu: string|undefined = OrchestratorHelper.writeDialogFiles(OrchestratorBuild.OutputPath, isDialog, baseName, entities);
    if (settingsKeyForBlu !== undefined) bluPaths[baseName] = snapshotFile;
  }

  private static async iterateInputFolder(inputPath: string, isDialog: boolean, bluPaths: any) {
    const items: string[] = fs.readdirSync(inputPath);
    for (const item of items) {
      const currentItemPath: string = path.join(inputPath, item);
      const isDirectory: boolean = fs.lstatSync(currentItemPath).isDirectory();

      if (isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorBuild.iterateInputFolder(currentItemPath, isDialog, bluPaths);
      } else {
        const ext: string = path.extname(item);
        if (ext === '.lu') {
          // eslint-disable-next-line no-await-in-loop
          await OrchestratorBuild.processLuFile(currentItemPath, isDialog, bluPaths);
        }
      }
    }
  }
}
