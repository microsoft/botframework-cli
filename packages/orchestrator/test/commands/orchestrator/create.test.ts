import {expect, test} from '@oclif/test';

describe('orchestrator:create', () => {
  test
  .stdout()
  .command(['orchestrator:create'])
  .it('Test.0000 orchestrator:create', (ctx: any) => {
    // expect(ctx.stdout).to.contain('create');
  });

  test
  .stdout()
  .command(['orchestrator:create', '--help'])
  .it('Test.0001 orchestrator:create --help', (ctx: any) => {
    expect(ctx.stdout).to.contain('help');
  });

  test
  .stdout()
  .command(['orchestrator:create', '--debug', '--in=resources/data/Columnar/Email.txt', '--out=resources/data/Columnar/OrchestratorModel_Email'])
  .it('Test.0002 orchestrator:create Email.txt', (ctx: any) => {
    expect(ctx.stdout).to.contain('Email');
  });
});
