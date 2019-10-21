import {expect, test} from '@oclif/test'

describe('qnamaker:endpointsettings:index', () => {
  test
    .stdout()
    .command(['qnamaker:endpointsettings:index'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
