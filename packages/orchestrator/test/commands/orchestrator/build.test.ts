/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
import {Orchestrator} from '@microsoft/bf-orchestrator';
const sinon: any = require('sinon');

describe('orchestrator:build', () => {
  beforeEach(() => {
    sinon.stub(Orchestrator, 'buildAsync');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['orchestrator:build', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in');
  });
  test
  .stdout()
  .command(['orchestrator:build'])
  .exit(1)
  .it('should print the help contents when there is no argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in');
  });
});
