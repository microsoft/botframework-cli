import {expect, test} from '@oclif/test';

describe('orchestrator:test', () => {
  test
  .stdout()
  .command(['orchestrator:test'])
  .it('Test.0000 orchestrator:test', (_ctx: any) => {
    // expect(ctx.stdout).to.contain('test');
  });

  test
  .stdout()
  .command(['orchestrator:test', '--help'])
  .it('Test.0001 orchestrator:test --help', (ctx: any) => {
    expect(ctx.stdout).to.contain('help');
  });

  test
  .stdout()
  .command(['orchestrator:test', '--debug', '--in=resources/data/Columnar/Email.txt', '--test=resources/data/Columnar/EmailTest.txt', '--out=resources/data/Columnar/OrchestratorModelForTestCommand_Email'])
  .it('Test.0002 orchestrator:test EmailTest.txt', (ctx: any) => {
    expect(ctx.stdout).to.contain('Email');
  });
});
