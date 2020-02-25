import {expect, test} from '@oclif/test'

describe('orchestrator:test', () => {
  test
  .stdout()
  .command(['orchestrator:test'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orchestrator:test', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
