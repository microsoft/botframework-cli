/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require('assert');

import {} from 'mocha';
import * as path from 'path';
import {DataSourceHelper} from '../src/datasourcehelper';
import {OrchestratorDataSource, OrchestratorSettings} from '../src/settings';
import {Orchestrator} from '../src/orchestrator';
import {Utility} from '../src/utility';
import {OrchestratorHelper} from '../lib';
const sinon: any = require('sinon');

describe('OrchestratorTests', () => {
  const SettingsDir: string = path.resolve('./test/fixtures/');
  const OutputDir: string = path.resolve('./test/fixtures/output/');
  const WeatherInputFile: string = path.resolve('./test/fixtures/skills/Weather.lu');
  const QnAMakerInputFile: string = path.resolve('./test/fixtures/skills/QnAMaker.qna');
  const SettingsFile: string = path.resolve(path.join(SettingsDir, OrchestratorSettings.OrchestratorSettingsFileName));
  const DataSourcesPath: string = path.resolve(path.join(SettingsDir, 'dataSources'));

  beforeEach(() => {
    sinon.stub(DataSourceHelper, 'getLuFileFromLuisApp').callsFake(async () => {
      return OrchestratorHelper.readFile(WeatherInputFile);
    });

    sinon.stub(DataSourceHelper, 'getQnAFileFromQnaKb').callsFake(async () => {
      return OrchestratorHelper.readFile(QnAMakerInputFile);
    });

    if (Utility.exists(SettingsFile)) {
      Utility.deleteFile(SettingsFile);
    }

    if (Utility.exists(DataSourcesPath)) {
      Utility.deleteFolderRecursive(DataSourcesPath);
    }
  });
  afterEach(() => {
    sinon.restore();
  });
  it('addDataSource - file', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource('', '', '', '', 'file', 'Weather', WeatherInputFile);
    await Orchestrator.addDataSource(dataSource);
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 1);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Type === 'file');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].FilePath === WeatherInputFile);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].RoutingName === 'Weather');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'Weather.lu')));
  });

  it('addDataSource - fileMissingRoutingName', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource('', '', '', '', 'file', '', WeatherInputFile);
    try {
      await Orchestrator.addDataSource(dataSource);
    } catch (error) {
      assert.ok(error.message === 'routingName parameter is required');
    }
  });
  it('addDataSource - luis', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', 'https://westus.api.cognitive.microsoft.com/', 'luis', '', '');
    await Orchestrator.addDataSource(dataSource);
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 1);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Type === 'luis');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Id === 'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].RoutingName === 'l_Weather');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'l_Weather.lu')));
  });
  it('addDataSource - luisMissingEndpoint', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', '', 'luis', '', '');
    try {
      await Orchestrator.addDataSource(dataSource);
    } catch (error) {
      assert.ok(error.message === 'LUIS endpoint required, ie --endpoint https://westus.api.cognitive.microsoft.com');
    }
  });
  it('addDataSource - qna', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        '25251465-84f4-4104-8e5f-cbe0c74f3644', '', '', '', 'qna', 'q_QnA', '');
    await Orchestrator.addDataSource(dataSource);
    assert.ok(OrchestratorSettings.DataSources.inputs.length === 1);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Type === 'qna');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Id === '25251465-84f4-4104-8e5f-cbe0c74f3644');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].RoutingName === 'q_QnA');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'q_QnA.qna')));
  });
  it('addDataSource - multiple', async () => {
    OrchestratorSettings.init(SettingsDir, '', '', OutputDir, true, true);
    const luisDataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', 'https://westus.api.cognitive.microsoft.com/', 'luis', '', '');
    await Orchestrator.addDataSource(luisDataSource);

    const qnaDataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        '25251465-84f4-4104-8e5f-cbe0c74f3644', '', '', '', 'qna', 'q_QnA', '');
    await Orchestrator.addDataSource(qnaDataSource);

    assert.ok(OrchestratorSettings.DataSources.inputs.length === 2);
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Type === 'luis');
    assert.ok(OrchestratorSettings.DataSources.inputs[0].Id === 'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'l_Weather.lu')));

    assert.ok(OrchestratorSettings.DataSources.inputs[1].Type === 'qna');
    assert.ok(OrchestratorSettings.DataSources.inputs[1].Id === '25251465-84f4-4104-8e5f-cbe0c74f3644');
    assert.ok(OrchestratorSettings.DataSources.inputs[1].RoutingName === 'q_QnA');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'q_QnA.qna')));
  });
});