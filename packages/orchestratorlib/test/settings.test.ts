/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {} from 'mocha';

import assert = require('assert');
import * as path from 'path';
import * as fs from 'fs-extra';

import {OrchestratorSettings} from '../src/settings';

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('OrchestratorSettingsTests', () => {
  const SettingsDir: string = './test/fixtures/';
  const BaseModelDir: string = path.resolve('./test/fixtures/model');

  const BaseModelDirJson: string = '.\\\\test\\\\fixtures\\\\model';
  const SettingsFile: string = path.resolve(path.join(SettingsDir, 'orchestratorsettings.json'));
  const SettingsDirJson: string = '.\\\\test\\\\fixtures';
  const DataSourcesPath: string = path.resolve(path.join(SettingsDir, 'dataSources'));

  beforeEach(() => {
    if (!Utility.exists(BaseModelDir)) {
      fs.mkdirSync(BaseModelDir);
    }

    if (Utility.exists(SettingsFile)) {
      Utility.deleteFile(SettingsFile);
    }
  });

  afterEach(() => {
    if (Utility.exists(BaseModelDir)) {
      fs.rmdirSync(BaseModelDir);
    }
  });

  it('init settings with no settings file', () => {
    OrchestratorSettings.init(SettingsDir, BaseModelDir, '', SettingsDir);
    assert.ok(OrchestratorSettings.SettingsPath === SettingsFile);
    assert.ok(OrchestratorSettings.ModelPath === BaseModelDir);
    assert.ok(OrchestratorSettings.EntityModelPath === '');

    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    Utility.debuggingLog(`OrchestratorSettings.DataSources.Path=${OrchestratorSettings.DataSources.path}`);

    assert.ok(OrchestratorSettings.DataSources.path === DataSourcesPath);
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 0);
    assert.ok(OrchestratorSettings.DataSources.hierarchical === false);
  });

  it('init settings with no data sources', () => {
    const settingsJson: string = `{
      "modelPath": "${BaseModelDirJson}",
      "snapshotPath": "${SettingsDirJson}",
      "dataSources": {
        "hierarchical": true,
        "inputs": [],
        "path": "${SettingsDirJson}\\\\dataSources"
      }
    }`;

    fs.writeFileSync(path.join(SettingsDir, 'orchestratorsettings.json'), settingsJson);
    OrchestratorSettings.init(SettingsDir, BaseModelDir, '', SettingsDir);
    assert.ok(OrchestratorSettings.SettingsPath === SettingsFile);
    assert.ok(OrchestratorSettings.ModelPath === BaseModelDir);
    assert.ok(OrchestratorSettings.EntityModelPath === '');
    // assert.ok(OrchestratorSettings.DataSources.Path.replace(/[\\\/]+/gm, '') === DataSourcesPath.replace(/[\\\/]+/gm, ''));
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 0);
    assert.ok(OrchestratorSettings.DataSources.hierarchical);
  });

  it('init settings with data sources', () => {
    const settingsJson: string = `{
      "modelPath": "${BaseModelDirJson}",
      "snapshotPath": "${SettingsDirJson}",
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
            "filePath": "${SettingsDirJson}\\\\datasources\\\\q_ChitChat.qna"
          },
          {
            "type": "luis",
            "id": "d06d7acf-a9ec-43e0-94c6-3b37ee313a21",
            "version": "",
            "key": "LUISKEY",
            "endpoint": "https://westus.api.cognitive.microsoft.com",
            "routingName": "l_Weather",
            "filePath": "${SettingsDirJson}\\\\datasources\\\\l_Weather.lu"
          }
        ],
        "path": "${SettingsDirJson}\\\\dataSources"
      }
    }`;

    fs.writeFileSync(path.join(SettingsDir, 'orchestratorsettings.json'), settingsJson);
    OrchestratorSettings.init(SettingsDir, BaseModelDir, '', SettingsDir);
    assert.ok(OrchestratorSettings.SettingsPath === SettingsFile);
    assert.ok(OrchestratorSettings.ModelPath === BaseModelDir);
    assert.ok(OrchestratorSettings.EntityModelPath === '');
    // assert.ok(OrchestratorSettings.DataSources.Path.replace(/[\\\/]+/gm, '') === DataSourcesPath.replace(/[\\\/]+/gm, ''));
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 2);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Type === 'qna');
    assert.ok(OrchestratorSettings.DataSources.inputs[1].Type === 'luis');
    assert.ok(OrchestratorSettings.DataSources.hierarchical);
  });

  it('init settings with settings file', () => {
    OrchestratorSettings.init('./test/fixtures/settings', BaseModelDir, '', SettingsDir);
    assert.ok(OrchestratorSettings.SettingsPath.indexOf('settings') > 0);
    assert.ok(OrchestratorSettings.ModelPath === BaseModelDir);
    assert.ok(OrchestratorSettings.EntityModelPath.indexOf('bert_example_ner_multilingual') > 0);
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 0);
    assert.ok(OrchestratorSettings.DataSources.hierarchical === false);
  });
});
