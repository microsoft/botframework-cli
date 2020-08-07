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

  public static init(settingsDir: string, nlrPath: string, snapshotPath: string, defaultSnapshotPath: string)  {
    const settingsFile: string = path.join(settingsDir, 'orchestrator.json');
    OrchestratorSettings.SettingsPath = settingsFile;
    const settingsFileExists: boolean = OrchestratorHelper.exists(settingsFile);
    let settings: any;
    OrchestratorSettings.ModelPath = '';
    OrchestratorSettings.SnapshotPath = '';

    if (settingsFileExists) {
      settings = JSON.parse(OrchestratorSettings.readFile(settingsFile));
    }

    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);

      if (!OrchestratorHelper.exists(nlrPath)) {
        Utility.debuggingLog(`Invalid model path ${nlrPath}`);
        throw new Error('Invalid model path');
      }
    } else if (!settingsFileExists || !settings.modelPath || settings.modelPath.length === 0) {
      throw new Error('Missing model path');
    } else {
      nlrPath = settings.modelPath;
    }

    if (snapshotPath) {
      snapshotPath = path.resolve(snapshotPath);

      if (!OrchestratorHelper.exists(snapshotPath)) {
        fs.mkdirSync(snapshotPath, {recursive: true});
      }
      if (OrchestratorHelper.isDirectory(snapshotPath)) {
        snapshotPath = path.join(snapshotPath, 'orchestrator.blu');
      }
    } else if (!settingsFileExists || !settings.snapshotPath || settings.snapshotPath.length === 0) {
      snapshotPath = path.join(defaultSnapshotPath, 'orchestrator.blu');
    } else {
      snapshotPath = settings.snapshotPath;
    }

    OrchestratorSettings.ModelPath = nlrPath;
    OrchestratorSettings.SnapshotPath = snapshotPath;
  }

  public static persist()  {
    if (OrchestratorSettings.SettingsPath.length === 0) {
      throw new CLIError('settings not initialized.');
    }
    try {
      const settings: any = {
        modelPath: OrchestratorSettings.ModelPath,
        snapshotPath: OrchestratorSettings.SnapshotPath,
      };

      OrchestratorSettings.writeToFile(OrchestratorSettings.SettingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
      throw new CLIError(error);
    }
  }
}
