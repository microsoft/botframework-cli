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
  /*
  test
  .stdout()
  .command(['orchestrator:add', '-t', 'luis', '--id', '8cf0f647-e080-4d79-a54d-4558b3700998', '-k', '8c5c4483797a433dbbdd5b34a82a62ad', '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .exit(1)
  .it('add luis source', (ctx: any) => {
    expect(ctx.stdout).to.contain('Added luis source with id 8cf0f647-e080-4d79-a54d-4558b3700998');
  });
  */
});
