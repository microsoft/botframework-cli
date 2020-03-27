import {expect, test} from '@oclif/test';

describe('orchestrator:evaluate', () => {
  test
  .stdout()
  .command(['orchestrator:evaluate'])
  .it('Test.0000 orchestrator:evaluate', ctx => {
    expect(ctx.stdout).to.contain('evaluate');
  });

  test
  .stdout()
  .command(['orchestrator:evaluate', '--help'])
  .it('Test.0001 orchestrator:evaluate --help', ctx => {
    expect(ctx.stdout).to.contain('help');
  });
});
