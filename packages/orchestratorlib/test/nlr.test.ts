/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorNlr} from '../src/nlr';
import * as path from 'path';
const sinon: any = require('sinon');

import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

describe('OrchestratorNlrTests', () => {
  let nlrVersions: string;
  beforeEach(() => {
    nlrVersions = OrchestratorHelper.readFile(path.resolve('./test/fixtures/nlr_versions.json'));
    sinon.stub(OrchestratorNlr, 'getNlrVersionsAsync').returns(nlrVersions);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('listAsync', async function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const nlrVersionsJson: string = await OrchestratorNlr.listAsync();
    Utility.debuggingLog(`nlrVersionsJson=${nlrVersionsJson}`);
  });
});
