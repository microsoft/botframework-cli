/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelResolver} from '../src/labelresolver';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorAdd} from '../src/add';
import * as path from 'path';
const sinon: any = require('sinon');

describe('OrchestratorAddTests', () => {
  beforeEach(() => {
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve('./test/fixtures/dispatch/orchestrator.blu'));
    sinon.stub(LabelResolver, 'createAsync');
    sinon.stub(LabelResolver, 'addExamples');
    sinon.stub(LabelResolver, 'createSnapshot').returns(snapshot);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('runAsync', async () => {
    await OrchestratorAdd.runAsync(
      './test/fixtures/',
      './test/fixtures/adaptive/',
      './test/fixtures/',
      './test/fixtures/dispatch/orchestrator.blu');
  });

  it('runAsync', async () => {
    await OrchestratorAdd.runAsync(
      './test/fixtures/',
      './test/fixtures/adaptive/',
      './test/fixtures/',
      './test/fixtures/dispatch/orchestrator.blu',
      'testPrefix');
  });
});
