import {expect, test} from '@oclif/test'

describe('qnamaker:alterations:index', () => {
  test
    .stdout()
    .command(['qnamaker:alterations'])
    .exit(1)
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
