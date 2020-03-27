import {expect, test} from '@oclif/test'

describe('orchestrator:test', () => {
  test
  .stdout()
  .command(['orchestrator:test'])
  .it('Test.0000 orchestrator:test', ctx => {
    expect(ctx.stdout).to.contain('test')
  })

  test
  .stdout()
  .command(['orchestrator:test', '--help'])
  .it('Test.0001 orchestrator:test --help', ctx => {
    expect(ctx.stdout).to.contain('help')
  })
})
