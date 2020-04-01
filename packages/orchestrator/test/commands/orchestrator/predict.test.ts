import {expect, test} from '@oclif/test';

describe('orchestrator:predict', () => {
  test
  .stdout()
  .command(['orchestrator:predict'])
  .it('Test.0000 orchestrator:predict', (ctx: any) => {
    // expect(ctx.stdout).to.contain('predict');
  });

  test
  .stdout()
  .command(['orchestrator:predict', '--help'])
  .it('Test.0001 orchestrator:predict --help', (ctx: any) => {
    expect(ctx.stdout).to.contain('help');
  });
});
