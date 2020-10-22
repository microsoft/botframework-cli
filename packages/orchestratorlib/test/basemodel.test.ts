/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/*
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBaseModel} from '../src/basemodel';
import * as path from 'path';
const sinon: any = require('sinon');

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import assert = require('assert');

describe('OrchestratorNlrTests', () => {
  let nlrVersions: any;
  beforeEach(() => {
    nlrVersions = JSON.parse(OrchestratorHelper.readFile(path.resolve('./test/fixtures/nlr_versions.json')));
    sinon.stub(OrchestratorBaseModel, 'getVersionsAsync').returns(nlrVersions);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('listAsync', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const nlrVersionsJson: string = await OrchestratorBaseModel.listAsync();
    Utility.debuggingLog(`nlrVersionsJson=${nlrVersionsJson}`);
  });

  it('getAsync', async function () {
    OrchestratorBaseModel.getAsync('./test/fixtures/output');
  });

  it('getDefaultModelId', () => {
    const defaultVersion: string = OrchestratorBaseModel.getDefaultModelId(nlrVersions);
    assert.ok(defaultVersion === 'pretrained.20200924.microsoft.dte.00.03.en.onnx', 'getDefaultModelId fails to return correct default version');
  });

  it('getDefaultModelIdNoDefaultSet', () => {
    const nlrVersionsJson: string = `{
      "version": "0.1",
      "models": {
        "pretrained.20201024.microsoft.dte.00.12.roberta.en.onnx": {
          "releaseDate": "09/24/2020",
          "modelUri": "https://models.botframework.com/models/dte/onnx/pretrained.20200924.microsoft.dte.00.12.roberta.en.onnx.7z",
          "description": "Bot Framework SDK release 4.10 - English Onnx V1.4 12-layer Roberta per-token NLR",
          "minSDKVersion": "4.10.0"
        },
        "pretrained.20200924.microsoft.dte.00.12.en.onnx": {
          "releaseDate": "09/24/2020",
          "modelUri": "https://models.botframework.com/models/dte/onnx/pretrained.20200924.microsoft.dte.00.12.en.onnx.7z",
          "description": "Bot Framework SDK release 4.10 - English Onnx V1.4 12-layer BERT per-token NLR",
          "minSDKVersion": "4.10.0"
        }
      }
    }`;

    const defaultVersion: string = OrchestratorBaseModel.getDefaultModelId(JSON.parse(nlrVersionsJson));
    assert.ok(defaultVersion === 'pretrained.20201024.microsoft.dte.00.12.roberta.en.onnx', 'getDefaultModelIdNoDefaultSet fails to return correct default version');
  });
});
*/
