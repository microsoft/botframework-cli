/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
describe('orchestrator:remove tests', () => {
  test
  .stdout()
  .command(['orchestrator:remove', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Remove examples from LUIS app(s), QnaMaker kb(s) or .lu/.qna/.json files');
  });
});
