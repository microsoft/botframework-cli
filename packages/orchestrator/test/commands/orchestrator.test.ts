/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('orchestrator', () => {
  test
  .stdout()
  .command(['orchestrator'])
  .it('should print the help contents when nothing is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Orchestrator CLI available commands')
    .to.contain('orchestrator:create')
    .to.contain('orchestrator:build')
    .to.contain('orchestrator:eval')
    .to.contain('orchestrator:test')
    .to.contain('orchestrator:predict')
    .to.contain('orchestrator:nlr');
  });

  test
  .stdout()
  .command(['orchestrator', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Orchestrator CLI available commands')
    .to.contain('orchestrator:create')
    .to.contain('orchestrator:build')
    .to.contain('orchestrator:eval')
    .to.contain('orchestrator:test')
    .to.contain('orchestrator:predict')
    .to.contain('orchestrator:nlr');
  });
});
