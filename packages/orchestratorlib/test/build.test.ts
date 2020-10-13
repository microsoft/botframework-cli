/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {LabelResolver} from '../src/labelresolver';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBuild} from '../src/build';
import * as path from 'path';
const sinon: any = require('sinon');

describe('OrchestratorBuildTests', () => {
  beforeEach(() => {
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve('./test/fixtures/dispatch/orchestrator.blu'));
    sinon.stub(LabelResolver, 'loadNlrAsync');
    sinon.stub(LabelResolver, 'addExamples');
    sinon.stub(LabelResolver, 'createSnapshot').returns(snapshot);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('runAsync', async () => {
    /*
    await OrchestratorBuild.runAsync(
      './test/fixtures/',
      OrchestratorHelper.getLuInputs('./test/fixtures/dispatch/'),
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luConfig.json')));
    */
  });
});
