import {expect, test} from '@oclif/test'

describe('plugins:index', () => {
  test
  .stdout()
  .stderr()
  .command(['plugins'])
  .exit(1)
  .it('runs help', ctx => {
    expect(ctx.stdout).to.contain('Install, uninstall and show installed plugins')
  })
})
