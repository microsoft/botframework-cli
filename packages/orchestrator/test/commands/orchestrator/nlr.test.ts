/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
import {Orchestrator} from '@microsoft/bf-orchestrator';
const sinon: any = require('sinon');

describe('orchestrator:nlr:get', () => {
  beforeEach(() => {
    sinon.stub(Orchestrator, 'nlrGetAsync');
    sinon.stub(Orchestrator, 'nlrListAsync');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['orchestrator:nlr:get', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Gets Orchestrator model');
  });

  test
  .stdout()
  .command(['orchestrator:nlr:list', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Lists all Orchestrator model versions');
  });
});
