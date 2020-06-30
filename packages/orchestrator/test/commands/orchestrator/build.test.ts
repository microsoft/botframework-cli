import {expect, test} from '@oclif/test'

describe('orchestrator:build', () => {
  test
  .stdout()
  .command(['orchestrator:build'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orchestrator:build', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
