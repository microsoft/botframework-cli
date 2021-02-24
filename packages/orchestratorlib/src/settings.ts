/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';
import * as fs from 'fs-extra';
import * as path from 'path';
const ReadText: any = require('read-text-file');

export class OrchestratorDataSource {
  public Type: string = '';

  public Id: string = '';

  public Version: string = '';

  public Key: string = '';

  public Endpoint: string = '';

  public RoutingName: string = '';

  public FilePath: string = '';

  // eslint-disable-next-line max-params
  constructor(id: string, key: string, version: string, endpoint: string, type: string, routingName: string, filePath: string) {
    this.Id = id;
    this.Key = key;
    this.Version = version;
    this.Endpoint = endpoint;
    this.Type = type;
    this.FilePath = filePath;
    this.RoutingName = routingName;
  }

  public update(input: OrchestratorDataSource) {
    this.Key = input.Key;

    if (input.Version.length > 0 && input.Version !== this.Version) {
      this.Version = input.Version;
    }

    if (input.Endpoint.length > 0 && input.Endpoint !== this.Endpoint) {
      this.Endpoint = input.Endpoint;
    }

    if (input.RoutingName.length > 0 && input.RoutingName !== this.RoutingName) {
      this.RoutingName = input.RoutingName;
    }

    if (input.FilePath.length > 0 && input.FilePath !== this.FilePath) {
      this.FilePath = input.FilePath;
    }
  }
}

export class OrchestratorDataSourceSettings {
  public hierarchical: boolean = false;

  public inputs: OrchestratorDataSource[] = [];

  public path: string;

  constructor(inputs: any, hierarchical: boolean, path: string) {
    for (const input of inputs) {
      this.inputs.push(new OrchestratorDataSource(
        input.id,
        input.key,
        input.version,
        input.endpoint,
        input.type,
        input.routingName,
        input.filePath));
    }
    this.hierarchical = hierarchical;
    this.path = path;
  }

  public hasDataSource(input: OrchestratorDataSource, updateExisting: boolean = true): boolean {
    for (const existingSource of this.inputs) {
      if (existingSource.Type !== input.Type) {
        continue;
      }

      switch (input.Type) {
      case 'luis':
      case 'qna':
        if (input.Id === existingSource.Id) {
          if (updateExisting) {
            existingSource.update(input);
          }
          return true;
        }
        break;
      case 'file':
        if (input.FilePath === existingSource.FilePath) {
          if (updateExisting) {
            existingSource.update(input);
          }
          return true;
        }
        break;
      default:
        throw new Error('Invalid input type');
      }
    }

    return false;
  }
}

export class OrchestratorSettings {
  public static OrchestratorSettingsFileName: string = 'orchestratorsettings.json';

  public static hasBaseModelSettings(settingsDir: string) {
    const settingsFile: string = path.join(settingsDir, OrchestratorSettings.OrchestratorSettingsFileName);
    if (OrchestratorHelper.exists(settingsFile)) {
      const settings: any = JSON.parse(OrchestratorSettings.readFile(settingsFile));
      return settings.modelPath && settings.modelPath.length > 0;
    }

    return false;
  }

  public static hasDataSource(input: OrchestratorDataSource): boolean {
    return OrchestratorSettings.DataSources.hasDataSource(input);
  }

  public static addUpdateDataSource(data: OrchestratorDataSource) {
    this.DataSources.inputs.push(data);
  }

  public static ModelPath: string;

  public static EntityModelPath: string;

  public static SnapshotPath: string;

  public static SettingsPath: string;

  public static DataSources: OrchestratorDataSourceSettings;

  public static readFile(filePath: string): string {
    return ReadText.readSync(filePath);
  }

  public static writeToFile(filePath: string, content: string): string {
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  // eslint-disable-next-line max-params
  public static init(
    settingsDir: string,
    baseModelPath: string,
    entityBaseModelPath: string,
    snapshotPath: string,
    hierarchical: boolean = false)  {
    settingsDir = path.resolve(settingsDir);
    const settingsFile: string = path.join(settingsDir, OrchestratorSettings.OrchestratorSettingsFileName);
    OrchestratorSettings.SettingsPath = settingsFile;
    const settingsFileExists: boolean = OrchestratorHelper.exists(settingsFile) || OrchestratorHelper.exists(path.join(settingsDir, 'orchestrator.json'));

    OrchestratorSettings.ModelPath = '';
    OrchestratorSettings.EntityModelPath = '';
    OrchestratorSettings.SnapshotPath = '';
    let settings: any;
    if (settingsFileExists) {
      settings = JSON.parse(OrchestratorSettings.readFile(settingsFile));
    }

    OrchestratorSettings.ensureDataSources(hierarchical, settings, settingsDir);
    OrchestratorSettings.SnapshotPath = OrchestratorSettings.ensureSnapshotPath(snapshotPath, settingsDir, settings);
    OrchestratorSettings.ModelPath = OrchestratorSettings.ensureBaseModelPath(baseModelPath, settings);
    entityBaseModelPath = OrchestratorSettings.ensureEntityBaseModelPath(entityBaseModelPath, settings);
    if (!Utility.isEmptyString(entityBaseModelPath)) {
      OrchestratorSettings.EntityModelPath = entityBaseModelPath;
    }
  }

  public static persist()  {
    if (OrchestratorSettings.SettingsPath.length === 0) {
      throw new Error('settings not initialized.');
    }
    try {
      const settings: any = (OrchestratorSettings.EntityModelPath) ? {
        modelPath: OrchestratorSettings.ModelPath,
        entityModelPath: OrchestratorSettings.EntityModelPath,
        snapshotPath: OrchestratorSettings.SnapshotPath,
        dataSources: OrchestratorSettings.DataSources,
      } : {
        modelPath: OrchestratorSettings.ModelPath,
        snapshotPath: OrchestratorSettings.SnapshotPath,
        dataSources: OrchestratorSettings.DataSources,
      };

      OrchestratorSettings.writeToFile(OrchestratorSettings.SettingsPath, Utility.jsonStringify(settings, null, 2));
    } catch (error) {
      throw new Error(error);
    }
  }

  static ensureEntityBaseModelPath(entityBaseModelPath: string, settings: any): string {
    if (!Utility.isEmptyString(entityBaseModelPath)) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);

      if (!OrchestratorHelper.exists(entityBaseModelPath)) {
        Utility.debuggingLog(`Invalid entity model path ${entityBaseModelPath}`);
        throw new Error('Invalid entity model path');
      }
    } else if (settings && 'entityModelPath' in settings) {
      entityBaseModelPath = settings.entityModelPath;
    }

    return entityBaseModelPath;
  }

  static ensureBaseModelPath(baseModelPath: string, settings: any): string {
    if (!Utility.isEmptyString(baseModelPath)) {
      baseModelPath = path.resolve(baseModelPath);

      if (!OrchestratorHelper.exists(baseModelPath)) {
        Utility.debuggingLog(`Invalid model path ${baseModelPath}`);
        throw new Error('Invalid model path');
      }
    } else if (!settings || !settings.modelPath || settings.modelPath.length === 0) {
      throw new Error('Missing model path');
    } else {
      baseModelPath = settings.modelPath;
    }
    return baseModelPath;
  }

  static ensureSnapshotPath(snapshotPath: string, defaultSnapshotPath: string, settings: any): string {
    if (!Utility.isEmptyString(snapshotPath)) {
      snapshotPath = path.resolve(snapshotPath);

      if (!OrchestratorHelper.exists(snapshotPath)) {
        let snapshotDir: string = path.dirname(snapshotPath);
        let snapshotFile: string = path.basename(snapshotPath);
        if (!snapshotFile.includes('.')) {
          snapshotDir = snapshotPath;
          snapshotFile = OrchestratorHelper.SnapshotFileName;
        }
        fs.mkdirSync(snapshotDir, {recursive: true});
        snapshotPath = path.join(snapshotDir, snapshotFile);
      }
    } else if (!settings || !settings.snapshotPath || settings.snapshotPath.length === 0) {
      snapshotPath = defaultSnapshotPath;
    } else {
      snapshotPath = settings.snapshotPath;
    }

    return snapshotPath;
  }

  static ensureDataSources(hierarchical: boolean, settings: any, settingsFolder: string) {
    let inputs: OrchestratorDataSource[] = [];
    let dataSourcePath: string = path.join(settingsFolder, 'dataSources');
    if (!OrchestratorHelper.exists(dataSourcePath)) {
      fs.mkdirSync(dataSourcePath, {recursive: true});
    }

    if (!settings) {
      OrchestratorSettings.DataSources = new OrchestratorDataSourceSettings(inputs, hierarchical, dataSourcePath);
      return;
    }

    const dataSourceSettings: any = settings.dataSources;
    if (dataSourceSettings) {
      if (dataSourceSettings.inputs) {
        inputs = dataSourceSettings.inputs;
      }
      hierarchical = dataSourceSettings.hierarchical;
      dataSourcePath = path.resolve(dataSourceSettings.path);
    }
    OrchestratorSettings.DataSources = new OrchestratorDataSourceSettings(inputs, hierarchical, dataSourcePath);
  }
}
