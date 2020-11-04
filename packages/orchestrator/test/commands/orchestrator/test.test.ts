/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';

describe('orchestrator:test', () => {
  test
  .stdout()
  .command(['orchestrator:test', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('The "test" command can operate in three modes');
  });
  test
  .stdout()
  .command(['orchestrator:test'])
  .exit(1)
  .it('should print the help contents when there is no argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('The "test" command can operate in three modes');
  });

  test
  .stdout()
  .command(['orchestrator:test',
    '--in=./resources/data/EvaluationJsonFormat/orchestrator_testing_set_ground_truth_instances.json',
    '--prediction=./resources/data/EvaluationJsonFormat/orchestrator_testing_set_prediction_instances.json',
    '--out=./resources/data/EvaluationJsonFormat/va_output'])
  .it('should run the command and produce outputs', (_ctx: any) => {
    // eslint-disable-next-line no-console
    console.log(`process.cwd=${process.cwd()}`);
  });
});
