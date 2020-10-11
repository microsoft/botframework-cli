/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelResolver} from '../src/labelresolver';
import {OrchestratorHelper} from '../src/orchestratorhelper';
// import {OrchestratorCreate} from '../src/create';
import * as path from 'path';
const sinon: any = require('sinon');

describe('OrchestratorCreateTests', () => {
  beforeEach(() => {
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve('./test/fixtures/dispatch/orchestrator.blu'));
    sinon.stub(LabelResolver, 'createAsync');
    sinon.stub(LabelResolver, 'addExamples');
    sinon.stub(LabelResolver, 'createSnapshot').returns(snapshot);
  });

  afterEach(() => {
    sinon.restore();
  });

  /* ---- NOTE-DISABLE-THESE-TESTS-TEMPORARILY ----
  it('runAsync', async () => {
    await OrchestratorCreate.runAsync(
      './test/fixtures/',
      './test/fixtures/dispatch/',
      './test/fixtures/',
      true);
  });
  */
});
