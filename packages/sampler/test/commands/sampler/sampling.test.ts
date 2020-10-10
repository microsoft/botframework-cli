/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('sampler:sampling', () => {
  test
  .stdout()
  .command(['sampler:sampling', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Do sampling to utterances in lu files');
  });
});
