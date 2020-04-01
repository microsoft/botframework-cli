import {expect, test} from '@oclif/test';

describe('orchestrator:evaluate', () => {
  test
  .stdout()
  .command(['orchestrator:evaluate'])
  .it('Test.0000 orchestrator:evaluate', (_ctx: any) => {
    // expect(ctx.stdout).to.contain('evaluate');
  });

  test
  .stdout()
  .command(['orchestrator:evaluate', '--help'])
  .it('Test.0001 orchestrator:evaluate --help', (ctx: any) => {
    expect(ctx.stdout).to.contain('help');
  });

  test
  .stdout()
  .command(['orchestrator:evaluate', '--debug', '--in=resources/data/Columnar/Email.txt', '--out=resources/data/Columnar/OrchestratorModelForEvaluateCommand_Email'])
  .it('Test.0002 orchestrator:evaluate Email.txt', (ctx: any) => {
    expect(ctx.stdout).to.contain('Email');
  });
});
