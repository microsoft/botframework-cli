import {expect, test} from '@oclif/test'

describe('plugins:install', () => {
  test
  .stderr()
  .command(['plugins:install', 'someplugin'])
  .exit(1)
  .it('runs plugins:install someplugin', ctx => {
    expect(ctx.stderr).to.contain('someplugin is blacklisted')
  })
})
