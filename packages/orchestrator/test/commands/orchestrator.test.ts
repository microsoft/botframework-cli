/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('orchestrator', () => {
  test
  .timeout(1000000)
  .stdout()
  .command(['orchestrator'])
  .exit(1)
  .it('should print the help contents when nothing is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Orchestrator CLI available commands')
    .to.contain('orchestrator:create')
    .to.contain('orchestrator:build')
    .to.contain('orchestrator:test')
    .to.contain('orchestrator:query')
    .to.contain('orchestrator:interactive')
    .to.contain('orchestrator:basemodel');
  });

  test
  .timeout(1000000)
  .stdout()
  .command(['orchestrator', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Orchestrator CLI available commands')
    .to.contain('orchestrator:create')
    .to.contain('orchestrator:build')
    .to.contain('orchestrator:test')
    .to.contain('orchestrator:query')
    .to.contain('orchestrator:interactive')
    .to.contain('orchestrator:basemodel');
  });
});

