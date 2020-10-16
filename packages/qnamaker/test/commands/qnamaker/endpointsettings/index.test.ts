import {expect, test} from '@oclif/test'

describe('qnamaker:endpointsettings:index', () => {
  test
    .stdout()
    .command(['qnamaker:endpointsettings'])
    .exit(1)
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
