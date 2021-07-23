/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
describe('orchestrator:discovery help tests', () => {
  test
  .stdout()
  .command(['orchestrator:discovery', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Discover all dialogs using Orchestrator model as the recognizer.');
  });
});

describe('orchestrator:discovery tests ', () => {
  test
  .stdout()
  .command(['orchestrator:discovery', '--in', './test/commands/orchestrator/fixtures/TestBot'])
  .it('should print all discovered orchestrator model dialogs', (ctx: any) => {
    expect(ctx.stdout).to.contain(`Dialogs using Luis Recognizers:\n{\n    "Orchestrator": [\n        {\n            "dialog": "EnterpriseAssistant.dialog",\n            "language": "en-us"\n     
  }\n    ]\n}\n`);
  });
});
