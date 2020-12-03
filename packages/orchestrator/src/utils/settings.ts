/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command';
import {OrchestratorHelper, Utility} from '@microsoft/bf-orchestrator';

import * as fs from 'fs-extra';
import * as path from 'path';
const ReadText: any = require('read-text-file');

export class OrchestratorSettings {
  public static ModelPath: string;

  public static EntityModelPath: string;

  public static SnapshotPath: string;

  public static SettingsPath: string;

  public static readFile(filePath: string): string {
    try {
      return ReadText.readSync(filePath);
    } catch (error) {
      throw new CLIError(error);
    }
  }

  public static writeToFile(filePath: string, content: string): string {
    try {
      fs.writeFileSync(filePath, content);
      return filePath;
    } catch (error) {
      throw new CLIError(error);
    }
  }

  // eslint-disable-next-line max-params
  public static init(settingsDir: string, baseModelPath: string, entityBaseModelPath: string, snapshotPath: string, defaultSnapshotPath: string)  {
    const settingsFile: string = path.join(settingsDir, 'orchestrator.json');
    OrchestratorSettings.SettingsPath = settingsFile;
    const settingsFileExists: boolean = OrchestratorHelper.exists(settingsFile);
    let settings: any;
    OrchestratorSettings.ModelPath = '';
    OrchestratorSettings.EntityModelPath = '';
    OrchestratorSettings.SnapshotPath = '';

    if (settingsFileExists) {
      settings = JSON.parse(OrchestratorSettings.readFile(settingsFile));
    }

    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);

      if (!OrchestratorHelper.exists(baseModelPath)) {
        Utility.debuggingLog(`Invalid model path ${baseModelPath}`);
        throw new Error('Invalid model path');
      }
    } else if (!settingsFileExists || !settings.modelPath || settings.modelPath.length === 0) {
      throw new Error('Missing model path');
    } else {
      baseModelPath = settings.modelPath;
    }

    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);

      if (!OrchestratorHelper.exists(entityBaseModelPath)) {
        Utility.debuggingLog(`Invalid entity model path ${entityBaseModelPath}`);
        throw new Error('Invalid entity model path');
      }
    } else {
      entityBaseModelPath = settings.entityModelPath;
    }

    if (snapshotPath) {
      snapshotPath = path.resolve(snapshotPath);

      if (!OrchestratorHelper.exists(snapshotPath)) {
        let snapshotDir: string = path.dirname(snapshotPath);
        let snapshotFile: string = path.basename(snapshotPath);
        if (!snapshotFile.includes('.')) {
          snapshotDir = snapshotPath;
          snapshotFile = '';
        }
        fs.mkdirSync(snapshotDir, {recursive: true});
        snapshotPath = path.join(snapshotPath, snapshotFile);
      }
    } else if (!settingsFileExists || !settings.snapshotPath || settings.snapshotPath.length === 0) {
      snapshotPath = defaultSnapshotPath;
    } else {
      snapshotPath = settings.snapshotPath;
    }

    OrchestratorSettings.ModelPath = baseModelPath;
    if (entityBaseModelPath) {
      OrchestratorSettings.EntityModelPath = entityBaseModelPath;
    }
    OrchestratorSettings.SnapshotPath = snapshotPath;
  }

  public static persist()  {
    if (OrchestratorSettings.SettingsPath.length === 0) {
      throw new CLIError('settings not initialized.');
    }
    try {
      const settings: any = (OrchestratorSettings.EntityModelPath) ? {
        modelPath: OrchestratorSettings.ModelPath,
        entityModelPath: OrchestratorSettings.EntityModelPath,
        snapshotPath: OrchestratorSettings.SnapshotPath,
      } : {
        modelPath: OrchestratorSettings.ModelPath,
        snapshotPath: OrchestratorSettings.SnapshotPath,
      };

      OrchestratorSettings.writeToFile(OrchestratorSettings.SettingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
      throw new CLIError(error);
    }
  }
}
