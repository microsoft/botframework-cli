/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
import {Orchestrator} from '@microsoft/bf-orchestrator';
const sinon: any = require('sinon');

describe('orchestrator:create tests', () => {
  beforeEach(() => {
    sinon.stub(Orchestrator, 'createAsync');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['orchestrator:create', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules');
  });
  test
  .stdout()
  .command(['orchestrator:create'])
  .exit(1)
  .it('should print the help contents when there is no argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules');
  });
});
