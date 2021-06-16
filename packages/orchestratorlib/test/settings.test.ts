/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {} from 'mocha';

import assert = require('assert');
import * as path from 'path';
import * as fs from 'fs-extra';

import {OrchestratorDataSource, OrchestratorSettings} from '../src/settings';
import {Utility} from '../src/utility';

describe('OrchestratorSettingsTests', () => {
  const SettingsDir: string = path.resolve('./test/fixtures/settings');
  const BaseModelDir: string = path.resolve('./test/fixtures/model');
  const SnapshotDir: string = path.resolve('./test/fixtures/output');
  const DataSourcesDir: string = path.join(SettingsDir, 'dataSources');
  const DataDir: string = path.resolve('./test/fixtures/dataSources');

  beforeEach(() => {
    if (!Utility.exists(BaseModelDir)) {
      fs.mkdirSync(BaseModelDir);
    }
    if (!Utility.exists(SettingsDir)) {
      fs.mkdirSync(SettingsDir);
    }
  });

  afterEach(() => {
    if (Utility.exists(SettingsDir)) {
      Utility.deleteFolderRecursive(SettingsDir);
    }
    if (Utility.exists(DataSourcesDir)) {
      Utility.deleteFolderRecursive(DataSourcesDir);
    }
  });

  after(() => {
    if (Utility.exists(BaseModelDir)) {
      Utility.deleteFolderRecursive(BaseModelDir);
    }
  });

  it('init settings with no settings file', () => {
    const settingsFile: string = 'orchestratorsettings1.json';
    const settings: OrchestratorSettings = new OrchestratorSettings();
    settings.init(SettingsDir, BaseModelDir, '', SettingsDir, true, false, settingsFile);
    settings.persist();
    assert.ok(settings.SettingsPath ===  path.join(SettingsDir, settingsFile));
    assert.ok(settings.ModelPath === BaseModelDir);
    assert.ok(settings.EntityModelPath === '');
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(settings.DataSources.path === '');
    assert.ok(!Utility.exists(DataSourcesDir));
  });

  it('init settings with no settings file + data source', () => {
    const settingsFile: string = 'orchestratorsettings2.json';
    const settings: OrchestratorSettings = new OrchestratorSettings();
    settings.init(SettingsDir, BaseModelDir, '', SettingsDir, false, true, settingsFile);
    assert.ok(settings.SettingsPath ===  path.join(SettingsDir, settingsFile));
    assert.ok(settings.ModelPath === BaseModelDir);
    assert.ok(settings.EntityModelPath === '');
    assert.ok(settings.DataSources);
    assert.ok(settings.DataSources.path === DataSourcesDir);
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(settings.DataSources.hierarchical === false);
    assert.ok(settings.DataSources.path);
    assert.ok(Utility.exists(DataSourcesDir));
  });

  it('init settings with no data sources', () => {
    const settingsJson: string = `{
      "modelPath": "${BaseModelDir.replace(/\\/g, '/')}",
      "snapshotPath": "${SnapshotDir.replace(/\\/g, '/')}",
      "dataSources": {
        "hierarchical": true,
        "inputs": [],
        "path": ""
      }
    }`;

    const settingsFile: string = 'orchestratorsettings3.json';
    fs.writeFileSync(path.join(SettingsDir, settingsFile), settingsJson);
    const settings: OrchestratorSettings = new OrchestratorSettings();
    settings.init(SettingsDir, BaseModelDir, '', SettingsDir, false, false, settingsFile);
    assert.ok(settings.SettingsPath ===  path.join(SettingsDir, settingsFile));
    assert.ok(settings.ModelPath === BaseModelDir);
    assert.ok(settings.EntityModelPath === '');
    assert.ok(settings.DataSources.path === '');
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(!settings.DataSources.hierarchical);
    assert.ok(!Utility.exists(DataSourcesDir));
  });

  it('init settings with data sources', () => {
    const settingsJson: string = `{
      "modelPath": "${BaseModelDir.replace(/\\/g, '/')}",
      "snapshotPath": "${SnapshotDir.replace(/\\/g, '/')}",
      "dataSources": {
        "hierarchical": true,
        "inputs": [
          {
            "type": "qna",
            "id": "213a48d3-855d-4083-af6d-339c03d497dd",
            "version": "",
            "key": "QNAKEY",
            "endpoint": "",
            "routingName": "q_ChitChat",
            "filePath": "${path.resolve(DataDir, 'q_ChitChat.qna').replace(/\\/g, '/')}"
          },
          {
            "type": "luis",
            "id": "d06d7acf-a9ec-43e0-94c6-3b37ee313a21",
            "version": "",
            "key": "LUISKEY",
            "endpoint": "https://westus.api.cognitive.microsoft.com",
            "routingName": "l_Weather",
            "filePath": "${path.resolve(DataDir, 'l_Weather.lu').replace(/\\/g, '/')}"
          }
        ],
        "path": "${DataSourcesDir.replace(/\\/g, '/')}"
      }
    }`;

    const settingsFile: string = 'orchestratorsettings4.json';
    fs.writeFileSync(path.join(SettingsDir, settingsFile), settingsJson);
    const settings: OrchestratorSettings = new OrchestratorSettings();
    settings.init(SettingsDir, BaseModelDir, '', SettingsDir, true, true, settingsFile);
    assert.ok(settings.SettingsPath === path.join(SettingsDir, settingsFile));
    
    assert.ok(settings.ModelPath === BaseModelDir);
    assert.ok(settings.EntityModelPath === '');
    assert.ok(settings.DataSources.path === DataSourcesDir);
    assert.ok(settings.DataSources.inputs.length === 2);
    assert.ok(settings.DataSources.inputs[0].Type === 'qna');
    assert.ok(settings.DataSources.inputs[1].Type === 'luis');
    assert.ok(settings.DataSources.hierarchical);
    assert.ok(Utility.exists(DataSourcesDir));

    const dataSource: OrchestratorDataSource = new OrchestratorDataSource(
      'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e',
      'LUISKEY',
      'version',
      'https://westus.api.cognitive.microsoft.com',
      'luis',
      'l_HomeAutomation',
      settings.DataSources.path);

    settings.addUpdateDataSource(dataSource);
    settings.persist();
    settings.init(SettingsDir, BaseModelDir, '', SettingsDir, true, true, settingsFile);
    assert.ok(settings.DataSources.hierarchical);
    assert.ok(settings.DataSources.inputs.length === 3);
    assert.ok(settings.DataSources.inputs[0].Type === 'qna');
    assert.ok(settings.DataSources.inputs[0].Id === '213a48d3-855d-4083-af6d-339c03d497dd');
    assert.ok(settings.DataSources.inputs[1].Type === 'luis');
    assert.ok(settings.DataSources.inputs[1].Id === 'd06d7acf-a9ec-43e0-94c6-3b37ee313a21');
    assert.ok(settings.DataSources.inputs[2].Type === 'luis');
    assert.ok(settings.DataSources.inputs[2].Id === 'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e');
  });

  it('init settings with settings file', () => {
    const settings: OrchestratorSettings = new OrchestratorSettings();
    const settingsFileName: string = 'orchestratorsettings5.json';
    const settingsFilePath: string = path.resolve(SettingsDir, settingsFileName);

    settings.init(SettingsDir, BaseModelDir, '', '', false, false, settingsFileName);
    settings.persist();

    settings.init(SettingsDir, '', '', '', false, false, settingsFileName);
    assert.ok(settings.SettingsPath === settingsFilePath);
    assert.ok(settings.ModelPath === BaseModelDir);
    assert.ok(!settings.EntityModelPath);
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(settings.DataSources.hierarchical === false);
  });
});
