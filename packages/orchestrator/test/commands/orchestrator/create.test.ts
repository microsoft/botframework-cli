import {expect, test} from '@oclif/test'

describe('orchestrator:create', () => {
  test
  .stdout()
  .command(['orchestrator:create'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orchestrator:create', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
