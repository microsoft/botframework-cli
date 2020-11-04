/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('orchestrator:query', () => {
  test
  .stdout()
  .command(['orchestrator:query', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Query Orchestrator base model and a snapshot/train file');
  });
  test
  .stdout()
  .command(['orchestrator:query'])
  .exit(1)
  .it('should print the help contents when there is no argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Query Orchestrator base model and a snapshot/train file');
  });
});
