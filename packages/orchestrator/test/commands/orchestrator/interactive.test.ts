/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('orchestrator:interactive', () => {
  test
  .stdout()
  .command(['orchestrator:interactive', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Real-time interaction with Orchestrator model and analysis. Can return score of given utterance using previously created orchestrator examples');
  });
});
