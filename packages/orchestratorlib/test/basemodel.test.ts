/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorBaseModel} from '../src/basemodel';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import assert = require('assert');
import {OrchestratorHelper} from '../lib';

describe('OrchestratorBaseModelTests', async () => {
  const nlrVersions: any = await OrchestratorBaseModel.getVersionsAsync();

  it('listAsync', async function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const nlrVersionsAll: any = await OrchestratorBaseModel.listAsync(true);
    assert.ok(nlrVersionsAll);
    Utility.debuggingLog(`nlrVersionsJson=${Utility.jsonStringify(nlrVersionsAll)}`);

    const nlrVersionDefaults: any = await OrchestratorBaseModel.listAsync();
    assert.ok(nlrVersionDefaults);
    assert.ok(Object.keys(nlrVersionsAll).length > Object.keys(nlrVersionDefaults).length);
    Utility.debuggingLog(`All Versions count=${Object.keys(nlrVersionsAll).length}, Default Versions count=${Object.keys(nlrVersionDefaults).length}`);
  });

  it('getAsync', async function () {
    OrchestratorBaseModel.getAsync('./test/fixtures/output');
  });

  it('getDefaultModelId', async () => {
    const defaultVersionEn: string = await OrchestratorBaseModel.getDefaultModelId(nlrVersions);
    assert.ok(defaultVersionEn === 'pretrained.20200924.microsoft.dte.00.06.en.onnx', 'getDefaultModelId fails to return correct default en version');
    const defaultVersionMulti: string = await OrchestratorBaseModel.getDefaultModelId(nlrVersions, 'intent', 'multilingual');
    assert.ok(defaultVersionMulti === 'pretrained.20210205.microsoft.dte.00.06.unicoder_multilingual.onnx', 'getDefaultModelId fails to return correct default multilingual version');
  });

  it('getModelLanguageFromVersionId', () => {
    let versionId: string = 'pretrained.20210205.microsoft.dte.00.06.bert_example_ner.en.onnx';
    let language: string = OrchestratorBaseModel.getModelLanguageFromVersionId(versionId);
    assert.ok(language === 'en', `language ${language}`);

    versionId = 'pretrained.20210205.microsoft.dte.00.06.unicoder_multilingual.onnx';
    language = OrchestratorBaseModel.getModelLanguageFromVersionId(versionId);
    assert.ok(language === 'multilingual', `language ${language}`);
  });

  it('isEntityModelVersion', () => {
    const versionId: string = 'pretrained.20210205.microsoft.dte.00.06.bert_example_ner.en.onnx';
    assert.ok(OrchestratorBaseModel.isEntityModelVersion('entity', versionId));
  });

  it('isIntentModelVersion', () => {
    const versionId: string = 'pretrained.20200924.microsoft.dte.00.12.en.onnx';
    assert.ok(OrchestratorBaseModel.isIntentModelVersion('intent', versionId));
  });

  it('getDefaultEntityModelFromIntentModel', async () => {
    const nlrVersionsFile: string = './test/fixtures/nlr_versions.json';
    const basemodelId: string = 'pretrained.20210205.microsoft.dte.00.06.unicoder_multilingual.onnx';
    const versions: string = JSON.parse(OrchestratorHelper.readFile(nlrVersionsFile));
    const entityVersionId: string = await OrchestratorBaseModel.getDefaultModelId(
      versions,
      'entity',
      OrchestratorBaseModel.getModelLanguageFromVersionId(basemodelId));
    assert.ok(entityVersionId === 'pretrained.20210218.microsoft.dte.00.06.bert_example_ner.en.onnx');
  });
});
