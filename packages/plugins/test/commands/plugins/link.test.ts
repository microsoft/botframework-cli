import {expect, test} from '@oclif/test'

describe('plugins:link', () => {
  test
  .stderr()
  .command(['plugins:link', 'someplugin'])
  .exit(1)
  .it('runs plugins:link someplugin', ctx => {
    expect(ctx.stderr).to.contain('Path to plugin does not exist')
  })
})
