/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {} from 'mocha';
import {DataSourceHelper} from '../src/datasourcehelper';
import {OrchestratorDataSourceSettings} from '../src/settings';
import {Utility} from '../src/utility';
import * as fs from 'fs-extra';
import assert = require('assert');

describe('LuisQnaHelperTests', () => {
  const dataSourcePath: string = './test/fixtures/output/dataSources';
  const dispatchJsonString: string = `{
    "authoringRegion": "westus",
    "subscriptionRegion": "westus2",
    "hierarchical": true,
    "useAllTrainingData": false,
    "dontReviseUtterance": false,
    "copyLuisData": true,
    "normalizeDiacritics": true,
    "services": [
      {
        "appId": "d06d7acf-a9ec-43e0-94c6-3b37ee313a21",
        "authoringKey": "XYZXYZ",
        "version": "0.1",
        "region": "westus",
        "type": "luis",
        "name": "Weather",
        "id": "1"
      },
      {
        "kbId": "213a48d3-855d-4083-af6d-339c03d497dd",
        "subscriptionKey": "YYYYYY",
        "type": "qna",
        "name": "ChitChat",
        "id": "2"
      },
      {
        "intentName": "l_HomeAutomation",
        "path": ".\\\\test\\\\fixtures\\\\dispatch\\\\HomeAutomation.json",
        "type": "file",
        "name": "HomeAutomation",
        "id": "3"
      }
    ],
    "serviceIds": [
      "1",
      "2",
      "3"
    ],
    "appId": "",
    "authoringKey": "",
    "subscriptionKey": "",
    "version": "Dispatch",
    "region": "westus",
    "type": "dispatch",
    "name": "LuisQnaFile"
  }`;

  const dispatchJson: any = JSON.parse(dispatchJsonString);
  const dataSourcesJsonString: string = `{
    "hierarchical": true,
    "inputs": [
        {
            "Type": "luis",
            "Id": "d06d7acf-a9ec-43e0-94c6-3b37ee313a21",
            "Version": "0.1",
            "Key": "XYZXYZ",
            "Endpoint": "https://westus.api.cognitive.microsoft.com",
            "RoutingName": "l_Weather",
            "FilePath": ".\\\\test\\\\fixtures\\\\output\\\\dataSources"
        },
        {
            "Type": "qna",
            "Id": "213a48d3-855d-4083-af6d-339c03d497dd",
            "Version": "",
            "Key": "YYYYYY",
            "Endpoint": "",
            "RoutingName": "q_ChitChat",
            "FilePath": ".\\\\test\\\\fixtures\\\\output\\\\dataSources"
        },
        {
            "Type": "file",
            "Id": "",
            "Version": "",
            "Key": "",
            "Endpoint": "",
            "RoutingName": "l_HomeAutomation",
            "FilePath": ".\\\\test\\\\fixtures\\\\dispatch\\\\HomeAutomation.json"
        }
    ],
    "path": "./test/fixtures/output/dataSources"
  }`;
  const dataSourceJson: any = JSON.parse(dataSourcesJsonString);

  it('convert Dispatch inputs with existing data sources empty', () => {
    if (!Utility.exists(dataSourcePath)) {
      fs.mkdirSync(dataSourcePath, {recursive: true});
    }
    const dataSourceSettings: OrchestratorDataSourceSettings = new OrchestratorDataSourceSettings([], true, dataSourcePath);
    DataSourceHelper.convertDispatchInputs(dispatchJson, dataSourceSettings);
    assert(dataSourceSettings.inputs.length === 3);
    assert(dataSourceSettings.inputs[0].Type === 'luis');
    assert(dataSourceSettings.inputs[0].Id === 'd06d7acf-a9ec-43e0-94c6-3b37ee313a21');
    assert(dataSourceSettings.inputs[0].RoutingName === 'l_Weather');
    assert(dataSourceSettings.inputs[0].Key === 'XYZXYZ');

    assert(dataSourceSettings.inputs[1].Type === 'qna');
    assert(dataSourceSettings.inputs[1].Id === '213a48d3-855d-4083-af6d-339c03d497dd');
    assert(dataSourceSettings.inputs[1].RoutingName === 'q_ChitChat');
    assert(dataSourceSettings.inputs[1].Key === 'YYYYYY');

    assert(dataSourceSettings.inputs[2].Type === 'file');
    assert(dataSourceSettings.inputs[2].RoutingName === 'l_HomeAutomation');
    // assert(dataSourceSettings.Inputs[2].FilePath.replace(/[\\/]+/gm, '') === HomeAutomationFile);
  });

  it('convert Dispatch inputs with existing data sources not empty', () => {
    const dataSourceSettings2: OrchestratorDataSourceSettings =
    new OrchestratorDataSourceSettings(dataSourceJson.inputs, true, dataSourcePath);

    dispatchJson.services[0].intentName = 'l_Weather1';
    dispatchJson.services[0].authoringKey = 'XYZXYY';
    dispatchJson.services[1].intentName = 'q_Kb';
    dispatchJson.services[1].subscriptionKey = 'XXYYZZ';
    DataSourceHelper.convertDispatchInputs(dispatchJson, dataSourceSettings2);
    assert(dataSourceSettings2.inputs.length === 3);
    assert(dataSourceSettings2.inputs[0].Type === 'luis');
    assert(dataSourceSettings2.inputs[0].Id === 'd06d7acf-a9ec-43e0-94c6-3b37ee313a21');
    assert(dataSourceSettings2.inputs[0].RoutingName === 'l_Weather1');
    assert(dataSourceSettings2.inputs[0].Key === 'XYZXYY');

    assert(dataSourceSettings2.inputs[1].Type === 'qna');
    assert(dataSourceSettings2.inputs[1].Id === '213a48d3-855d-4083-af6d-339c03d497dd');
    assert(dataSourceSettings2.inputs[1].RoutingName === 'q_Kb');
    assert(dataSourceSettings2.inputs[1].Key === 'XXYYZZ');

    assert(dataSourceSettings2.inputs[2].Type === 'file');
    assert(dataSourceSettings2.inputs[2].RoutingName === 'l_HomeAutomation');
  });
});
