/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
import {Orchestrator} from '@microsoft/bf-orchestrator';
const sinon: any = require('sinon');

describe('orchestrator:basemodel:get', () => {
  beforeEach(() => {
    sinon.stub(Orchestrator, 'baseModelGetAsync');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['orchestrator:basemodel:get', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Gets Orchestrator base model');
  });

  test
  .stdout()
  .command(['orchestrator:basemodel:list', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Lists all Orchestrator base model versions');
  });
});
