import {expect, test} from '@oclif/test'

describe('orchestrator:create', () => {
  test
  .stdout()
  .command(['orchestrator:create'])
  .it('Test.0000 orchestrator:create', ctx => {
    expect(ctx.stdout).to.contain('create')
  })

  test
  .stdout()
  .command(['orchestrator:create', '--help'])
  .it('Test.0001 orchestrator:create --help', ctx => {
    expect(ctx.stdout).to.contain('help')
  })
})
