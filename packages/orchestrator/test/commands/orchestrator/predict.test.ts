import {expect, test} from '@oclif/test'

describe('orchestrator:predict', () => {
  test
  .stdout()
  .command(['orchestrator:predict'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orchestrator:predict', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
