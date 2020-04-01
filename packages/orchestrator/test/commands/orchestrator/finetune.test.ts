import {expect, test} from '@oclif/test'

describe('orchestrator:finetune', () => {
  test
  .stdout()
  .command(['orchestrator:finetune'])
  .it('Test.0000 orchestrator:finetune', ctx => {
    expect(ctx.stdout).to.contain('finetune')
  })

  test
  .stdout()
  .command(['orchestrator:finetune', '--help', 'jeff'])
  .it('Test.0001 orchestrator:finetune --help', ctx => {
    expect(ctx.stdout).to.contain('help')
  })
})
