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
  const SettingsDir: string = path.resolve('./test/fixtures/output');
  const OutputDir: string = path.resolve('./test/fixtures/output/');
  const WeatherInputFile: string = path.resolve('./test/fixtures/skills/Weather.lu');
  const QnAMakerInputFile: string = path.resolve('./test/fixtures/skills/QnAMaker.qna');
  const SettingsFile: string = path.resolve(path.join(SettingsDir, OrchestratorSettings.OrchestratorSettingsFileName));
  const DataSourcesPath: string = path.resolve(path.join(SettingsDir, 'dataSources'));

  beforeEach(() => {
    sinon.stub(DataSourceHelper, 'getLuFileFromLuisApp').callsFake(async () => {
      const weatherData: string = OrchestratorHelper.readFile(WeatherInputFile);
      return weatherData;
    });

    sinon.stub(DataSourceHelper, 'getQnAFileFromQnaKb').callsFake(async () => {
      const qnaMakerInput: string = OrchestratorHelper.readFile(QnAMakerInputFile);
      return qnaMakerInput;
    });
    if (Utility.exists(SettingsFile)) {
      Utility.deleteFile(SettingsFile);
    }
  });
  afterEach(() => {
    sinon.restore();
    if (Utility.exists(DataSourcesPath)) {
      Utility.deleteFolderRecursive(DataSourcesPath);
    }
    if (Utility.exists(SettingsFile)) {
      Utility.deleteFile(SettingsFile);
    }
  });

  it('addRemoveDataSource - file', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource('', '', '', '', 'file', 'Weather', WeatherInputFile);
    await Orchestrator.addDataSource(dataSource);
    const destFilePath: string = path.join(DataSourcesPath, 'Weather.lu');
    assert.ok(settings.DataSources.inputs.length === 1);
    assert.ok(settings.DataSources.inputs[0].Type === 'file');
    assert.ok(settings.DataSources.inputs[0].FilePath === destFilePath);
    assert.ok(settings.DataSources.inputs[0].RoutingName === 'Weather');
    assert.ok(Utility.exists(destFilePath));

    assert.ok(Orchestrator.removeDataSource(dataSource));
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(!Utility.exists(dataSource.FilePath));
  });

  it('addDataSource - fileMissingRoutingName', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource('', '', '', '', 'file', '', WeatherInputFile);
    try {
      await Orchestrator.addDataSource(dataSource);
    } catch (error) {
      assert.ok(error.message === 'routingName parameter is required');
    }
  });

  it('addRemoveDataSource - luis', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', 'https://westus.api.cognitive.microsoft.com/', 'luis', '', '');
    const destFilePath: string = path.join(DataSourcesPath, 'l_Weather.lu');
    await Orchestrator.addDataSource(dataSource);
    assert.ok(settings.DataSources.inputs.length === 1);
    assert.ok(settings.DataSources.inputs[0].Type === 'luis');
    assert.ok(settings.DataSources.inputs[0].Id === 'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e');
    assert.ok(settings.DataSources.inputs[0].RoutingName === 'l_Weather');
    assert.ok(Utility.exists(destFilePath));

    assert.ok(Orchestrator.removeDataSource(dataSource));
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(!Utility.exists(destFilePath));
  });

  it('addDataSource - luisMissingEndpoint', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', '', 'luis', '', '');
    try {
      await Orchestrator.addDataSource(dataSource);
    } catch (error) {
      assert.ok(error.message === 'LUIS endpoint required, ie --endpoint https://westus.api.cognitive.microsoft.com');
    }
  });

  it('addRemoveDataSource - qna', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const dataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        '25251465-84f4-4104-8e5f-cbe0c74f3644', '', '', '', 'qna', 'q_QnA', '');
    const destFilePath: string = path.join(DataSourcesPath, 'q_QnA.qna');
    await Orchestrator.addDataSource(dataSource);
    assert.ok(settings.DataSources.inputs.length === 1);
    assert.ok(settings.DataSources.inputs[0].Type === 'qna');
    assert.ok(settings.DataSources.inputs[0].Id === '25251465-84f4-4104-8e5f-cbe0c74f3644');
    assert.ok(settings.DataSources.inputs[0].RoutingName === 'q_QnA');
    assert.ok(Utility.exists(path.join(DataSourcesPath, 'q_QnA.qna')));

    assert.ok(Orchestrator.removeDataSource(dataSource));
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(!Utility.exists(destFilePath));
  });

  it('addDataSource - multiple', async () => {
    const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    settings.init(SettingsDir, '', '', OutputDir, true, true);
    const luisDataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e', '', '', 'https://westus.api.cognitive.microsoft.com/', 'luis', '', '');
    const luisDestFilePath: string = path.join(DataSourcesPath, 'l_Weather.lu');
    await Orchestrator.addDataSource(luisDataSource);

    const qnaDataSource: OrchestratorDataSource =
      new OrchestratorDataSource(
        '25251465-84f4-4104-8e5f-cbe0c74f3644', '', '', '', 'qna', 'q_QnA', '');
    const qnaDestFilePath: string = path.join(DataSourcesPath, 'q_QnA.qna');
    await Orchestrator.addDataSource(qnaDataSource);

    assert.ok(settings.DataSources.inputs.length === 2);
    assert.ok(settings.DataSources.inputs[0].Type === 'luis');
    assert.ok(settings.DataSources.inputs[0].Id === 'a5ee4d79-28e0-4757-a9f8-45ab64ee1f7e');
    assert.ok(Utility.exists(luisDestFilePath));

    assert.ok(settings.DataSources.inputs[1].Type === 'qna');
    assert.ok(settings.DataSources.inputs[1].Id === '25251465-84f4-4104-8e5f-cbe0c74f3644');
    assert.ok(settings.DataSources.inputs[1].RoutingName === 'q_QnA');
    assert.ok(Utility.exists(qnaDestFilePath));

    assert.ok(Orchestrator.removeDataSource(qnaDataSource));
    assert.ok(settings.DataSources.inputs.length === 1);
    assert.ok(!Utility.exists(qnaDestFilePath));
    assert.ok(Utility.exists(luisDestFilePath));

    assert.ok(Orchestrator.removeDataSource(luisDataSource));
    assert.ok(settings.DataSources.inputs.length === 0);
    assert.ok(!Utility.exists(luisDestFilePath));
  });
});
