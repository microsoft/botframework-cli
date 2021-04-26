/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
describe('orchestrator:add tests', () => {
  test
  .stdout()
  .command(['orchestrator:add', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Add examples from .lu/.qna/.json/.blu files');
  });
});
