import {expect, test} from '@oclif/test'

describe('plugins:uninstall', () => {
  test
  .stderr()
  .command(['plugins:uninstall', 'someplugin'])
  .it('runs plugins:uninstall someplugin', ctx => {
    expect(ctx.stderr).to.contain('someplugin is not installed')
  })
})
