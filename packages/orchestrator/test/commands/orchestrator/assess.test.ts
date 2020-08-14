/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
import {Orchestrator} from '@microsoft/bf-orchestrator';
const sinon: any = require('sinon');

describe('orchestrator:assess', () => {
  beforeEach(() => {
    sinon.stub(Orchestrator, 'assessAsync');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['orchestrator:assess', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Assess utterance/label samples from an input file and create an evaluation report');
  });

  test
  .stdout()
  .command(['orchestrator:assess',
    '--in=./resources/data/EvaluationJsonFormat/va_test.json',
    '--prediction=./resources/data/EvaluationJsonFormat/va_predictions-top1.json',
    '--out=./resources/data/EvaluationJsonFormat/va_output'])
  .it('should run the command and produce outputs', (_ctx: any) => {
    // eslint-disable-next-line no-console
    console.log(`process.cwd=${process.cwd()}`);
  });
});
