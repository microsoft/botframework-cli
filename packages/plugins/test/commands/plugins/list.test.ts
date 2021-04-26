import {expect, test} from '@oclif/test'

describe('plugins:list', () => {
  test
  .stderr()
  .command(['plugins:list'])
  .exit(1)
  .it('plugins:list', ctx => {
    expect(ctx.stderr).to.contain('no plugins installed\n')
  })
})
