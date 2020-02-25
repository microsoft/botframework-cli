import {expect, test} from '@oclif/test'

describe('orchestrator:evaluate', () => {
  test
  .stdout()
  .command(['orchestrator:evaluate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orchestrator:evaluate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
