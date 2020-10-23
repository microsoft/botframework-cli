/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('sampler', () => {
  test
  .stdout()
  .command(['sampler'])
  .exit(1)
  .it('should print the help contents when nothing is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Sampler CLI available commands')
    .to.contain('sampler:sampling');
  });

  test
  .stdout()
  .command(['sampler', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout)
    .to.contain('Display Sampler CLI available commands')
    .to.contain('sampler:sampling');
  });
});
